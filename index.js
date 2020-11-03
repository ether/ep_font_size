var eejs = require('ep_etherpad-lite/node/eejs/');
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_font_size/templates/editbarButtons.ejs");
  return cb();
}

exports.eejsBlock_dd_format = function(hook_name, args, cb){
  args.content = args.content + eejs.require("ep_font_size/templates/fileMenu.ejs");
  return cb();
}

exports.eejsBlock_timesliderStyles = function(hook_name, args, cb){
  args.content = args.content + '<style>'+eejs.require("ep_font_size/static/css/size.css")+'</style>';
  return cb();
}
