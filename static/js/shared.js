exports.collectContentPre = function (hook, context) {
  const size = /(?:^| )font-size:([A-Za-z0-9]*)/.exec(context.cls);
  if (size && size[1]) {
    context.cc.doAttrib(context.state, `font-size:${size[1]}`);
  }
};
