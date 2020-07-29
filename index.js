var eejs = require('ep_etherpad-lite/node/eejs/');
var sizes = ["fs8", "fs9", "fs10", "fs11", "fs12", "fs13", "fs14", "fs15", "fs16", "fs17", "fs18", "fs19", "fs20", "fs22", "fs24", "fs26", "fs28", "fs30", "fs35", "fs40", "fs45", "fs50", "fs60"];

/********************
* UI
*/
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_font_size/templates/editbarButtons.ejs");
  return cb();
}

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_font_size/templates/fileMenu.ejs");
  return cb();
}


/********************
* Editor
*/

// Allow <whatever> to be an attribute
exports.aceAttribClasses = function(hook_name, attr, cb){
  attr.fs8  = 'tag:fs8';
  attr.fs9  = 'tag:fs9';
  attr.fs10 = 'tag:fs10';
  attr.fs11 = 'tag:fs11';
  attr.fs12 = 'tag:fs12';
  attr.fs13 = 'tag:fs13';
  attr.fs14 = 'tag:fs14';
  attr.fs15 = 'tag:fs15';
  attr.fs16 = 'tag:fs16';
  attr.fs17 = 'tag:fs17';
  attr.fs18 = 'tag:fs18';
  attr.fs19 = 'tag:fs19';
  attr.fs20 = 'tag:fs20';
  attr.fs22 = 'tag:fs22';
  attr.fs24 = 'tag:fs24';
  attr.fs26 = 'tag:fs26';
  attr.fs28 = 'tag:fs28';
  attr.fs30 = 'tag:fs30';
  attr.fs35 = 'tag:fs35';
  attr.fs40 = 'tag:fs40';
  attr.fs45 = 'tag:fs45';
  attr.fs50 = 'tag:fs50';
  attr.fs60 = 'tag:fs60';
  cb(attr);
}
/********************
* Export
*/

// Add the props to be supported in export
exports.exportHtmlAdditionalTags = function(hook, pad, cb){
  cb(sizes);
};

exports.getLineHTMLForExport  = function (hook, context, cb) {
  var lineContent = context.lineContent;
  sizes.forEach(function(size){
    size = size.replace("fs","");
    if(lineContent){
      lineContent = lineContent.replaceAll("<fs"+size, "<span style='font-size:"+size+"px'");
      lineContent = lineContent.replaceAll("</fs"+size, "</span");
    }
  });
  context.lineContent = lineContent;
}

String.prototype.replaceAll = function(str1, str2, ignore)
{
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}
