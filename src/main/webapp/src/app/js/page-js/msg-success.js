define(['html!pages/msg-success.html', 'restAPI', 'pageManager', 'common'], function (html, restAPI, pageManager, common) {

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


});