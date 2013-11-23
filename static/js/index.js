var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var sizesClass = 'sizes';
var cssFiles = ['ep_sizes/static/css/editor.css'];
var sizes = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

// Bind the event handler to the toolbar buttons
var postAceInit = function(hook, context){
  var hs = $('.size-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      applyFontSize(context, intValue);
      hs.val("dummy");
    }
  })
  $('.ep_font_size').click(function(){
    var size = $(this).data("size");
    console.log(size);
    applyFontSize(context, size);
  });
  $('.font_size').hover(function(){
    $('.submenu > .size-selection').attr('size', 6);
  });

};


function applyFontSize(context, size){
console.log(size);
  context.ace.callWithAce(function(ace){
    ace.ace_doInsertSizes(size);
  },'font_size' , true);
}


// Our sizes attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context){
  if(context.key == 'sizes'){
    return ['sizes:' + context.value ];
  }
}


// Here we convert the class sizes:h1 into a tag
exports.aceCreateDomLine = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var sizesType = /(?:^| )sizes:([A-Za-z0-9]*)/.exec(cls);

  var tagIndex;
  if (sizesType) tagIndex = _.indexOf(sizes, sizesType[1]);
      
  if (tagIndex !== undefined && tagIndex >= 0){
    // var tag = sizes[tagIndex];
    var lineHeight = tag*1.25;
    var tag = sizes[tagIndex];
    var modifier = {
      extraOpenTags: '<span style="font-size: ' + tag + 'px;line-height:'+lineHeight+'px;">',
      extraCloseTags: '</span>',
      cls: cls
    };
    return [modifier];
  }
  return [];
};



// Find out which lines are selected and assign them the sizes attribute.
// Passing a level >= 0 will set a sizes on the selected lines, level < 0 
// will remove it
function doInsertSizes(level){
  var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && sizes[level] === undefined))
  {
    return;
  }
  
    if(level >= 0){
          documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
                ['sizes', sizes[level]]
          ]);
    }else{
        documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
                    ['sizes', '']
              ]);
    }
}


// Once ace is initialized, we set ace_doInsertSizes and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertSizes = _(doInsertSizes).bind(context);
}


// Export all hooks
//exports.aceRegisterBlockElements = aceRegisterBlockElements;
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
//exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceAttribsToClasses = aceAttribsToClasses;
//exports.aceEditorCSS = aceEditorCSS;
