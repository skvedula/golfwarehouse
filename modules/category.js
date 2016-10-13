var url = require('url');

module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;

  if($('.categoryNavWidget').length && !($('.facetContainer').length || $('#page.search-results').length || $('.productListingWidget').length || $('.Reviews-CategoryDescription').length) &&
     $('title').text() !== 'Wichita Retail Store' && $('meta[name="pageIdentifier"]').attr('content') !== 'GiftCardsPage') {
    var matchedCategory = false;

    var categoryData = $('.categoryNavWidget a').map(function(){
      var $category = $(this);
      var $count = $category.find('.facetCountContainer');
      var count = $count.cleanText() || '';
      $count.remove();

      var href = $(this).attr('href') || null;
      if(href && url.parse(href).path === req.url) {
        matchedCategory = true;
      }

      return {
        href: href,
        title: $(this).cleanText() || '',
        count: count
      };

    });

    if(!matchedCategory) {
      var breadcrumbContent = $.html('#widget_breadcrumb');

      $('#content').html(partials('category', { breadcrumbs: breadcrumbContent, subcategories: categoryData }));
    }
  }

};
