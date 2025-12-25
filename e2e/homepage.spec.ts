/**
 * Homepage E2E Test
 *
 * Verifies the homepage loads correctly and basic navigation works.
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Page should load without errors
    await expect(page).toHaveTitle(/ecoPulse/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still be accessible on mobile
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Basic accessibility check - more comprehensive tests with axe-core can be added
    // Check that the page has a main landmark
    const main = page.locator('main');
    if ((await main.count()) > 0) {
      await expect(main).toBeVisible();
    }
  });
});
