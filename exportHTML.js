const _ = require('ep_etherpad-lite/static/js/underscore');
const eejs = require('ep_etherpad-lite/node/eejs/');

const sizes = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "22", "24", "26", "28", "30", "35", "40", "45", "50", "60"];

// Add the props to be supported in export
exports.exportHtmlAdditionalTagsWithData = async (hookName, pad) => {
  return findAllsizeUsedOn(pad).map((name) => ['font-size', name]);
};

// Iterate over pad attributes to find only the size ones
function findAllsizeUsedOn(pad) {
  const sizesUsed = [];
  pad.pool.eachAttrib((key, value) => { if (key === 'font-size') sizesUsed.push(value); });
  return sizesUsed;
}

// Include CSS for HTML export
exports.stylesForExport = async (hookName, padId) => {
  return eejs.require('ep_font_size/static/css/size.css');
};

exports.getLineHTMLForExport = async (hookName, context) => {
  // Replace data-size="foo" with class="size:x".
console.log(context.lineContent);
  context.lineContent =
      context.lineContent.replace(/data-font-size=["|']([0-9a-zA-Z]+)["|']/gi, 'class="font-size:$1"');
};
