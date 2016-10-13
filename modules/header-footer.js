module.exports = function(obj) {

  var fs = require('fs');
  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  var globalData = obj.globalData;

  globalData.footer = globalData.footer || {};
  globalData.footer.config = globalData.footer.config || {};
  req.app.bb = req.app.bb || {};
  req.app.bb.config = req.app.bb.config || {};

  globalData.footer.config = req.app.bb.config;

  req.app.hbs.handlebars.registerPartial('global-cms', "" + fs.readFileSync('views/partials/global-cms.hbs'));

  if (!$('body').length) {
    return;
  }

  if (!$('#checkout_crumb').length) {
    // slide menu
    $body = $('body');
    $body
      .html('<div class="body-wrapper">' + $body.html() + '</div>');
    $('.body-wrapper').after(partials('slide-menu', globalData));

    // header
    $('script[src*="/wcsstore/StorefrontAssetStore/javascript/js/jquery"]').remove();
    var $searchBar = $('#searchBar');
    var searchHTML = $searchBar.html();
    $searchBar.remove();

    $desktopHeader = $('#headerWrapper, .header_wrapper_position');
    $desktopHeader.before(partials('header', {header: globalData.header, searchHTML: searchHTML}));

    // footer
    $('#page').append(partials('footer', {footer: globalData.footer}));

    // hide footer & populate input on e-mail signup landing page
    if ($('#page.email-signup').length) {
      var email = (req.query && req.query.email) || '';
      $('.bb-email-signup').remove();
      $('#s_email').val(email);
    }
  }

};
