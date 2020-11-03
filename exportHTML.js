const _ = require('ep_etherpad-lite/static/js/underscore');
const eejs = require('ep_etherpad-lite/node/eejs/');

const sizes = ["fs8", "fs9", "fs10", "fs11", "fs12", "fs13", "fs14", "fs15", "fs16", "fs17", "fs18", "fs19", "fs20", "fs22", "fs24", "fs26", "fs28", "fs30", "fs35", "fs40", "fs45", "fs50", "fs60"];

// Add the props to be supported in export
exports.exportHtmlAdditionalTagsWithData = async (hookName, pad) => {
  return findAllsizeUsedOn(pad).map((name) => ['size', name]);
};

// Iterate over pad attributes to find only the size ones
function findAllsizeUsedOn(pad) {
  const sizesUsed = [];
  pad.pool.eachAttrib((key, value) => { if (key === 'size') sizesUsed.push(value); });
  return sizesUsed;
}

// Include CSS for HTML export
exports.stylesForExport = async (hookName, padId) => {
  return eejs.require('ep_font_size/static/css/size.css');
};

exports.getLineHTMLForExport = async (hookName, context) => {
  // Replace data-size="foo" with class="size:x".
  context.lineContent =
      context.lineContent.replace(/data-font-size=["|']([0-9a-zA-Z]+)["|']/gi, 'class="size:$1"');
};
