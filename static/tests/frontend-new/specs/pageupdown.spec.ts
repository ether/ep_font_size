import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

// Mirror the helper used in font_size.spec: set the underlying <select>
// value and fire a bubbling change event so niceSelect passes it through.
const setFontSizeIndex = (page: any, index: string) =>
  page.evaluate((i: string) => {
    const sel = document.querySelector<HTMLSelectElement>('#font-size')!;
    sel.value = i;
    sel.dispatchEvent(new Event('change', {bubbles: true}));
  }, index);

// Return the 0-based index of the div that currently contains the caret.
const getCaretLineIndex = (page: any): Promise<number> =>
  page.frame('ace_inner')!.evaluate(() => {
    const sel = document.getSelection();
    if (!sel || !sel.focusNode) return -1;
    let node = sel.focusNode as HTMLElement;
    while (node && node.tagName !== 'DIV') node = node.parentElement!;
    if (!node) return -1;
    return Array.from(document.getElementById('innerdocbody')!.children).indexOf(node);
  });

test.describe('ep_font_size – Page Up / Page Down with mixed font sizes', () => {
  // Allow up to 2 retries to account for timing variance in headless browsers.
  test.describe.configure({retries: 2});

  /**
   * Build a pad with 60 lines and then inject random-looking font-size spans
   * into every third div, directly inside ace_inner.  This reproduces the
   * markup that ep_font_size's aceCreateDomLine / aceAttribsToClasses hooks
   * emit at runtime (e.g. `<span class="font-size:14" style="font-size:14px">`)
   * without having to select each line individually in the UI, which would
   * make the setup prohibitively slow.
   */
  const buildPadWithMixedFontSizes = async (page: any) => {
    await clearPadContent(page);
    for (let i = 0; i < 60; i++) {
      await writeToPad(page, `line ${i + 1}`);
      await page.keyboard.press('Enter');
    }

    const innerFrame = page.frame('ace_inner')!;
    await innerFrame.evaluate(() => {
      // A subset of the sizes exposed by the plugin (from shared.js).
      const sizes = [8, 10, 12, 14, 18, 24, 30, 40, 60];
      const body = document.getElementById('innerdocbody')!;
      Array.from(body.children).forEach((div, i) => {
        if (i % 3 !== 0) return; // leave two-thirds of lines at default size
        const size = sizes[i % sizes.length];
        (div as HTMLElement).style.fontSize = `${size}px`;
        // Wrap the text node in a span that carries the same class attribute
        // and inline style that ep_font_size produces.
        const span = document.createElement('span');
        span.className = `font-size:${size}`;
        span.style.fontSize = `${size}px`;
        while (div.firstChild) span.appendChild(div.firstChild);
        div.appendChild(span);
      });
    });
    await page.waitForTimeout(500);
  };

  // ── Tests adapted from the Etherpad-core pageupdown.js spec (PR #4622) ──

  test('PageDown with mixed font sizes moves caret forward', async ({page}) => {
    await buildPadWithMixedFontSizes(page);

    // Move caret to the very first line.
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await page.waitForTimeout(200);

    await page.keyboard.press('PageDown');
    await page.waitForTimeout(1000);

    const line = await getCaretLineIndex(page);
    expect(line).toBeGreaterThan(2);
  });

  test('PageUp with mixed font sizes moves caret backward', async ({page}) => {
    await buildPadWithMixedFontSizes(page);

    // Move caret to the very last line.
    await page.keyboard.down('Control');
    await page.keyboard.press('End');
    await page.keyboard.up('Control');
    await page.waitForTimeout(200);

    await page.keyboard.press('PageUp');
    await page.waitForTimeout(500);

    const line = await getCaretLineIndex(page);
    expect(line).toBeLessThan(55);
  });

  test('PageDown then PageUp with mixed font sizes returns near start', async ({page}) => {
    await buildPadWithMixedFontSizes(page);

    // Start at the top.
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await page.waitForTimeout(200);

    await page.keyboard.press('PageDown');
    await page.waitForTimeout(1000);
    await page.keyboard.press('PageUp');
    await page.waitForTimeout(1000);

    const line = await getCaretLineIndex(page);
    // Allow some drift due to viewport calculations with varied font sizes.
    expect(line).toBeLessThan(8);
  });

  // ── Plugin-UI font size + PageDown scrolls the viewport ──

  test('plugin font size applied via UI then PageDown scrolls viewport down', async ({page}) => {
    const padBody = await getPadBody(page);
    await clearPadContent(page);
    for (let i = 0; i < 60; i++) {
      await writeToPad(page, `line ${i + 1}`);
      await page.keyboard.press('Enter');
    }

    // Select all text and apply a large font size through the plugin UI so
    // PageDown must move the viewport, not only the caret.
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await setFontSizeIndex(page, '22'); // index 22 → size 60
    await page.waitForTimeout(500);

    // Confirm the class was applied to the first span.
    await expect(padBody.locator('div').first().locator('span').first())
        .toHaveClass(/font-size:60/);

    // Move caret to the very first line.
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await page.waitForTimeout(200);

    const outerFrame = page.frame('ace_outer')!;
    const scrollBefore = await outerFrame.evaluate(
        () => document.querySelector<HTMLElement>('#outerdocbody')!
            .parentElement!.scrollTop,
    );

    await page.keyboard.press('PageDown');
    await page.waitForTimeout(1000);

    const scrollAfter = await outerFrame.evaluate(
        () => document.querySelector<HTMLElement>('#outerdocbody')!
            .parentElement!.scrollTop,
    );
    expect(scrollAfter).toBeGreaterThan(scrollBefore);
  });
});
