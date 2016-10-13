module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;

  /* /gift-cards */
  var cbfw = $('#checkBalanceFormWrap');
  if(cbfw.length) {
    $('body').addClass('gift-cards');
    
    var categoryData = $('.categoryNavWidget a').map(function() {
      var $category = $(this);
      var href = $category.attr('href') || null;
      return {
        href: href,
        title: $category.cleanText() || ''
      };
    });
    cbfw.after('<div class="buy-gift">Buy Gift Cards & Certificates</div><section id="categoryIndex"><ul class="subcategories"></ul></section>');
    categoryData.forEach(function(category) {
      $('ul.subcategories').append('<li><a href=' + category.href + ' class="link-bar">' + category.title + '</a></li>');
    });

    $('#content').prepend('<div class="title">Gift Cards & Certificates</div>');
    $('#widget_left_nav_5_-2006_3074457345618262569').remove();
  }
};
