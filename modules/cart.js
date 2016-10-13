module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;

  if ($('#ShopCartDisplay').length) {
    $('body').attr('data-bb-cache', 'false');

    // General layout changes
    $('.content_wrapper_position').attr('class', 'bb-cart').html($('.main_content').html());
    $('.right_column').remove();

    // Checkout buttons
    var paypalButton = $('#shippingBillingPagePayPal') || null;
    var checkoutAction = $('#guestShopperContinue').attr('onclick') || null;
    var isGuest = true;
    var paypalDisabled = false;
    var paypalClickInfo = '';
    if (!checkoutAction) {
      checkoutAction = $('#shopcartCheckout').attr('onclick') || null;
      isGuest = false;
    }

    if (paypalButton.hasClass('disabled')) {
      paypalDisabled = true;
    }

    if ($('#PayPalClickInfo').length) {
      paypalClickInfo = '<div id="paypal-popup">' + $('#PayPalClickInfo') + '</div>';
    }
    var cartActions = partials('cart-actions', {
      paypalAction: paypalButton.attr('onclick'),
      paypalDisabled: paypalDisabled,
      paypalClickInfo: paypalClickInfo,
      checkoutAction: checkoutAction,
      isGuest: isGuest
    });

    $('#ShopCartDisplay').before(cartActions).after(cartActions);


    // Parse products
    var products = parseProducts();
    if (products.length) {
      $('#ShopCartDisplay').before(partials('cart-products', { products: products }));
    }

    promoTransform();

    //Moving Sign In/Guest Form to it's own section
    var AjaxLogon = $('#AjaxLogon').remove();
    $('.shop_cart > div:first-of-type').after('<div class="back-to-cart cart-buttons-alt"><a href="#">Back To Cart</a></div>' + AjaxLogon.addClass('ajax-logon-form'));

    var loginInput = $('input[name="logonId"]');
    loginInput.attr('autocapitalize', 'off');
    loginInput.attr('autocorrect', 'off');

    //Continue Shopping Button
    var logoHREF = $('#logo > a').attr('href')
    $('.shop_cart .left_column > nav').each(function() {
      $(this).after('<div class="continue-shopping cart-buttons-alt"><a href="'+ logoHREF +'">Continue Shopping</a></div>');
    });

    $('#WC_CheckoutLogonf_div_9').remove();
  }

  /* promoTransform
   * Wrap input & button in container for styling purposes
   */
  function promoTransform(){
    $promoForm = $('#PromotionCodeForm');
    $promoForm.prepend('<div class="promo-wrap"></div>');
    $promoForm.find('input#promoCode').attr('placeholder', 'Promotional code');
    $promoForm.find('.promotion_button a').html('Apply');
    $('.promo-wrap').append($promoForm.find('.promotion_input, .promotion_button'));
  }

  /* parsePromo
   * If a table row contains promo information, return value & discount text.
   */
  function parsePromo($promo){
    var $discount = $promo.find('.discount.hover_underline');
    var $value = $promo.find('td.discount').last();
    return {
      discount: $.html($discount) || null,
      value: $value.cleanText() || null
    };
  }

  /* parseProducts
   */
  function parseProducts(){
    var products = [];
    $('#order_details tr').each(function(){
      var $row = $(this);
      if ($row.find('.img').length) {
        var $title = $row.find('[id^="catalogEntry_name"]');
        products.push({
          id: $title.attr('id') || null,
          img: $row.find('.img img').attr('src') || null,
          title: $title.text() || null,
          price: $row.find('.each .price').first().cleanText() || null,
          href: $title.attr('href') || null,
          stock: $row.find('.availabilityMessage').cleanText() || null,
          availability: $row.find('[id^="availabilityDescInfoPopUp"] .body').cleanText() || null,
          qty: function($qty){
            var qtyData = {
              id: $qty.attr('id') || null,
              min: 1,
              max: 999,
              value: parseInt($qty.val()) || 1
            };
            qtyData.active = (qtyData.value > qtyData.min) ? 'active' : '';
            return qtyData;
          }($row.find('input[id^=qty_]')),
          promo: parsePromo($row.next('tr')),
          remove: $row.find('.remove_address_link').attr('href')  || null
        });
      }
    });
    return products;
  }

};
