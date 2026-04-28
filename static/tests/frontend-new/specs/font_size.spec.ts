import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, selectAllText, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_font_size', () => {
  // The #font-size <select> is wrapped by niceSelect, which intercepts
  // native change events. Mirror the legacy spec by setting .value on
  // the underlying <select> and dispatching change manually.
  const setFontSizeIndex = (page: any, index: string) => page.evaluate((i: string) => {
    const sel = document.querySelector<HTMLSelectElement>('#font-size')!;
    sel.value = i;
    sel.dispatchEvent(new Event('change', {bubbles: true}));
  }, index);

  test('Changes from size 8 to 9 and back to 8', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    await clearPadContent(page);
    await writeToPad(page, 'foo');
    await selectAllText(page);

    // Index 1 → font-size:9
    await setFontSizeIndex(page, '1');
    await expect(
      padBody.locator('div').first().locator('span').first()
    ).toHaveClass(/font-size:9/);

    await selectAllText(page);

    // Index 0 → font-size:8
    await setFontSizeIndex(page, '0');
    await expect(
      padBody.locator('div').first().locator('span').first()
    ).toHaveClass(/font-size:8/);
  });

  // Regression test for ep_font_size#4914: applying very large font to
  // ~120 lines should grow ace_inner past 2000px (the legacy bug pinned
  // the iframe to a smaller height regardless of content).
  test('iframe height grows under very large font (regression #4914)', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    await clearPadContent(page);

    // Build content quickly via the inner DOM rather than typing 120 lines.
    const numLines = 120;
    const innerFrame = page.frame('ace_inner')!;
    await innerFrame.evaluate((n: number) => {
      const body = document.getElementById('innerdocbody')!;
      body.innerHTML = '';
      for (let i = 0; i < n - 1; i++) body.appendChild(document.createElement('div'));
      const last = document.createElement('div');
      last.textContent = 'Very large text that ideally spans across multiple lines';
      body.appendChild(last);
    }, numLines);

    await page.waitForTimeout(800);
    await selectAllText(page);

    // Index 22 → font-size:60 (largest published option in the legacy spec).
    await setFontSizeIndex(page, '22');

    // The ace_inner iframe lives inside the ace_outer iframe, so a top-level
    // page.evaluate() can't see it (document.querySelector returns null and
    // getComputedStyle then throws "parameter 1 is not of type 'Element'").
    // Run the lookup in the ace_outer frame's document instead.
    const outerFrame = page.frame('ace_outer')!;
    const heightOf = () => outerFrame.evaluate(() => {
      const f = document.querySelector<HTMLIFrameElement>('iframe[name="ace_inner"]');
      if (!f) return 0;
      return parseInt(window.getComputedStyle(f).height || '0', 10);
    });
    await expect.poll(heightOf, {timeout: 10_000}).toBeGreaterThan(2000);
  });
});
