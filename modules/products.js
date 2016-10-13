module.exports = function(obj) {

  var fs = require('fs');
  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;

  if ($('.facetContainer').length || $('#page.search-results').length || $('.productListingWidget').length) {

    $('#page').addClass('product-index');

    var searchWord = $('div[id^="PageHeading"]').cleanText();
    var searchTotalCount = $('span[id^="searchTotalCount"]').cleanText();
    if (searchWord && searchWord.length && searchTotalCount.indexOf('0 matches') === -1) {
      $('#widget_breadcrumb .current').text(searchWord);
    }

    // Adding product count to breadcrumbs
    var countMatches = $('.num_products').cleanText().match(/\d+ \- \d+ of (\d+)/);
    if (countMatches && countMatches.length) {
      $('#widget_breadcrumb .current').append('<span class="product-count">' + countMatches[1] + '</span>');
    }

    $('.contentRecommendationWidget').each(function () {
      var $widget = $(this);
      var $widgetId = $widget.attr('id');

      if(/contentRecommendationWidget_\d_-\d{4}_\d+/.test($widgetId)) {
        $widget.remove();
      }
    });

    // Product Modifiers
    $('.categoryNavWidget').remove();
    var $facets = $('div[id^=widget_left]');
    var facetContent;
    $('.facetWidget h3.toggle').html('<span class="filter-button">Filter</span>');
    $('.facetWidget .content').before($('.facetWidget .clearAll'));
    var facetContent = $facets.html();

    var $sortBy = $('.orderByDropdown');
    $sortBy.find('select').removeAttr('data-dojo-type');
    var sortContent = $sortBy.html();

    $facets.after(partials('product-modifiers', { facets: facetContent, sortBy: sortContent }));
    $facets.remove();


    if (!$facets.length && (req.url.indexOf('ProductListingView') === -1 || (req.query.categoryId === '3074457345616678270' || req.query.categoryId === '3074457345616678271'))) {
      $('.productListingWidget').before(partials('product-modifiers', { facets: facetContent, sortBy: sortContent }));
      $('.product-modifiers').addClass('needs-height');
    }

    // Review Stars
    $('.product_rating').each(function(){
      var $img = $(this).find('img');
      if ($img.length) {
        var ratingMatches = $img.attr('src').match(/([\d\.]+)\/5\/rating\.gif/);
        if (ratingMatches[1]) {
          var percentage = parseFloat(ratingMatches[1], 10) * 20;
          $img.replaceWith(partials('product-rating', { percentage: percentage }));
        }
      }
    });

    //No Search Results
    if (!$('.product_listing_container').length) {
      $('.product-modifiers').replaceWith('<div>' + $('.results_description').text() + '</div>')
    }

    //Removing unecessary class as it causes CSS problems with Foundation Reveal
    $('.facetContainer').removeClass('row');

  }

};
