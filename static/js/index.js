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
    context.ace.callWithAce(function(ace){
      // remove all other attrs
      $.each(fs, function(k, v){
        ace.ace_setAttributeOnSelection(v, false);
      });
      ace.ace_setAttributeOnSelection(value, true);
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
  var cs = call.callstack;

  if(!(cs.type == "handleClick") && !(cs.type == "handleKeyEvent") && !(cs.docTextChanged)){
    return false;
  }

  // If it's an initial setup event then do nothing..
  if(cs.type == "setBaseText" || cs.type == "setup") return false;
  // It looks like we should check to see if this section has this attribute
  setTimeout(function(){ // avoid race condition..

    $('.size-selection').val("dummy"); // reset value to the dummy value

    // Attribtes are never available on the first X caret position so we need to ignore that
    if(call.rep.selStart[1] === 0){
      // Attributes are never on the first line
      return;
    }
    // The line has an attribute set, this means it wont get hte correct X caret position
    if(call.rep.selStart[1] === 1){
      if(call.rep.alltext[0] === "*"){
        // Attributes are never on the "first" character of lines with attributes
        return;
      }
    }
    // the caret is in a new position.. Let's do some funky shit
    $('.subscript > a').removeClass('activeButton');
    $.each(fs, function(k,v){
      if ( call.editorInfo.ace_getAttributeOnSelection(v) ) {
        // show the button as being depressed.. Not sad, but active..
        $('.size-selection').val(v);
      }
    });
  },250);
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
