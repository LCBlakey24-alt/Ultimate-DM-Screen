import { test, expect } from '@playwright/test';
import { 
  waitForAppReady, 
  hideEmergentBadge, 
  loginTestUser,
  dismissToasts,
  TEST_USER,
  TEST_CHARACTER_ID,
  TEST_CAMPAIGN_ID
} from '../fixtures/helpers';

test.describe('Unified Dashboard Rebrand', () => {
  test.beforeEach(async ({ page }) => {
    await hideEmergentBadge(page);
    await dismissToasts(page);
  });

  test.describe('Dashboard Layout', () => {
    test('UnifiedDashboard shows after login (not role selection)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      
      // Login
      await page.goto('/auth', { waitUntil: 'domcontentloaded' });
      await page.getByTestId('login-email').fill(TEST_USER.email);
      await page.getByTestId('login-password').fill(TEST_USER.password);
      await page.getByTestId('login-btn').click();
      
      // Should redirect to /home (UnifiedDashboard)
      await page.waitForURL(/\/home/, { timeout: 15000 });
      
      // Verify split view with Characters and Campaigns
      await expect(page.getByText('MY CHARACTERS')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('MY CAMPAIGNS')).toBeVisible();
    });

    test('MY CHARACTERS section uses blue color scheme', async ({ page }) => {
      await loginTestUser(page);
      await expect(page.getByText('MY CHARACTERS')).toBeVisible({ timeout: 10000 });
      
      // Check New Character button is blue (--player-primary: #2563EB)
      const newCharBtn = page.getByTestId('new-character-btn');
      await expect(newCharBtn).toBeVisible();
      
      // Verify it has blue background color (RGB approximately 37, 99, 235)
      await expect(newCharBtn).toHaveCSS('background-color', /rgb\(37, 99, 235\)/);
    });

    test('MY CAMPAIGNS section uses red color scheme', async ({ page }) => {
      await loginTestUser(page);
      await expect(page.getByText('MY CAMPAIGNS')).toBeVisible({ timeout: 10000 });
      
      // Check New Campaign button is red (--gm-primary: #A4243B)
      const newCampBtn = page.getByTestId('new-campaign-btn');
      await expect(newCampBtn).toBeVisible();
      
      // Verify it has red background color (RGB approximately 164, 36, 59)
      await expect(newCampBtn).toHaveCSS('background-color', /rgb\(164, 36, 59\)/);
    });
  });

  test.describe('Header Buttons', () => {
    test.beforeEach(async ({ page }) => {
      await loginTestUser(page);
      await expect(page.getByText('MY CHARACTERS')).toBeVisible({ timeout: 10000 });
    });

    test('Review button is visible in header', async ({ page }) => {
      await expect(page.getByTestId('review-btn')).toBeVisible();
      await expect(page.getByTestId('review-btn')).toContainText('Leave Review');
    });

    test('Referral button is visible in header', async ({ page }) => {
      await expect(page.getByTestId('referral-btn')).toBeVisible();
      await expect(page.getByTestId('referral-btn')).toContainText('Referral Code');
    });

    test('Review modal opens with star rating', async ({ page }) => {
      await page.getByTestId('review-btn').click();
      
      // Modal should appear
      await expect(page.getByText('Leave a Review')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('How would you rate your experience?')).toBeVisible();
      
      // Should have Submit and Cancel buttons
      await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
      
      // Close modal by clicking cancel
      await page.getByRole('button', { name: /cancel/i }).click();
      await expect(page.getByText('Leave a Review')).not.toBeVisible();
    });

    test('Referral modal opens with code display', async ({ page }) => {
      await page.getByTestId('referral-btn').click();
      
      // Modal should appear
      await expect(page.getByText('Your Referral Code')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Share this link with friends to earn rewards')).toBeVisible();
      
      // Should have Copy Referral Link button
      await expect(page.getByRole('button', { name: /copy referral link/i })).toBeVisible();
    });
  });

  test.describe('Navigation Buttons', () => {
    test.beforeEach(async ({ page }) => {
      await loginTestUser(page);
      await expect(page.getByText('MY CHARACTERS')).toBeVisible({ timeout: 10000 });
    });

    test('New Character button navigates to character builder', async ({ page }) => {
      await page.getByTestId('new-character-btn').click();
      await page.waitForURL(/\/character-builder/, { timeout: 10000 });
    });

    test('New Campaign button opens campaign creation dialog', async ({ page }) => {
      await page.getByTestId('new-campaign-btn').click();
      // Fix: navigates to /campaigns and opens Create Campaign modal
      await page.waitForURL(/\/campaigns/, { timeout: 10000 });
      // Verify the Create New Campaign modal is open
      await expect(page.getByRole('heading', { name: 'Create New Campaign' })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('textbox', { name: /enter campaign name/i })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Campaign' })).toBeVisible();
    });

    test('Character card navigates to character sheet', async ({ page }) => {
      // Check if there's a character card to click
      const characterCard = page.getByTestId(`character-${TEST_CHARACTER_ID}`);
      if (await characterCard.isVisible({ timeout: 5000 })) {
        await characterCard.click();
        await page.waitForURL(/\/characters\//, { timeout: 10000 });
      }
    });

    test('Campaign card navigates to campaign dashboard', async ({ page }) => {
      // Check if there's a campaign card to click
      const campaignCard = page.getByTestId(`campaign-${TEST_CAMPAIGN_ID}`);
      if (await campaignCard.isVisible({ timeout: 5000 })) {
        await campaignCard.click();
        await page.waitForURL(/\/campaign\//, { timeout: 10000 });
      }
    });
  });

  test.describe('Auth Page Color Scheme', () => {
    test('Auth page has blue login button', async ({ page }) => {
      await page.goto('/auth', { waitUntil: 'domcontentloaded' });
      
      const loginBtn = page.getByTestId('login-btn');
      await expect(loginBtn).toBeVisible();
      
      // Verify login button has blue background (player-primary)
      await expect(loginBtn).toHaveCSS('background-color', /rgb\(37, 99, 235\)/);
    });
  });

  test.describe('Square Corners Design', () => {
    test('Buttons have square corners (minimal border-radius)', async ({ page }) => {
      await loginTestUser(page);
      await expect(page.getByText('MY CHARACTERS')).toBeVisible({ timeout: 10000 });
      
      // Check New Character button
      const newCharBtn = page.getByTestId('new-character-btn');
      const borderRadius = await newCharBtn.evaluate(el => 
        window.getComputedStyle(el).borderRadius
      );
      
      // Should have small border-radius (2px or similar)
      expect(parseInt(borderRadius)).toBeLessThanOrEqual(4);
    });

    test('Character/Campaign cards have square corners', async ({ page }) => {
      await loginTestUser(page);
      await expect(page.getByText('MY CHARACTERS')).toBeVisible({ timeout: 10000 });
      
      // Check character card border-radius
      const characterCards = page.locator('[data-testid^="character-"]');
      if (await characterCards.count() > 0) {
        const borderRadius = await characterCards.first().evaluate(el => 
          window.getComputedStyle(el).borderRadius
        );
        expect(parseInt(borderRadius)).toBeLessThanOrEqual(4);
      }
    });
  });
});
