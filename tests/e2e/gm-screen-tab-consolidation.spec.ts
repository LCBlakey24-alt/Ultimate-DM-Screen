import { test, expect } from '@playwright/test';

test.describe('GM Screen Tab Consolidation', () => {
  const testEmail = 'lcblakey24@outlook.com';
  const testPassword = 'LCBlakey24?!';

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.getByPlaceholder('Email address').fill(testEmail);
    await page.getByPlaceholder('Password').fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for dashboard
    await expect(page.getByText(/your campaigns/i).first()).toBeVisible();
  });

  test('GM Screen has 9 tabs - tab consolidation verified', async ({ page }) => {
    // Navigate to a campaign
    await page.locator('[data-testid^="campaign-"]').first().click();
    await page.waitForLoadState('networkidle');
    
    // Dismiss any tips modal if present
    try {
      const gotIt = page.getByRole('button', { name: /got it, thanks/i });
      if (await gotIt.isVisible()) await gotIt.click();
    } catch(e) {}
    
    // Navigate to GM Screen
    await page.getByTestId('open-dm-screen-btn').click();
    
    // Wait for GM Tools header (indicates GM Screen loaded)
    await expect(page.locator('text=GM TOOLS').first()).toBeVisible();
    
    // Verify all 9 tabs are visible (using text-based selectors since tabs are buttons with text)
    const expectedTabs = ['Combat', 'Location', 'NPCs', 'Monsters', 'Tables', 'Loot', 'Dice', 'Party', 'Notes'];
    
    for (const tabName of expectedTabs) {
      const tabButton = page.locator(`button:has-text("${tabName}")`).first();
      await expect(tabButton).toBeVisible();
    }
    
    // Screenshot showing 9 tabs
    await page.screenshot({ path: 'gm-screen-9-tabs-verified.jpeg', quality: 20 });
    
    // Verify removed tabs do NOT exist (Names, Creatures, Inventory)
    await expect(page.locator('button:has-text("Names")').first()).not.toBeVisible();
    await expect(page.locator('button:has-text("Creatures")').first()).not.toBeVisible();
    await expect(page.locator('button:has-text("Inventory")').first()).not.toBeVisible();
  });

  test('NPCs tab shows combined Saved NPCs + Name Generator', async ({ page }) => {
    // Navigate to GM Screen
    await page.locator('[data-testid^="campaign-"]').first().click();
    await page.waitForLoadState('networkidle');
    
    try {
      const gotIt = page.getByRole('button', { name: /got it, thanks/i });
      if (await gotIt.isVisible()) await gotIt.click();
    } catch(e) {}
    
    await page.getByTestId('open-dm-screen-btn').click();
    await expect(page.locator('text=GM TOOLS').first()).toBeVisible();
    
    // Click NPCs tab
    await page.locator('button:has-text("NPCs")').first().click();
    
    // Verify combined view
    await expect(page.getByRole('heading', { name: /npcs & name generator/i })).toBeVisible();
    
    // Verify Saved NPCs section
    await expect(page.locator('text=Saved NPCs').first()).toBeVisible();
    
    // Verify Name Generator section
    await expect(page.locator('text=Generate NPC Name').first()).toBeVisible();
    
    await page.screenshot({ path: 'npcs-tab-combined-layout.jpeg', quality: 20 });
  });

  test('Monsters tab shows combined SRD lookup + Custom Creatures', async ({ page }) => {
    // Navigate to GM Screen
    await page.locator('[data-testid^="campaign-"]').first().click();
    await page.waitForLoadState('networkidle');
    
    try {
      const gotIt = page.getByRole('button', { name: /got it, thanks/i });
      if (await gotIt.isVisible()) await gotIt.click();
    } catch(e) {}
    
    await page.getByTestId('open-dm-screen-btn').click();
    await expect(page.locator('text=GM TOOLS').first()).toBeVisible();
    
    // Click Monsters tab
    await page.locator('button:has-text("Monsters")').first().click();
    
    // Verify combined view
    await expect(page.getByRole('heading', { name: /monsters & custom creatures/i })).toBeVisible();
    
    // Verify SRD Monster Lookup section
    await expect(page.locator('text=SRD Monster Lookup').first()).toBeVisible();
    
    // Verify Custom Creatures section
    await expect(page.locator('text=Custom Creatures').first()).toBeVisible();
    
    await page.screenshot({ path: 'monsters-tab-combined-layout.jpeg', quality: 20 });
  });

  test('Name generator functionality works in NPCs tab', async ({ page }) => {
    // Navigate to GM Screen
    await page.locator('[data-testid^="campaign-"]').first().click();
    await page.waitForLoadState('networkidle');
    
    try {
      const gotIt = page.getByRole('button', { name: /got it, thanks/i });
      if (await gotIt.isVisible()) await gotIt.click();
    } catch(e) {}
    
    await page.getByTestId('open-dm-screen-btn').click();
    await expect(page.locator('text=GM TOOLS').first()).toBeVisible();
    
    // Click NPCs tab
    await page.locator('button:has-text("NPCs")').first().click();
    await expect(page.getByRole('heading', { name: /npcs & name generator/i })).toBeVisible();
    
    // Click Generate Name button
    await page.getByTestId('generate-name-btn').click();
    
    // Verify generated name appears
    await expect(page.locator('text=Generated Name').first()).toBeVisible();
    
    // Verify Save as NPC button appears
    await expect(page.getByTestId('save-as-npc-btn')).toBeVisible();
    
    await page.screenshot({ path: 'name-generator-result.jpeg', quality: 20 });
    
    // Save as NPC
    await page.getByTestId('save-as-npc-btn').click();
    
    // Verify success toast
    await expect(page.locator('text=saved as NPC').first()).toBeVisible();
    
    // Verify "Saved This Session" section appears
    await expect(page.locator('text=Saved This Session').first()).toBeVisible();
    
    await page.screenshot({ path: 'name-saved-as-npc.jpeg', quality: 20 });
  });
});
