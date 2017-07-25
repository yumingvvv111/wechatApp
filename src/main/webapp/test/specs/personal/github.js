// var $,jquery;
// jquery = $ = require('../lib/jquery.min');

// require('../lib/jasmine-jquery');

var accountMap = [
    'ftrdt2@163.com----aafk7180',
    'okz774@163.com----hrlo2325',
    'vobbz3@163.com----coty9506',
    'utkby6@163.com----mqlc6683',
    'ydcqd0@163.com----kugm4745',
    'cbwp54@163.com----scbe6963',
    'mfjv36@163.com----lfkf9449',
    'zry994@163.com----olgs2639',
    'uarj64@163.com----nmtz1778',
    'oeubq1@163.com----fpss1828',
    'dip461@163.com----xuzm4463',
    'aduer9@163.com----ejxl3170',
    'zuv820@163.com----ylmt6006',
    'prpv93@163.com----dbtf0176',
    'xmycc3@163.com----xiym2798',
    'kncce5@163.com----kboy2207',
    'fndg81@163.com----kvjn0582',
    'nst912@163.com----iswa0870',
    'hev197@163.com----jcaf3710',
    'hujg64@163.com----unhp0167',
    'aothx1@163.com----yiap8410',
    'vphfv9@163.com----zomy6760',
    'lbsnz0@163.com----htly8417',
    'wlvzr0@163.com----czwy3248',
    'nro708@163.com----gmlh5620',
    'daxu37@163.com----cptu9773',
    'elkl66@163.com----gclk9691',
    'snvmf4@163.com----arzv4092',
    'imo761@163.com----dedl2588',
    'lukii4@163.com----styt6707',
    'hqmhf2@163.com----zwcz1951',
    'trpp75@163.com----wewl4143',
    'iufb22@163.com----smkw1131',
    'cuxu64@163.com----rdqn2276',
    'lhbvu1@163.com----zwmo1272',
    'vnsnt3@163.com----boxa2540',
    'htg908@163.com----cqvw6090',
    'nnegq9@163.com----vxdg7551',
    'xhsnx6@163.com----kalr8928',
    'gdtyh5@163.com----rave3739',
    'mohjf0@163.com----lgyh6002',
    'hkfw84@163.com----dwjz4060',
    'oqno93@163.com----ggrp3875',
    'amzoo9@163.com----ghad5107',
    'ncvz76@163.com----xjrb9150',
    'ppqnf9@163.com----yfzz9766',
    'tsszi9@163.com----fxax1510',
    'vlztw2@163.com----algd6848',
    'govi61@163.com----dgcq8243',
    'xuqqy9@163.com----lgcf8584',
    'zltw65@163.com----zitt5285',
    'kwd331@163.com----cwjb1863',
    'qssri3@163.com----msls9424',
    'auphi4@163.com----bfht7750',
    'ebruk9@163.com----pjbj2074',
    'quwcy0@163.com----unpp0824',
    'mqdn50@163.com----fitp6618',
    'esql76@163.com----ozyn8095',
    'ukbo28@163.com----slyb2340',
    'hoqxb6@163.com----blam2624',
    'gefj20@163.com----rrbh7093',
    'prnz80@163.com----ikyd4204',
    'lirr90@163.com----dfes9225',
    'nwwbg5@163.com----wewg8825',
    'diogp0@163.com----dtkn8891',
    'qxzmt0@163.com----kkif5989',
    'sikkh3@163.com----wrwk7243',
    'hywkh4@163.com----szhw2060',
    'dpeaj7@163.com----dslh4861',
    'tvjl83@163.com----nhkz2702',
    'mvqh34@163.com----xlyr2659',
    'iqsn81@163.com----icbh9122',
    'lnxs31@163.com----hkgf1802',
    'axdia4@163.com----lvaf2579',
    'gwqew6@163.com----vxaz3449',
    'eeuay4@163.com----ijqj2574',
    'vrjrm4@163.com----luie4093',
    'scvf72@163.com----qaru8451',
    'lptu07@163.com----oars6220',
    'oqs930@163.com----tmua1447',
    'dft716@163.com----ncvs9058',
    'hjmq80@163.com----bxbp4657',
    'vib133@163.com----gbba2955',
    'nob849@163.com----tcjp0272',
    'kdd060@163.com----umlf8560',
    'twmfb9@163.com----kxkd1188',
    'brrok7@163.com----kizi1271',
    'hffdq1@163.com----vzbe3227',
    'urcym5@163.com----cwyr1198',
    'sfi667@163.com----jsma5417',
    'orrze9@163.com----tguj1052',
    'wlmpu8@163.com----bbuo5574',
    'xow970@163.com----tqhb1463',
    'ltibo0@163.com----ggfu1417',
    'buxc08@163.com----xxdo5592',
    'mza922@163.com----vggu4129',
    'ogfv64@163.com----eala5688',
    'lgww36@163.com----rctu4818',
    'svp745@163.com----zibb2331',
    'yppq71@163.com----hyso4164'
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
