define(['css!style/p2-style', 'css!style/page-css/p6-data', 'css!style/page-css/p6-play', 'html!pages/p6-board/p6-play.html', 'restAPI', 'pageManager', 'common'], function (c1, c2, c3, html, restAPI, pageManager, common) {


    var paramFromURL = common.utils.getInfoFromURL().param;
    var jsonData = JSON.parse(paramFromURL.data);

    var scope = {
        equipmentName: jsonData.equipmentName
    };

    pageManager.initPage(html, 'p6-play', scope, afterInitPage);


    function afterInitPage() {
        if(paramFromURL.coverPage){
            var data = jsonData;
            var circleBoardModel = data.circleBoardModel;
            circleBoardModel.forEach(function (v) {
                renderCircleBoard(v.selector, v.frontRange, v.backRange, v.value);
            });
            renderTime(data.uploadTime, '.page-p6-play .link-info');
        }
    }


    function renderCircleBoard(selector, frontRange, backRange, value, type) {
        var circleElement = $(selector);
        //最小值
        var minA = frontRange[0];
        //最大值
        var maxA = frontRange[1];
        //一个数字平均旋转度数
        var meanA = 180 / (maxA - minA);
        //具体数字
        var originalNum = parseFloat(value);
        var num = (originalNum || 0) * meanA;
        circleElement.find('.big-number').text(isNaN(originalNum) ? '--' : originalNum);
        if (num <= 180) {
            animateIt(circleElement, num);
        } else {
            animateIt(circleElement, 180);
        }
        function animateIt(circleElement, num) {
            var $element = circleElement.find('.out-cricle');
            var n = 0;

            function step() {
                n += 2;
                if (n > 180) {
                    n = 180;
                }
                $element.css('transform', "rotate(" + n + "deg)");
                if (n < num) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }

        //判断背景环颜色
        if (isNaN(originalNum)) {
            circleElement.addClass('dial-box-white');
        } else {
            //hack pm2.5
            if (selector === '.dial-box1') {
                var stages = [0, 35, 75, 115, 150, 250, 1000];
                var stageName = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'];
                var colorStage = [75, 150];
                var colorName = '';

                for (var i = 0, j = i + 1; i < stages.length - 1; i++, j = i + 1) {
                    if (originalNum > stages[i] && originalNum <= stages[j]) {
                        circleElement.find('.small-number').text(stageName[i]);
                        if (originalNum <= colorStage[0]) {
                            colorName = 'dial-box-blue';
                            renderWarningMessage(type, 0);
                        } else if (originalNum > colorStage[0] && originalNum <= colorStage[1]) {
                            colorName = 'dial-box-yellow';
                            renderWarningMessage(type, 1);
                        } else {
                            colorName = 'dial-box-red';
                            renderWarningMessage(type, 2);
                        }
                        break;
                    }
                }
                circleElement.addClass(colorName);
                return;
            }
            if (originalNum <= backRange[0]) {
                circleElement.addClass('dial-box-blue');
                circleElement.find('.small-number').text((type === 'ch2' || type === 'tvoc')? '安全' : '优');
                renderWarningMessage(type, 0);
            } else if (backRange[0] < originalNum && originalNum <= backRange[1]) {
                circleElement.addClass('dial-box-yellow');
                circleElement.find('.small-number').text((type === 'ch2' || type === 'tvoc')? '轻度' : '中等');
                renderWarningMessage(type, 1);
            } else {
                circleElement.addClass('dial-box-red');
                circleElement.find('.small-number').text((type === 'ch2' || type === 'tvoc')? '重度' : '严重');
                renderWarningMessage(type, 2);
            }

            function renderWarningMessage(type, level) {

            }
        }
    }


    function renderTime(_time, selector) {
        // var _time2 = (new Date()).getTime();
        // _time = _time2 - _time;
        // if (_time < 60 * 1000) {
        //     _time = parseInt(_time / 1000) + '秒前'
        // } else if (_time >= 60 * 1000 && _time < 60 * 60 * 1000) {
        //     _time = parseInt(_time / (60 * 1000)) + '分钟前'
        // } else if (_time >= 60 * 60 * 1000 && _time < 60 * 60 * 24 * 1000) {
        //     _time = parseInt(_time / (60 * 60 * 1000)) + '小时前'
        // } else {
        //     _time = parseInt(_time / (60 * 60 * 24 * 1000)) + '天前'
        // }
        $(selector).text(_time || 0);
    }


});