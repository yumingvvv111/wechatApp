var html = require("html-loader?-attrs!../../pages/msg-success.html");
var restAPI=require("restAPI");
var pageManager=require("pageManager");
var common=require("common");

    var paramFromURL = common.utils.getInfoFromURL().param;

    var scope = {
        title: paramFromURL.title || '操作成功!',
        desc: paramFromURL.desc || '',
        primaryButtonText: '返回',
        footerText: '',
        onClickPrimary: function () {
            wx.closeWindow();
        }
    };

    pageManager.initPage(html, 'p6-data', scope);


