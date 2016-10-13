$(function() {
  var $alphabetButtons = $('#alphabet-button-array');
  
  if (!$alphabetButtons.length) {
    return;
  }
  
  // disable their scrolling function to prevent jerkiness
  window.scrollToBrand = function() {};
  
  $alphabetButtons.on('click', '.btn', function(e) {
    e.preventDefault();
    
    // expand accordion section when alphabet letter is clicked
    var letter = $(this).text().trim();
    var $link = $('.accordion-navigation[data-tab="' + letter + '"] > a');
    $link.trigger('click');
    
    // then scroll to it
    $('html, body').animate({
      scrollTop: $link.offset().top
    }, 1000);
  });
  
});
