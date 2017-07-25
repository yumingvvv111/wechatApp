var html = require("html-loader?-attrs!../../pages/binding-description/binding-description.html");
var pageManager=require("pageManager");

    var scope = {
        onClickPrimary: function(){
            wx.closeWindow();
        }
    };

    pageManager.initPage(html, 'binding-description', scope);

