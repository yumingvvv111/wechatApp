var html = require("html-loader?-attrs!../../pages/invalid-page/invalid-page.html");
var pageManager=require("pageManager");

    pageManager.initPage(html, 'invalid-page');

