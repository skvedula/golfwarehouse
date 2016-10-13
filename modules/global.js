module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;
  var config   = req.app.bb.config;

  handleScripts(req, $);

  $('head').append(partials('head', { config: config }));

  // Removing desktop site promo container
  $('[id^=contentRecommendationWidget] [id^="contentImage"]').remove();

  // Remove desktop viewport meta tag. we insert our own
  $('#Viewport').remove();

  if(/\/fs99|\/2ndair/.test(req.url)){
    var style = "<style>.bb-global-banner{display:none}</style>";
    $('body').prepend(style);
  }

  //Removing Promo Banners from Desktop excluding some elements that we need
  $('.contentRecommendationWidget').each(function () {
    var $widget = $(this);

    //TODO: Find a Pattern and turn this into a regex for versatility
    if ($widget.is('[id*="contentRecommendationWidget_1_-2012_3074457345618"]') ||
        $widget.is('[id*="contentRecommendationWidget_1_-2000_3074457345618"]') ||
        $widget.find('meta[name="ROBOTS"], div[class^="Launch-Section"], .Subheadline-Section4-Text').length) {
      // TGWM-476 make sure not to delete contents of shipping-info and price-match pages
      if (!$widget.is('[id="contentRecommendationWidget_1_-2000_3074457345618270105"]') && !$widget.is('[id="contentRecommendationWidget_1_-2000_3074457345618279628"]')) {
        $(this).remove();
      }
    }
  });

  // Disable autocomplete/capitalize/correct on type text email input
  $('input[type=text][name$=email], input[type=text][name$=Email]').attr('autocomplete', 'off').attr('autocapitalize', 'off').attr('autocorrect', 'off');
};

function handleScripts(req, $) {
  var host = req.protocol + '://' + req.headers.host + '/';
  var $absoluteURLScript = $('script:contains("absoluteURL =")');
  if ($absoluteURLScript.length) {
    $absoluteURLScript.html($absoluteURLScript.html().replace(/absoluteURL = \"(.+)\"/, 'absoluteURL = "' + host + '"'));
  }

  // Some ajax responses contain markup that's appended to the page. they have no
  // html or body. just return since we don't want to manipulate or reorder it
  if (!$('html').length) {
    return;
  }

  //TGW has redirect pages with scripts on them to do the redirects but do not have a body
  var output = '';
  if (!$('body').length) {
    $('script').each(function(){
      output += $.html(this);
      $(this).remove();
    });
    $('html').append(output);
    return;
  }

  // Moving scripts below header - this preserves execution order despite additional scripts
  // appended to the header later by dojo, platform, etc.
  $('script').each(function() {
    //Special Logic For LiveClicker Script. Bad Entity in URL. Can't turn decodeEntities off, it will break the site
    var src = $(this).attr('src') || '';
    var liveClickerIDPos = src.indexOf("id=lcBanner");

    if (liveClickerIDPos === -1) {
      output += $.html(this);
      $(this).remove();
    }
    else {
      var beginning = src.slice(0, liveClickerIDPos - 1);
      var end = src.slice(liveClickerIDPos);
      // '&div_' was being decoded to a division sign by cheerio
      $(this).attr('src', beginning + '&div_' + end);
    }
  });
  $('body').prepend(output);
}
