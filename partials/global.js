var _ = require('bb_platform/node_modules/lodash');

module.exports = {
  path  : [ '*' ],

  parse : function(req, response, body, $) {
    return {
      title: $('title').cleanText(),
      header: {
        cart: parseLink($('#GotoCartButton2')),
        logoHREF: $('#logo > a').attr('href'),
        nav: [
          {
            title: 'My Account',
            href: '/webapp/wcs/stores/servlet/LogonForm?langId=-1&catalogId=10052&storeId=10151&storeId=10151'
          }, {
            title: 'Order Status',
            href: getOrderStatusLink($)
          }, {
            title: 'Gift Cards',
            href: $('#footerGiftCardsSection a').attr('href') || null
          }, {
            title: 'Submit Feedback',
            href: 'javascript:void(null)',
            reveal: 'siteFeedback'
          }
        ]
      },
      footer: {
        signup: $('#emailSignup').attr('href') || null,
        nav: [
          [
            {
              title: '1-888-746-7849',
              href: 'tel:18887467849',
            },
            parseLink($('#quickLinksBar #storeCustomerService').last())
          ],
          [
            parseLink($('#quickLinksBar #requestCatalog')),
            {
              title: 'Account',
              href: '/webapp/wcs/stores/servlet/LogonForm?langId=-1&catalogId=10052&storeId=10151&storeId=10151'
            }, {
              title: 'Order Status',
              href: getOrderStatusLink($)  
            }
          ]
        ],
        social: $('#socialMediaIcons a').map(function(){
          var $social = $(this);
          var idMatches = $social.find('i').last().attr('class').match(/icon-(.+)-square/);
          var idMatch = idMatches.length ? idMatches[1] : '';

          return {
            href: $social.attr('href') || null,
            title: $social.attr('title'),
            id: idMatch
          };
        }),
        bottomNav: $('.privacyText a').map(function(){
          var $nav = $(this);
          $nav.text($nav.cleanText().toLowerCase());
          return parseLink($(this));
        }),
        desktopUrl: response.href + (~response.href.indexOf('?') ? '&' : '?') + 'MobileOptOut=1',
        copyright: '© ' + new Date().getFullYear() + ' The Golf Warehouse, Inc.'
      },
      categories: $('#departmentsMenu .mainNavGolf, #discountsId').map(function(){
        var catLink = $(this).find('[data-dojo-type="tgw/flyover"] > a');
        return {
          title: catLink.cleanText() || null,
          href: hrefFromOnClick(catLink),
          subcategories: $(this).find('.categoryList > li a').map(function(){
            return parseLink($(this));
          })
        };
      }),
    }
  }
}

function parseLink($element) {
  return {
    title: $element.cleanText() || null,
    href: $element.attr('href') || null
  };
}

function hrefFromOnClick($element){
  var onclick = $element.attr('onclick');
  var match = onclick && onclick.match(/redirectToL1\(\'(.+)\'\)/);
  if (match && match.length) {
    return match[1];
  } else {
    return null;
  }
}

// TGWM-465 Force logged in users directly to order status page
function getOrderStatusLink($){
  var link = $('#footerOrderStatusLink').attr('href') || null;
  if (/\/returns-exchanges/i.test(link)) {
    link = '/TrackOrderStatus';
  }  
  return link;
}
