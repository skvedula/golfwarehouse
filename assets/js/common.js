$(document).ready(function(){

  $(document).foundation();

  // overriding desktop site header login code that interferes with facets, etc. on mobile
  // possibly only a temporary patch until this is fixed on the full site
  if (window.GlobalLoginJS) {
    window.GlobalLoginJS.updateGlobalLoginContent = function () {};
  }

  // Product Index - patching facet update to also update current product count
  if (typeof updateFacetCounts !== 'undefined') {
    var oldFacetCount = updateFacetCounts;
    var updateProductCount = function() {
      var countMatches = $('.num_products').text().match(/\d+ \- \d+ of (\d+)/);
      if (countMatches.length) {
        $('.product-count').text(countMatches[1]);
      }
    };

    updateFacetCounts = function(){
      oldFacetCount.apply(this, arguments);
      updateProductCount();
    };

    // After selecting a filter, the response contains a script that wipes out
    // our updateFacetsCount override above. but luckily it publishes an event
    // that we can listen for
    if (dojo && typeof dojo.subscribe === 'function') {
      dojo.subscribe("FacetCount_updated", function(){
        updateProductCount();
      });
    }
  }

  // Footer e-mail signup
  var $emailSignup = $('.bb-email-signup');
  var $emailInput = $emailSignup.find('input');
  var emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

  function emailValidate(){
    return emailRegex.test($emailInput.val());
  }
  $emailInput.on('keyup', function(e){
    if ($(this).hasClass('submitted')) {
      $(this).toggleClass('error',!emailValidate());
    }
  });
  $emailSignup.on('submit', function(e){
    e.preventDefault();
    $emailInput.addClass('submitted');
    if (emailValidate()) {
      window.location = 'http://' + window.location.host + $emailSignup.attr('action') + '&email=' + encodeURIComponent($emailInput.val());
    } else {
      $emailInput.addClass('error');
    }
  });

  $('a[onclick*="javascript:GlobalLoginJS.InitHTTPSecure"]').attr('href', '/webapp/wcs/stores/servlet/LogonForm?langId=-1&catalogId=10052&storeId=10151&storeId=10151');

  $('.feedback > a').click(function() {
    // scroll to the feedback modal when you click on site feedback
    $('html, body').scrollTop( $(document).height()/2 );
  });

});

// CMS carousel
window.bbHomeCarousel = function(){
  $(document).ready(function(){
    $('.bb-home-cms ul').slick({
      arrows: false,
      autoplay: true,
      slide : 'li',
      dots: true
    });
  });
};
