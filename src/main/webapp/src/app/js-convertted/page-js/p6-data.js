var html = require("html-loader?-attrs!../../pages/p6-board/p6-data.html");
var restAPI=require("restAPI");
var pageManager=require("pageManager");
var common=require("common");

    var paramFromURL = common.utils.getInfoFromURL().param;

    var chartJsonData = {};

    restAPI.equipmentData = {
        getEquimentData: {//圆形仪表盘接口
            url: 'equimentRest/restEquiment/equiment/getEquimentData',
            param: ['erId', 'eupId', 'mac']
        },
        getEquimentDetailData: {
            url: 'equimentRest/restEquiment/equiment/getEquimentDetailData',
            param: ['erId', 'mac', 'eupId']
        },
        changeEquipmentName: {
            url: 'equimentRest/restEquiment/equiment/position',
            param: ['eupId', 'erId', 'name']
        }
    };

    function getShareURL(chartJsonData) {
        var jsonData = JSON.stringify(chartJsonData);
        var shareURL = location.href.split('#')[0] + '#p6-play?coverPage=true&page=p6-play&share=true&data=' + jsonData;
        // history.replaceState({share:true}, '分享页', shareURL);
        return shareURL;
    }

    var scope = {
        equipmentName: '',
        onClickEquipmentName: function () {
            $('#changeNameWrapper').fadeIn(200);
        },
        onClickShare: function () {
            $('#share').fadeIn(200);
        },
        onClickShareWrapper: function () {
            $('#share').fadeOut(200);
        },
        onClickPrimary: function () {
            var name = $('#changeNameWrapper input').val();
            pageManager.requestBackend({
                url: restAPI.equipmentData.changeEquipmentName.url,
                param: {
                    name: name,
                    erId: paramFromURL.erId,
                    eupId: paramFromURL.eupId
                },
                success: function (data) {
                    $('#equipmentName').text(name.trim() === '' ? '未命名' : name);
                    pageManager.showTooltip('修改成功', 'success');
                }
            });
            $('.js_dialog').fadeOut(200);
        },
        onClickCancel: function () {
            $('.js_dialog').fadeOut(200);
        }
    };

    pageManager.initPage(html, 'p6-data', scope, afterInitPage);


    function renderChart(chartSelector, data, range) {
        // 基于准备好的dom，初始化echarts实例
        var myfirstChart = echarts.init($(chartSelector)[0]);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: data.text + '-48小时记录',
                textStyle: {
                    color: "#ffffff",
                    fontSize: 16,
                },
                x: "center",

                bottom: 0,
            },
            color: ['#ffffff'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '1%',
                right: '2%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: false,
                },
                axisLine: { //坐标轴边线颜色
                    lineStyle: {
                        color: ['#ffffff']
                    }
                },
                axisLable: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: '',
                min: range[0],
                max: range[1],
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: ['#ffffff']
                    }
                }
            }],
            series: [{
                name: 'pm2.5',
                type: 'bar',
                barWidth: '80%',
                data: data.data
            }]
        };
        myfirstChart.setOption(option);
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
        circleElement.find('.big-number').text(originalNum === null ? '--' : originalNum);
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
                circleElement.find('.small-number').text('优');
                renderWarningMessage(type, 0);
            } else if (backRange[0] < originalNum && originalNum <= backRange[1]) {
                circleElement.addClass('dial-box-yellow');
                circleElement.find('.small-number').text('中等');
                renderWarningMessage(type, 1);
            } else {
                circleElement.addClass('dial-box-red');
                circleElement.find('.small-number').text('严重');
                renderWarningMessage(type, 2);
            }

            function renderWarningMessage(type, level) {
                var textMap = {
                    ch2: [
                        '甲醛国家标准为0.1mg/m³，您所处的环境安全',
                        '您所处的环境甲醛超标，请及时采取净化措施或通风换气',
                        '您所处的环境甲醛超标严重，请立刻通风换气'
                    ],
                    tvoc: [
                        '化学污染物国家标准为0.6mg/m³，您所处的环境安全',
                        '您所处的环境化学污染物超标，请及时采取净化措施或通风换气',
                        '您所处的环境化学污染物超标严重，请立刻通风换气'
                    ],
                    pm25: [
                        'PM2.5国家标准为75μg/m³，您所处的环境安全',
                        '您所处的环境PM2.5超标，请及时采取净化措施',
                        '您所处的环境PM2.5超标严重，请立刻采取净化措施'
                    ]
                };
                var className = ['good-message', 'remind-message', 'Warning-message'][level];
                var text = textMap[type];
                if(text){
                    text = text[level];
                    var htmlStr = '<p class="'+ className +'">'+ text +'</p>';
                    $('.page-p6-data .prompt-message').append(htmlStr);
                }
            }
        }
    }


    function afterInitPage() {

        reDrawCircleBoard();
        setInterval(reDrawCircleBoard, 1000 * 60 * 5);

        function reDrawCircleBoard() {
            pageManager.requestBackend({
                url: restAPI.equipmentData.getEquimentData.url,
                param: {
                    erId: paramFromURL.erId || 0,
                    eupId: paramFromURL.eupId || 0,
                    mac: paramFromURL.mac || 0
                },
                success: function (data) {
                    var d = data.equimentData;
                    if (d && Object.prototype.toString.call(d) !== '[object Object]') {
                        pageManager.showTooltip('数据有误');
                        return;
                    }
                    var circleBoardModel = [
                        {
                            selector: '.dial-box1',
                            frontRange: [0, 999],
                            backRange: [76, 150],
                            value: d.pm25,
                            type: 'pm25',
                        },
                        {
                            selector: '.dial-box2',
                            frontRange: [0, 3],
                            backRange: [0.1, 0.19],
                            value: d.ch2,
                            type: 'ch2',
                        },
                        {
                            selector: '.dial-box3',
                            frontRange: [0, 10],
                            backRange: [0.6, 2],
                            value: d.tvoc,
                            type: 'tvoc',
                        },
                        {
                            selector: '.dial-box4',
                            frontRange: [0, 500],
                            backRange: [101, 200],
                            value: d.pollutionLevel,
                            type: 'pollutionLevel'
                        },
                        {
                            selector: '.dial-box5',
                            frontRange: [-20, 50],
                            backRange: [Infinity, Infinity],
                            value: d.temperature,
                            type: 'temperature'
                        },
                        {
                            selector: '.dial-box6',
                            frontRange: [0, 100],
                            backRange: [Infinity, Infinity],
                            value: d.humity,
                            type: 'humity'
                        }
                    ];

                    chartJsonData.circleBoardModel = circleBoardModel;
                    circleBoardModel.forEach(function (v) {
                        renderCircleBoard(v.selector, v.frontRange, v.backRange, v.value, v.type);
                    });
                    if (paramFromURL.isPrimary != 0) {
                        $('.page-p6-data #equipmentName').hide();
                    }
                    $('.page-p6-data #equipmentName').text(d.position.trim() === '' ? '未命名' : d.position);
                    chartJsonData.uploadTime = d.uploadTime;
                    renderTime(d.uploadTime, '.page-p6-data .link-info');
                    // changeHistory(chartJsonData);
                    window.shareOption.link = getShareURL(chartJsonData);

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
                }
            });
        }

        reDrawChart();
        setInterval(reDrawChart, 1000 * 60 * 60);

        function reDrawChart() {
            pageManager.requestBackend({
                url: restAPI.equipmentData.getEquimentDetailData.url,
                param: {
                    erId: paramFromURL.erId,
                    mac: paramFromURL.mac,
                    eupId: paramFromURL.eupId
                },
                success: function (data) {
                    var d = data.equimentDetailData;
                    if (d && Object.prototype.toString.call(d) !== '[object Object]') {
                        pageManager.showTooltip('数据有误');
                        return;
                    }
                    d = convertData(d);
                    var chartModel = [
                        {
                            selector: '#first-echart-box',
                            data: d.ch2,
                            text: '甲醛',
                            range: [0, 2 + 1]
                        },
                        {
                            selector: '#second-echart-box',
                            data: d.pollutionLevel,
                            text: '污染指数',
                            range: [0, 500 + 20]
                        },
                        {
                            selector: '#three-echart-box',
                            data: d.tvoc,
                            text: '化学污染物',
                            range: [0, 10 + 5]
                        },
                        {
                            selector: '#four-echart-box',
                            data: d.humity,
                            text: '湿度',
                            range: [0, 100 + 10]
                        },
                        {
                            selector: '#five-echart-box',
                            data: d.pm25,
                            text: 'PM2.5',
                            range: [0, 1000 + 30]
                        },
                        {
                            selector: '#six-echart-box',
                            data: d.temperature,
                            text: '温度',
                            range: [-20, 50 + 10]
                        }
                    ];
                    chartModel.forEach(function (v) {
                        renderChart(v.selector, v, v.range);
                    });

                    function convertData(data) {
                        var obj = {};
                        for (var name in data) {
                            var item = data[name];
                            obj[name] = [];
                            for (var i = 0, len = item.length; i < len; i++) {
                                obj[name].push(item[i].value);
                            }
                        }
                        return obj;
                    }
                }
            });
        }


    }

