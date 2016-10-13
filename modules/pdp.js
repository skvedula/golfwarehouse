module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;


  // gift card PDPs
  if (req.url.indexOf('gift-card') > -1 || req.url.indexOf('gift-certificate') > -1) {
    $('#page').addClass('bb-gift-page');

    // move product image into the product options container
    $('.prod-det-main > .col5').prepend($('.widget_product_image_viewer').remove());

    // remove input size attr so our width styling will be applied
    $('input[size]').attr('size', '');

    // parse price options and insert select after the price swatches. swatches will be hidden with css
    var priceOptions = $('ul[aria-label="Amount"] > li > a').map(function() {
      return '<option value="' + this.attr('id') + '">' + this.attr('aria-label') + '</option>';
    });
    priceOptions.unshift('<option value="">Please Choose</option>');
    var $priceSelect = $('<select id="bb-giftcard-price"></select>').append(priceOptions);
    $('.attribute_swatch_list').after($priceSelect);

    var accordion = parseAccordion();
    $('.tabButtonContainer').last().closest('.row.margin-true')
      .replaceWith(partials('accordion', { tabs: accordion }));

    transformCTA();

    return;
  }

  if ($('.product_page_content').length) {

    // PDP Images
    var productImages = $('#ProductAngleImagesAreaList a').map(function(){
      var matches = $(this).attr('href').match(/\,\'(.+)\'\,/);
      return matches.length ? matches[1] : null;
    });

    // If no alternate product view images are found, grab the main image
    if (!productImages.length) {
      productImages = $('#productMainImage').map(function() {
        return this.attr('src');
      });
    }
    $('#widget_breadcrumb').after(partials('pdp-images', { images: productImages }));

    // Inventory information - shifting position
    var $availability = $('[id^="InventoryStatus_Availability_Section"]');
    $availability.find('.sublist').append($('.sku'));
    $('.prod-det-main').after($availability);

    // Swatches - add class to last group
    $('.definingAttributes .attribute_swatch_list').last().addClass('last');

    // Review stars - moving
    $('.product-images').before($('#BVRRSummaryContainer'));

    transformCTA();
    transformTables();

    // PDP accordion
    var accordion = parseAccordion();

    $('.tabButtonContainer').last().closest('.row.margin-true').remove();
    $availability.after(partials('accordion', { tabs: accordion }));

    // Removing recommended products
    $('[id^="catalogEntryRecommendationWidget"]').remove();

    //make iframes 100%
    $('iframe').attr('width','100%').attr('height','100%');
  }

  function transformCTA() {
    // Add to cart & qty steppr
    var $addToCart = $('.shopperActions #add2CartBtn');
    var addToCartContent = $.html($addToCart);
    var $qty = $('.quantity_section');
    var qtyData = {
      id: $qty.find('input').attr('id') || null,
      min: parseInt($qty.find('input').val(), 0) || 0,
      max: 999
    };
    qtyData.value = qtyData.min;
    qtyData.active = (qtyData.val > qtyData.min) ? 'active' : '';
    $addToCart.replaceWith(partials('pdp-actions-row', { addToCart: addToCartContent, qty: qtyData }));
  }

  function transformTables() {
    // Convert tables to something more reasonable
    $('.Chart-ContainerSize').each(function() {
      var $container = $(this);
      var $header = $container.find('.Chart-Headline-DrkGry td');
      var headings = $header.map(function() {
        return this.cleanText();
      });

      $header.remove();

      $container.find('.Chart-RowSpacer ~ table[class^="Chart-Body"]').each(function() {
        var $this = $(this);
        var newColumns = $this.find('td').map(function(index) {
          return '<li><label>' + headings[index] + '</label><span>' + this.cleanText() + '</span></li>';
        });
        var newList = $('<ul>' + newColumns.join('') + '</ul>');
        $this.replaceWith(newList);
      });

    });
  }

  function parseAccordion() {
    var accordion = [];
    $('.tabButtonContainer').last().find('.tab_container').each(function(){
      var $tab = $(this);
      var $content = $('[role="tabpanel"][aria-labelledby="tab' + $tab.attr('aria-posinset') + '"]');

      //Fixing Bad HTML
      $content.find('li').each(function (i, elem) {
        var $this = $(this);
        if (!$this.parent().is('ul') && !$this.parent().is('ol')) {
          $this.replaceWith('<div class="was-li">' + $this.html() + '</div>');
        }
      });


      // skip Q&A
      if ($content.find('#BVQAContainer').length) {
        return;
      }
      if ($content.length) {
        accordion.push({
          title: $tab.cleanText() || null,
          content: $content.html()
        });
      }
    });

    // Social Tab
    var $social = $('#social');
    if ($social.length) {
      $social.find('#pinterest > a').attr('data-pin-tall', 'true');
      $social.find('.g-plusone').attr('data-annotation', 'none').attr('data-size', 'tall');
      $social.find('.fb-like').attr('data-layout', 'button');

      accordion.push({
        title: 'Share',
        content: $social.html()
      });
      $social.remove();
    }

    return accordion;
  }

};
