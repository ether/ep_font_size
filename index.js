'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const shared = require('./static/js/shared');

exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  if (JSON.stringify(settings.toolbar).indexOf('fontSize') > -1) {
    return cb();
  }
  args.content += eejs.require('ep_font_size/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content += eejs.require('ep_font_size/templates/fileMenu.ejs');
  return cb();
};

exports.eejsBlock_timesliderStyles = function (hook_name, args, cb) {
  args.content = `${args.content}<style>${eejs.require('ep_font_size/static/css/size.css')}</style>`;
  return cb();
};

exports.padInitToolbar = function (hook_name, args, cb) {
  const toolbar = args.toolbar;
  const fontSize = toolbar.selectButton({
    command: 'fontSize',
    class: 'size-selection',
    selectId: 'font-size',
  });
  fontSize.addOption('dummy', 'Font Size', {'data-l10n-id': 'ep_font_size.size'});
  shared.sizes.forEach((size, value) => {
    fontSize.addOption(value, size);
  });

  toolbar.registerButton('fontSize', fontSize);
  return cb();
};
