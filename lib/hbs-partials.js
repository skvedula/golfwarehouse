var fs   = require('fs');
var path = require('path');
var _    = require('bb_platform/node_modules/lodash');
var cwd  = process.cwd();

// store hbs partials, make them easily be accessible

module.exports = function(app) {
  var views = [
    cwd + '/views/partials',
    'node_modules/bb_platform/views/partials'
  ];

  _.each(views, function(dir) {
    fs.readdirSync(dir).forEach(function (file) {
      var fileName = path.join(dir, file);
      var stat = fs.statSync(fileName);

      if (stat.isDirectory() || !/\.hbs$/.test(fileName)) {
        return;
      }

      file = file.replace('.hbs', '');

      app.hbs.handlebars.partials[file] = app.hbs.handlebars.compile(fs.readFileSync(fileName, {encoding: 'utf8'}));
    });
  });

  app.hbsPartials = function(file, data) {
    data = data || {};
    if (typeof app.hbs.handlebars.partials[file] !== 'function') {
      console.error('ERROR: Cannot find partial ' + file);
      return '';
    }

    if (app.settings.env === 'development') {
      return lookupPartial(file)(data);
    } else {
      return app.hbs.handlebars.partials[file](data);
    }
  };

  // read the fresh file to make dev convenient, or we have restart server every time.

  function lookupPartial(target) {
    var result;

    _.each(views, function(dir) {
      fs.readdirSync(dir).forEach(function (file) {
        var fileName = path.join(dir, file);
        var stat = fs.statSync(fileName);

        if (stat.isDirectory() || !/\.hbs$/.test(fileName)) {
          return;
        }

        file = file.replace('.hbs', '');

        app.hbs.handlebars.partials[file] = app.hbs.handlebars.compile(fs.readFileSync(fileName, {encoding: 'utf8'}));

        if (file === target) {
          result = app.hbs.handlebars.partials[file];
        }
      });
    });

    return result;
  }
};