$(function() {
  if (typeof dojo !== 'undefined') {
    dojo.addOnLoad(function () {
      // prepopulate sort dropdown with selected option
      var $sort = $('.product-modifiers .sort > select');
      $sort.val($sort.find('option[selected]').val());
    });

    // override the auto collapse function defined in /wcsstore/StorefrontAssetStore/javascript/Widgets/collapsible.js
    require(["dojo/on", "dojo/query", "dojo/topic", "dojo/dom-attr", "dojo/NodeList-traverse", "dojo/domReady!"], function(on, query, topic) {
      // close the toggler regardless media query
      var closeCollapsibles = function() {
          query(".collapsible").attr("aria-expanded", 'false');
      };
      var updateCollapsibles = function (mediaQuery) {
        // update collapse status when on desktop
        var expanded = mediaQuery ? mediaQuery.matches : document.documentElement.clientWidth > 767;
        if (expanded){
          query(".collapsible:not(.collapsedOnInit)").attr("aria-expanded", 'true');
        } else {
          query(".collapsible").attr("aria-expanded", 'false');
        }
      }
      if (window.matchMedia) {
        // previously desktop expand the toggler when width > 600px. Override it to keep toggler closed
        var mediaQueryOverride = window.matchMedia("(max-width:600px)");
        closeCollapsibles(mediaQueryOverride);
        mediaQueryOverride.addListener(closeCollapsibles);

        // expand it when user is on desktop dimension
        var mediaQueryDesktop = window.matchMedia("(min-width:768px)");
        updateCollapsibles(mediaQueryDesktop);
        mediaQueryDesktop.addListener(updateCollapsibles);
      }
      else {
        updateCollapsibles();
        on(window, "resize", function(event) {
          updateCollapsibles();
        });
      }
    });
  }

  // override desktop pagination function. scroll to top of product grid after pagination loads new results
  if (typeof SearchBasedNavigationDisplayJS !== 'undefined' && SearchBasedNavigationDisplayJS.showResultsPage) {
    var showResultsPage = SearchBasedNavigationDisplayJS.showResultsPage;
    SearchBasedNavigationDisplayJS.showResultsPage = function() {
      // this function runs twice: before and after the request completes.
      // this flag is used to determine when the request is complete
      var shouldScroll = !!requestSubmitted;

      showResultsPage.apply(this, arguments);

      if(shouldScroll) {
        $('html, body').animate({
          scrollTop: $('.product-modifiers').offset().top - 10
        }, 1000);
      }
    };
  }

  var containerCount = 0;
  $('.optionContainer > div[role="button"]').each(function() {
    if (containerCount < 4) {
      $(this).trigger('click');
      containerCount++;
    }
  })

});
