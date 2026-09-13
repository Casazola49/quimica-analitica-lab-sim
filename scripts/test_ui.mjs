import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function run() {
  // Start vite server
  const vite = spawn('npx', ['vite', '--port', '5173'], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });

  // Wait 1.5s for server
  await new Promise((r) => setTimeout(r, 1500));

  const browser = await chromium.launch({ headless: true });
  
  // 1. Test standard laptop viewport (1366x768) at 100% zoom
  // Note: in a browser on 1366x768 screen, the viewport is typically 1366 x 650 (accounting for browser chrome)
  const context = await browser.newContext({
    viewport: { width: 1366, height: 680 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('#buretteGlass');

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: 'screenshots/current_1366x680.png', fullPage: false });

  // Measure bounding boxes of key elements
  const burette = await page.$eval('#buretteGlass', (el) => el.getBoundingClientRect());
  const flask = await page.$eval('#flaskBody', (el) => el.getBoundingClientRect());
  const shelf = await page.evaluate(() => {
    const el = document.querySelector('button[title*="fenolftaleína"]')?.closest('div');
    return el ? el.getBoundingClientRect() : null;
  });

  console.log('--- Current Measurements at 1366x680 ---');
  console.log('Viewport Height:', 680);
  console.log('Burette bottom:', burette.bottom);
  console.log('Flask bottom:', flask.bottom);
  console.log('Shelf position:', shelf);

  await browser.close();
  vite.kill();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
