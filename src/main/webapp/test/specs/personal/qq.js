// var $,jquery;
// jquery = $ = require('../lib/jquery.min');

// require('../lib/jasmine-jquery');

var accountMap = [
    {
        nick: 'yumingvvv111',
        password: 'cctv1983',
        pass_again: 'cctv1983'
    }
];


describe('Personal Test', function () {

    it('goto github', function () {
        accountMap.forEach(function (v) {
            browser.url('https://github.com/');
            $$('.site-header-link')[1].click();
            var match = v.match(/^\s*((.*?)\@.*?\.com)----(\w+)/);
            var email = match[1];
            var password = match[3] + '123456';
            var userName = match[2] + '010';//Math.round(Math.random()*1000);
            $('#user_login').setValue(userName);
            $('#user_email').setValue(email);
            $('#user_password').setValue(password);
            $('#signup_button').click();
            var continueButton = $('.js-choose-plan-submit');
            continueButton.waitForExist(2000);
            continueButton.click();
            browser.timeoutsImplicitWait(2000);
            $('.alternate-action').click();
            browser.url('https://github.com/sstm888/webapp2go');

            //click start
            browser.execute(`
            document.getElementsByClassName('btn-with-count')[0].click();
            document.getElementsByClassName('select-menu-item')[1].click();     
            document.getElementsByClassName('btn-with-count')[2].click();
`);


            //sign out
            $$('.header-nav-item')[6].$('a').click();
            $('.dropdown-signout').click();
            browser.pause(3000);
        });

    });

});


// $('.k-grid-content')[0].onscroll = function (e) {
//     var scrollLeft = this.scrollLeft;
//     var tableWrapperWidth = $(this).width();
//     var tableElement = $(this).find('table');
//     tableElement.find('tr>td:last-child').each(function (i, e) {
//         var lastTD = $(e);
//         var lastTdInnerWrapper = lastTD.find('.last-td-wrapper');
//         if (lastTdInnerWrapper.length === 0) {
//             lastTD.wrapInner('<div class="last-td-wrapper"></div>');
//         }
//         lastTD.css('position', 'relative');
//         lastTdInnerWrapper.css({position: 'relative', right: (tableElement.width() - tableWrapperWidth - scrollLeft)});
//
//     });
// }
