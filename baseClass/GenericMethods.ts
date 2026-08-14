import { expect, Locator, Page } from '@playwright/test';

export class GenericMethods {
  constructor(protected page: Page) {}

  async navigateTo(url: string): Promise<void> {
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        return;
      } catch (error) {
        const message = String(error);
        const isTransientNetworkError =
          message.includes('ERR_NETWORK_CHANGED') ||
          message.includes('ERR_INTERNET_DISCONNECTED') ||
          message.includes('ERR_CONNECTION_RESET') ||
          message.includes('net::ERR_');

        if (!isTransientNetworkError || attempt === maxAttempts) {
          throw error;
        }
      }
    }
  }

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async type(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() ?? '';
  }

  async assertText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption({ label: value });
  }

  async waitForLocator(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }
}
