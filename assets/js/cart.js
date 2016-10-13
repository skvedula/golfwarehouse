$(document).ready(function(){

  if ($('#ShopCartDisplay').length) {

    // Qty Stepper - proxying hidden qty dropdown
    var qtyTimeout;
    function updateQuantity($qtyInput){
      clearTimeout(qtyTimeout);
      qtyTimeout = setTimeout(function(){
        var $select = $('#' + $qtyInput.attr('data-proxy-for'));
        $select.val($qtyInput.val());
        $select.trigger('onkeydown');
      }, 200);
    }
    $(document).on('change', '.cart-products .qty-stepper input', function(){
      updateQuantity($(this));
    });
    $(document).on('click', '.cart-products .qty-stepper .stepper', function(){
      updateQuantity($(this).siblings('input'));
    });

    // Cart refresh override - re-enforce transformations if necessary
    var cartController = wc.render.refreshControllers.ShopCartDisplayController;
    var refresh = cartController.postRefreshHandler;
    cartController.postRefreshHandler = function(){
      refresh.apply(cartController, arguments);

      $('#order_total tr:last-of-type td:first-of-type').text('Total:');

      promoTransform();
      updateProducts();

    };

    // override promo code apply/remove ajax callbacks. just refresh the page
    if (wc && wc.service && wc.service.services) {
      var AjaxPromotionCodeManage = wc.service.services.AjaxPromotionCodeManage;
      var AjaxPromotionCodeDelete = wc.service.services.AjaxPromotionCodeDelete;

      if (AjaxPromotionCodeManage && AjaxPromotionCodeManage.successHandler) {
        AjaxPromotionCodeManage.successHandler = function() {
          window.location = window.location;
        };
      }

      if (AjaxPromotionCodeDelete && AjaxPromotionCodeDelete.successHandler) {
        AjaxPromotionCodeDelete.successHandler = function() {
          window.location = window.location;
        };
      }
    }

    if (CheckoutHelperJS) {
      CheckoutHelperJS.updateCartWait = function(quantityBox, orderItemId,event, giftWrapAdded, giftWrapOrderItemId) {
        if(!this.isAjaxCheckOut()){
          return;
        }

        //Key pressed.. update the flag
        if(this.keyPressCount[orderItemId] == null && isNaN(this.keyPressCount[orderItemId])){
          this.keyPressCount[orderItemId] = 0;
        }
        this.keyPressCount[orderItemId] = parseInt(this.keyPressCount[orderItemId]) + 1;

        if (giftWrapAdded) {
          this.giftWrapAdded = true;
          this.giftWrapOrderItemId = giftWrapOrderItemId;
        }else{
          this.giftWrapAdded = false;
          this.giftWrapOrderItemId = "";
        }
        setTimeout(dojo.hitch(this,"updateCart",quantityBox,orderItemId,this.keyPressCount[orderItemId]),this.updateWaitTimeOut);
      }
    }

  }

  /* updateProducts
   * Check status of refreshed products and update transformed version
   */
  function updateProducts(){
    $('.cart-products > li').each(function(){
      var $transformed = $(this);
      var $original = $('#' + $transformed.attr('data-id')).closest('tr');
      if ($original.length) {

        // Update quantity, price
        $transformed.find('.qty-stepper input').val($original.find('[id^="qty_"]').val());
        $transformed.find('.price').text($original.find('.each .price').first().text());

        // Update promo information
        var promo = $original.next('tr');
        if (promo.length) {
          promo = parsePromo(promo);
        }
        if (promo.discount) {
          $transformed.find('.promo').addClass('active');
          $transformed.find('.promo .discount').text(promo.discount);
          $transformed.find('.promo .value').text(promo.value);
        } else {
          $transformed.find('.promo').removeClass('active');
        }

      } else {
        $transformed.remove();
      }
    });
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
      value: $value.text() || null
    };
  }



  //Sign In/Guest Checkout Form
  if ($('#ShopCartDisplay').length) {
    var checkoutButton = $('.checkout-button');
    if (!checkoutButton.attr('onclick')) {
      checkoutButton.on('click', function () {
        $('input[name="logonId"]').attr('type', 'email');
        $('.shop_cart > div.left_column, .continue-shopping').hide();
        $('.headingtext span').text('Checkout Options');

        $('.ajax-logon-form, .back-to-cart').fadeIn('slow');
      });

      $('.cart-wrapper, .back-to-cart a').on('click', function (e) {
        e.preventDefault();

        $('.ajax-logon-form, .back-to-cart').hide();
        $('.headingtext span').text('Shopping Cart');

        $('.shop_cart > div.left_column, .continue-shopping').fadeIn('slow');
      });
    }
  }

});
