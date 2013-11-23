var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_font_size/templates/editbarButtons.ejs");
  return cb();
}

exports.eejsBlock_dd_format = function(hook_name, args, cb){
  args.content = args.content + eejs.require("ep_font_size/templates/fileMenu.ejs");
  return cb();
}

function getInlineStyle(size) {
  return "font_size: "+size+"px;";
}

// line, apool,attribLine,text
exports.getLineHTMLForExport = function (hook, context) {
  var header = _analyzeLine(context.attribLine, context.apool);
  if (header) {
    var inlineStyle = getInlineStyle(header);
    return "<span style=\"" + inlineStyle + "\">" + context.text.substring(1) + "</span>";
  }
}

function _analyzeLine(alineAttrs, apool) {
  var header = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
      header = Changeset.opAttributeValue(op, 'font_size', apool);
    }
  }
  return header;
}
