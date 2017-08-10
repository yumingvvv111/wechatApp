define(function (require) {
    var common = require('common');
    var restAPI = require('restAPI');
    window.pageManager = require('pageManager');
    var defaultPage = 'air-good';
    var utils = common.utils;
    var paramFromInfo = utils.getInfoFromURL();
    restAPI.accessPermission = {
        getWxId: {
            url: 'equimentRest/restEquiment/pageToken/getCode',
            param: ['code']
        },
        getTicket: {
            // url: 'http://wwwv.applinzi.com/movieEnglishService/getSignature.php'
            url: 'equimentRest/restEquiment/weixin/getTicket'
        }
    };


    //把code和微信id暴露为全局常量
    window.CODE = paramFromInfo.param.code;
    window.WXID = paramFromInfo.param.wxId;
    window.shareURL = location.href;
    window.shareOption = {
        title: document.title,
        desc: '空气猫检测系列管理平台',
        link: location.href,
        imgUrl: paramFromInfo.path + 'equimentRest/dist/app/images/product02.jpg'
    };//分享参数


    function getWxId() {
        var dfd = new $.Deferred();
        if (WXID) {
            dfd.resolve({wxId: WXID, from: 'url'});
        } else if (CODE) {
            pageManager.ajaxManager({
                url: restAPI.accessPermission.getWxId.url,
                data: {
                    code: CODE
                },
                type: 'get',
                success: function (res) {
                    if (res.code === 0) {
                        var _wxId = res.data.WXId;
                        window.WXID = _wxId;
                        dfd.resolve({wxId: _wxId, from: 'code'});
                    } else {
                        dfd.reject(res.data);
                    }
                },
                fail: function (ex) {
                    dfd.reject(ex);
                }
            });
        } else {
            dfd.reject(WXID);
        }
        return dfd.promise();
    }


   /* //获取jsSDK的 ticket
    function getTicket() {
        var dfd = new $.Deferred();
        pageManager.ajaxManager({
            url: restAPI.accessPermission.getTicket.url,
            type: 'post',
            data: {
                url: location.href.split('#')[0]//encodeURIComponent(location.href.split('#')[0])
            },
            dataType: 'json',
            success: function (res) {
                if(res.code === 0){
                    dfd.resolve(res.data);
                }
            },
            fail: function (ex) {
                dfd.reject(ex);
            }
        });

        return dfd.promise();
    }*/


    getWxId().then(function (data) {
        if (data && data.from === 'code') {
            history.replaceState({}, 'home', location.href.replace(/code=(.*?)(?=&|$|#)/, 'wxId=' + window.WXID));
            location.reload();
            return;
        }
        var page = paramFromInfo.hash || defaultPage;
        pageManager._go(page);
        $(window).on('hashchange', pageManager.onHashChange);
    }, function () {
        pageManager.showTooltip('"微信绑定超时数据异常！请返回主页从新登录！错误代码：1", "error"');
        // pageManager._go(defaultPage);
    });

    /*getTicket().then(function (res) {
        wx.config({
            beta: true,
            debug: false,
            appId: res.appid,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                // 'startRecord',
                // 'stopRecord',
                // 'onVoiceRecordEnd',
                // 'playVoice',
                // 'pauseVoice',
                // 'stopVoice',
                // 'onVoicePlayEnd',
                // 'uploadVoice',
                // 'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                // 'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                // 'hideOptionMenu',
                // 'showOptionMenu',
                // 'hideMenuItems',
                // 'showMenuItems',
                // 'hideAllNonBaseMenuItem',
                // 'showAllNonBaseMenuItem',
                'closeWindow',
                // 'scanQRCode',
                // 'chooseWXPay',
                // 'openProductSpecificView',
                // 'addCard',
                // 'chooseCard',
                // 'openCard'
            ]
        });


        wx.ready(function () {
            wx.invoke('setNavigationBarColor', {
                color: 'green'
            });

            wx.onMenuShareTimeline(window.shareOption);
            wx.onMenuShareQQ(window.shareOption);
            wx.onMenuShareAppMessage(window.shareOption);

        });
    }, function () {
        console.warn('获取js ticket失败');
    });*/


});
