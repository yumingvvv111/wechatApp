webpackJsonp([2],{0:function(a,i,t){var s=t(6),e=t(3);e.initPage(s,"air-middle");var l=echarts.init($(".air-middle #first-echart-box")[0]),o=[150,52,200,334,390,330,220,333,56,34,55,67,98,235,342,454,231,56,78,352,231,35,66,68,150,52,200,334,390,330,220,333,56,34,55,67,98,235,342,454,231,56,78,352,231,35,66,68],r={title:{text:"PM2.5-48小时记录",textStyle:{color:"#ffffff",fontSize:16},x:"center",bottom:0},color:["#ffffff"],tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{left:"1%",right:"2%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:[],axisTick:{alignWithLabel:!1},axisLine:{lineStyle:{color:["#ffffff"]}},axisLable:{show:!1}}],yAxis:[{type:"value",name:"",min:0,max:500,position:"left",axisLine:{lineStyle:{color:["#ffffff"]}}}],series:[{name:"pm2.5",type:"bar",barWidth:"80%",data:o}]};l.setOption(r);var c=echarts.init($(".air-middle #next-echart-box")[0]),n=[150,152,280,134,350,230,220,98,56,34,55,167,198,235,142,454,331,156,178,352,231,315,166,168,150,152,200,334,390,330,220,333,156,134,55,167,98,235,342,454,231,56,78,352,231,135,166,68],r={title:{text:"PM10-48小时记录",textStyle:{color:"#ffffff",fontSize:16},x:"center",bottom:0},color:["#ffffff"],tooltip:{trigger:"axis",axisPointer:{type:"shadow",label:{textStyle:{color:"#fff"}}}},grid:{left:"1%",right:"2%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:[],axisTick:{alignWithLabel:!1},axisLine:{lineStyle:{color:["#ffffff"]}},axisLable:{show:!1}}],yAxis:[{type:"value",name:"",min:0,max:500,position:"left",axisLine:{lineStyle:{color:["#ffffff"]}}}],series:[{name:"pm10",type:"bar",barWidth:"80%",data:n}]};c.setOption(r),$(function(){$("#showIOSDialog1").click(function(){$("#iosDialog1").fadeIn(200)}),$("#dialogs").on("click",".weui-dialog__btn",function(){$(this).parents(".js_dialog").fadeOut(200)})}),$(function(){$(".dial-box").each(function(a,i){var t=.36*$(this).find(".big-number").text();500>=t?$(this).find(".out-cricle").css("transform","rotate("+t+"deg)"):$(this).find(".out-cricle").css("transform","rotate(180deg)")})})},6:function(a,i,t){a.exports=' <div class="page air-good orange-bgcolor"> <input type=hidden name=title value=过敏史 /> <div class="top-title clearfix"> <a href=javascript:; class="home fl" id=showIOSDialog1>客厅</a> <span class="link-info fr">3分钟前</span> </div> <div class=dial-box> <div class=pie-cricle> <div class=out-cricle></div> <div class="inner-cricle inner-cricle-orange"> <img src=app/images/background_3.png> </div> </div> <div class=mark-box> <div class=company>ug/m³</div> <div class=texting-big-num><span class=big-number>358</span></div> <div class=texting-num>PM2.5<span class=mlr10>|</span><span class=small-number>轻度污染</span> </div> </div> </div> <div class=dial-box-name> PM10浓度： <small><span>38</span>ug/m³</small> </div> <div class=echartsbox> <div id=first-echart-box class=first-echart-box></div> <div id=next-echart-box class=next-echart-box></div> </div> <div class=foot-tabbar> <div class="weui-tabbar weui-tabbar-link"> <a href=javascript:; class=weui-tabbar__item> <img src=app/images/Shutdown.png alt="" class=weui-tabbar__icon> <p class=weui-tabbar__label>关机</p> </a> <a href=javascript:; class=weui-tabbar__item> <img src=app/images/Always.png alt="" class=weui-tabbar__icon> <p class=weui-tabbar__label>设备常亮</p> </a> <a href=javascript:; class=weui-tabbar__item> <img src=app/images/pm10.png alt="" class=weui-tabbar__icon> <p class=weui-tabbar__label>PM2.5</p> </a> <a href=javascript:; class=weui-tabbar__item> <img src=app/images/share.png alt="" class=weui-tabbar__icon> <p class=weui-tabbar__label>分享</p> </a> </div> </div> <div class=none-div></div> <div id=dialogs> <div class=js_dialog id=iosDialog1 style=display:none> <div class=weui-mask></div> <div class=weui-dialog> <div class=weui-dialog__hd><strong class=weui-dialog__title>请给设备命名</strong></div> <div class=weui-dialog__bd> <input class="weui-input input-text" type=text placeholder=请输入设备名称> </div> <div class=weui-dialog__ft> <a href=javascript:; class="weui-dialog__btn weui-dialog__btn_primary">确定</a> <a href=javascript:; class="weui-dialog__btn weui-dialog__btn_default">取消</a> </div> </div> </div> </div> </div> '}});
//# sourceMappingURL=air-middle.js.map