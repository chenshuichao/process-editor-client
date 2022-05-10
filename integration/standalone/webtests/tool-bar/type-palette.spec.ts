import { test, expect, Locator, Page } from '@playwright/test';
import { embeddedSelector, endSelector, multiSelect, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';

test.describe('tool bar - BPMN type palette', () => {
  const PALETTE_BODY = '.activity-type-palette-body';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('search', async ({ page, browserName }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const typePaletteBtn = dynamicTools.locator('i[title$=Type]');
    const searchInput = page.locator(PALETTE_BODY + ' .search-input');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    const embedded = page.locator(embeddedSelector);
    await expect(paletteBody).toBeHidden();
    await expect(dynamicTools).toBeHidden();

    await start.click();
    await expect(dynamicTools).toBeVisible();
    await expect(typePaletteBtn).toBeHidden();

    await wrapToEmbedded([start, end], page, browserName);
    await embedded.click();
    await expect(dynamicTools).toBeVisible();
    await expect(typePaletteBtn).toBeVisible();

    await typePaletteBtn.click();
    await expect(paletteBody).toBeVisible();

    await expect(toolButtons).toHaveCount(9);
    await searchInput.fill('ser');
    await searchInput.dispatchEvent('keyup');
    await expect(toolButtons).toHaveCount(2);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(toolButtons).toHaveCount(1);
    await expect(toolButtons).toHaveText('No results found.');

    page.keyboard.press('Escape');
    await expect(searchInput).toBeEmpty();
  });

  test('switch type', async ({ page, browserName }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const typePaletteBtn = dynamicTools.locator('i[title$=Type]');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    const embedded = page.locator(embeddedSelector);
    const userIcon = page.locator('.sprotty-graph .userBpmnElement .fa-user');

    await wrapToEmbedded([start, end], page, browserName);
    await embedded.click();
    await expect(dynamicTools).toBeVisible();
    await expect(typePaletteBtn).toBeVisible();

    await typePaletteBtn.click();
    await expect(paletteBody).toBeVisible();
    await expect(userIcon).toBeHidden();
    await toolButtons.locator('text=User').click();
    await expect(userIcon).toBeVisible();
  });

  test('create BPMN Manual, jump, change type', async ({ page }) => {
    const dynamicTools = page.locator('.dynamic-tools');
    const typePaletteBtn = dynamicTools.locator('i[title$=Type]');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');
    const jumpOutBtn = page.locator('.dynamic-tools span[title^="Jump"]');
    const manual = page.locator('.sprotty-graph .manualBpmnElement');
    const embedded = page.locator(embeddedSelector);

    await page.locator('#btn_ele_picker_bpmn-activity-group').click();
    await page.locator('.element-palette-body .tool-button:has-text("Manual")').click();
    await page.locator('.sprotty-graph').click();

    await manual.click();
    await clickQuickActionStartsWith(page, 'Jump');
    await jumpOutBtn.click();

    await expect(embedded).toBeHidden();
    await manual.click();
    await typePaletteBtn.click();
    await toolButtons.locator('text=Sub').click();
    await expect(embedded).toBeVisible();
  });

  async function wrapToEmbedded(elements: Locator[], page: Page, browserName: string): Promise<void> {
    await multiSelect(page, elements, browserName);
    await clickQuickActionStartsWith(page, 'Wrap');
  }
});
