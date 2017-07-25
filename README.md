*微信webapp*

基于weui打造的微信前端框架,适合公众号、微信网页应用。
技术方面为前后端纯分离模式, 前端为MVVM模式架构。后端提供restfulAPI服务, 后端同时保留两种架构nodejs + mongoDB和java的springMVC + hibernate + mySql。
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


