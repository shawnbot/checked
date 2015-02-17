var jsdom = require('jsdom'),
    express = require('express'),
    assert = require('assert'),
    async = require('async'),
    port = process.env.PORT || 8080,
    host = process.env.HOST || '127.0.0.1',
    server;

describe('main', function() {
  this.timeout(5000);

  var _window,
      _document,
      checked;
  before(function(done) {
    jsdom.env(
      [
        '<input type="checkbox" name="foo" value="1">',
        '<input type="checkbox" name="bar" value="2" checked>',
      ].join(''),
      [__dirname + '/../checked.js'],
      function(errors, window) {
        if (errors) throw errors[0];
        _window = window;
        _window.localStorage = require('localStorage');
        _document = window.document;
        done();
      });
  });

  beforeEach(function() {
    checked = _window.checked({
      namespace: ''
    });
  });

  it('has data', function() {
    var data = checked.data();
    assert.deepEqual(data, {
      bar: '2'
    }, 'bad data: ' + JSON.stringify(data));
  });

  it('stores values', function() {
    var box = _document.querySelector('[name=foo]'),
        wasChecked = box.checked;
    box.click();
    assert.ok(wasChecked === !box.checked);

    var data = checked.data();
    assert.deepEqual(data, {
      foo: '1',
      bar: '2'
    }, 'bad data: ' + JSON.stringify(data));

    var key = _window.localStorage.key(0);
    assert.equal(key, 'foo', 'bad key: ' + key);
  });

  after(function() {
    _window.close();
  });
});

function init(done) {
  async.waterfall([
    createServer,
    createDOM
  ], done);
}

function createServer(done) {
  if (server) return done(server);
  server = express()
    .use(express.static(__dirname))
    .listen(port, host, done);
}

function createWindow(done) {
  if (window) return done(null, window);
  var addr = server.address(),
      url = 'http://' + addr.address + ':' + addr.port;
  return jsdom.env(url, function(errors, win) {
    if (errors) return done(errors);
    document = win.document;
    win.localStorage = localStorage;
    done(null, window = win);
  });
}

function reload(done) {
  return driver.get(url).then(done);
}
    
