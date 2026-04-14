'use strict';

const {inlineAttributeExport} = require('ep_plugin_helpers/attributes-server');

const sizeExport = inlineAttributeExport({
  attr: 'font-size',
  exportCssFile: 'ep_font_size/static/css/size.css',
  exportDataAttr: 'data-font-size',
});

exports.exportHtmlAdditionalTagsWithData = sizeExport.exportHtmlAdditionalTagsWithData;
exports.stylesForExport = sizeExport.stylesForExport;
exports.getLineHTMLForExport = sizeExport.getLineHTMLForExport;
