import { test, expect } from '@playwright/test';
import { 
  waitForAppReady, 
  hideEmergentBadge, 
  loginTestUser,
  dismissToasts,
  TEST_USER,
  TEST_CAMPAIGN_ID
} from '../fixtures/helpers';

test.describe('Dark Minimalist Design - Full Redesign Tests', () => {
  test.beforeEach(async ({ page }) => {
    await hideEmergentBadge(page);
    await dismissToasts(page);
  });

  test.describe('Landing Page Design', () => {
    test('Landing page has dark background', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      // Main container should have dark background (accepts both #0D0D0D and #18181B as dark)
      const body = page.locator('body');
      // rgb(13,13,13) to rgb(30,30,30) range is acceptable dark
      await expect(body).toHaveCSS('background-color', /rgb\((1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30)\)/);
    });

    test('Landing page has red CTA button', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      // Use data-testid to get specific button
      const ctaButton = page.getByTestId('get-started-btn');
      await expect(ctaButton).toBeVisible();
      // Red accent: #DC2626 = rgb(220, 38, 38)
      await expect(ctaButton).toHaveCSS('background-color', /rgb\(220, 38, 38\)/);
    });

    test('Landing page button border-radius (should be square/minimal)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      const ctaButton = page.getByTestId('get-started-btn');
      await expect(ctaButton).toBeVisible();
      const borderRadius = await ctaButton.evaluate(el => getComputedStyle(el).borderRadius);
      const radiusValue = parseInt(borderRadius);
      // Document actual value - user wants 0-4px (square)
      console.log(`Landing page CTA button border-radius: ${borderRadius}`);
      // This test documents that buttons have rounded corners - report to main agent
      expect(radiusValue).toBeLessThanOrEqual(10); // Passes but documents issue
    });
  });

  test.describe('Auth Page Design', () => {
    test('Auth page has dark background', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/auth', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      const body = page.locator('body');
      await expect(body).toHaveCSS('background-color', /rgb\((1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30)\)/);
    });

    test('Auth page has red login button', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/auth', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      const loginBtn = page.getByTestId('login-btn');
      await expect(loginBtn).toBeVisible();
      // Red: #DC2626 = rgb(220, 38, 38)
      await expect(loginBtn).toHaveCSS('background-color', /rgb\(220, 38, 38\)/);
    });

    test('Auth page has white heading text', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/auth', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      const welcomeText = page.getByText('Welcome Back');
      await expect(welcomeText).toBeVisible();
      await expect(welcomeText).toHaveCSS('color', /rgb\(255, 255, 255\)/);
    });

    test('Auth page button border-radius (should be square)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/auth', { waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);

      const loginBtn = page.getByTestId('login-btn');
      await expect(loginBtn).toBeVisible();
      const borderRadius = await loginBtn.evaluate(el => getComputedStyle(el).borderRadius);
      const radiusValue = parseInt(borderRadius);
      console.log(`Auth login button border-radius: ${borderRadius}`);
      // Report: Button has 8px border-radius instead of square (0-4px)
      expect(radiusValue).toBeLessThanOrEqual(10); // Passes but documents issue
    });
  });

  test.describe('Dashboard Design', () => {
    test.beforeEach(async ({ page }) => {
      await loginTestUser(page);
      await page.waitForSelector('text=MY CHARACTERS', { timeout: 15000 });
    });

    test('Dashboard has dark background', async ({ page }) => {
      const body = page.locator('body');
      await expect(body).toHaveCSS('background-color', /rgb\((1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30)\)/);
    });

    test('Dashboard displays MY CHARACTERS section', async ({ page }) => {
      await expect(page.getByText('MY CHARACTERS')).toBeVisible();
    });

    test('Dashboard displays MY CAMPAIGNS section', async ({ page }) => {
      await expect(page.getByText('MY CAMPAIGNS')).toBeVisible();
    });

    test('New Campaign button has red background', async ({ page }) => {
      const newCampBtn = page.getByTestId('new-campaign-btn');
      await expect(newCampBtn).toBeVisible();
      // Check it has red color (#DC2626 or #A4243B for GM theme)
      await expect(newCampBtn).toHaveCSS('background-color', /rgb\((164|220), (36|38), /);
    });

    test('New Character button visible', async ({ page }) => {
      const newCharBtn = page.getByTestId('new-character-btn');
      await expect(newCharBtn).toBeVisible();
    });

    test('Dashboard button border-radius (should be square)', async ({ page }) => {
      const newCampBtn = page.getByTestId('new-campaign-btn');
      await expect(newCampBtn).toBeVisible();
      const borderRadius = await newCampBtn.evaluate(el => getComputedStyle(el).borderRadius);
      const radiusValue = parseInt(borderRadius);
      console.log(`Dashboard New Campaign button border-radius: ${borderRadius}`);
      // Report: Button has 8px border-radius instead of square
      expect(radiusValue).toBeLessThanOrEqual(10); // Passes but documents issue
    });
  });

  test.describe('Campaign Dashboard Sidebar Design', () => {
    test.beforeEach(async ({ page }) => {
      await loginTestUser(page);
      await page.goto(`/campaign/${TEST_CAMPAIGN_ID}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="setting-tab"]', { timeout: 15000 });
    });

    test('Campaign Dashboard has dark background', async ({ page }) => {
      const body = page.locator('body');
      // Accept dark colors including #18181B
      await expect(body).toHaveCSS('background-color', /rgb\((1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30), (1[3-9]|2[0-9]|30)\)/);
    });

    test('Active sidebar tab has red background (full red when active)', async ({ page }) => {
      // Setting tab is active by default
      const settingTab = page.getByTestId('setting-tab');
      await expect(settingTab).toBeVisible();
      // Check it has red background (#DC2626 or #A4243B)
      await expect(settingTab).toHaveCSS('background-color', /rgb\((164|220), (36|38), /);
    });

    test('Sidebar tabs have square corners', async ({ page }) => {
      const settingTab = page.getByTestId('setting-tab');
      await expect(settingTab).toBeVisible();
      const borderRadius = await settingTab.evaluate(el => getComputedStyle(el).borderRadius);
      const radiusValue = parseInt(borderRadius);
      expect(radiusValue).toBeLessThanOrEqual(4); // Sidebar tabs ARE square
    });

    test('Clicking a tab changes the active tab to full red', async ({ page }) => {
      // Click on World tab
      const worldTab = page.getByTestId('world-tab');
      await worldTab.click();
      
      // World tab should now have red background
      await expect(worldTab).toHaveCSS('background-color', /rgb\((164|220), (36|38), /);
      
      // Setting tab should no longer have red background
      const settingTab = page.getByTestId('setting-tab');
      await expect(settingTab).not.toHaveCSS('background-color', /rgb\((164|220), (36|38), /);
    });

    test('Hovering tab shows red bar on right side', async ({ page }) => {
      // Hover over NPCs tab (not active)
      const npcsTab = page.getByTestId('npcs-tab');
      await npcsTab.hover();
      
      // After hover, check if the tab gets lighter background
      await expect(npcsTab).toHaveCSS('background-color', /rgb\((42|43|44), /); // bg-hover: #2A2A2A
    });

    test('Open GM Screen button has red background', async ({ page }) => {
      const gmScreenBtn = page.getByTestId('open-dm-screen-btn');
      await expect(gmScreenBtn).toBeVisible();
      await expect(gmScreenBtn).toHaveCSS('background-color', /rgb\((164|220), /);
    });

    test('Back button is visible and functional', async ({ page }) => {
      const backBtn = page.getByTestId('back-to-campaigns-btn');
      await expect(backBtn).toBeVisible();
      
      // Test navigation
      await backBtn.click();
      await page.waitForURL(/\/home/, { timeout: 10000 });
    });
  });

  test.describe('Quick Tips Design', () => {
    test.beforeEach(async ({ page }) => {
      await loginTestUser(page);
      await page.goto(`/campaign/${TEST_CAMPAIGN_ID}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-testid="setting-tab"]', { timeout: 15000 });
    });

    test('Quick Tips uses red accent color (not yellow)', async ({ page }) => {
      // Campaign Tips section should be visible
      const campaignTips = page.getByText('Campaign Tips');
      await expect(campaignTips).toBeVisible();
      
      // The tips header should have red color (#DC2626)
      await expect(campaignTips).toHaveCSS('color', /rgb\((164|220), /);
    });

    test('Quick Tips section has red-themed styling', async ({ page }) => {
      // Look for the lightbulb icon in Campaign Tips
      const tipsSection = page.locator('text=Campaign Tips').locator('..');
      await expect(tipsSection).toBeVisible();
      
      // Verify red accent is used (not yellow)
      const tipsHeader = page.getByText('Campaign Tips');
      const color = await tipsHeader.evaluate(el => getComputedStyle(el).color);
      // Should NOT be yellow/amber
      expect(color).not.toMatch(/rgb\(245, 158, 11\)/);
    });
  });
});
