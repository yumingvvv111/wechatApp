var html = require("html-loader?-attrs!../../pages/user-equipment.html");
var restAPI=require("restAPI");
var pageManager=require("pageManager");

    restAPI.equipment = {
        unbind: {
            url: 'equimentRest/restEquiment/equiment/unbind',
            param: ['pkId', 'bindType']
        },
        equipmentList: {
            url: 'equimentRest/restEquiment/equiment/list',
            param: ['wxId']
        }
    };

    var scope = {
        equipmentList: [{
            "isPrimary": 0,
            "roomName": "无数据",
            "pk_id": 11,
            "mac": "--"
        }],
        onClickUnbind: function (event, data) {
            $('#iosDialog1').fadeIn(200).attr('data-pkId', data.eupId).attr('data-bindType', data.isPrimary);
            event.preventDefault();
            event.stopPropagation();
            return false;
        },
        onClickExecuteUnbind: function (event) {
            var target = $(event.target);
            pageManager.ajaxManager({
                //hostIndex: 2,
                url: restAPI.equipment.unbind.url,
                data: {
                    pkId: target.closest('#iosDialog1').attr('data-pkId'),
                    bindType: target.closest('#iosDialog1').attr('data-bindType')
                },
                type: 'post',
                success: function (res) {
                    if (res.code != 0) {
                        console.warn(res);
                        pageManager.showTooltip(res.message);
                    } else {
                        // renderChart(res.data);
                        pageManager.showTooltip('解绑成功', 'success');
                        setTimeout(function () {
                            pageManager.reloadPage();
                        }, 1000);
                    }
                }
            });
        },
        onClickCancel: function () {
            $(this).closest('.js_dialog').fadeOut(200);
        },
        onClickAdd: function () {
            pageManager.go('binding-description');
        },
        gotoChartPage: function (event, data) {
            pageManager.go('p6-data?erId=' + data.erId + '&eupId=' + data.eupId + '&mac=' + data.mac + '&isPrimary=' + data.isPrimary);
        }
    };

    function afterInitPage(element) {
        var param = {};
        pageManager.ajaxManager({
            //hostIndex: 2,
            url: restAPI.equipment.equipmentList.url,
            data: param,
            type: 'post',
            success: function (res) {
                if (res.code != 0) {
                    pageManager.showTooltip(res.message);
                } else {
                    scope.equipmentList = res.data.dataList;
                }
            }
        });
    }

    pageManager.initPage(html, 'user-equipment', scope, afterInitPage);

