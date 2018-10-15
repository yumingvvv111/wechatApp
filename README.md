# YY前端框架
[TOC]

## 概述
基于weui打造的前端框架,适合公众号、单页面应用。
前后端纯分离模式, 前端为MVVM模式架构。后端提供restfulAPI服务, 后端同时保留两种架构nodejs + mongoDB和java的springMVC + hibernate + mySql。
为了支持类似fis的`__inline`和`__sprite`语法（base64和雪碧图），对依赖包`gulp-css-base64`和`gulp-css-spriter`都做了修改，暂时保留在node_modules中。不必再下载这两个包。

**起Node服务的步骤:**

安装依赖包：
`npm install`

使用AMD开发：
`gulp amd`

使用CMD开发：
`gulp cmd`

发布：
`gulp`


**前端单元测试和UI验收测试**

使用到`wdio` `selenium` `mocha` `jasmine`等

进入test目录安装依赖
`npm install`

运行测试用例
`wdio wdio.conf.js`

**注意：**
webpack已经更新到2.0+。
devtool: 'source-map' 改为 '#source-map'， 兼容新版Chrome规则。

**起Java服务的步骤:**

参考maven配置步骤

然后启动本地mysql再启动tomcat

## 二 常用接口
### 数据交互 pageManager.ajaxManager 
__说明__
这个方法是对$.ajax的封装，目的是统一管理ajax可以做一些请求拦截，比如验证是否已经登陆，没登陆的返回登陆页面。
__参数__

* `url`
[required]	  请求的地址（pc浏览器里不可跨域请求）
* `data`
[optional]  参数对象 默认提交form表单内的数据，每一个参数对象都会自动带上wxId
* `type`
[optional]  GET|POST 默认是post
* `dataType`
[optional]  json|text|html 数据响应的格式，默认是json
* `success`
[required]  成功响应之后的回调函数
* `fail`
[optional]  失败的回调函数

__示例__

```
pageManager.ajaxManager({
                url: API.apply.street.url,
                data: {moduleId: '90'},
                //如果不填data，则发送form表单的参数，如果表单也不存在就只会发送wxId
                type: 'get',
                success: function (res) {
                    if (res.code != 0) {
                        console.warn(res);
                    } else {
                        var ss = res.data.parTyList;
                        ss.unshift({typeName: '请选择街道', typeId: "0"});
                        pageCfg.viewModel.streetList = ss;
                        $('#cqStreetCode').val('0');
                    }
                }
            })();//此处别忘加()，因为前边返回的是一个函数
```
__补充__
每一个请求都做了拦截和校验，根据服务端返回的code进行校验，根据情况跳转到login页。走securityVerification这个方法，具体在app.js里：

```js
...
function (res) {
   if (res.code === 5008 || res.code === 5010 || res.code === 5007 || res.code === 5009) {
   self.securityVerification(res);
   } else {
   fn && fn(res);
   }
}
...
```
### 页面跳转&后退&刷新
#### 跳转 pageManager.go
__参数__
`hash` [required]  将要跳转页面的hash值（可带参数）
__示例__

```js
pageManager.go('home')//单纯的跳转到首页
pageManager.go('home?param1=123&param2=456')//带参数的跳转
```
__补充__
跳转的新页面之后可以通过`utils.getInfoFromURL()`方法获取到附带的参数信息，返回值：

```js
{
  "host": "http://192.168.1.100:8080/",
  "hash": "info-check",
  "path": "http://192.168.1.100:8080/cmserverWeixin/",
  "param": {
    "param1": "123",
    "param2": "456"
  }
}
```
#### 无刷新后退
比如从“基本信息”页返回到“首页”，只需要写`location.hash="home"`。
因为页面是堆栈结构，所以进入到基本信息页面的时候首页并没消失只是隐藏看不到。
这样的好处是可以立即为上个页面赋值。
#### 后退并刷新
添加参数v在页面名称后`location.hash="home?v=" + Math.random()`。
优点是可以立即看到服务端的数据改动。
### 模板编译 
__说明__
模版编译方法是借鉴knockout的思路，采用MVVM的模式，视图－视图数据模型－业务数据模型。分层设计利于维护和开发，类似java里的 velocity。需要html模板配合js模型一起使用。
__配置__
#### 属性 
有两种写法：
1. `data-bind="{attr:{...}}"`
2. `data-bind="" 结合 data-`
__示例__

html模板：

```html
<!-- 首先在外层bind $root, 这里的$root代表js里的数据模型viewModel -->
<div class="page-wrapper" data-bind="$root">
        <div class="page-content">
            <div class="page__hd">
            <!-- 循环遍历出列表数据 -->
                <div class="weui-grids weui-grids-date" data-bind="foreach:$root.placeDate">
                <!-- 为元素绑定单击事件，除了click，还支持'click', 'blur', 'change', 'touch', 'focus', 'load', 'scroll', 'select' -->
                    <a href="javascript:;" class="weui-grid date" data-bind="{click:$root.onChangeDate}"</a>
                </div>
            </div>
            <div class="page__bd">
            <!-- 如果需要双向绑定（数据层发生变化适时更新界面）只需要加上双括号 -->
                <div class="weui-grids" data-bind="foreach:(($root.placeTime))">
                    <a href="javascript:;" class="weui-grid" data-bind="click:$root.onSelectTime" data-class="statu != 2 ? 'disabled' : ''" >
                    <!-- 填充文字的写法 -->
                        <p data-bind="text:timeSpan"></p>
                    <!-- 带逻辑的文字填充  -->
                        <p class="weui-grid__label" data-bind="text:statu == 2 ? '预约' : (statu == 1 ? '已约满' : '&nbsp;')">预约</p>
                    </a>
                </div>
            </div>
            
        </div>
    </div>
```

