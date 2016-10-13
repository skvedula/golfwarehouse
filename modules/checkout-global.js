module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  var globalData = obj.globalData;

  if ($('#checkout_crumb').length) {
    $('body').attr('data-bb-cache', 'false');

    // header
    $('script[src*="/wcsstore/StorefrontAssetStore/javascript/js/jquery"]').remove();
    var header = $('#header');
    header.before(partials('checkout-header', {header: globalData.header}));


    //footer
    var linksContainer = $('.privacyText');
    var footerLinks = linksContainer.find('a').remove();
    var copyright = linksContainer.text().trim();
    var startOfCopyright = copyright.indexOf("The");

    copyright = startOfCopyright !== -1 ? copyright.slice(startOfCopyright) : copyright;
    linksContainer.html(footerLinks + '<div class="copyright">' + copyright + '</div>');

    $('#footerPrivacyWrapper').attr('id', 'bbCheckoutFooter');
    $('#bbCheckoutFooter').prepend(partials('cf-links'));
    $('#socialMediaIcons').remove();
  }

};
