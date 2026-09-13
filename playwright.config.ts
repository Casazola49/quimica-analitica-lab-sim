import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx vite --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
  projects: [
    {
      name: 'Desktop 1366x680 (Laptop 100% Zoom)',
      use: { viewport: { width: 1366, height: 680 } },
    },
    {
      name: 'Desktop 1920x940 (FullHD 100% Zoom)',
      use: { viewport: { width: 1920, height: 940 } },
    },
    {
      name: 'Mobile Safari / Chrome (390x844)',
      use: { viewport: { width: 390, height: 844 } },
    },
  ],
});
