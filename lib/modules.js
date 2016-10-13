var fs   = require('fs');

// Load up all the modules, enabled by default for now
module.exports = function(app) {

  app.bb.modules = [];

  var dir = process.cwd() + '/modules';

  fs.readdirSync(dir).forEach(function(file) {
    var fileName = dir + "/" + file;
    if (!/\.js$/.test(fileName)) {
      return;
    }
    var module = {
      fileName: file,
      module:   require(fileName),
      enabled:  true
    };
    app.bb.modules.push(module);
  });

  // Custom endpoint for controlling which modules are enabled
  app.get('/bb-module-config', function (req, res) {
    var data = {
      modules: app.bb.modules
    };

    if (req.query.toggle) {
      app.bb.modules[req.query.toggle].enabled = !app.bb.modules[req.query.toggle].enabled;
    }

    res.render('config', data);
  });
};
