var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var cssFiles = ["ep_font_size/static/css/size.css"];

// All our sizes are block elements, so we just return them.
// var sizes = ['black', 'red', 'green', 'blue', 'yellow', 'orange'];
var sizes = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "22", "24", "26", "28", "30", "35", "40", "45", "50", "60"];

// Bind the event handler to the toolbar buttons
var postAceInit = function(hook, context){
  var hs = $('.size-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertsizes(intValue);
      },'insertsize' , true);
      hs.val("dummy");
    }
  })
  $('.font_size').hover(function(){
    $('.submenu > .size-selection').attr('size', 6);
  });
  $('.font-size-icon').click(function(){
    $('#font-size').toggle();
  });
};

// Our sizes attribute will result in a size:red... _yellow class
function aceAttribsToClasses(hook, context){
  if(context.key.indexOf("size:") !== -1){
    var size = /(?:^| )size:([A-Za-z0-9]*)/.exec(context.key);
    return ['size:' + size[1] ];
  }
  if(context.key == 'size'){
    return ['size:' + context.value ];
  }
}


// Here we convert the class size:red into a tag
exports.aceCreateDomLine = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var sizesType = /(?:^| )size:([A-Za-z0-9]*)/.exec(cls);

  var tagIndex;
  if (sizesType) tagIndex = _.indexOf(sizes, sizesType[1]);


  if (tagIndex !== undefined && tagIndex >= 0){
    var tag = sizes[tagIndex];
    var modifier = {
      extraOpenTags: '',
      extraCloseTags: '',
      cls: cls
    };
    return [modifier];
  }
  return [];
};


// Find out which lines are selected and assign them the size attribute.
// Passing a level >= 0 will set a sizes on the selected lines, level < 0
// will remove it
function doInsertsizes(level){
  var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && sizes[level] === undefined)){
    return;
  }

  var new_size = ["size", ""];
  if(level >= 0) {
    new_size = ["size", sizes[level]];
  }

  documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [new_size]);
}


// Once ace is initialized, we set ace_doInsertsizes and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertsizes = _(doInsertsizes).bind(context);
}

function aceEditorCSS(){
  return cssFiles;
};


// Export all hooks
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
exports.aceAttribsToClasses = aceAttribsToClasses;
exports.aceEditorCSS = aceEditorCSS;
