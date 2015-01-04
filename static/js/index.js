var $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;

/*****
* Basic setup
******/

// Bind the event handler to the toolbar buttons
exports.postAceInit = function(hook, context){
  var fontSize = $('.size-selection');
  fontSize.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10) + 8;
    context.ace.callWithAce(function(ace){
      ace.ace_setAttributeOnSelection("fs"+intValue, true);
    },'insertfontsize' , true);
  })
  $('.ep_font_size').click(function(){
    var size = $(this).data("size");
  });
  $('.font_size').hover(function(){
    $('.submenu > .size-selection').attr('size', 6);
  });
  $('.font-size-icon').click(function(){
    $('#font-size').toggle();
  });
};

// To do show what font size is active on current selection
exports.aceEditEvent = function(hook, call, cb){
  // TODO
}

/*****
* Editor setup
******/

// Our fontsize attribute will result in a class
// I'm not sure if this is actually required..
exports.aceAttribsToClasses = function(hook, context){
  var fs = (["fs8", "fs9", "fs10", "fs11", "fs12", "fs13", "fs14", "fs15", "fs16", "fs17", "fs18", "fs19", "fs20"]);
  if(fs.indexOf(context.key) !== -1){
    return [context.key];
  }
}

// Block elements
// I'm not sure if this is actually required..
exports.aceRegisterBlockElements = function(){
  var fs = (["fs8", "fs9", "fs10", "fs11", "fs12", "fs13", "fs14", "fs15", "fs16", "fs17", "fs18", "fs19", "fs20"]);
  return fs;
}

// Register attributes that are html markup / blocks not just classes
// This should make export export properly IE <sub>helllo</sub>world
// will be the output and not <span class=sub>helllo</span>
exports.aceAttribClasses = function(hook, attr){
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
  return attr;
}

exports.aceEditorCSS = function(hook_name, cb){
  return ["/ep_font_size/static/css/iframe.css"];
}
