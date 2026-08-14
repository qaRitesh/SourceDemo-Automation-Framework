import { chromium, type FullConfig } from '@playwright/test';
import { env } from '../config/environments';

const authFile = 'playwright/.auth/user.json';

async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(env.baseURL);
  await page.locator('[data-test="username"]').fill(env.username);
  await page.locator('[data-test="password"]').fill(env.password);
  await page.locator('[data-test="login-button"]').click();

  await page.context().storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;
