webpackJsonp([11],{0:function(a,i,e){function s(){if($(".page-p6-play #equipmentName").hide(),r.coverPage){var a=JSON.parse(r.data),i=a.circleBoardModel;i.forEach(function(a){t(a.selector,a.frontRange,a.backRange,a.value)}),l(a.uploadTime,".pape-p6-play .ink-info")}}function t(a,i,e,s){var t=$(a),l=i[0],n=i[1],c=180/(n-l),d=s,r=(d||0)*c;t.find(".big-number").text(null===d?"--":d),180>=r?t.find(".out-cricle").css("transform","rotate("+r+"deg)"):t.find(".out-cricle").css("transform","rotate(180deg)"),isNaN(d)?t.addClass("dial-box-white"):d<=e[0]?t.addClass("dial-box-blue"):e[0]<d&&d<=e[1]?t.addClass("dial-box-yellow"):t.addClass("dial-box-red")}function l(a,i){var e=(new Date).getTime();a=e-a,a=6e4>a?parseInt(a/1e3)+"秒前":a>=6e4&&36e5>a?parseInt(a/6e4)+"分钟前":a>=36e5&&864e5>a?parseInt(a/36e5)+"小时前":parseInt(a/864e5)+"天前",$(i).text(a)}var n=e(15),c=(e(2),e(3)),d=e(1),r=d.utils.getInfoFromURL().param,o={equipmentName:""};c.initPage(n,"p6-play",o,s)},15:function(a,i,e){a.exports=' <div class="page p6-data black-bgcolor"> <input type=hidden name=title value=空气猫P6型雾霾检测仪 /> <div class="top-title clearfix"> <a href=javascript:; class="home fl" id=equipmentName data-bind={text:$root.equipmentName,click:$root.onClickEquipmentName}></a> <span class="link-info fr">3分钟前</span> </div> <div class=dial-listbox> <div class="dial-box dial-box2"> <div class=pie-cricle> <div class=out-cricle></div> <div class=inner-cricle></div> </div> <div class=mark-box> <div class=company>mg/m³</div> <div class=texting-big-num><span class=big-number>0.05</span></div> <div class=texting-num>甲醛<span class=mlr5>|</span><span class=small-number>优</span></div> </div> </div> <div class="dial-box dial-box3"> <div class=pie-cricle> <div class=out-cricle></div> <div class=inner-cricle></div> </div> <div class=mark-box> <div class=company>mg/m³</div> <div class=texting-big-num><span class=big-number>--</span></div> <div class=texting-num>化学污染物<span class=mlr5>|</span><span class=small-number>--</span> </div> </div> </div> <div class="dial-box dial-box1"> <div class=pie-cricle> <div class=out-cricle></div> <div class=inner-cricle></div> </div> <div class=mark-box> <div class=company>&mu;g/m³</div> <div class=texting-big-num><span class=big-number>189</span></div> <div class=texting-num>PM2.5<span class=mlr5>|</span><span class=small-number>严重</span> </div> </div> </div> <div class="dial-box dial-box4"> <div class=pie-cricle> <div class=out-cricle></div> <div class=inner-cricle></div> </div> <div class=mark-box> <div class=company></div> <div class=texting-big-num><span class=big-number>430</span></div> <div class=texting-num>污染指数</div> </div> </div> <div class="dial-box dial-box5 dial-box-blue"> <div class=pie-cricle> <div class=out-cricle></div> <div class=inner-cricle></div> </div> <div class=mark-box> <div class=company>℃</div> <div class=texting-big-num><span class=big-number>27</span></div> <div class=texting-num>温度</div> </div> </div> <div class="dial-box dial-box6 dial-box-blue"> <div class=pie-cricle> <div class=out-cricle></div> <div class=inner-cricle></div> </div> <div class=mark-box> <div class=company>%</div> <div class=texting-big-num><span class=big-number>56</span></div> <div class=texting-num>湿度</div> </div> </div> <div class=clearfix></div> </div> <div class=product-infor> <div class=product-img> <img src=app/images/p6-image.png> </div> <div class=product-hd> <h2>空气猫P6plus型便携式空气质量动态检测仪</h2> <p>清华大学控股企业/激光传感器、电化学传感器、红外传感器、电子传感器/PM2.5、甲醛、二氧化碳、化学污染物、温度、湿度</p> </div> <div class=product-bd> <span class=shop-car><img src=app/images/shop-car.png> </span><a href="https://detail.tmall.com/item.htm?spm=a230r.1.14.6.ebb2eb2Lem6Va&id=533985656878&cm_id=140105335569ed55e27b&abbucket=4" target=_blank>马上购买</a> </div> </div> </div> '}});
//# sourceMappingURL=p6-play.js.map