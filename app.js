var app           = require('bb_platform');
var hbsHelpers    = require('./lib/hbs-helpers');
var cheerioMixins = require('./lib/cheerio-mixins');
var modules       = require('./lib/modules');
var partials      = require('./lib/hbs-partials');

app.use(function (req, res, next) {

  // TGWM-287 - force optout on a url before any A/B logic is applied
  if (/\/bushnell-tour-v3-rangefinder-standard-pat-packs/i.test(req.url)) {
    var optOut = /aboff/i.test(req.url);
    if (!optOut) {
      var delimiter = req.url.indexOf('?') === -1 ? '?' : '&';
      return res.redirect(req.url + delimiter + 'aboff');
    }
  }

  // TGW-237 & TGW-238 Script & HTML Injection Fix
  if(/\<\s*script.*|\<\s*meta.*|xmlrpc\.php/.test(decodeURIComponent(req.url))) {
    return res.send(400, "<script>window.location = '/';</script>");
  }
  if(req.query && req.query.catalogId && /[<>\'\"]/.test(req.query.catalogId)) {
    return res.send(400, "<script>window.location = '/';</script>");
  }
  // Restrict pageView parameter to alphanumeric and general characters, though
  // we've only ever seen this value as 'grid'
  if(req.query && req.query.pageView && !/^[\w \.-]+$/.test(req.query.pageView)) {
    return res.send(400, "<script>window.location = '/';</script>");
  }

  return next();
});

app.sprites({
  callback: function() {

    app.init();

    // init helpers and mixins
    hbsHelpers(app);
    cheerioMixins(app);

    modules(app);
    partials(app);

    app.run();
  }
});
