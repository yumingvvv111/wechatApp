define(['css!style/p2-style', 'css!style/page-css/binding-description', 'html!pages/binding-description/binding-description.html', 'pageManager'], function (c1, c2, html, pageManager) {

    var scope = {
        onClickPrimary: function(){
            wx.closeWindow();
        }
    };

    pageManager.initPage(html, 'binding-description', scope);

});