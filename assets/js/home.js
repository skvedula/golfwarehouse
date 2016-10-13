$(function() {
  
  // home page accordion: when clicked, scroll to active tab
  $('.home-categories').on('click', '.link-bar', function(e) {
    e.preventDefault();
    
    var $this = $(this);

    // the timeout 0 ensures the old accordion section is collapsed and new one
    // is expanded. otherwise the scrolltop isn't accurate
    setTimeout(function() {
      $('html, body').animate({
        scrollTop: $this.offset().top
      }, 1000);
    }, 0);
  });
  
});
