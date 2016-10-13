module.exports = function(obj) {

  var req = obj.req;
  var $ = obj.$;

  if ($('.categoryRecommendationWidget').length) {
    $('#content').prepend('<bb-cms data-cms-key="Landing/Banner/' + req.url.split('/').pop() + '">');
  }

  if ($('.Reviews-CategoryDescription').length) {
    var iframes = $('iframe[src*=youtube]');

    iframes.each(function() {
      $(this).attr('width', '100%').attr('height', '100%');
    });

    $('h1').removeAttr('class');
  }
};
