/**
 * Prerender key routes at build time using Puppeteer + vite preview.
 *
 * Run via: npm run build:seo
 * Requires the backend running at localhost:4000 for fully populated snapshots.
 * If the backend is offline, the page skeleton (nav, titles, meta) is still captured.
 *
 * Output: dist/<route>/index.html for each route listed in ROUTES.
 * Nginx should serve these with: try_files $uri $uri/ $uri/index.html /index.html;
 */

import puppeteer from 'puppeteer';
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST         = join(__dirname, '..', 'dist');
const PREVIEW_PORT = 4173;
const BASE_URL     = `http://localhost:${PREVIEW_PORT}`;

// Routes to prerender. dir is relative to dist/.
// '.' keeps the existing dist/index.html (overwritten with rendered snapshot).
const ROUTES = [
  { path: '/',                 dir: '.'                },
  { path: '/projects',         dir: 'projects'         },
  { path: '/packages',         dir: 'packages'         },
  { path: '/solar-calculator', dir: 'solar-calculator' },
  { path: '/client-journey',   dir: 'client-journey'   },
];

async function waitForServer(url, maxMs = 20_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`Preview server did not become ready at ${url} within ${maxMs / 1000}s`);
}

async function checkBackend() {
  try {
    const r = await fetch('http://localhost:4000/api/health', { signal: AbortSignal.timeout(3_000) });
    return r.ok;
  } catch { return false; }
}

async function main() {
  const backendUp = await checkBackend();
  if (!backendUp) {
    console.warn(
      '\n⚠  Backend not detected at localhost:4000.\n' +
      '   API-fetched content will not appear in snapshots.\n' +
      '   Start the backend first for fully populated prerendered HTML.\n'
    );
  } else {
    console.log('✓  Backend is reachable — API data will be included in snapshots.\n');
  }

  // Start vite preview (serves dist/ with the /api proxy defined in vite.config.ts)
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  preview.stdout.on('data', d => process.stdout.write(d));
  preview.stderr.on('data', d => process.stderr.write(d));

  let exitCode = 0;

  try {
    await waitForServer(BASE_URL);
    console.log('');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const { path, dir } of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      await page.goto(`${BASE_URL}${path}`, {
        waitUntil: 'networkidle2',
        timeout: 30_000,
      });

      // Extra settle time for deferred effects and CSS animations
      await new Promise(r => setTimeout(r, 600));

      const html = await page.content();
      await page.close();

      const targetDir = join(DIST, dir);
      await mkdir(targetDir, { recursive: true });
      await writeFile(join(targetDir, 'index.html'), html, 'utf-8');
      console.log(`✓  prerendered  ${path}`);
    }

    await browser.close();
    console.log('\nPrerender complete — snapshots written to dist/');
  } catch (err) {
    console.error('\nPrerender failed:', err.message);
    exitCode = 1;
  } finally {
    preview.kill();
  }

  process.exit(exitCode);
}

main();
