var _ = require('ep_etherpad-lite/static/js/underscore');

var sizes = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '22', '24', '26', '28', '30', '35', '40', '45', '50', '60'];

var collectContentPre = function (hook, context) {
  const size = /(?:^| )font-size:([A-Za-z0-9]*)/.exec(context.cls);
  if (size && size[1]) {
    context.cc.doAttrib(context.state, `font-size:${size[1]}`);
  }
};

var collectContentPost = function (hook, context) {
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
