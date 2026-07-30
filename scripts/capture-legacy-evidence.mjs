import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { validateBytes } from 'gltf-validator';

const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'work/gate0/v05-source/forge-studio-v05',
    '--host',
    '127.0.0.1',
    '--port',
    '4176',
  ],
  { stdio: 'ignore', windowsHide: true },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Legacy evidence server exited early.');
    try {
      const response = await fetch('http://127.0.0.1:4176/');
      if (response.ok) return;
    } catch {
      // Server startup is still in progress.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Legacy evidence server startup timed out.');
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
  if (server.exitCode === null) server.kill('SIGKILL');
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  await page.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
  await page.goto('http://127.0.0.1:4176/');
  await page.locator('#viewport canvas').waitFor();
  await mkdir('tests/fixtures/v05/glb', { recursive: true });
  await mkdir('outputs/evidence', { recursive: true });
  const reports = {};
  for (const name of ['cube', 'oak', 'sword']) {
    const chooserPromise = page.waitForEvent('filechooser');
    await page.locator('#openBtn').click();
    const chooser = await chooserPromise;
    await chooser.setFiles(`tests/fixtures/v05/v05-${name}.json`);
    await page.locator('#status').filter({ hasText: '프로젝트 불러오기 완료' }).waitFor();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#exportBtn').click();
    const download = await downloadPromise;
    const target = `tests/fixtures/v05/glb/v05-${name}.glb`;
    await download.saveAs(target);
    const bytes = new Uint8Array(await (await import('node:fs/promises')).readFile(target));
    const report = await validateBytes(bytes, {
      uri: `v05-${name}.glb`,
      format: 'glb',
      maxIssues: 0,
      writeTimestamp: false,
    });
    reports[name] = {
      errors: report.issues.numErrors,
      warnings: report.issues.numWarnings,
    };
  }

  const visualChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#openBtn').click();
  const visualChooser = await visualChooserPromise;
  await visualChooser.setFiles('tests/fixtures/v05/v05-rock-visual.json');
  await page.locator('#status').filter({ hasText: '프로젝트 불러오기 완료' }).waitFor();
  await page.screenshot({
    path: 'outputs/evidence/v05-rock-visual-parity.png',
    fullPage: true,
  });
  if (errors.length) throw new Error(errors.join('\n'));
  await writeFile(
    'tests/fixtures/v05/glb/validation.json',
    `${JSON.stringify(reports, null, 2)}\n`,
    'utf8',
  );
} finally {
  await browser?.close();
  await stopServer();
}
