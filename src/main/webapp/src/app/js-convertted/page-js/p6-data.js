var html = require("html-loader?-attrs!../../pages/p6-board/p6-data.html");
var restAPI=require("restAPI");
var pageManager=require("pageManager");
var common=require("common");

    var paramFromURL = common.utils.getInfoFromURL().param;

    var chartJsonData = {};

    restAPI.equipmentData = {
        getEquimentData: {//圆形仪表盘接口
            url: 'equimentRest/restEquiment/equimentData/getEquimentData',
            param: ['erId', 'eupId', 'mac']
        },
        getEquimentDetailData: {
            url: 'equimentRest/restEquiment/equimentData/getEquimentDetailData',
            param: ['erId', 'mac', 'eupId']
        },
        changeEquipmentName: {
            url: 'equimentRest/restEquiment/equiment/position',
            param: ['eupId', 'erId', 'name']
        },
        //关机
        clientOFF: {
            url: 'equimentRest/restEquiment/equimentComm/off',
            param: ['mac', 'eupId']
        },
        //设备常量
        sheScreen: {
            url: 'equimentRest/restEquiment/equimentComm/bright',
            param: ['mac', 'eupId']
        },
        //设备常量关闭
        sheScreenOFF: {
            url: 'equimentRest/restEquiment/equimentComm/OffBright',
            param: ['mac', 'eupId']
        },
        getTicket: {
            // url: 'http://wwwv.applinzi.com/movieEnglishService/getSignature.php'
            url: 'equimentRest/restEquiment/weixin/getTicket'
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
        onClickShutdown: function () {
            $(this).before("<div class='hide-box'></div>");
            $('.hide-box').fadeOut(28000);

            pageManager.ajaxManager({
                url: restAPI.equipmentData.clientOFF.url,
                data: {
                    mac: paramFromURL.mac,
                    eupId: paramFromURL.eupId
                },
                success: function (data) {
                    if (data.code != 0) {
                        alert(data.message);
                    } else {
                        alert("设备关闭成功!");
                        // renderChart(res.data);
                    }
                    $('.hide-box').remove();
                }
            });
        },
        //设备关闭
        onClickSheScreenOFF: function () {
            $('#p6DataSheScreen').hide();

            $(this).before("<div class='hide-box2'></div>");
            $('.hide-box2').fadeOut(28000);

            pageManager.ajaxManager({
                url: restAPI.equipmentData.sheScreenOFF.url,
                data: {
                    mac: paramFromURL.mac,
                    eupId: paramFromURL.eupId
                },
                success: function (data) {
                    if (data.code != 0) {

                        alert(data.message);
                        if (1001 == data.code) {
//                    	   $('#p6DataSheScreenOff').fadeOut();
//                           $('#p6DataSheScreen').fadeIn();
                            $('#p6DataSheScreenOff').hide();
                            $('#p6DataSheScreen').show();
                        }

                    } else {
                        $('#p6DataSheScreenOff').hide();
                        $('#p6DataSheScreen').show();
                    }

                    $('.hide-box2').remove();
                }
            });
            //shutdown();

        },
        //设备常亮
        onClickSheScreen: function () {
            $('#p6DataSheScreenOff').hide();
            $(this).before("<div class='hide-box2'></div>");
            $('.hide-box2').fadeOut(28000);

            pageManager.ajaxManager({
                url: restAPI.equipmentData.sheScreen.url,
                data: {
                    mac: paramFromURL.mac,
                    eupId: paramFromURL.eupId
                },
                success: function (data) {

                    if (data.code != 0) {
                        $('.hide-box').remove();
                        alert(data.message);
                        if (1001 == data.code) {
//                        	   $('#p6DataSheScreen').fadeOut();
//                               $('#p6DataSheScreenOff').fadeIn();
                            $('#p6DataSheScreen').hide();
                            $('#p6DataSheScreenOff').show();
                        }
                    } else {
                        // renderChart(res.data);
//                        $('#p6DataSheScreen').fadeOut();
//                        $('#p6DataSheScreenOff').fadeIn();
                        $('#p6DataSheScreen').hide();
                        $('#p6DataSheScreenOff').show();
                    }

                    $('.hide-box2').remove();
                }
            });
            //  shutdown();

        },
        onClickPrimary: function () {
            var name = $('#changeNameWrapper input').val();
            if (name.length > 16) {
                alert("设备名称不能超过16位");
            }
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
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
            //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            //     }
            // },
            grid: {
                left: '40',
                right: '2%',
                bottom: '60',
                containLabel: false
            },
            xAxis: [{
                type: 'category',
                data: data.data.x,
                axisTick: {
                    alignWithLabel: true,
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
                // min: range[0],
                // max: range[1],
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: ['#ffffff']
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: ['#ffffff']
                    }
                }
            }],
            series: [{
                name: 'pm2.5',
                type: 'bar',
                barWidth: 5,
                data: data.data.y
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


    function afterInitPage() {
        pageManager.setRefreshPage(['p6-data'], function () {
            reDrawCircleBoard();
            reDrawChart();
        });
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
                            backRange: [0.1, 0.2],
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
                            backRange: [101, 201],
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
                        $('.page-p6-data #p6DataShutdown').hide();
                        $('.page-p6-data #p6DataSheScreenOff').hide();
                        $('.page-p6-data #p6DataSheScreen').hide();
                    }
                    try {
                        $('.page-p6-data #equipmentName').text((chartJsonData.equipmentName = d.position.trim() === '' ? '未命名' : d.position));
                        chartJsonData.uploadTime = d.uploadTime;
                        renderTime(d.uploadTime, '.page-p6-data .link-info');
                    } catch (ex) {
                    }
                    // changeHistory(chartJsonData);
                    window.shareOption.link = getShareURL(chartJsonData);

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
                    // data = {
                    //     "equimentDetailData": {
                    //         "ch2": [
                    //             {
                    //                 "time": "123100",
                    //                 "value": "1.5"
                    //             },
                    //             {
                    //                 "time": "123109",
                    //                 "value": "1.7"
                    //             },
                    //             {
                    //                 "time": "123110",
                    //                 "value": "0.5"
                    //             },
                    //             {
                    //                 "time": "010123",
                    //                 "value": "0.5"
                    //             },
                    //             {
                    //                 "time": "010122",
                    //                 "value": "0.5"
                    //             }
                    //         ],
                    //         "pollutionLevel": [],
                    //         "tvoc": [],
                    //         "humity": [],
                    //         "pm25": [],
                    //         "temperature": []
                    //     }
                    // };
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
                            range: [0, 2 + 2]
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
                            text: 'TVOC',
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

                    //对原始数据进行转换
                    function convertData(data) {
                        var obj = {};
                        for (var name in data) {
                            var items = data[name];
                            var itemLength = items.length;
                            var timeRegex = /(\d{2})(\d{2})(\d{2})/;
                            var timeAmount = 48;
                            var dataArray = new Array(timeAmount);
                            obj[name] = {x: [], y: []};
                            //如果当前柱形图有数据
                            if (itemLength > 0) {
                                //先对数据排序, 注意12月31日和第二年1月1日跨年的问题
                                items = items.sort(function (a, b) {
                                    var reg = timeRegex;
                                    var v1 = a.time.match(reg);
                                    var v2 = b.time.match(reg);
                                    var r1 = parseInt(v1[1]) - parseInt(v2[1]);
                                    var r2 = parseInt(v1[2]) - parseInt(v2[2]);
                                    var r3 = parseInt(v1[3]) - parseInt(v2[3]);
                                    if (r1 === 0) {
                                        if (r2 === 0) {
                                            return r3
                                        } else {
                                            return r2;
                                        }
                                    } else {
                                        if (Math.abs(r1) > 2) {//当跨年情况出现时月份(1月)小的反而排在后边
                                            return -r1;
                                        } else {
                                            return r1;
                                        }
                                    }
                                });
                                var n = timeAmount - 1;
                                var rightSideItem = items.pop();
                                var itemMatch = rightSideItem.time.match(timeRegex);
                                var maxTime = parseInt(itemMatch[3]);
                                var maxDay = parseInt(itemMatch[2]);
                                var maxMonth = parseInt(itemMatch[1]);
                                var _time;
                                var _value;
                                do {
                                    _time = (maxMonth < 10 ? ('0' + maxMonth) : maxMonth.toString()) + (maxDay < 10 ? ('0' + maxDay) : maxDay.toString()) + (maxTime < 10 ? ('0' + maxTime) : maxTime.toString());
                                    _value = 0;
                                    dataArray[n] = {
                                        time: _time,
                                        value: _value
                                    };

                                    if (rightSideItem && rightSideItem.time === _time) {
                                        dataArray[n].value = rightSideItem.value;
                                        rightSideItem = items.pop();
                                    }

                                    if (--maxTime < 0) {
                                        maxTime = 23;
                                        if (maxDay === 1 && maxMonth === 1) {
                                            maxDay = 31;
                                            maxMonth = 12;
                                        } else {
                                            maxDay -= 1;
                                        }
                                    }
                                } while (n--)
                                for (var i = 0, len = dataArray.length; i < len; i++) {
                                    var _t = dataArray[i].time.match(timeRegex)[3] + ':00';
                                    obj[name].x.push(_t);
                                    obj[name].y.push(dataArray[i].value);
                                }
                            }

                        }
                        return obj;
                    }
                }
            });
        }


    }

    //获取jsSDK的 ticket
    function getTicket() {
        var dfd = new $.Deferred();
        pageManager.ajaxManager({
            url: restAPI.equipmentData.getTicket.url,
            type: 'post',
            data: {
                url: location.href.split('#')[0]//encodeURIComponent(location.href.split('#')[0])
            },
            dataType: 'json',
            success: function (res) {
                if (res.code === 0) {
                    dfd.resolve(res.data);
                }
            },
            fail: function (ex) {
                dfd.reject(ex);
            }
        });

        return dfd.promise();
    }

    getTicket().then(function (res) {
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
    });

