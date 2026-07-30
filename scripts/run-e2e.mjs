import { spawn } from 'node:child_process';

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4174'],
  { stdio: 'ignore', windowsHide: true },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Vite test server exited before startup.');
    try {
      const response = await fetch('http://127.0.0.1:4174/');
      if (response.ok) return;
    } catch {
      // Server startup is still in progress.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Vite test server did not become ready within 30 seconds.');
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

let exitCode;
try {
  await waitForServer();
  const runner = spawn(
    process.execPath,
    ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)],
    { stdio: 'inherit', windowsHide: true },
  );
  exitCode = await new Promise((resolve) => runner.once('exit', resolve));
} finally {
  await stopServer();
}

process.exitCode = exitCode ?? 1;
