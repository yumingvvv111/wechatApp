var html = require("html-loader?-attrs!../../pages/binding-apply/binding-apply.html");
var restAPI=require("restAPI");
var pageManager=require("pageManager");
var common=require("common");

    var paramFromURL = common.utils.getInfoFromURL().param;

    /*var time = paramFromURL.time;
    var now = new Date().getTime();
    var s = (now - time) / (1000 * 60);
    if(s>=3600){
        location.hash = 'invalid-page';
    }*/

    restAPI.bind = {
        agreeBinding: {
            url: 'equimentRest/restEquiment/equiment/isAgree',
            param: ['secondaryWxId', 'isAgree', 'nickName', 'pkId','time']
        },
        isExpired: {
            url: 'equimentRest/restEquiment/equiment/isExpired',
            param: ['time']
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
                    pageManager.go(encodeURI('msg-success?title=操作成功!'));
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
        time: paramFromURL.time,
        onClickAgree: function () {
            var param = {
                secondaryWxId: paramFromURL.secondaryWxId,
                isAgree: 0,
                nickName: paramFromURL.nickName,
                pkId: paramFromURL.pkId,
                time:paramFromURL.time
            };
            postData(param);
        },
        onClickDisagree: function () {
            var param = {
                secondaryWxId: paramFromURL.secondaryWxId,
                isAgree: 1,
                nickName: paramFromURL.nickName,
                pkId: paramFromURL.pkId,
                time:paramFromURL.time
            };
            postData(param);
        }
    };

    afterInitPage();

    function afterInitPage() {
        var param = {  time:paramFromURL.time
        };
        pageManager.ajaxManager({
            //hostIndex: 2,
            url: restAPI.bind.isExpired.url,
            data: param,
            type: 'post',
            success: function (res) {
                if (res.code != 0) {
                    location.hash = 'invalid-page';
                } else {
                    pageManager.initPage(html, 'binding-apply', scope);
                }
            }
        });
    }

