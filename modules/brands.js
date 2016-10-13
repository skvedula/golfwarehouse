module.exports = function(obj) {
  
  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  var $brandsListing = $('#brandsListing');

  if (!$brandsListing.length) {
    return;
  }

  var accordion = $brandsListing.find('.alphabetical-family').map(function() {
    var $this = $(this);
    
    return {
      id: 'asdf-' + $this.attr('id'),
      title: $this.find('h2').cleanText(),
      content: $this.find('.category-group').toString()
    };
  });

  $brandsListing.find('.alphabetical-family').remove();
  $brandsListing.append(partials('accordion', { tabs: accordion }));
};
