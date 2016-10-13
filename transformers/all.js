var globalParser = require('../partials/global');

module.exports = {
  // do not transform paths inside the analyzerIgnore option
  body: [function(req, response, body, $) {
    var ignoreAllow = [];
    for(var x=0; x < req.app.bb.config.analyzerIgnore.length; x++) {
      var ignore = req.app.bb.config.analyzerIgnore[x];
      if (ignoreAllow.indexOf(ignore) === -1 && req.url.indexOf(ignore) > -1) {
        return false;
      }
    }
    return true;
  }],

  cache: {
    enabled: function (req, res, body, $) {
      var cache = 3600;

      if (/checkout|xhr|bb_sess|RESTOrderCalculate|AjaxOrderItemDisplayView/.test(req.url)) {
        cache = 0;
      }

      if ($('body[data-bb-cache="false"]').length) {
        cache = 0;
      }

      if ($('h1[role="main"].error-message').length) {
        cache = 0;
      }

      if ($('.MaintenancePageContainer').length) {
        cache = 0;
      }
      
      return cache;
    }
  },

  transform : function(req, response, body, $) {

    scrubHostname(req, $);

    var responseObject = {
      req:      req,
      response: response,
      body:     body,
      $:        $
    };

    var isStaticResource = /\.(js|css|jpe?g|gif|png|map|ico|ttf|woff|otf)$/i.test(req.path);

    responseObject.globalData = {};
    if (!isStaticResource) {
      responseObject.globalData = globalParser.parse(req, response, body, $);
    }

    //-----------------------------------------------------------------------------
    // Run Enabled modules
    //-----------------------------------------------------------------------------

    for(var x=0; x < req.app.bb.modules.length; x++) {
      var module = req.app.bb.modules[x];
      if (module.enabled) {
        module.module(responseObject);
      }
    }

    //-----------------------------------------------------------------------------
    // The same cheerio object was passed to all modules, return its new contents
    //-----------------------------------------------------------------------------

    var result = '';

    if (isStaticResource) {
      result = responseObject.body;
    } else {
      result = $.html();
    }

    return {
      body: result
    };
  }
};

/**
 * Removes full site host from common elements/attributes that aren't handled by the analyzer
 */
function scrubHostname(req, $) {
  var host = req.headers && req.headers.host || req.app.bb.host;
  var urlRegex = new RegExp('(http|https):(\/|\\\\)*' + req.app.bb.host, 'gmi');

  function scrub(text) {
    return text.replace(urlRegex, '');
  }

  $('script').each(function() {
    var $this = $(this);
    $this.text(scrub($this.text()));
  });

  $('a[href]').each(function() {
    var $this = $(this);
    $this.attr('href', scrub($this.attr('href')));
  });

  $('[onclick]').each(function() {
    var $this = $(this);
    $this.attr('onclick', scrub($this.attr('onclick')));
  });

  return $;
}
