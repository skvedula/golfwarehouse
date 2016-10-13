$(document).ready(function() {
  var $emailInput = $('input[name="email1"]');
  if ($emailInput.attr('type') !== "hidden") {
    $emailInput.attr('type', 'email');
  }

  var $zipField = $('input[name="zipCode"]');
  if ($zipField.attr('type') !== "hidden") {
    $zipField.attr('type', 'tel');

    $('select[name="country"]').on('change', function () {
      if ($(this).val() !== 'US') {
        $zipField.attr('type', 'text');
      } else {
        $zipField.attr('type', 'tel');
      }
    });
  }

  if ($('.bb-cart').length || $('#bbCheckoutHeader').length) {
    $(document).on('DOMSubtreeModified', function() {
      var $email1 = $('#email1');
      if ($email1.attr('type') !== "hidden") {
        $email1.attr('type', 'email');
      }

      var $ajaxZipField = $('#zipCode');
      if ($ajaxZipField.attr('type') !== "hidden") {
        $ajaxZipField.attr('type', 'tel');

        $('#country').on('change', function () {
          if ($(this).val() !== 'US') {
            $ajaxZipField.attr('type', 'text');
          } else {
            $ajaxZipField.attr('type', 'tel');
          }
        });
      }
    });
  }
});

$(document).on('click', 'input[name="radioCc"], input[name="radioPayPal"]', function() {
  var $displayDiv = $('#paymentSection1');
  $(this).closest('form').after($displayDiv);
});