js数据模型

在页面底部写上<script type="text/javascript" id="pageCfg6"></script>，id需要是pageCfg＋数字的形式，这样才会跟普通js区分开，以上的html模板才会生效。

```js
//定义一个默认数据，结构跟后端返回的一致。这样做是为了体验友好，不至于一直等待后端数据响应之后才显示页面，另一方面也可以在这里赋一个假数据便于调试。
var defaultData = JSON.parse('{"message":"Success","data":{"placeTime":[],"placeDate":[]},"code":0}');
    
    var pageCfg = {
    //数据模型包含在pageCfg内
          viewModel: {
              placeDate: defaultData.data.placeDate,
              placeTime: defaultData.data.placeTime,
              onChangeDate: function (event, data, index) {},
            },
            //afterRenderPage方法一般是用来页面渲染之后做一些事，替代jquery的$(function(){......})。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
          afterRenderPage: function () {
            pageManager.ajaxManager({
                    url: API.appoint.getAppointMentTimeByDate.url,
                    data: {
                        projectId: 1,
                        date: (new Date()).getDate(),
                        placeId: 2
                    },
                    type: 'post',
                    success: function (res) {
                        if (res.code != 0) {
                        //数据响应之后把数据赋值給viewModel里对应的字段，数据模型发生了变化就会自动通知页面更新
                          pageCfg.viewModel.placeTime = res.data.placeTime;
                        }
           }
        };
```

## 三 控件
统一都是通过createComponent创建
### 模态窗口
![](media/14894585657558/14895583916294.jpg)￼

__示例__

```js
var dialogCfg = {
    type: 'append',//append是添加到容器中，html是替换容器里的内容
    viewModel: {//视图层对应的数据模型
      id: 'iosDialog1',//页面上的id
      isShowTitle: false,//不解释都懂
      isShowGrayButton: true,
      isShowFooter: false,
      title: '标题',
      content: '',//文字或者html片段
      primaryText: '是',//按钮显示的文字
      onClickPrimary: function(event, data){},//点击按钮的响应
      defaultText: '否',
      onClickDefault: function(event, data){},
      onClickMask: function(){}//点击遮罩层的响应
      }
    };
    createComponent('dialog', dialogCfg);
```
### 自定义下拉框
安卓下的样式如下，IOS里仍然是默认样式
![](media/14894585657558/14895584321802.jpg)￼


__示例__

```js
var selectCfg = {
    type: 'append',
    viewModel: {
      onSelected: function(event, data, index){//下拉选择的响应
        var target = $(event.target);
        var item = target.closest('weui-check__label');
        $(item).siblings().find('input').each(function(i, e){
        e.checked=false;
      });
    },
    options: [//具体的下拉选项
        {checked:true, name:'请选择',value:0}
        ] //下拉选项的值和选中所组成的数组
      }
    };
    createComponent('select', selectCfg);
```
这个已经封装好，基本不用手工创建，框架会自动把所有下拉框转换成这种样式。

### IOS和Android兼容性
#### 判断手机的系统
调用`common.utils.getDeviceInfo()`方法, 返回一个对象，isIphone是true时为苹果手机，同理isAndroid是true时为安卓手机。
#### 主要的兼容性处理
* 下拉控件
已经做了一个兼容封装，使用方式如下：

```html
<div class="weui-cell weui-cell_select" data-component='{"name":"yy-select","disabled":"disabled"}'>
                    <div class="weui-cell__hd"><label class="weui-label">检测项目</label></div>
                    <div class="weui-cell__bd weui-cell-mask" style="position:relative;">
                        <em></em>
                        <select class="weui-select" name="projectId" id="projectId">
                            <option value="0" selected="selected" data-bind="click:$root.onChangeProject">请选择检测项目</option>
                            <option value="1" data-bind="click:$root.onChangeProject">体格检测、眼象检测</option>
                            <option value="2" data-bind="click:$root.onChangeProject">基因检测</option>
                            <option value="3" data-bind="click:$root.onChangeProject">基因检测、OGTT检测</option>
                        </select>
                    </div>
                    <div class="weui-cell__ft">
                        <i class="weui-icon-warn"></i>
                    </div>
                </div>
```
* 日历
原来是使用日历插件，但是ios里的风格跟本身系统自带风格不协调，所以改为html5的实现方法，具体代码：

```html
<input type="date" class="weui-select weui-select-date" name="birthday"/>

```
* 标题
每次进入一个页面需要实时改变顶部的标题，但是在苹果手机里不生效，所以也封装了一个方法：
调用`common.changeTitle("标题文字")`

### 模块化
使用requirejs进行模块管理，用法的主要区别：

* 1、每个页面都有一个define定义，然后依次加载css，html和js模块
* 2、回调函数内部需要初始化页面

```js
define(['css!style/p2-style',  'html!pages/air-cat/air-good.html', 'restAPI', 'pageManager'], function (c1, html, restAPI, pageManager) {
    pageManager.initPage(html, 'air-good');
    });
```





