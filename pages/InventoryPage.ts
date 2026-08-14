import { Page, Locator } from '@playwright/test';
import { GenericMethods } from '../baseClass/GenericMethods';

export class InventoryPage extends GenericMethods {
  readonly page: Page;
  readonly title: Locator;
  readonly products: Locator;
  readonly cartButton: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.locator('.title');
    this.products = page.locator('.inventory_item');
    this.cartButton = page.locator('.shopping_cart_link');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addFirstItemToCart(): Promise<void> {
    await this.click(this.addToCartButtons.first());
  }

  async addItemByName(name: string): Promise<void> {
    const button = this.page.locator('.inventory_item').filter({ hasText: name }).locator('button');
    await this.click(button);
  }

  async openCart(): Promise<void> {
    await this.click(this.cartButton);
  }
}
