var $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var fs = (["fs8", "fs9", "fs10", "fs11", "fs12", "fs13", "fs14", "fs15", "fs16", "fs17", "fs18", "fs19", "fs20"]);

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
      // remove all other attrs
      $.each(fs, function(k, v){
        ace.ace_setAttributeOnSelection(v, false);
      });
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
  if(fs.indexOf(context.key) !== -1){
    return [context.key];
  }
}

// Block elements
// I'm not sure if this is actually required..
exports.aceRegisterBlockElements = function(){
  return fs;
}

// Register attributes that are html markup / blocks not just classes
// This should make export export properly IE <sub>helllo</sub>world
// will be the output and not <span class=sub>helllo</span>
exports.aceAttribClasses = function(hook, attr){
  $.each(fs, function(k, v){
    attr[v] = 'tag:'+v;
  });
  return attr;
}

exports.aceEditorCSS = function(hook_name, cb){
  return ["/ep_font_size/static/css/iframe.css"];
}
