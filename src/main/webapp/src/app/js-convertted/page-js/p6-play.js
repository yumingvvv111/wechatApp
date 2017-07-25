var html = require("html-loader?-attrs!../../pages/p6-board/p6-play.html");
var restAPI=require("restAPI");
var pageManager=require("pageManager");
var common=require("common");


    var paramFromURL = common.utils.getInfoFromURL().param;

    var scope = {
        equipmentName: ''
    };

    pageManager.initPage(html, 'p6-play', scope, afterInitPage);


    function afterInitPage() {
        $('.page-p6-play #equipmentName').hide();
        if(paramFromURL.coverPage){
            var data = JSON.parse(paramFromURL.data);
            var circleBoardModel = data.circleBoardModel;
            circleBoardModel.forEach(function (v) {
                renderCircleBoard(v.selector, v.frontRange, v.backRange, v.value);
            });
            renderTime(data.uploadTime, '.pape-p6-play .ink-info');
        }
    }


    function renderCircleBoard(selector, frontRange, backRange, value) {
        var circleElement = $(selector);
        //最小值
        var minA = frontRange[0];
        //最大值
        var maxA = frontRange[1];
        //一个数字平均旋转度数
        var meanA = 180 / (maxA - minA);
        //具体数字
        var originalNum = value;
        var num = (originalNum || 0) * meanA;
        circleElement.find('.big-number').text(originalNum === null ? '--' : originalNum);
        if (num <= 180) {
            circleElement.find('.out-cricle').css('transform', "rotate(" + num + "deg)");
        } else {
            circleElement.find('.out-cricle').css('transform', "rotate(180deg)");
        }
        //判断背景环颜色
        if (isNaN(originalNum)) {
            circleElement.addClass('dial-box-white');
        } else {
            if (originalNum <= backRange[0]) {
                circleElement.addClass('dial-box-blue');
            } else if (backRange[0] < originalNum && originalNum <= backRange[1]) {
                circleElement.addClass('dial-box-yellow');
            } else {
                circleElement.addClass('dial-box-red');
            }
        }
    }


    function renderTime(_time, selector) {
        var _time2 = (new Date()).getTime();
        _time = _time2 - _time;
        if (_time < 60 * 1000) {
            _time = parseInt(_time / 1000) + '秒前'
        } else if (_time >= 60 * 1000 && _time < 60 * 60 * 1000) {
            _time = parseInt(_time / (60 * 1000)) + '分钟前'
        } else if (_time >= 60 * 60 * 1000 && _time < 60 * 60 * 24 * 1000) {
            _time = parseInt(_time / (60 * 60 * 1000)) + '小时前'
        } else {
            _time = parseInt(_time / (60 * 60 * 24 * 1000)) + '天前'
        }
        $(selector).text(_time);
    }


