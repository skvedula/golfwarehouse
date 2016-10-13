
/* 
  Analytics Template
    This is a self contained analytics file which should handle BB Tracking for both passthrough and parsed pages.

  Process
    1. Fill in the necessary ID in UA-XXXX-Y on ga create.
    2. Update receipt page if statement.
    3. Update addTransaction, lineItems, and addItem information from receipt page (null values and empty array).
    4. Update selectors for paypal, v.me, checkout, etc.
    5. Add any custom tracking required by the client or PM.
*/

if (typeof ga !== 'function') {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
}

ga('create', 'UA-69090228-1', 'auto', {'name': 'bb'});
ga('bb.send', 'pageview', {useBeacon: true});

document.addEventListener('DOMContentLoaded', function(event) { 

  //If receipt page, require ecommerce and addTransction
  if (document.querySelector('.receipt-page')) {
    var orderID  = document.querySelector('#WC_OrderShippingBillingConfirmationPage_span_1') ? document.querySelector('#WC_OrderShippingBillingConfirmationPage_span_1').innerText : '';

    ga('bb.require', 'ecommerce');
    ga('bb.ecommerce:addTransaction', {
      'id':       orderID,
      'revenue':  document.querySelector('#order_total tr:last-child td:last-child') ? document.querySelector('#order_total tr:last-child td:last-child').innerText.replace('$','') : '',
      'shipping': document.querySelector('#order_total tr:nth-child(3) td:last-child') ? document.querySelector('#order_total tr:nth-child(3) td:last-child').innerText.replace('$','') : '',
      'tax':      document.querySelector('#order_total tr:nth-child(4) td:last-child') ? document.querySelector('#order_total tr:nth-child(4) td:last-child').innerText.replace('$','') : ''
    });    
  
    //For each item, addItem
    var lineItems = document.querySelectorAll('#order_details > tbody > tr:not(.nested)');
    [].forEach.call(lineItems, function (item) {
      ga('bb.ecommerce:addItem', {
        'id':       orderID,  //item.id
        'name':     item.querySelector('.itemspecs > p:first-of-type') ? item.querySelector('.itemspecs > p:first-of-type').innerText : '',  //item.name
        'sku':      item.querySelector('.itemspecs > span:first-of-type') ? item.querySelector('.itemspecs > span:first-of-type').innerText : '',  //item.sku
        'price':    item.querySelector('.each .price') ? item.querySelector('.each .price').innerText.replace('$','') : '',  //item.price
        'quantity': item.querySelector('.QTY .item-quantity') ? item.querySelector('.QTY .item-quantity').innerText : ''   //item.quantity
      });
    });

    ga('bb.ecommerce:send');
  }

  //Track Paypal Button Clicks
  var ga_paypal = document.querySelector('button.paypal');
  if (ga_paypal) {
    paypal.onclick = function() {
      ga('bb.send', 'event', 'checkout', 'click', 'paypal', {useBeacon: true});
    }
  }
  
  //Track Checkout Entry
  var ga_checkout = document.querySelector('button.checkout');
  if (ga_checkout) {
    ga_checkout.onclick = function() {
      ga('bb.send', 'event', 'cart', 'click', 'checkout', {useBeacon: true});
    }
  }

  //Track Shoprunner Clicks
  var ga_shoprunner = document.querySelector('button.shoprunner');
  if (ga_shoprunner) {
    ga_shoprunner.onclick = function() {
      ga('bb.send', 'event', 'checkout', 'click', 'Shoprunner');
    }
  }

  //Track Optout Clicks
  var ga_optout = document.querySelector('a.optout');
  if (ga_optout) {
    ga_optout.onclick = function() {
      ga('bb.send', 'event', 'checkout', 'click', 'Mobile Opt Out', {useBeacon: true});
    }
  }
});
