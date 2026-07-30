import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const warmupMs = Number(process.env.FORGE_PERF_WARMUP_MS ?? 10_000);
const sampleMs = Number(process.env.FORGE_PERF_SAMPLE_MS ?? 60_000);
const interactionMs = Number(process.env.FORGE_PERF_INTERACTION_MS ?? 300_000);
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4175'],
  { stdio: 'ignore', windowsHide: true },
);

function chromeProcesses() {
  if (process.platform !== 'win32') return [];
  const command = [
    'Get-Process chrome -ErrorAction SilentlyContinue',
    'Select-Object Id,WorkingSet64',
    'ConvertTo-Json -Compress',
  ].join(' | ');
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', command], {
    encoding: 'utf8',
    windowsHide: true,
  });
  if (!result.stdout.trim()) return [];
  const parsed = JSON.parse(result.stdout);
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Vite performance server exited early.');
    try {
      const response = await fetch('http://127.0.0.1:4175/');
      if (response.ok) return;
    } catch {
      // Server startup is still in progress.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Vite performance server startup timed out.');
}

async function orbitFor(page, durationMs) {
  const viewport = page.locator('#viewport');
  const box = await viewport.boundingBox();
  const startedAt = Date.now();
  let step = 0;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  while (Date.now() - startedAt < durationMs) {
    const angle = step * 0.35;
    await page.mouse.move(
      box.x + box.width / 2 + Math.cos(angle) * box.width * 0.22,
      box.y + box.height / 2 + Math.sin(angle * 0.7) * box.height * 0.16,
      { steps: 3 },
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    step += 1;
  }
  await page.mouse.up();
}

function percentile(values, ratio) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1)];
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

const beforePids = new Set(chromeProcesses().map((entry) => entry.Id));
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    acceptDownloads: true,
  });
  const runtimeErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));

  const coldStartedAt = performance.now();
  await page.goto('http://127.0.0.1:4175/');
  await page.waitForFunction(() => Boolean(globalThis.__FORGE_STUDIO__));
  const coldStartMs = performance.now() - coldStartedAt;

  const loadStartedAt = performance.now();
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByTestId('open-project').click();
  const chooser = await chooserPromise;
  await chooser.setFiles('tests/fixtures/v2/performance-scene.forge.json');
  await page.locator('#footer-object-count').waitFor({ state: 'visible' });
  await page.waitForFunction(() => globalThis.__FORGE_STUDIO__.getSummary().objectCount === 200);
  const loadMs = performance.now() - loadStartedAt;

  const saveStartedAt = performance.now();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('save-project').click();
  await downloadPromise;
  const saveMs = performance.now() - saveStartedAt;

  await page.locator('.hierarchy-select').first().click();
  const inputResponseMs = await page.evaluate(() => {
    const input = document.querySelector('#object-name');
    const startedAt = performance.now();
    input.value = 'Performance Mesh Renamed';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    if (!document.querySelector('.hierarchy-select')?.textContent.includes('Renamed')) {
      throw new Error('Rename response did not reach Hierarchy synchronously.');
    }
    return performance.now() - startedAt;
  });

  const undoStartedAt = performance.now();
  await page.getByTestId('undo').click();
  await page.waitForFunction(
    () => !document.querySelector('.hierarchy-select')?.textContent.includes('Renamed'),
  );
  const undoMs = performance.now() - undoStartedAt;
  const redoStartedAt = performance.now();
  await page.getByTestId('redo').click();
  await page.waitForFunction(() =>
    document.querySelector('.hierarchy-select')?.textContent.includes('Renamed'),
  );
  const redoMs = performance.now() - redoStartedAt;

  await page.screenshot({
    path: 'outputs/evidence/performance-scene-200-mesh.png',
    fullPage: true,
  });
  await orbitFor(page, warmupMs);
  const framesPromise = page.evaluate(
    (duration) =>
      new Promise((resolve) => {
        const samples = [];
        const started = performance.now();
        let previous = started;
        const frame = (now) => {
          samples.push(now - previous);
          previous = now;
          if (now - started >= duration) resolve({ duration: now - started, samples });
          else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }),
    sampleMs,
  );
  await orbitFor(page, sampleMs);
  const frames = await framesPromise;
  const remainingMs = Math.max(0, interactionMs - warmupMs - sampleMs);
  if (remainingMs) await orbitFor(page, remainingMs);

  const environment = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    const extension = context?.getExtension('WEBGL_debug_renderer_info');
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemoryGiB: navigator.deviceMemory ?? null,
      devicePixelRatio: globalThis.devicePixelRatio,
      screen: [screen.width, screen.height],
      webglVendor: extension
        ? context.getParameter(extension.UNMASKED_VENDOR_WEBGL)
        : context?.getParameter(context.VENDOR),
      webglRenderer: extension
        ? context.getParameter(extension.UNMASKED_RENDERER_WEBGL)
        : context?.getParameter(context.RENDERER),
      jsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
    };
  });
  const currentChrome = chromeProcesses().filter((entry) => !beforePids.has(entry.Id));
  const workingSetBytes =
    currentChrome.length > 0
      ? currentChrome.reduce((total, entry) => total + entry.WorkingSet64, 0)
      : null;
  const frameSamples = frames.samples.slice(1);
  const averageFps = frameSamples.length / (frames.duration / 1000);
  const p95FrameTimeMs = percentile(frameSamples, 0.95);
  const criteria = {
    averageFps: averageFps >= 30,
    p95FrameTime: p95FrameTimeMs <= 50,
    coldStart: coldStartMs <= 5000,
    save: saveMs <= 2000,
    load: loadMs <= 5000,
    undoRedo: Math.max(undoMs, redoMs) <= 500,
    inputResponse: inputResponseMs <= 150,
    workingSet: workingSetBytes === null ? null : workingSetBytes < 1024 * 1024 * 1024,
    consoleErrors: runtimeErrors.length === 0,
  };
  const result = {
    measuredAt: new Date().toISOString(),
    scene: {
      meshCount: 200,
      triangleCount: 100000,
      uniqueMaterialValues: 30,
      textures: 0,
    },
    method: {
      viewport: [1920, 1080],
      devicePixelRatio: 1,
      warmupMs,
      orbitSampleMs: sampleMs,
      totalInteractionMs: interactionMs,
      browserChannel: 'chrome',
      headless: true,
    },
    measurements: {
      averageFps,
      p95FrameTimeMs,
      coldStartMs,
      saveMs,
      loadMs,
      undoMs,
      redoMs,
      inputResponseMs,
      workingSetBytes,
      frameSampleCount: frameSamples.length,
    },
    environment,
    runtimeErrors,
    criteria,
    passed: Object.values(criteria).every((value) => value !== false),
  };
  const json = `${JSON.stringify(result, null, 2)}\n`;
  await mkdir('docs/evidence', { recursive: true });
  await mkdir('outputs/evidence', { recursive: true });
  await writeFile('docs/evidence/performance-results.json', json, 'utf8');
  await writeFile('outputs/evidence/performance-results.json', json, 'utf8');
  console.log(json);
  if (!result.passed) process.exitCode = 1;
} finally {
  await browser?.close();
  await stopServer();
}
