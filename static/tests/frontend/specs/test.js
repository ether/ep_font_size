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
  // Set it to size 9
  // Select all text
  // Set it to size 8

  it("Changes from size 8 to 9 and back to 8", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    var inner$ = helper.padInner$;

    var $firstTextElement = inner$("div").first();
    var $editorContainer = chrome$("#editorcontainer");

    var $editorContents = inner$("div")
    $firstTextElement.sendkeys('foo');
    $firstTextElement.sendkeys('{selectall}');

    // sets first line to Font size 9
    chrome$('.size-selection').val("1");
    chrome$('.size-selection').change();

    var fElement = inner$("div").first();
    helper.waitFor(function(){
      let elementHasClass = fElement.children().first().hasClass("size:9");
      return expect(elementHasClass).to.be(true);
    }).done(function(){
      $firstTextElement = inner$("div").first();
      $firstTextElement.sendkeys('{selectall}');
      // sets first line to Font size 8
      chrome$('.size-selection').val('0');
      chrome$('.size-selection').change();
      helper.waitFor(function(){
        fElement = inner$("div").first();
        let elementHasClass = fElement.children().first().hasClass("size:8");
        return expect(elementHasClass).to.be(true);
      }).done(function(){
        done();
      });
    });
  });
});

