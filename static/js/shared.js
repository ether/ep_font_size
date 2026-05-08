'use strict';

const {inlineAttribute} = require('ep_plugin_helpers/attributes');

const range = (b, e, s = 1) => [...Array(Math.ceil((e - b) / s)).keys()].map((x) => (x * s) + b);

const sizes = []
    .concat(range(8, 20))
    .concat(range(20, 30, 2))
    .concat(range(30, 50, 5))
    .concat(range(50, 70, 10));
const sizeSet = new Set(sizes.map(String));

const fontSize = inlineAttribute({attr: 'font-size'});

// Read a `style="font-size:..."` declaration on imported HTML and apply
// the matching `font-size::<value>` attribute. The `inlineAttribute`
// factory only reads `class="font-size:14"` (the form ep_font_size
// emits on export), so any externally-pasted HTML using the standard
// CSS form would silently lose its size.
const STYLE_FONT_SIZE_RE = /(?:^|;|\s)font-size\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*(px|pt|em|rem)?\s*(?:;|$)/i;

// Map a CSS font-size to the nearest supported toolbar size. Sizes are
// integer pt/px values; Word commonly emits half-points (e.g. 11pt is
// 22 half-points) so we floor to the nearest integer first.
const matchSupportedSize = (value, unit) => {
  let n = Math.round(parseFloat(value));
  if (!isFinite(n) || n <= 0) return null;
  const u = (unit || 'px').toLowerCase();
  // Convert pt → px (1pt ≈ 1.333px) but only roughly; toolbar values
  // were authored as bare numbers, mostly treated as pt-equivalent in
  // ep_font_size. Use the value as-is for pt and px.
  if (u === 'em' || u === 'rem') n = Math.round(n * 16); // 1em ≈ 16
  if (sizeSet.has(String(n))) return String(n);
  // Find the closest available size.
  let best = null; let bestDist = Infinity;
  for (const s of sizes) {
    const d = Math.abs(s - n);
    if (d < bestDist) { best = s; bestDist = d; }
  }
  return best != null ? String(best) : null;
};

const collectContentPreOrig = fontSize.collectContentPre;
exports.collectContentPre = (hookName, context) => {
  collectContentPreOrig(hookName, context);
  if (context.styl) {
    const m = STYLE_FONT_SIZE_RE.exec(context.styl);
    if (m) {
      const size = matchSupportedSize(m[1], m[2]);
      if (size) context.cc.doAttrib(context.state, `font-size::${size}`);
    }
  }
};
exports.sizes = sizes;
