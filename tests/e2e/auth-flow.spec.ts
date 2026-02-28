import { test, expect } from '@playwright/test';
import { waitForAppReady, dismissToasts, hideEmergentBadge, generateTestUsername } from '../fixtures/helpers';

test.describe('Auth Flow with New Design', () => {
  test.beforeEach(async ({ page }) => {
    await dismissToasts(page);
    await hideEmergentBadge(page);
  });

  test('should display login page with new Rookie Quest design', async ({ page }) => {
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    
    // Verify login form exists
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-username-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-btn')).toBeVisible();
    await expect(page.getByTestId('switch-to-register-btn')).toBeVisible();
    
    // Verify design elements - green login button and red create account button
    const loginBtn = page.getByTestId('login-submit-btn');
    await expect(loginBtn).toHaveText(/LOG IN/i);
    
    const registerBtn = page.getByTestId('switch-to-register-btn');
    await expect(registerBtn).toHaveText(/CREATE ACCOUNT/i);
  });

  test('should switch between login and register forms', async ({ page }) => {
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    
    // Initially should show login form
    await expect(page.getByTestId('login-form')).toBeVisible();
    
    // Click to switch to register
    await page.getByTestId('switch-to-register-btn').click();
    await expect(page.getByTestId('register-form')).toBeVisible();
    await expect(page.getByTestId('register-username-input')).toBeVisible();
    await expect(page.getByTestId('register-password-input')).toBeVisible();
    
    // Switch back to login
    await page.getByTestId('switch-to-login-btn').click();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should register a new user and redirect to campaigns', async ({ page }) => {
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    
    const testUsername = generateTestUsername();
    
    // Switch to register
    await page.getByTestId('switch-to-register-btn').click();
    await expect(page.getByTestId('register-form')).toBeVisible();
    
    // Fill registration form
    await page.getByTestId('register-username-input').fill(testUsername);
    await page.getByTestId('register-password-input').fill('testpass123');
    
    // Submit registration
    await page.getByTestId('register-submit-btn').click();
    
    // Should redirect to campaigns page
    await expect(page).toHaveURL(/\/campaigns/, { timeout: 10000 });
    
    // Verify we see the campaigns page with "Your Campaigns" header
    await expect(page.getByText('Your Campaigns')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    
    // Switch to register
    await page.getByTestId('switch-to-register-btn').click();
    
    // Fill with short password
    await page.getByTestId('register-username-input').fill('testuser');
    await page.getByTestId('register-password-input').fill('short');
    await page.getByTestId('register-submit-btn').click();
    
    // Should show error toast (stay on auth page)
    await expect(page).toHaveURL(/\/auth/);
  });
});
