module.exports = function(obj) {

  var req      = obj.req;
  var $        = obj.$;
  var partials = req.app.hbsPartials;


  //Login
  if ($('form[name="Logon"]').length) {
    disableCache();
    //Removing Elements that mess up styling
    $('.xl-heading, .ad, .title, br').remove();
    $('.myaccount_header').addClass('myaccount-header').removeClass('myaccount_header');
  }


  //Landing
  if ($('.my_account').length) {
    disableCache();
    $('.myaccount_desc').remove();

    //Sign Out Link
    var welcomeHeader = $('.myaccount_desc_title');
    var welcomeText = welcomeHeader.text();

    if (welcomeHeader.length) {
      $('#widget_breadcrumb').remove();
      welcomeHeader.html('<div class="welcome">' + welcomeText + '</div><div class="sign-out"><a href="/Logoff?catalogId=10052&myAcctMain=1&langId=-1&storeId=10151&URL=http://www.tgw.com/&deleteCartCookie=true">Sign Out</a></div>');
    }

    $('.info_table > div').removeClass('row').addClass('table-row');
    $('.info_table > div .clear_float').remove();

    $('#myAccountNavigationWidget .facetWidget').removeClass('facetWidget');

    //Causing CSS Problems on My Account Landing Page
    $('#box').removeAttr('id');

    var myAccountNav = $("#facet_nav_collapsible_my_account .content").remove();
    $('.my_account').after('<div class="my-account-nav">' + myAccountNav + '</div>');
    $('#myAccountNavigationWidget').remove();
  }

  //Edit Profile/Personal Information and Create Account
  if ($('form[name="Register"]').length) {
    disableCache();
    $('br').remove();
    $('.column').removeClass('column');
    $('input[aria-required="true"]').attr('required', '');
    $('.myaccount_header').addClass('myaccount-header').removeClass('myaccount_header');

    var accountNav = $('.my-account-nav');
    var updateBtn = $('.button_footer_line');
    if (accountNav.length && updateBtn.length) {
      accountNav.before(updateBtn);
    }

    addMyAccountBreadcrumbClass();
  }

  //Wishlist Page
  if ($('.my_account_wishlist').length) {
    disableCache();
    $('#multipleWishlistController_select').parent().removeClass('my_account_wishlist').addClass('wishlist-select-container');

    $('#myAccountNavigationWidget .facetWidget').removeClass('facetWidget');
    var myAccountNav = $("#facet_nav_collapsible_my_account .content").remove();
    $('#bb-global-footer').before('<div class="my-account-nav">' + myAccountNav + '</div>');
    $('#myAccountNavigationWidget').remove();
    $('#page').addClass('product-index');
  }

  //Order Status Page
  var orderStatusTable = $('.order_status_table');
  if (orderStatusTable.length) {
    disableCache();
    $('br').remove();
    orderStatusTable.find('th.option_1').remove();
    orderStatusTable.find('.row').removeClass('row');

    //removing nbsp;
    orderStatusTable.find('.status_column_1').each(function(){
      var innerText = $(this).text().trim();
      $(this).text(innerText);
      return this;
    });

    //No Orders
    if (orderStatusTable.find('td').length < 2) {
      orderStatusTable.addClass('no-results');
    }

    addMyAccountBreadcrumbClass();
  }

  //Order Status Details Page
  if ($('form[name="initiateReturn"]').length) {
    disableCache();
    $('#returnItem, .button_footer_line, .returnExchangeCell').remove();
    $('.row').removeClass('row');
    $('div').removeClass('acol6 col6 col3');
    $('.order_details_my_account > div:first-of-type').find('br').remove();

    var detailsTable = $('#order_details').find('tr');
    var returnsTable = $('#return_details').find('tr');
    var subTotals    = $('td.subTotal');
    var prodData = {
      returns : getTableData(returnsTable),
      shipped : getTableData(detailsTable)
    }
    prodData.shipped.subTotal = subTotals.html();

    $('#shipping').before('<p class="return-msg">Please use the Desktop version of our site if you want to return or exchange any of these items.</p>');
    returnsTable.before(partials('order-status-item', { item: prodData.returns }));
    detailsTable.before(partials('order-status-item', { item: prodData.shipped }));
    detailsTable.addClass('hide');
    returnsTable.addClass('hide');
    subTotals.addClass('hide');

    addMyAccountBreadcrumbClass();
  }

  //Address Book
  if ($('#addressBookMainDiv').length) {
    disableCache();
    var accountNav = $('.my-account-nav');
    var updateBtn = $('#WC_AjaxAddressBookForm_div_16');
    if (accountNav.length && updateBtn.length) {
      accountNav.before(updateBtn);
    }

    addMyAccountBreadcrumbClass();
  }

  function getTableData(tabledata) {
    var item = [];
    tabledata.each(function() {
      var $this = $(this);
      var prodInfo = $this.find('.th_align_left_normal');
      if (prodInfo.length === 0) {
        prodInfo = $this.find('.prod-info');
      }

      if (prodInfo.find('img').length) {
        item.push({
          img : {
            prodImg   : prodInfo.find('.img img').attr('src') || null,
            prodSpecs : prodInfo.find('.itemspecs').html() || null
          },
          data : $this.find('td:not(.prod-info)').map(function() {
            var $self = $(this);
            var title = $self.attr('class').replace('lastRow', '').trim() || null;

            if (title && title === 'tracking' && prodInfo.hasClass('th_align_left_normal')) {
              title = 'tracking-number';
            }
            return {
              title : title,
              value : $self.html() || null
            }
          })
        });
      }
    });
    return item;
  }

  function addMyAccountBreadcrumbClass() {
    $('#widget_breadcrumb').addClass('my-account-breadcrumbs');
  }

  function disableCache() {
    $('body').attr('data-bb-cache', 'false');
  }
};
