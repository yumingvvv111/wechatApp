webpackJsonp([12],{0:function(a,i,e){function s(a){var i={};n.ajaxManager({url:l.equipment.equipmentList.url,data:i,type:"post",success:function(a){0!=a.code?n.showTooltip(a.message):c.equipmentList=a.data.dataList}})}var t=e(16),l=e(2),n=e(3);l.equipment={unbind:{url:"equimentRest/restEquiment/equiment/unbind",param:["pkId","bindType"]},equipmentList:{url:"equimentRest/restEquiment/equiment/list",param:["wxId"]}};var c={equipmentList:[{isPrimary:0,roomName:"无数据",pk_id:11,mac:"--"}],onClickUnbind:function(a,i){return $("#iosDialog1").fadeIn(200).attr("data-pkId",i.eupId).attr("data-bindType",i.isPrimary),a.preventDefault(),a.stopPropagation(),!1},onClickExecuteUnbind:function(a){var i=$(a.target);n.ajaxManager({url:l.equipment.unbind.url,data:{pkId:i.closest("#iosDialog1").attr("data-pkId"),bindType:i.closest("#iosDialog1").attr("data-bindType")},type:"post",success:function(a){0!=a.code?(console.warn(a),n.showTooltip(a.message)):(n.showTooltip("解绑成功","success"),setTimeout(function(){n.reloadPage()},1e3))}})},onClickCancel:function(){$(this).closest(".js_dialog").fadeOut(200)},onClickAdd:function(){n.go("binding-description")},gotoChartPage:function(a,i){n.go("p6-data?erId="+i.erId+"&eupId="+i.eupId+"&mac="+i.mac+"&isPrimary="+i.isPrimary)}};n.initPage(t,"user-equipment",c,s)},16:function(a,i,e){a.exports=' <div class="page user-equipment" data-bind=$root> <input type=hidden name=title value=已有设备列表 /> <div class=weui-cells data-bind=foreach:(($root.equipmentList))> <div class=weui-cell data-bind=click:$root.gotoChartPage> <div class="weui-cell_hd cell_hd-pic"> <img src=app/images/product01.jpg> <span class=bottom-bt data-bind=isPrimary data-if="isPrimary==0">主</span> </div> <div class=weui-cell_bd> <p class=product-name data-bind="text:\'空气猫\'">空气猫PM2.5检测仪</p> <p class=product-position data-bind=text:roomName>卧室</p> <p class=product-mac data-bind=text:mac>ab:ab:ab:ab:ab:ab</p> </div> <div class=weui-cell_ft> <a href=javascript:; class="cell_ft-pic equipment-remove" data-bind=click:$root.onClickUnbind> <img src=app/images/remove01.png> </a> </div> </div> </div> <div class=add-equipment-btn> <a href=javascript:; class="weui-btn weui-btn_primary" data-bind=click:onClickAdd>+添加设备</a> </div> <div id=dialogs> <div class=js_dialog id=iosDialog1 style=display:none> <div class=weui-mask></div> <div class=weui-dialog> <div class=weui-dialog__hd><strong class=weui-dialog__title>确定解绑吗？</strong></div> <div class=weui-dialog__ft> <a href=javascript:; class="weui-dialog__btn weui-dialog__btn_primary" data-bind=click:$root.onClickExecuteUnbind>确定</a> <a href=javascript:; class="weui-dialog__btn weui-dialog__btn_default" data-bind=click:$root.onClickCancel>取消</a> </div> </div> </div> </div> </div> '}});
//# sourceMappingURL=user-equipment.js.map