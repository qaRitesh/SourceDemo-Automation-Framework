import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const loginUsers = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../saucedemoData/loginUsers.json'), 'utf-8')
) as Array<{ username: string; password: string; name: string; description: string }>;

const checkoutUsers = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../saucedemoData/checkoutData.json'), 'utf-8')
) as Array<{ firstName: string; lastName: string; postalCode: string }>;

test('TC01: User can open login page and login with valid credentials @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.loginWithValidCredentials();

  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.title).toHaveText('Products');
});

test('TC02: User sees all products loaded on inventory page @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(inventoryPage.products).toHaveCount(6);
});

test('TC03: User can add a single product to cart @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addFirstItemToCart();
  await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('TC04: User can add a product by its name @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addItemByName('Sauce Labs Backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('TC05: User can open cart from inventory page @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.openCart();
  await expect(cartPage.cartItems).toHaveCount(1);
});

test('TC06: User can proceed to checkout @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.openCart();
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/checkout-step-one/);
});

test('TC07: User can complete checkout with valid details @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.openCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillUserInfo(checkoutUsers[0].firstName, checkoutUsers[0].lastName, checkoutUsers[0].postalCode);
  await checkoutPage.finishOrder();
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

test('TC08: Locked out user cannot login @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(loginUsers[1].username, loginUsers[1].password);
  await expect(loginPage.errorMessage).toContainText('locked out');
});

test('TC09: Invalid credentials display login error @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('wrong_user', 'wrong_password');
  await expect(loginPage.errorMessage).toContainText('Username and password do not match');
});

test('TC10: Footer social icons are visible @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.locator('.social_twitter')).toBeVisible();
  await expect(page.locator('.social_facebook')).toBeVisible();
  await expect(page.locator('.social_linkedin')).toBeVisible();
});

test('TC11: Sorting products by price low to high @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.locator('[data-test="product-sort-container"]').selectOption({ label: 'Price (low to high)' });

  const prices = await page.locator('.inventory_item_price').allTextContents();
  const numeric = prices.map((item) => Number(item.replace('$', '')));
  expect(numeric).toEqual([...numeric].sort((a, b) => a - b));
});

test('TC12: Product titles count matches 6 items @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.locator('.inventory_item_name')).toHaveCount(6);
});

test('TC13: Problem user can log in but product images may be broken @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(loginUsers[2].username, loginUsers[2].password);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('TC14: User can log out successfully @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();

  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

test('TC15: User can continue shopping after viewing cart @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.openCart();
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.shopping_cart_link')).toBeVisible();
});
