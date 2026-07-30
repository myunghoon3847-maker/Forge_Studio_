import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(rootDirectory, 'dist');
const mountPath = '/forge-studio-pages-smoke/';
const host = '127.0.0.1';
const port = 4177;

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
]);

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${host}:${port}`);
    if (requestUrl.pathname === '/') {
      response.writeHead(302, { Location: mountPath });
      response.end();
      return;
    }

    if (!requestUrl.pathname.startsWith(mountPath)) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    const relativePath =
      decodeURIComponent(requestUrl.pathname.slice(mountPath.length)) || 'index.html';
    const targetPath = path.resolve(distDirectory, relativePath);
    if (targetPath !== distDirectory && !targetPath.startsWith(`${distDirectory}${path.sep}`)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    const targetStats = await stat(targetPath);
    if (!targetStats.isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type':
        mimeTypes.get(path.extname(targetPath).toLowerCase()) ?? 'application/octet-stream',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
    });
    createReadStream(targetPath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(port, host, resolve);
});

const channels = process.platform === 'win32' ? ['chrome', 'msedge'] : [undefined];
const results = [];

try {
  for (const channel of channels) {
    const browser = await chromium.launch({
      ...(channel ? { channel } : {}),
      headless: true,
    });
    try {
      const page = await browser.newPage();
      const runtimeErrors = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          runtimeErrors.push(`console: ${message.text()}`);
        }
      });
      page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`));
      page.on('requestfailed', (request) => {
        runtimeErrors.push(
          `request: ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`,
        );
      });

      const response = await page.goto(`http://${host}:${port}${mountPath}`, {
        waitUntil: 'networkidle',
      });
      if (!response?.ok()) {
        throw new Error(`${channel ?? 'chromium'} returned HTTP ${response?.status()}.`);
      }

      await page.waitForFunction(() => Boolean(globalThis.__FORGE_STUDIO__));
      const initialState = await page.evaluate(() => ({
        appDisplay: window.getComputedStyle(document.querySelector('#app')).display,
        webglErrorDisplay: window.getComputedStyle(document.querySelector('#webgl-error')).display,
        templateCount: document.querySelector('#template-count')?.textContent,
        canvasCount: document.querySelectorAll('#viewport canvas').length,
      }));

      if (initialState.appDisplay !== 'grid') {
        throw new Error(`${channel ?? 'chromium'} did not apply the production CSS.`);
      }
      if (initialState.webglErrorDisplay !== 'none') {
        throw new Error(`${channel ?? 'chromium'} reported WebGL2 unavailable.`);
      }
      if (initialState.templateCount !== '20' || initialState.canvasCount !== 1) {
        throw new Error(
          `${channel ?? 'chromium'} did not initialize the editor: ${JSON.stringify(initialState)}`,
        );
      }

      await page.getByTestId('primitive-box').click();
      await page.waitForFunction(() => globalThis.__FORGE_STUDIO__.getSummary().objectCount === 1);

      if (runtimeErrors.length > 0) {
        throw new Error(
          `${channel ?? 'chromium'} emitted runtime errors:\n- ${runtimeErrors.join('\n- ')}`,
        );
      }

      results.push(`${channel ?? 'chromium'}: PASS`);
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

console.log(
  `GitHub Pages repository-subpath smoke test passed at ${mountPath}\n${results.join('\n')}`,
);
