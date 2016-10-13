(function($) {

  $(document).ready(function () {

    // slide menu
    var $body = $('body');
    $body.on('click', '#bb-slide-menu-btn', function(e) {
      e.preventDefault();
      $body.toggleClass('bb-slide-menu-active');

      if ($body.hasClass('bb-slide-menu-active')) {
        $body.one('click.body-wrapper', '.body-wrapper', function(e) {
          e.preventDefault();
          $body
            .removeClass('bb-slide-menu-active')
            .off('touchend.body-wrapper');
        }).one('touchend.body-wrapper', '.body-wrapper', function(e) {
          e.preventDefault();
          $body
            .removeClass('bb-slide-menu-active')
            .off('click.body-wrapper');
        });
      }
    });

    // entering subcategories
    $body.on('click', '.has-sub-menu > a', function(e) {
      e.preventDefault();
      var $menu = $(this).parent();
      var menuId = $menu.data('menu-id');
      var $category = $('.category[data-parent-menu-id=' + menuId + ']');

      $category.addClass('active');
      $('.categories').addClass('active');
      $('.main-menu').addClass('inactive');
      
      window.scrollTo(0,0);
    });

    // go back to main menu
    $body.on('click', '.back', function(e) {
      e.preventDefault();
      var $parentCategory = $(this).closest('.category');

      $('.categories').removeClass('active');
      $('.main-menu').removeClass('inactive');
      
      window.scrollTo(0,0);

      setTimeout(function() {
        $parentCategory.removeClass('active');
      }, 300);
    });

  });

})(jQuery);