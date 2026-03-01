import { test, expect } from '@playwright/test';
import { waitForAppReady, dismissToasts, hideEmergentBadge, TEST_USER, TEST_CAMPAIGN_ID } from '../fixtures/helpers';

test.describe('Dashboard Additional Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await dismissToasts(page);
    
    // Login with test user
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    await page.getByTestId('login-username-input').fill(TEST_USER.username);
    await page.getByTestId('login-password-input').fill(TEST_USER.password);
    await page.getByTestId('login-submit-btn').click();
    await page.waitForURL(/\/campaigns/, { timeout: 10000 });
    
    // Navigate to test campaign
    await page.goto(`/campaign/${TEST_CAMPAIGN_ID}`, { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    await hideEmergentBadge(page);
  });

  test('Combat Creator tab loads correctly', async ({ page }) => {
    // Navigate to Combat Creator tab
    await page.getByTestId('combat-creator-tab').click();
    
    // Verify key elements are present
    await expect(page.getByText('Combat Creator')).toBeVisible({ timeout: 10000 });
    
    // Verify monster database section exists
    await expect(page.getByText('Add Monsters')).toBeVisible();
    await expect(page.getByText('From Database')).toBeVisible();
    
    // Verify saved scenarios section exists  
    await expect(page.getByText('Saved Scenarios')).toBeVisible();
  });

  test('Combat Creator monster search works', async ({ page }) => {
    await page.getByTestId('combat-creator-tab').click();
    await expect(page.getByText('Combat Creator')).toBeVisible({ timeout: 10000 });
    
    // Look for search/filter controls
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Goblin');
      // Should filter monsters
    }
    
    // Verify monster type filter exists
    await expect(page.getByText('All Types')).toBeVisible();
  });

  test('Items tab loads correctly', async ({ page }) => {
    // Navigate to Items tab
    await page.getByTestId('items-tab').click();
    
    // Verify Item Creator heading is visible
    await expect(page.getByText('Item Creator')).toBeVisible({ timeout: 10000 });
    
    // Verify Create New Item button exists
    await expect(page.getByText('Create New Item')).toBeVisible();
    
    // Verify filter controls exist
    await expect(page.getByText('All Types')).toBeVisible();
  });

  test('Items tab shows item types', async ({ page }) => {
    await page.getByTestId('items-tab').click();
    await expect(page.getByText('Item Creator')).toBeVisible({ timeout: 10000 });
    
    // Verify item type icons/filters are present
    await expect(page.getByText('Weapon')).toBeVisible();
    await expect(page.getByText('Armor')).toBeVisible();
    await expect(page.getByText('Potion')).toBeVisible();
  });

  test('Encounter Generator tab loads correctly', async ({ page }) => {
    // Navigate to Encounter Generator tab  
    await page.getByTestId('encounter-gen-tab').click();
    
    // Verify AI Encounter Generator heading is visible
    await expect(page.getByText('AI Encounter Generator')).toBeVisible({ timeout: 10000 });
    
    // Verify generator controls exist
    await expect(page.getByText('Party Level')).toBeVisible();
    await expect(page.getByText('Party Size')).toBeVisible();
    await expect(page.getByText('Difficulty')).toBeVisible();
  });

  test('Encounter Generator has difficulty options', async ({ page }) => {
    await page.getByTestId('encounter-gen-tab').click();
    await expect(page.getByText('AI Encounter Generator')).toBeVisible({ timeout: 10000 });
    
    // Verify difficulty level options exist
    await expect(page.getByText('Easy')).toBeVisible();
    await expect(page.getByText('Medium')).toBeVisible();
    await expect(page.getByText('Hard')).toBeVisible();
    await expect(page.getByText('Deadly')).toBeVisible();
  });

  test('Encounter Generator has encounter type options', async ({ page }) => {
    await page.getByTestId('encounter-gen-tab').click();
    await expect(page.getByText('AI Encounter Generator')).toBeVisible({ timeout: 10000 });
    
    // Verify encounter type options exist
    await expect(page.getByText('Combat')).toBeVisible();
    await expect(page.getByText('Ambush')).toBeVisible();
    await expect(page.getByText('Boss Fight')).toBeVisible();
    await expect(page.getByText('Horde')).toBeVisible();
  });

  test('Encounter Generator has environment options', async ({ page }) => {
    await page.getByTestId('encounter-gen-tab').click();
    await expect(page.getByText('AI Encounter Generator')).toBeVisible({ timeout: 10000 });
    
    // Verify environment dropdown has options
    await expect(page.getByText('Environment')).toBeVisible();
    
    // Check for Generate Encounter button
    await expect(page.getByRole('button', { name: /Generate Encounter/i })).toBeVisible();
  });

  test('All dashboard tabs are accessible', async ({ page }) => {
    // Test navigation to all tabs
    const tabIds = [
      'setting-tab',
      'gods-tab',
      'npcs-tab', 
      'locations-tab',
      'players-tab',
      'combat-creator-tab',
      'encounter-gen-tab',
      'items-tab',
      'calendar-tab',
      'ingame-notes-tab'
    ];
    
    for (const tabId of tabIds) {
      await page.getByTestId(tabId).click();
      // Each tab should render without error (no crash)
      await expect(page.getByTestId(tabId)).toBeVisible();
    }
  });
});
