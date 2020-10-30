var _ = require('ep_etherpad-lite/static/js/underscore');

var sizes = ["fs8", "fs9", "fs10", "fs11", "fs12", "fs13", "fs14", "fs15", "fs16", "fs17", "fs18", "fs19", "fs20", "fs22", "fs24", "fs26", "fs28", "fs30", "fs35", "fs40", "fs45", "fs50", "fs60"];

var collectContentPre = function(hook, context){
  var size = /(?:^| )size:([A-Za-z0-9]*)/.exec(context.cls);
  if(size && size[1]){
    context.cc.doAttrib(context.state, "size::" + size[1]);
  }
};

var collectContentPost = function(hook, context){
/*
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(sizes, tname);

  if(tagIndex >= 0){
    delete lineAttributes['size'];
  }
*/
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
