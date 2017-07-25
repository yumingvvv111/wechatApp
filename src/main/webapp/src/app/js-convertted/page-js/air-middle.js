var html = require("html-loader?-attrs!../../pages/air-cat/air-middle.html");
var pageManager=require("pageManager");

    pageManager.initPage(html, 'air-middle');

    // 基于准备好的dom，初始化echarts实例
    var myfirstChart = echarts.init($('.air-middle #first-echart-box')[0]);
    // 指定图表的配置项和数据
    var data1 = [150, 52, 200, 334, 390, 330, 220, 333, 56, 34, 55, 67, 98, 235, 342, 454, 231, 56, 78, 352, 231, 35, 66, 68, 150, 52, 200, 334, 390, 330, 220, 333, 56, 34, 55, 67, 98, 235, 342, 454, 231, 56, 78, 352, 231, 35, 66, 68]
    var option = {
        title: {
            text: 'PM2.5-48小时记录',
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
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: false,
                },
                axisLine: {//坐标轴边线颜色
                    lineStyle: {
                        color: ['#ffffff']
                    }
                },
                axisLable: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                min: 0,
                max: 500,
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: ['#ffffff']
                    }
                }
            }
        ],
        series: [
            {
                name: 'pm2.5',
                type: 'bar',
                barWidth: '80%',
                data: data1  //数据数据
            }
        ]
    };
    myfirstChart.setOption(option);
    //		第二个柱状图
    var mynextChart = echarts.init($('.air-middle #next-echart-box')[0]);
    var data2 = [150, 152, 280, 134, 350, 230, 220, 98, 56, 34, 55, 167, 198, 235, 142, 454, 331, 156, 178, 352, 231, 315, 166, 168, 150, 152, 200, 334, 390, 330, 220, 333, 156, 134, 55, 167, 98, 235, 342, 454, 231, 56, 78, 352, 231, 135, 166, 68]
    var option = {
        title: {
            text: 'PM10-48小时记录',
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
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow',    // 默认为直线，可选为：'line' | 'shadow'
                label: {
                    textStyle: {
                        color: '#fff',
                    }
                }
            }
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: false,
                },
                axisLine: {//坐标轴边线颜色
                    lineStyle: {
                        color: ['#ffffff']
                    }
                },
                axisLable: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                min: 0,
                max: 500,
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: ['#ffffff']
                    }
                }
            }
        ],
        series: [
            {
                name: 'pm10',
                type: 'bar',
                barWidth: '80%',
                data: data2  //数据数据
            }
        ]
    };
    mynextChart.setOption(option);

    $(function () {
        $('#showIOSDialog1').click(function () {
            $('#iosDialog1').fadeIn(200);
        });

        $('#dialogs').on('click', '.weui-dialog__btn', function () {
            $(this).parents('.js_dialog').fadeOut(200);
        });
    });

    $(function () {
        $('.dial-box').each(function (index, el) {
            var num = $(this).find('.big-number').text() * 0.36;
            if (num <= 500) {
                $(this).find('.out-cricle').css('transform', "rotate(" + num + "deg)");
            } else {
                $(this).find('.out-cricle').css('transform', "rotate(180deg)");

            }
            ;
        });
    });

