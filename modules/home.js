module.exports = function(obj) {
  
  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  var globalData = obj.globalData;  

  if ($('#page.home-page').length) {
    
    $('#contentWrapper').html(partials('home', globalData));
    
  }
    
};
