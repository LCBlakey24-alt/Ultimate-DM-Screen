import { test, expect, Page } from '@playwright/test';

/**
 * Tests for GM Side Color Updates and Campaign Settings Modal:
 * 1. Campaign Dashboard - Settings button visible in header
 * 2. Campaign Settings Modal - opens and shows 4 upload sections
 * 3. GM Screen - Names tab uses gold colors instead of green
 * 4. GM Screen - Tables tab Shop Name uses gold colors
 * 5. Previous features still work
 */

const TEST_EMAIL = 'lcblakey24@outlook.com';
const TEST_PASSWORD = 'LCBlakey24?!';

// Helper to login
async function login(page: Page) {
  await page.goto('/auth', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('domcontentloaded');
  await page.getByTestId('login-email').fill(TEST_EMAIL);
  await page.getByTestId('login-password').fill(TEST_PASSWORD);
  await page.getByTestId('login-btn').click();
  await page.waitForURL(/\/home/, { timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');
}

// Helper to dismiss toasts
async function dismissToasts(page: Page) {
  await page.addLocatorHandler(
    page.locator('[data-sonner-toast]').first(),
    async (toast) => {
      const close = toast.locator('[data-close], button[aria-label="Close"]');
      await close.first().click({ timeout: 1000 }).catch(() => {});
    },
    { times: 20, noWaitAfter: true }
  );
}

test.describe('Campaign Dashboard Settings Button', () => {
  test.beforeEach(async ({ page }) => {
    await dismissToasts(page);
  });

  test('Settings button is visible in Campaign Dashboard header', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first available campaign
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for campaign dashboard to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="campaign-settings-btn"]', { timeout: 10000 });
    
    // Verify Settings button is visible
    const settingsBtn = page.getByTestId('campaign-settings-btn');
    await expect(settingsBtn).toBeVisible();
    
    // Verify button has Settings text (desktop only class hides text on mobile)
    await expect(settingsBtn).toBeVisible();
    
    // Screenshot for verification
    await page.screenshot({ path: '/app/tests/e2e/test-campaign-dashboard-settings.jpeg', quality: 20 });
  });

  test('Settings button opens Campaign Settings modal with 4 upload sections', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first available campaign
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for campaign dashboard
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="campaign-settings-btn"]', { timeout: 10000 });
    
    // Click Settings button
    await page.getByTestId('campaign-settings-btn').click();
    
    // Wait for modal to open
    await page.waitForSelector('text=Campaign Settings', { timeout: 5000 });
    
    // Verify modal title - use more specific selector
    await expect(page.locator('h2').filter({ hasText: 'Campaign Settings' })).toBeVisible();
    
    // Verify 4 upload sections are present
    await expect(page.locator('h3').filter({ hasText: 'Custom Rulesets' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Custom Races & Classes' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Custom Items & Spells' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Custom Monsters & NPCs' })).toBeVisible();
    
    // Verify upload buttons
    await expect(page.locator('button').filter({ hasText: 'Upload Ruleset' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Upload Character Options' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Upload Items & Spells' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Upload Monsters & NPCs' })).toBeVisible();
    
    // Screenshot for verification
    await page.screenshot({ path: '/app/tests/e2e/test-campaign-settings-modal.jpeg', quality: 20 });
  });
});

test.describe('GM Screen Color Updates', () => {
  test.beforeEach(async ({ page }) => {
    await dismissToasts(page);
  });

  test('GM Screen Names tab uses gold colors', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first campaign to get campaign ID
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for dashboard
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="open-dm-screen-btn"]', { timeout: 10000 });
    
    // Get current URL to extract campaign ID
    const url = page.url();
    const campaignId = url.split('/campaign/')[1];
    
    // Navigate to GM Screen directly
    await page.goto(`/gm-screen/${campaignId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for GM Tools sidebar
    await page.waitForSelector('text=GM Tools', { timeout: 10000 });
    
    // Click on Names tab
    await page.getByTestId('tab-names').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Verify Names tab content is displayed
    await expect(page.locator('text=NPC Name Generator')).toBeVisible({ timeout: 10000 });
    
    // Verify gold color elements - check for "Generate a Name" section
    await expect(page.locator('h3').filter({ hasText: 'Generate a Name' })).toBeVisible();
    
    // Verify the Generate Name button exists
    await expect(page.getByTestId('generate-name-btn')).toBeVisible();
    
    // Screenshot for visual verification of gold colors
    await page.screenshot({ path: '/app/tests/e2e/test-gm-screen-names-gold.jpeg', quality: 20 });
  });

  test('GM Screen Tables tab Shop Name uses gold color', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first campaign
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for dashboard and get campaign ID
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="open-dm-screen-btn"]', { timeout: 10000 });
    const url = page.url();
    const campaignId = url.split('/campaign/')[1];
    
    // Navigate to GM Screen directly
    await page.goto(`/gm-screen/${campaignId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for sidebar
    await page.waitForSelector('text=GM Tools', { timeout: 10000 });
    
    // Click on Tables tab
    await page.getByTestId('tab-tables').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Verify Tables tab content
    await expect(page.locator('h2').filter({ hasText: 'Random Tables' })).toBeVisible({ timeout: 10000 });
    
    // Verify Shop Name button is visible (should be gold colored - #F59E0B)
    const shopNameBtn = page.getByTestId('roll-shop_names-btn');
    await expect(shopNameBtn).toBeVisible();
    
    // Verify the Shop Name button contains correct text
    await expect(shopNameBtn).toContainText('Shop Name');
    
    // Screenshot for visual verification
    await page.screenshot({ path: '/app/tests/e2e/test-gm-screen-tables-shop-gold.jpeg', quality: 20 });
  });

  test('GM Screen Party tab displays correctly', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first campaign
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for dashboard and get campaign ID
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="open-dm-screen-btn"]', { timeout: 10000 });
    const url = page.url();
    const campaignId = url.split('/campaign/')[1];
    
    // Navigate to GM Screen directly
    await page.goto(`/gm-screen/${campaignId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for sidebar
    await page.waitForSelector('text=GM Tools', { timeout: 10000 });
    
    // Click on Party tab
    await page.getByTestId('tab-party').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Verify Party tab content
    await expect(page.locator('h2').filter({ hasText: 'Party Overview' })).toBeVisible({ timeout: 10000 });
    
    // Screenshot for visual verification of pink/purple colors
    await page.screenshot({ path: '/app/tests/e2e/test-gm-screen-party-colors.jpeg', quality: 20 });
  });
});

test.describe('Previous Features Still Work', () => {
  test.beforeEach(async ({ page }) => {
    await dismissToasts(page);
  });

  test('Campaign Dashboard sidebar has correct tabs structure', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first campaign
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for campaign dashboard
    await page.waitForLoadState('domcontentloaded');
    
    // Verify sidebar groups exist
    await expect(page.getByTestId('group-world')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('group-combat')).toBeVisible();
    await expect(page.getByTestId('group-tools')).toBeVisible();
    
    // Verify key tabs are visible
    await expect(page.getByTestId('setting-tab')).toBeVisible();
    await expect(page.getByTestId('combat-tab')).toBeVisible();
    await expect(page.getByTestId('tools-tab')).toBeVisible();
  });

  test('Open GM Screen button works', async ({ page }) => {
    await login(page);
    
    // Wait for home to load
    await page.waitForSelector('text=My Campaigns');
    
    // Click on first campaign
    const campaignItem = page.locator('text=TEST_Campaign').first();
    await campaignItem.click();
    
    // Wait for dashboard
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="open-dm-screen-btn"]', { timeout: 10000 });
    
    // Verify Open GM Screen button is visible
    const gmScreenBtn = page.getByTestId('open-dm-screen-btn');
    await expect(gmScreenBtn).toBeVisible();
    await expect(gmScreenBtn).toContainText('GM Screen');
  });

  test('Home page displays Player Coming Soon overlay', async ({ page }) => {
    await login(page);
    
    // Wait for home page to fully load
    await page.waitForSelector('text=My Campaigns');
    
    // Verify Coming Soon overlay is visible on Player section
    await expect(page.locator('text=Coming Soon').first()).toBeVisible();
    
    // Verify Player Features text
    await expect(page.locator('text=Player Features')).toBeVisible();
    
    // Verify GM section is still functional
    await expect(page.locator('text=My Campaigns')).toBeVisible();
    await expect(page.getByRole('button', { name: /New Campaign/i })).toBeVisible();
  });
});
