define(['css!style/p2-style', 'css!style/page-css/binding-apply', 'html!pages/binding-apply/binding-apply.html', 'restAPI', 'pageManager', 'common'], function (c1, c2, html, restAPI, pageManager, common) {

    var paramFromURL = common.utils.getInfoFromURL().param;

    var time = paramFromURL.time;
    var now = new Date().getTime();
    var s = (now - time) / (1000 * 60);
    if(s>=3600){
        location.hash = 'invalid-page';
    }

    restAPI.bind = {
        agreeBinding: {
            url: 'equimentRest/restEquiment/equiment/isAgree',
            param: ['secondaryWxId', 'isAgree', 'nickName', 'pkId']
        }
    };

    function postData(param){
        pageManager.ajaxManager({
            //hostIndex: 2,
            url: restAPI.bind.agreeBinding.url + '?' + common.utils.paramToString(param),
            data: param,
            type: 'post',
            success: function (res) {
                if (res.code != 0) {
                    console.warn(res);
                    pageManager.showTooltip(res.message);
                } else {
                    // renderChart(res.data);
                    pageManager.go(encodeURI('msg-success?title=恭喜您链接成功!'));
                }
            }
        });
    }

    var scope = {
        nickName: paramFromURL.nickName,
        roomName: paramFromURL.roomName,
        mac: paramFromURL.mac,
        product_name: paramFromURL.product_name,
        paramFromURL: paramFromURL,
        onClickAgree: function () {
            var param = {
                secondaryWxId: paramFromURL.secondaryWxId,
                isAgree: 0,
                nickName: paramFromURL.nickName,
                pkId: paramFromURL.pkId
            };
            postData(param);
        },
        onClickDisagree: function () {
            var param = {
                secondaryWxId: paramFromURL.secondaryWxId,
                isAgree: 1,
                nickName: paramFromURL.nickName,
                pkId: paramFromURL.pkId
            };
            postData(param);
        }
    };

    pageManager.initPage(html, 'binding-apply', scope);

});