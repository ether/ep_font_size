'use strict';

const {inlineAttribute} = require('ep_plugin_helpers/attributes');
const shared = require('./shared');

const fontSize = inlineAttribute({attr: 'font-size'});

exports.aceAttribsToClasses = fontSize.aceAttribsToClasses;
exports.aceCreateDomLine = fontSize.aceCreateDomLine;

exports.postAceInit = (hookName, context) => {
  const hs = $('#font-size, select.size-selection');
  hs.on('change', function () {
    const value = $(this).val();
    const intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      context.ace.callWithAce((ace) => {
        ace.ace_doInsertsizes(intValue);
      }, 'insertsize', true);
      hs.val('dummy');
      context.ace.focus();
    }
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
