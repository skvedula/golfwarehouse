$(document).ready(function(){

  // Qty Stepper - proxying hidden qty dropdown
  var $qtyInput = $('.pdp-actions-row .qty-stepper input');
  function updateQuantity(){
    var $select = $('#' + $qtyInput.attr('data-proxy-for'));
    $select.val($qtyInput.val());
  }
  $qtyInput.on('change', updateQuantity);
  $qtyInput.siblings().on('click', updateQuantity);

  // Product Images carousel
  function ProductImages(element){
    this.$container = $(element);
    this.init();
  };
  ProductImages.prototype.init = function(){
    this.$container.slick({
      slide: 'li',
      dots: true
    });
  };
  ProductImages.prototype.refresh = function(){
    this.$container.replaceWith('<ul class="product-images"></ul>');
    var $container = this.$container = $('.product-images');
    var newElements = [];
    $('#ProductAngleImagesAreaList a').each(function(){
      var matches = $(this).attr('href').match(/\,\'(.+)\'\,/);
      var src = matches.length ? matches[1] : null;
      if (src) {
        newElements.push('<li><img src="' + src + '"></li>');
      }
    });
    if (!newElements.length) {
      $('#productMainImage').each(function() {
        var src = $(this).attr('src');
        if (src) {
          newElements.push('<li><img src="' + src + '"></li>');
        }
      });
    }
    $container.append(newElements);
    this.init();
  };

  var productImages = new ProductImages('.product-images');

  if (typeof productDisplayJS !== 'undefined') {
    var updateProductImage = productDisplayJS.updateProductImage;
    productDisplayJS.updateProductImage = function(){
      updateProductImage.apply(productDisplayJS, arguments);
      productImages.refresh();
    };

    // Add to Cart override - check for quantity adjustment and allow message
    // to show before sending user to cart
    wc.render.refreshControllers.MiniShoppingCartController.postRefreshHandler = function(widget) {
      var controller = this;
      var renderContext = this.renderContext;
      var goToCart = true;

      destroyDialog("MiniShopCartProductAdded");
      updateCartCookie();
      populateProductAddedDropdown();

      var minicartQtySpan = $('span[id^="MiniShopCartAddedProdQty_"]');
      var originalQtyInput = $('input[id^="quantity_"]');

      if (minicartQtySpan.length && originalQtyInput.length) {
        var minicartQty = minicartQtySpan[0].innerHTML;
        var originalQty = originalQtyInput[0].value;

        if (minicartQty !== '' && originalQty !== '' && minicartQty !== originalQty) {
          goToCart = false;
          MessageHelper.displayStatusMessage(storeNLS['QUANTITY_ADJUSTED_NOTIFY']);
          // Set message modal to go to cart when closed
          $('#MessageArea, #clickableErrorMessageImg').attr('onclick', 'javascript:window.location=$(\'.cart-wrapper\').attr(\'href\');');
        }
      }

      resetDeleteCartCookie();

      if (goToCart) {
        window.location = $('.cart-wrapper').attr('href');
      }
    };
  }

  // proxy changes from BB's select to the full site's hidden price swatches
  $('#bb-giftcard-price').on('change', function(e) {
    e.preventDefault();
    var swatchId = $(this).val();

    // can't select it directly by id because id contains some special chars
    var href = $('[id^="' + swatchId + '"]').attr('href');

    // shame on me. no real alternative though (triggering a click won't work)
    eval(href);
  });

  $('a[href="javascript:shoppingListJS.redirectToSignOn();"]').attr('href', '/webapp/wcs/stores/servlet/LogonForm?langId=-1&catalogId=10052&storeId=10151&storeId=10151');

  // TGWM-463
  // add in pdp video
  // link href redirects to video
  var videoHref = $('div[id^=lcBanner]').find('a').attr('href');
  if (videoHref) {
    if (videoHref.indexOf('www.lcmob.net') === -1) {
      videoHref.replace('lcmob.net', 'www.lcmob.net');
    }
    var video = $('<div class="pdp-video-container"><div class="pdp-video-inner"><video id="#video" src="' + videoHref + '" type="video/mp4" width="320" controls></video></div></div>');
    $('ul.accordion').before(video);
  }
});
