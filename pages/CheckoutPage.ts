import { Page, Locator } from '@playwright/test';
import { GenericMethods } from '../baseClass/GenericMethods';

export class CheckoutPage extends GenericMethods {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillUserInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.type(this.firstNameInput, firstName);
    await this.type(this.lastNameInput, lastName);
    await this.type(this.postalCodeInput, postalCode);
    await this.click(this.continueButton);
  }

  async finishOrder(): Promise<void> {
    await this.click(this.finishButton);
  }
}
