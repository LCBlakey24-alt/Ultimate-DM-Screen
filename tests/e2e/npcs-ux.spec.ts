import { test, expect } from '@playwright/test';
import { loginTestUser, dismissToasts, TEST_CAMPAIGN_ID } from '../fixtures/helpers';

test.describe('NPCsTab UX', () => {
  test.beforeEach(async ({ page }) => {
    await dismissToasts(page);
    await loginTestUser(page);
    await page.goto(`/campaigns/${TEST_CAMPAIGN_ID}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'NPCs' }).click();
    await page.waitForLoadState('networkidle');
  });

  test('displays NPCs list and Add NPC button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /NPCs/i })).toBeVisible();
    await expect(page.getByTestId('add-npc-btn')).toBeVisible();
  });

  test('shows delete confirmation pattern', async ({ page }) => {
    const deleteBtn = page.locator('[data-testid^="delete-npc-btn-"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByText('Delete?')).toBeVisible({ timeout: 5000 });
    }
  });

  test('has Unseen Servant AI panel', async ({ page }) => {
    await expect(page.getByText('Unseen Servant')).toBeVisible();
    await expect(page.getByTestId('unseen-servant-npc-prompt')).toBeVisible();
    await expect(page.getByTestId('summon-npc-btn')).toBeVisible();
  });
});
