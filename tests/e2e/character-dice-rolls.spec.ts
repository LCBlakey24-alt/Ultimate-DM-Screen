import { test, expect } from '@playwright/test';
import { 
  hideEmergentBadge, 
  loginTestUser,
  TEST_CHARACTER_ID
} from '../fixtures/helpers';

/**
 * Character Sheet Dice Roll Tests
 * Tests for clickable dice roll buttons on character sheet
 * 
 * KNOWN ISSUE: CharacterSheetFull.js does not implement DiceRollButton components
 * The ability scores, saving throws, and skills display modifiers but are not clickable
 * for dice rolling. The DiceRollButton component exists in CharacterSheet.js but that
 * component is not used in the app routes.
 */

test.describe('Character Sheet Dice Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await hideEmergentBadge(page);
    await loginTestUser(page);
    
    // Navigate to character sheet
    await page.goto(`/characters/${TEST_CHARACTER_ID}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('character-sheet-full')).toBeVisible({ timeout: 10000 });
  });

  test('Character sheet displays ability score modifiers', async ({ page }) => {
    // Verify ability scores are visible with modifiers
    await expect(page.getByTestId('ability-strength')).toBeVisible();
    await expect(page.getByTestId('ability-dexterity')).toBeVisible();
    await expect(page.getByTestId('ability-constitution')).toBeVisible();
    await expect(page.getByTestId('ability-intelligence')).toBeVisible();
    await expect(page.getByTestId('ability-wisdom')).toBeVisible();
    await expect(page.getByTestId('ability-charisma')).toBeVisible();
    
    // Check that modifiers are displayed
    await expect(page.getByTestId('ability-strength')).toContainText('-1');
    await expect(page.getByTestId('ability-intelligence')).toContainText('+4');
  });

  test('Character sheet displays saving throws', async ({ page }) => {
    // Verify saving throws display modifiers
    const strengthAbility = page.getByTestId('ability-strength');
    await expect(strengthAbility).toContainText('SAVE');
    
    const intAbility = page.getByTestId('ability-intelligence');
    await expect(intAbility).toContainText('SAVE');
  });

  test('Character sheet displays all 18 skills', async ({ page }) => {
    // Verify skills section exists
    const skills = [
      'acrobatics', 'animal-handling', 'arcana', 'athletics',
      'deception', 'history', 'insight', 'intimidation',
      'investigation', 'medicine', 'nature', 'perception',
      'performance', 'persuasion', 'religion', 'sleight-of-hand',
      'stealth', 'survival'
    ];
    
    for (const skill of skills) {
      await expect(page.getByTestId(`skill-${skill}`)).toBeVisible();
    }
  });

  test('Initiative display shows modifier', async ({ page }) => {
    // Verify initiative is displayed in quick stats bar
    await expect(page.getByTestId('initiative-display')).toBeVisible();
    await expect(page.getByTestId('initiative-display')).toContainText('+');
  });

  test.skip('KNOWN BUG: Ability scores should have clickable dice roll buttons', async ({ page }) => {
    // This test documents that dice roll buttons don't exist in CharacterSheetFull
    // The DiceRollButton component is defined but not used in CharacterSheetFull.js
    
    // Look for dice roll test ids - these don't exist because CharacterSheetFull
    // doesn't use DiceRollButton
    const diceButton = page.getByTestId('dice-roll-strength-check');
    await expect(diceButton).toBeVisible();
    
    // If the button existed, clicking it should show a toast with roll result
    await diceButton.click();
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 3000 });
  });

  test.skip('KNOWN BUG: Saving throws should have clickable dice roll buttons', async ({ page }) => {
    // Dice roll buttons for saving throws don't exist in CharacterSheetFull
    const saveDiceButton = page.getByTestId('dice-roll-strength-save');
    await expect(saveDiceButton).toBeVisible();
  });

  test.skip('KNOWN BUG: Skills should have clickable dice roll buttons', async ({ page }) => {
    // Dice roll buttons for skills don't exist in CharacterSheetFull
    const skillDiceButton = page.getByTestId('dice-roll-perception');
    await expect(skillDiceButton).toBeVisible();
  });

  test.skip('KNOWN BUG: Initiative should have clickable dice roll button', async ({ page }) => {
    // Dice roll button for initiative doesn't exist in CharacterSheetFull
    const initDiceButton = page.getByTestId('dice-roll-initiative');
    await expect(initDiceButton).toBeVisible();
  });
});

/**
 * RECOMMENDED FIX:
 * Update CharacterSheetFull.js to import and use DiceRollButton from DiceRollButton.js
 * 
 * In AbilityScoreBlock component:
 * - Import: import { DiceRollButton } from '@/components/DiceRollButton';
 * - Add: <DiceRollButton modifier={modifier} label={`${ability.fullName} Check`} />
 * 
 * In SkillRow component:
 * - Add: <DiceRollButton modifier={totalMod} label={skill.name} />
 * 
 * For Initiative:
 * - Add: <DiceRollButton modifier={initMod} label="Initiative" />
 */
