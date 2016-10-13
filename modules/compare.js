module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  var globalData = obj.globalData;

  if ($('.widget_product_compare_position').length) {
    $('body').addClass('compare-products');
    $('.compare_heading').append($('.content > div.heading.zebra'));
  }

};
