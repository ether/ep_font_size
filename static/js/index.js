'use strict';

const {inlineAttribute} = require('ep_plugin_helpers/attributes');
const {toolbarSelect} = require('ep_plugin_helpers/toolbar-select');
const shared = require('./shared');

const fontSize = inlineAttribute({attr: 'font-size'});

exports.aceAttribsToClasses = fontSize.aceAttribsToClasses;
exports.aceCreateDomLine = fontSize.aceCreateDomLine;

exports.postAceInit = (hookName, context) => {
  toolbarSelect({
    selector: '#font-size, select.size-selection',
    context,
    invoke: (ace, value) => ace.ace_doInsertsizes(value),
    op: 'insertsize',
  });
  $('.font_size').hover(() => {
    $('.submenu > .size-selection').attr('size', 6);
    $('.submenu > #font-size').attr('size', 6);
  });
  $('.font-size-icon').on('click', () => {
    $('#font-size').toggle();
  });
};

exports.aceInitialized = (hookName, context) => {
  context.editorInfo.ace_doInsertsizes = (level) => {
    const {rep, documentAttributeManager} = context;
    if (!(rep.selStart && rep.selEnd)) return;
    if (level >= 0 && shared.sizes[level] === undefined) return;
    const newSize = ['font-size', level >= 0 ? shared.sizes[level] : ''];
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [newSize]);
  };
};

exports.aceEditorCSS = () => ['ep_font_size/static/css/size.css'];

exports.postToolbarInit = (hookName, context) => {
  context.toolbar.registerCommand('fontSize', () => {
    $('#font-size').toggle();
  });
};
