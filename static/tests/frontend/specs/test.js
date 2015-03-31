describe("Set Font size and ensure its removed properly", function(){

  // Tests still to do
  // Ensure additional chars keep the same formatting
  // Ensure heading value is properly set when caret is placed on font size changed content

  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
  // Select all text
  // Set it to size 18
  // Select all text
  // Set it to size 12

  it("Changes from Size 12 to 18 and back to 12", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    var inner$ = helper.padInner$;

    var $firstTextElement = inner$("div").first();
    var $editorContainer = chrome$("#editorcontainer");

    var $editorContents = inner$("div")
    $firstTextElement.sendkeys('foo');
    $firstTextElement.sendkeys('{selectall}');
    
    // Show the select
    chrome$('.font-size-icon').click();

    // sets first line to Font size 18
    chrome$('.size-selection').val('fs18');
    chrome$('.size-selection').change();

    var fElement = inner$("div").first();

    helper.waitFor(function(){
      var elementName = fElement.children().first().children().last()[0].localName;
      expect(elementName).to.be("fs18");
      return elementName == "fs18";
    }).done(function(){
      $firstTextElement = inner$("div").first();
      $firstTextElement.sendkeys('{selectall}');
      // sets first line to Font size 12
      chrome$('.size-selection').val('fs12');
      chrome$('.size-selection').change();
      helper.waitFor(function(){
        var fElement = inner$("div").first();
        var elementName = fElement.children().first().children().last()[0].localName;
        expect(elementName).to.be("fs12");
        return elementName == "fs12";
      }).done(function(){
        done();
      });
    });

  });
});
