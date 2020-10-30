var appUrl = 'http://localhost:9001';
var apiVersion = 1;

var supertest = require('ep_etherpad-lite/node_modules/supertest'),
           fs = require('fs'),
         path = require('path'),
          api = supertest(appUrl),
 randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;


describe('export size styles to HTML', function(){
  var padID;
  var html;

  //create a new pad before each test run
  beforeEach(function(done){
    padID = randomString(5);

    createPad(padID, function() {
      setHTML(padID, html(), done);
    });
  });

  context('when pad text has one size', function() {
    before(function() {
      html = function() {
        return buildHTML(textWithsize("red"));
      }
    });

    it('returns ok', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(codeToBe0)
      .expect('Content-Type', /json/)
      .expect(200, done);
    });

    it('returns HTML with size class', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        var expectedRegex = regexWithsize("red");
        var expectedsizes = new RegExp(expectedRegex);
        var html = res.body.data.html;
        var foundsize = html.match(expectedsizes);
        if(!foundsize) throw new Error("size not exported. Regex used: " + expectedRegex + ", html exported: " + html);
      })
      .end(done);
    });
  });

  context('when pad text has two sizes in a single line', function() {
    before(function() {
      html = function() {
        return buildHTML(textWithsize("red") + textWithsize("blue"));
      }
    });

    it('returns HTML with two size spans', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        var firstsize = regexWithsize("red");
        var secondsize = regexWithsize("blue");
        var expectedRegex = firstsize + ".*" + secondsize;
        var expectedsizes = new RegExp(expectedRegex);

        var html = res.body.data.html;
        var foundsize = html.match(expectedsizes);
        if(!foundsize) throw new Error("size not exported. Regex used: " + expectedRegex + ", html exported: " + html);
      })
      .end(done);
    });
  });

  context('when pad text has no sizes', function() {
    before(function() {
      html = function() {
        return buildHTML("empty pad");
      }
    });

    it('returns HTML with no size', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        var expectedRegex = ".*empty pad.*";
        var nosize = new RegExp(expectedRegex);

        var html = res.body.data.html;
        var foundsize = html.match(nosize);
        if(!foundsize) throw new Error("size exported, should not have any. Regex used: " + expectedRegex + ", html exported: " + html);
      })
      .end(done);
    });
  });

  context('when pad text has size inside strong', function() {
    before(function() {
      html = function() {
        return buildHTML("<strong>" + textWithsize("red", "this is red and bold") + "</strong>");
      }
    });

    // Etherpad exports tags using the order they are defined on the array (bold is always inside size)
    it('returns HTML with strong and size, in any order', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        var strongInsidesizeRegex = regexWithsize("red", "<strong>this is red and bold<\/strong>");
        var sizeInsideStrongRegex = "<strong>" + regexWithsize("red", "this is red and bold") + "<\/strong>";
        var expectedStrongInsidesize = new RegExp(strongInsidesizeRegex);
        var expectedsizeInsideStrong = new RegExp(sizeInsideStrongRegex);

        var html = res.body.data.html;
        var foundsize = html.match(expectedStrongInsidesize) || html.match(expectedsizeInsideStrong);
        if(!foundsize) throw new Error("size not exported. Regex used: [" + strongInsidesizeRegex + " || " + sizeInsideStrongRegex + "], html exported: " + html);
      })
      .end(done);
    });
  });

  context('when pad text has strong inside size', function() {
    before(function() {
      html = function() {
        return buildHTML(textWithsize("red", "<strong>this is red and bold</strong>"));
      }
    });

    // Etherpad exports tags using the order they are defined on the array (bold is always inside size)
    it('returns HTML with strong and size, in any order', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        var strongInsidesizeRegex = regexWithsize("red", "<strong>this is red and bold<\/strong>");
        var sizeInsideStrongRegex = "<strong>" + regexWithsize("red", "this is red and bold") + "<\/strong>";
        var expectedStrongInsidesize = new RegExp(strongInsidesizeRegex);
        var expectedsizeInsideStrong = new RegExp(sizeInsideStrongRegex);

        var html = res.body.data.html;
        var foundsize = html.match(expectedStrongInsidesize) || html.match(expectedsizeInsideStrong);
        if(!foundsize) throw new Error("size not exported. Regex used: [" + strongInsidesizeRegex + " || " + sizeInsideStrongRegex + "], html exported: " + html);
      })
      .end(done);
    });
  });

  context('when pad text has part with size and part without it', function() {
    before(function() {
      html = function() {
        return buildHTML("no size here " + textWithsize("red"));
      }
    });

    it('returns HTML with part with size and part without it', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        var expectedRegex = "no size here " + regexWithsize("red");
        var expectedsizes = new RegExp(expectedRegex);
        var html = res.body.data.html;
        var foundsize = html.match(expectedsizes);
        if(!foundsize) throw new Error("size not exported. Regex used: " + expectedRegex + ", html exported: " + html);
      })
      .end(done);
    });
  });
})

// Loads the APIKEY.txt content into a string, and returns it.
var getApiKey = function() {
  var etherpad_root = '/../../../../../../ep_etherpad-lite/../..';
  var filePath = path.join(__dirname, etherpad_root + '/APIKEY.txt');
  var apiKey = fs.readFileSync(filePath,  {encoding: 'utf-8'});
  return apiKey.replace(/\n$/, "");
}

var apiKey = getApiKey();

// Creates a pad and returns the pad id. Calls the callback when finished.
var createPad = function(padID, callback) {
  api.get('/api/'+apiVersion+'/createPad?apikey='+apiKey+"&padID="+padID)
  .end(function(err, res){
    if(err || (res.body.code !== 0)) callback(new Error("Unable to create new Pad"));

    callback(padID);
  })
}

var setHTML = function(padID, html, callback) {
  api.get('/api/'+apiVersion+'/setHTML?apikey='+apiKey+"&padID="+padID+"&html="+html)
  .end(function(err, res){
    if(err || (res.body.code !== 0)) callback(new Error("Unable to set pad HTML"));

    callback(null, padID);
  })
}

var getHTMLEndPointFor = function(padID, callback) {
  return '/api/'+apiVersion+'/getHTML?apikey='+apiKey+"&padID="+padID;
}

var codeToBe = function(expectedCode, res) {
  if(res.body.code !== expectedCode){
    throw new Error("Code should be " + expectedCode + ", was " + res.body.code);
  }
}

var codeToBe0 = function(res) { codeToBe(0, res) }

var buildHTML = function(body) {
  return "<html><body>" + body + "</body></html>"
}

var textWithsize = function(size, text) {
  if (!text) text = "this is " + size;

  return "<span class='size:" + size + "'>" + text + "</span>";
}

var regexWithsize = function(size, text) {
  if (!text) text = "this is " + size;

  var regex = "<span .*class=['|\"].*size:" + size + ".*['|\"].*>" + text + "<\/span>";
  // bug fix: if no other plugin on the Etherpad instance returns a value on getLineHTMLForExport() hook,
  // data-size=(...) won't be replaced by class=size:(...), so we need a fallback regex
  var fallbackRegex = "<span .*data-size=['|\"]" + size + "['|\"].*>" + text + "<\/span>";

  return regex + " || " + fallbackRegex;
}

