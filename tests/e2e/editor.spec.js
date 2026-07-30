import { expect, test } from '@playwright/test';

function monitorPage(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

test.describe('AT-020 Chrome/Edge core editor flow', () => {
  let runtimeErrors;
  let externalRequests;

  test.beforeEach(async ({ page }) => {
    runtimeErrors = monitorPage(page);
    externalRequests = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (!['http://127.0.0.1:4174', 'blob:', 'data:'].includes(url.origin)) {
        externalRequests.push(request.url());
      }
    });
    const response = await page.goto('/');
    expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    await expect(page.getByTestId('viewport')).toBeVisible();
    await expect(page.locator('#template-count')).toHaveText('20');
    await page.waitForFunction(() => Boolean(globalThis.__FORGE_STUDIO__));
  });

  test.afterEach(() => {
    expect(runtimeErrors).toEqual([]);
    expect(externalRequests).toEqual([]);
  });

  test('creates, synchronizes, groups, edits, and restores objects', async ({ page }) => {
    await page.getByTestId('primitive-box').click();
    await expect(page.locator('#footer-object-count')).toHaveText('1');
    await expect(page.locator('#dirty-state')).toContainText('저장 안 됨');
    await expect(page.getByTestId('object-name')).toHaveValue('Cube');

    await page.getByTestId('object-name').fill('<img src=x onerror=alert(1)>');
    await page.getByTestId('object-name').press('Enter');
    await expect(page.locator('.hierarchy-select')).toContainText('<img src=x onerror=alert(1)>');
    await expect(page.locator('.hierarchy-select img')).toHaveCount(0);

    await page.getByTestId('object-name').press('Control+d');
    await expect(page.locator('#footer-object-count')).toHaveText('1');

    await page.getByTestId('primitive-sphere').click();
    const hierarchyItems = page.locator('.hierarchy-select');
    await hierarchyItems.nth(0).click();
    await hierarchyItems.nth(1).click({ modifiers: ['Shift'] });
    await expect(page.locator('#selection-count')).toHaveText('2 selected');
    await expect(page.locator('#transform-fieldset')).toHaveAttribute('disabled', '');
    await expect(page.getByTestId('tool-move')).toBeDisabled();
    await expect(page.getByTestId('group')).toBeEnabled();

    await page.getByTestId('group').click();
    await expect(page.locator('#footer-object-count')).toHaveText('3');
    await expect(page.locator('#footer-selection')).toHaveText('Group');
    await expect(page.getByTestId('ungroup')).toBeEnabled();
    await page.getByTestId('ungroup').click();
    await expect(page.locator('#footer-object-count')).toHaveText('2');

    await page.getByTestId('undo').click();
    await expect(page.locator('#footer-object-count')).toHaveText('3');
    await page.getByTestId('redo').click();
    await expect(page.locator('#footer-object-count')).toHaveText('2');
  });

  test('saves Schema v2, exports GLB, and keeps the project on malformed input', async ({
    page,
  }) => {
    await page.getByTestId('primitive-box').click();
    const saveDownload = page.waitForEvent('download');
    await page.getByTestId('save-project').click();
    const saved = await saveDownload;
    expect(saved.suggestedFilename()).toMatch(/\.forge\.json$/u);
    await expect(page.locator('#dirty-state')).toHaveText('저장됨');

    const exportDownload = page.waitForEvent('download');
    await page.getByTestId('export-glb').click();
    const exported = await exportDownload;
    expect(exported.suggestedFilename()).toMatch(/\.glb$/u);
    await expect(page.locator('#status-message')).toHaveText('GLB 내보내기 완료');

    await page.locator('#project-file').setInputFiles({
      name: 'broken.forge.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{'),
    });
    await expect(page.locator('#error-code')).toHaveText('PROJECT_JSON_INVALID');
    await expect(page.locator('#footer-object-count')).toHaveText('1');
  });

  test('migrates and renders the v0.5 IcosahedronGeometry rock fixture', async ({
    page,
  }, testInfo) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('open-project').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/v05/v05-rock.json');
    await expect(page.locator('#status-message')).toHaveText('v0.5 프로젝트 migration 완료');
    await expect(page.locator('#footer-object-count')).toHaveText('1');
    await page.locator('.hierarchy-select').click();
    await expect(page.locator('#inspector-note')).toHaveText('icosahedron geometry');
    await expect(page.getByTestId('object-name')).toHaveValue('바위 원본');
    await expect(page.locator('#material-flat')).toBeChecked();
    await expect(page.locator('#position-x')).toHaveValue('1');
    await expect(page.locator('#position-y')).toHaveValue('2');
    await expect(page.locator('#position-z')).toHaveValue('3');
    if (testInfo.project.name === 'chrome') {
      await page.screenshot({
        path: 'outputs/evidence/v06-migrated-rock-flatshading-preservation.png',
        fullPage: true,
      });
      const visualChooserPromise = page.waitForEvent('filechooser');
      await page.getByTestId('open-project').click();
      const visualChooser = await visualChooserPromise;
      await visualChooser.setFiles('tests/fixtures/v05/v05-rock-visual.json');
      await expect(page.locator('#status-message')).toHaveText('v0.5 프로젝트 migration 완료');
      await page.locator('.hierarchy-select').click();
      await page.screenshot({
        path: 'outputs/evidence/v06-rock-visual-parity.png',
        fullPage: true,
      });
    }
  });

  test('exposes usable names for visible controls at 1366×768', async ({ page }) => {
    const unnamed = await page
      .locator('button:visible, input:visible, select:visible')
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            if (element.matches('input[type="hidden"]')) return false;
            const id = element.id;
            const label = id
              ? document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent
              : '';
            return !(
              element.getAttribute('aria-label') ||
              element.getAttribute('title') ||
              element.textContent?.trim() ||
              label?.trim()
            );
          })
          .map((element) => element.outerHTML),
      );
    expect(unnamed).toEqual([]);
    await expect(page.locator('.topbar')).toBeInViewport();
    await expect(page.locator('.statusbar')).toBeInViewport();

    await page.getByTestId('primitive-box').click();
    await page.getByTestId('new-project').click();
    await expect(page.locator('#discard-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#discard-dialog')).not.toBeVisible();
    await expect(page.getByTestId('new-project')).toBeFocused();
    await page.getByTestId('new-project').click();
    await page.getByRole('button', { name: '변경사항 버리기' }).click();
    await expect(page.locator('#footer-object-count')).toHaveText('0');
  });
});
