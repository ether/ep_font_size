var _ = require('ep_etherpad-lite/static/js/underscore');

var sizes = ['black', 'red', 'green', 'blue', 'yellow', 'orange'];

var collectContentPre = function(hook, context){
  var sizes = /(?:^| )sizes:([A-Za-z0-9]*)/.exec(context.cls);
  if(sizes && sizes[1]){
    context.cc.doAttrib(context.state, sizes[0]);
  }
};

var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(sizes, tname);

  if(tagIndex >= 0){
    delete lineAttributes['size'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
