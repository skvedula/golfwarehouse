module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;

  if ($('#checkout_crumb').length) {
    $('#checkout_crumb .crumb > a').remove();
    $('#checkout_crumb .crumb .step_arrow').remove();

    if ($('.checkout_confirmation').length) {
      $('#checkout_crumb').addClass('receipt-page');
    }
  }
};