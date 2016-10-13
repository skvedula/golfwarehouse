module.exports = function(obj) {
  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  
  if (!$('.main_content .buyers-club').length) {
    return;
  }

  $('body').addClass('bb-buyers-club');
};
