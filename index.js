'use strict';

const settingsModule = require('ep_etherpad-lite/node/utils/Settings');
const settings = settingsModule.default || settingsModule;
const {template, rawHTML} = require('ep_plugin_helpers');
const eejs = require('ep_etherpad-lite/node/eejs/');
const shared = require('./static/js/shared');

exports.eejsBlock_editbarMenuLeft = template('ep_font_size/templates/editbarButtons.ejs', {
  skip: () => JSON.stringify(settings.toolbar).indexOf('fontSize') > -1,
});

exports.eejsBlock_dd_format = template('ep_font_size/templates/fileMenu.ejs');

exports.eejsBlock_timesliderStyles = rawHTML(
  `<style>${eejs.require('ep_font_size/static/css/size.css')}</style>`
);

exports.padInitToolbar = (hookName, args, cb) => {
  const toolbar = args.toolbar;
  const fontSize = toolbar.selectButton({
    command: 'fontSize',
    class: 'size-selection',
    selectId: 'font-size',
  });
  fontSize.addOption('dummy', 'Font Size', {'data-l10n-id': 'ep_font_size.size'});
  shared.sizes.forEach((size, value) => {
    fontSize.addOption(value, size.toString());
  });

  toolbar.registerButton('fontSize', fontSize);
  return cb();
};
