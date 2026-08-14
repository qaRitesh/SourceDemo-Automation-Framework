import { defineConfig, devices } from '@playwright/test';
import { env } from './config/environments';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/html', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  outputDir: 'test-results',
  globalSetup: require.resolve('./baseClass/auth.setup.ts'),
  use: {
    baseURL: env.baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: 'npx http-server ./ -p 8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
