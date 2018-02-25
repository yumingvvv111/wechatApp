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
                renderCircleBoard(v.selector, v.frontRange, v.backRange, v.value, v.type);
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
        //具体数字
        var originalNum = parseFloat(value);
        //获得数字旋转度数
        var num = 180 * (originalNum - minA) / (maxA - minA);
        circleElement.find('.big-number').text(isNaN(originalNum) ? '--' : value);
        if (isNaN(originalNum)) {
            num = 0
        }
        if (num <= 180) {
            animateIt(circleElement, num);
        } else {
            animateIt(circleElement, 180);
        }
        function animateIt(circleElement, num) {
            var $element = circleElement.find('.out-cricle');
            $element.attr({style: "transform: rotate(0deg)"});
            setTimeout(function () {
                $element.attr({style: "transform: rotate(" + num + "deg); transition: all 2s ease"});
            }, 500);
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
                    //chenhui添加修改originalNum > stages[i]
                    if (originalNum >= stages[i] && originalNum <= stages[j]) {
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
            function getText(index) {
                var levelMap = [
                    ['安全', '优'],
                    ['轻度', '中等'],
                    ['重度', '严重']
                ];
                return (type === 'ch2' || type === 'tvoc' || type === 'pollutionLevel') ? levelMap[index][0] : levelMap[index][1];
            }

            if (originalNum < backRange[0]) {
                circleElement.addClass('dial-box-blue');
                circleElement.find('.small-number').text(getText(0));
                renderWarningMessage(type, 0);
            } else if (backRange[0] <= originalNum && originalNum < backRange[1]) {
                circleElement.addClass('dial-box-yellow');
                circleElement.find('.small-number').text(getText(1));
                renderWarningMessage(type, 1);
            } else {
                circleElement.addClass('dial-box-red');
                circleElement.find('.small-number').text(getText(2));
                renderWarningMessage(type, 2);
            }

            function renderWarningMessage(type, level) {
                var textMap = {
                    ch2: {
                        name: '甲醛',
                        standard: '0.1mg/m³',
                        solution: '净化措施或通风换气',
                        justDoIt: '通风换气'
                    },
                    tvoc: {
                        name: '化学污染物',
                        standard: '0.6mg/m³',
                        solution: '净化措施或通风换气',
                        justDoIt: '通风换气'
                    },
                    pm25: {
                        name: 'PM2.5',
                        standard: '75μg/m³',
                        solution: '净化措施',
                        justDoIt: '净化措施'
                    }
                };
                var textMapTemplates = [
                    '{{name}}国家标准为{{standard}}，您所处的环境安全。请继续保持哦！',
                    '您所处的环境{{name}}超标，请及时采取{{solution}}。说真的，我都替你着急！',
                    '您的您所处的环境{{name}}超标严重，请立刻{{justDoIt}}。赶紧的吧！急死我了！！'
                ];
                for (var name in textMap) {
                    var arr = [];
                    var data = textMap[name];
                    textMapTemplates.forEach(function (v2) {
                        var resultText = v2.replace(/\{\{([^\{]+)\}\}/g, function(m0, m1){
                            return data[m1];
                        });
                        arr.push(resultText);
                    });
                    textMap[name] = arr;
                }
                var className = ['good-message', 'remind-message', 'Warning-message'][level];
                var text = textMap[type];
                if (text) {
                    text = text[level];
                    var htmlStr = '<p class="' + className + '">' + text + '</p>';
                    $('.page-p6-data').find('.' + type + '-message').html(htmlStr);
                }
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