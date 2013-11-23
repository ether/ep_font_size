var _ = require('ep_etherpad-lite/static/js/underscore');

var sizes = ['black', 'red', 'green', 'blue', 'yellow', 'orange'];

var collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(sizes, tname);

  if(tagIndex >= 0){
    lineAttributes['size'] = sizes[tagIndex];
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
