!function(e){function a(i){if(t[i])return t[i].exports;var s=t[i]={exports:{},id:i,loaded:!1};return e[i].call(s.exports,s,s.exports,a),s.loaded=!0,s.exports}var t={},i={14:0};a.e=function(e,t){if(0===i[e])return t.call(null,a);if(void 0!==i[e])i[e].push(t);else{i[e]=[t];var s=document.getElementsByTagName("head")[0],n=document.createElement("script");n.type="text/javascript",n.charset="utf-8",n.src=a.p+""+{1:"a3fd827c0c004e429621",2:"c6b9a0c8ea676fc7a8a5",3:"fdf17f84105abe68c376",4:"0d071a438bb8a16a7cbd",5:"31d37a9f2bac8b793464",6:"2007260e854be396e11a",7:"822f0acb551a24ce64c6",8:"441c77ea8d6164471d31",9:"7a76ae47a72a1b8ec582",10:"5e4d8a5a457e49ee3711",11:"cbb2e3af59379e0d3cbd",12:"758210ecaa58b9238c89",13:"ab1b112b753ba67d9da4",14:"b011ba13a4be36f48fa4"}[e]+".js",s.appendChild(n)}},a.modules=e,a.cache=t,a.p="dist/app/js/",window.webpackJsonp=function(s,n){for(var r,o,l=[];s.length;)o=s.shift(),i[o]&&l.push.apply(l,i[o]),i[o]=0;for(r in n)e[r]=n[r];for(;l.length;)l.shift().call(null,a);n[0]&&(t[0]=0,a(0))}}([,function(module,exports,require){function templateCompile(segment,data,parentData,$index,$parentIndex,dataPath){function myEval(e,a){var t='with(data){var result;if(typeof str === "undefined"){str = "";}str = str.replace(/{#([^{}]+)}/g, function(m1, m2){return data[m2];});try{result = eval(str)}catch(ex){result = str; console.log(ex);} return result;}';return new Function("data","str",t)(a,e)}function reDraw(newVal,matchs,evalScope,$elem,$index,dataPath){function createNewFragment(e){var a,t=$elem.clone();t.html(oldTemplate),a=(self.compile||templateCompile).call(self,t,e.data,e.parentData,e.index,e.parentIndex,e.dataPath),a.children().each(function(e,a){_fragment.appendChild(a)})}var self=this,evalStr=matchs instanceof Array?matchs[2]:matchs,_data=newVal||myEval(evalStr,evalScope),_fragment=document.createDocumentFragment(),oldTemplate=$elem._template||($elem._template=$elem.html()),_path;if(_data instanceof Array)for(var i=0,len=_data.length;len>i;i++)dataPath.push(evalStr+"["+i+"]"),_path=dataPath,createNewFragment.call(self,{data:_data[i],parentData:function(){var num=0,len=_path.length;return len>0?(num=len-2,num=0>num?0:num,eval(_path[num])):null}(),index:i,parentIndex:$index,dataPath:_path});else"[object Object]"===Object.prototype.toString.call(_data)&&(dataPath.push(evalStr),_path=dataPath,createNewFragment.call(self,{data:_data,parentData:parentData,index:$index,parentIndex:$parentIndex,dataPath:_path}));$elem.html(""),$elem.append(_fragment)}function forEachBindElements(index,element,parentData,$parentIndex){function getMatchs(e){var a=e.match(/^\b(\w*?)\b:(.*)/),t=e.match(/^\{(.*)\}$/),i=e.match(/\(\(([^\(\)]+)\)\)/),s=!1;return t?{isArray:!0,array:t[1].split(",")}:a?(i&&(a[2]=i[1],s=!0),{matchs:a,isBindMatch:s}):i?{isOnlyBind:!0,matchs:i[1]}:!1}function putValues(e,a,t,i,s,n,r,o,l){var c=this;if(e)switch(e[1]){case"text":"[]"===e[2]?i.text(data):(i.text(r(e[2],t)),a&&s.push({key:e[2],Func:function(e){i.text(e)}}));break;case"html":i.html(r(e[2],t)),a&&s.push({key:e[2],Func:function(e){i.html(e)}});break;case"foreach":i._template=i.html(),n.call(c,null,e,t,i,t.$index,dataPath),a&&s.push({key:e[2],Func:function(a){n.call(c,a,e,t,i,t.$index,dataPath)}});break;case"attr":var d=e[2].match(/{(\w.*?):(.*)}/),p=r(d[2],t);i.attr(d[1],"data-param"===d[1]||"data-remote-check"===d[1]?JSON.stringify(p):p);var u,m;null!==(u=/^([\w\.]+)\b.*?\?.*:/.exec(d[2]))&&(m=u[1]),a&&s.push({key:e[2],Func:function(e){i.attr(d[1],r(d[2],t))}});break;default:o(e[1])&&l(i,e,$index,r,t,data)}}var self=this,$elem=$(element),expression=$elem.attr("data-bind").replace(/\$root/g,"self.viewModel"),dataAttrNames=["data-if","data-href","data-attr","data-bind","data-class"];if(!elemIsInForeach($elem,$excludeElement)){"array"==typeof data&&(data={_arr_:data});var watchList=[];with(data){var ifAttr=$elem.attr(dataAttrNames[0]),hrefAttr=$elem.attr(dataAttrNames[1]),attrData=$elem.attr(dataAttrNames[2]),evalScope=$.extend({},data,{$parent:parentData,$index:$index,$parentIndex:$parentIndex,self:self}),_bindEvent=function(e,a,t,i,s,n){e[0]["on"+a[1]]=function(e){return function(t){try{var r=i(a[2],s);r.call(this,t,n,e)}catch(o){console.warn("_eval:::",r,"matchs:::",a[2],"evalScope:::",s)}}}(t)},isEventName=function(e){var a=!1,t=["click","blur","change","touch","focus","load","scroll","select"];return t.forEach(function(t){t===e&&(a=!0)}),a};if(ifAttr&&(ifAttr=ifAttr.replace(/\$root/g,"self.viewModel"),!myEval(ifAttr,evalScope)))return void $elem.remove();hrefAttr&&(hrefAttr=hrefAttr.replace(/\$root/g,"self.viewModel"),hrefAttr=myEval(hrefAttr,evalScope),$elem.attr("href",hrefAttr));var classAttr=$elem.attr(dataAttrNames[4]);if(classAttr&&(classAttr=classAttr.replace(/\$root/g,"self.viewModel"),classAttr=myEval(classAttr,evalScope),$elem.addClass(classAttr)),attrData){var attrMatchs;attrMatchs=myEval("attrMatchs="+attrData,evalScope);for(var _name in attrMatchs){var _val=attrMatchs[_name];("param"===_name||"remoteCheck"===_name)&&(_val=JSON.stringify(_val),_name="data-"+_name),"addClass"===_name?$elem.addClass(_val):$elem.attr(_name,_val)}}var matchResult=getMatchs(expression);if(matchResult)if(matchResult.isArray)for(var _item,itemMatchResult,_m=0;_m<matchResult.array.length;_m++)_item=matchResult.array[_m],itemMatchResult=getMatchs(_item),itemMatchResult&&putValues.call(self,itemMatchResult.matchs,itemMatchResult.isBindMatch,evalScope,$elem,watchList,reDraw,myEval,isEventName,_bindEvent);else matchResult.isOnlyBind?($elem._template=$elem.html(),watchList.push({key:matchResult.matchs,Func:function(e){reDraw.call(self,e,matchResult.matchs,evalScope,$elem,$index,dataPath)}})):putValues.call(self,matchResult.matchs,matchResult.isBindMatch,evalScope,$elem,watchList,reDraw,myEval,isEventName,_bindEvent);try{watch.call(self,watchList,data,self.viewModel)}catch(ex){}}}}function elemIsInForeach(e,a){var t=!1;return a.each(function(a,i){i===e[0]&&(t=!0)}),t}function parentsHasProperty(e,a,t){var i=(e.parent(),a),s=new RegExp("\\b"+t+"\\b"),n=!1;return e.parents().each(function(){var e=$(this).attr(i);"undefined"!=typeof e&&s.test(t)&&(n=!0)}),n}function watch(watchList,obj,modelRoot){for(var self=this,i=0,item,arr=[];i<watchList.length;i++){item=watchList[i],item.Func=[item.Func];for(var n=0,item2,isRepeat=!1;n<arr.length;n++)item2=arr[n],item.key===item2.key&&(item2.Func=item2.Func.concat(item.Func),isRepeat=!0);!isRepeat&&arr.push(item)}watchList=arr,watchList.forEach(function(item){var watchStr=item.key,value,watchHandler,watchObj,match,defaultSetFunc=function(e){var a=value;value=e,watchHandler instanceof Array?watchHandler.forEach(function(t){t.call(self,e,a)}):watchHandler.call(self,e,a)};if((match=/self.viewModel.(.*)/.exec(watchStr))?(watchObj=modelRoot,watchStr=match[1]):watchObj=obj,/\./.test(watchStr)){var splitter=watchStr.split(/\./);watchStr=splitter.pop(),watchObj=myEval(splitter.join("."),watchObj)}/\{#([^{}]+)\}/.test(watchStr)&&(watchStr=/\{#([^{}]+)\}/.exec(watchStr)[1]),value=watchObj[watchStr],function(scope){watchHandler="string"!=typeof item.Func?item.Func:eval(item.Func)}(obj),Object.defineProperty(watchObj,watchStr,{get:function(){return value},set:defaultSetFunc})})}var self=this,segmentWrapper,$excludeElement;"undefined"==typeof dataPath&&(segmentWrapper=$('<div class="segment-wrapper"></div>'),segment=segmentWrapper.append(segment)),$excludeElement=segment.find("[data-bind*=foreach]").find("[data-bind]"),dataPath=dataPath||[];for(var bindElementsArray=Array.prototype.slice.call(segment.find("[data-bind]")),_i=0;_i<bindElementsArray.length;_i++)forEachBindElements.call(self,_i,bindElementsArray[_i],parentData,$parentIndex);return dataPath.pop(),segment.hasClass("segment-wrapper")?segment.children():segment}function Component(e,a,t,i,s){var n,i=$(i||"#widgetContainer");this.init=function(){this.viewModel=e,this.compile=t,n=this.compile($(a),this.viewModel),i.css("zIndex",9999999)},this.destroy=function(){n.fadeOut(100),setTimeout(function(){n.remove()},100),i.css("zIndex",-9)},this.init(),"append"===s?(i.append(n),n.fadeIn(200)):(i.html(n),n.fadeIn(200))}function createComponent(e,a){var t,i=$("#component"+e.replace(/^(.)/,function(e,a){return a.toUpperCase()}));return t=i.length>0?a.templateSelector?$(a.templateSelector).html():componentElement.html().match(/<!\[CDATA\[([\s\S]*?)\]\]>/m)[1].trim():xTemplate[e],new Component(a.viewModel,t,templateCompile,a.container,a.type)}function onClickContainer(e){function a(){var e,a='[data-widgetID="'+u+'"]';$(".component-select").find("input").each(function(a,t){t.checked&&(e=t.value)}),$(a).val(e),$(a).trigger("change"),$(a).children().each(function(a,t){t.value===e&&$(t).trigger("click")}),setTimeout(function(){$("#widgetContainer")[0].onclick=null,f.destroy()},0)}var t=$(e.target),i=t.closest("[data-component]"),s=t.closest(".js-router"),n=t.closest(".submit"),r=t[0].tagName.toUpperCase();if(("INPUT"===r||"TEXTAREA"===r)&&t[0].focus(),n.length>0&&("EM"===t[0].tagName.toUpperCase()?t[0].onclick():_validator.submitHandler(e)),s.length>0&&(s=s.data("router"),window.pageManager.go(s)),i.length>0){var o=i.data("component"),l=o;switch("[object Object]"===o.toString()&&(l=o.name),l.replace("yy-","")){case"select":if("EM"!==t[0].tagName.toUpperCase()||o.disabled)return!1;var c=[],d=o.hideFirst;i.find("select").find("option").each(function(e,a){(0!==e||!d&&"true"!=$(a).attr("hidden")&&!/选择/.test($(a).text()))&&c.push({value:$(a).attr("value"),checked:a.selected,name:$(a).text()})});var p=parseInt(1e6*Math.random(),10),u="select"+p;i.find("select").attr("data-widgetID",u);var m={type:"append",viewModel:{id:"dialog"+p,isShowTitle:!1,isShowFooter:!1,title:"标题",content:"",primaryText:"是",onClickPrimaryText:function(e,a){},defaultText:"否",onClickDefault:function(e,a){},onClickMask:function(e,t){a()}}},f=createComponent("dialog",m),v={container:"#dialog"+p+" .weui-dialog__bd",type:"html",viewModel:{onSelected:function(e,t,i){var s=$(e.target),n=s.closest(".weui-check__label");return $(n).siblings().find("input").each(function(e,a){a.checked=!1}),n.find("input")[0].checked=!0,a(),!1},options:c}};createComponent("select",v),$("[checked=false]").removeAttr("checked")}return!1}}function getPromise(e,a){var t=new $.Deferred;return $.ajax({url:e,type:"get",dataType:a,success:function(e){var i=e;"html"===a&&/html segment/.test(e)&&(i=e.match(/html segment begin -->(.*?)<!-- html segment end/)[1]),t.resolve(i)}}),t.promise()}var xTemplate={};xTemplate.dialog=require(17),xTemplate.select=require(18),xTemplate.toast=require(19);var _validator={hasBindSubmit:!1,submitHandler:function(e){function a(){_validator.removeAllErrorIcon(),pageManager.ajaxManager({url:r,form:n,success:function(e){_validator.responseHandler(e)||o&&(location.hash=o.replace("#","")+"v="+Math.random())},fail:function(){pageManager.showTooltip("数据连接超时或异常","error")}})()}var t=e.target,i=$(t).closest('section[class*="page-"]'),s=!1,n=$(i.find("form")),r=n.attr("action"),o=n.attr("data-callback"),l=[],c=!1;return n.find("[data-rule]").filter(function(){return $(this).attr("questioncheck")||utils.visible(this)}).each(function(e,a){var t=$(this).attr("name");if($(this).attr("questioncheck")){t=$(this).attr("id").replace("_temp","");var s=i.find("[name="+t+"]"),n=s.eq(0).closest(".question");return void(utils.visible(n)&&0===_validator.checkHasChecked(s)?(pageManager.showTooltip("请选择:"+(n.find(".question-title").text()||n.find(".title").text()),"error"),n.attr("haserror","true"),c||setTimeout(function(){$(".question").each(function(e,a){var t=$(a),i=t.find(".error-input"),s=t.attr("haserror"),n=t.closest(".page");(i.length>0||s)&&!c&&(console.log(this),this.scrollIntoView(),c=!0,n[0].scrollTop-=50)})},0)):n.removeAttr("haserror"))}l.push(_validator.checkRule.call(this))}),$(t).attr("onclick")&&-1!==$(t).attr("onclick").indexOf("confirmSubmit")?!1:($.when.apply($,l).done(function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){e._error&&(s=!0)}),s||a()}).fail(function(e){console.warn(e)}).always(function(e){console.log(e)}),_validator.hasBindSubmit=!0,e.preventDefault(),e.stopPropagation(),!1)},init:function(e){$(e||"form").find("[data-rule]").each(function(e,a){var t=this.onblur,i=this,s=function(e){$.when(_validator.checkRule.call(this,e)).then(function(a){t&&t.call(i,e)},function(e){console.warn(e)})};this.onblur=s;var n;this.onkeyup=function(e){var t=this;clearTimeout(n),n=setTimeout(function(){$.when(_validator.checkRule.call(t,a)).then(function(e){$(t).closest(".weui-cell").removeClass("weui-cell_warn")},function(e){console.warn(e)})},2e3)}})},initForQuestionnaire:function(e){var a={},t={},i="BSP-birthed,BSP-food,BSP-sleep,BSP-smoking,BSP-sport,BSP-tzbs,BSP-wine,";if(-1!==i.indexOf(e+",")){var s=".page-"+utils.getInfoFromURL().hash;$(s).find("input[type=text]").filter(function(){return!($(this).siblings().find("[type=checkbox]").length>1)}).attr("data-rule","noEmpty"),$(s).find("input[type=checkbox]").each(function(e,t){a[$(t).attr("name")]=1});for(var n in a)$(s).find("[name="+n+"]").after('<input type="hidden" id="'+n+'_temp" data-rule="noEmpty" questioncheck="true">');$(s).find("input[type=radio]").each(function(e,a){t[$(a).attr("name")]=1});for(var r in t)$(s).find("[name="+r+"]").last().after('<input type="hidden" id="'+r+'_temp" data-rule="noEmpty" questioncheck="true">');$(s).find(".weui-btn_primary").addClass("submit"),_validator.init(s+" form")}},checkHasChecked:function(e){var a=0;return e.each(function(e,t){t.checked&&(a+=1)}),a},responseHandler:function(e){return 0!=e.code?(_validator.addErrorMsg.call(this,e.message),console.log("%c%s","color:orange","error"),e.message):(console.log("%c%s","color:green","success"),!1)},checkRule:function(){var e=$.Deferred(),a=this,t=_validator.getError.call(this),i=$(this).attr("data-remoteCheck"),s=$(this).attr("data-param");if(t){if("输入不能为空"===t)try{var n=$(this).closest(".question").find(".title");t=(n.text()||$(this).closest(".question").find(".question-title").text())+"--"+t}catch(r){}return _validator.addErrorMsg.call(this,t),e.reject({_error:t}),e.promise()}if(s=s?JSON.parse(s):{},i=i?JSON.parse(i):{},i.url){var o={};i.params&&i.params.forEach(function(e){o[e]=null}),o[$(this).attr("name")]=$(this).val(),window.pageManager.ajaxManager({url:i.url,type:"post",data:$.extend({},o,s),success:function(t){var i=_validator.responseHandler.call(a,t);i?e.reject({_error:i}):(_validator.removeErrorMsg.call(a),e.resolve({_noError:!0}))},fail:function(a){e.reject({_error:a}),console.log(a)}})()}else _validator.removeErrorMsg.call(this),e.resolve({_noError:!0});return e.promise()},getError:function(){var element=this,formElement=$(this).closest(".weui-cells_form"),rules={mobile:{reg:"(\\+86)?1[3,5,6,7,8]\\d{9}",errorMsg:"手机号格式不正确"},number:{reg:"\\d+",errorMsg:"请输入正确的数字"},verification:{reg:"\\d{6}",errorMsg:"请输入正确的验证码"},idCard:{reg:"[0-9a-zA-Z]{15,20}",errorMsg:"您输入的身份证号有误，请核对后再次输入"},noEmpty:{reg:"\\S+",errorMsg:"输入不能为空"},streetDetail:{reg:"\\S+",errorMsg:"详细地址不能为空"},birthday:{reg:"\\S+",errorMsg:"出生日期不能为空"},password:{reg:"[^\\s\\t\\n\\r]{8,}",errorMsg:"密码格式不正确，输入英文大小写字母，数字，特殊符号均可，至少8位"},verifyPassword:[{reg:"[^\\s\\t\\n\\r]{8,}",errorMsg:"密码格式不正确，输入英文大小写字母，数字，特殊符号均可，至少8位"},{expression:'"{#confirmPassword}" === "{#password}" || "{#confirmPassword}" === "{#newPassword}"',errorMsg:"两次输入的密码不一致"}],name:{reg:"[^\\s\\t\\n\\r]{2,10}",errorMsg:"请输入2-10个字的名字"}},thisRule=rules[$(this).attr("data-rule")],regFromAttr=$(this).attr("pattern");if(thisRule){thisRule instanceof Array||(thisRule=[thisRule]);for(var i=0,_rule,regStr;i<thisRule.length;i++){if(_rule=thisRule[i],_rule.reg){regStr=_rule.reg||regFromAttr;var reg=new RegExp("^"+regStr+"$");if(!reg.test($(this).val()))return _rule.errorMsg||"请输入正确的"+$(this).attr("title")}if(_rule.expression){_rule.expression=_rule.expression.replace(/{#([^{}]+)}/g,function(e,a){return formElement.find('[name="'+a+'"]').val()||""});var _result;try{_result=eval(_rule.expression)}catch(ex){console.log("_result",ex),_result=!1}if(!_result)return _rule.errorMsg||"请输入正确的"+$(this).attr("title")}}}},removeAllErrorIcon:function(){$(".weui-cell_warn").removeClass("weui-cell_warn")},removeErrorMsg:function(){var e=$(this),a=e.closest(".weui-cell");if(0===a.length){var t=e.hasClass("error-input");"不能为空"===e.attr("placeholder")&&e.attr("placeholder",""),t&&e.removeClass("error-input"),"undefined"!=typeof e.attr("data-rule")&&""===e.val().trim()&&(e.attr("placeholder","不能为空"),e.addClass("error-input"))}else a.removeClass("weui-cell_warn")},addErrorMsg:function(e){var a=$(this),t=a.closest(".weui-cell");0===t.length?"undefined"!=typeof a.attr("data-rule")&&""===a.val().trim()&&(a.attr("placeholder","不能为空"),a.addClass("error-input")):t.addClass("weui-cell_warn"),pageManager.showTooltip(e)}},utils={visible:function(e){return e=$(e),!(!e.width()&&!e.height())&&"none"!==e.css("display")},paramToString:function(e){var a=[];for(var t in e)a.push(t+"="+e[t]);return a.join("&")},getDeviceInfo:function(){var e=navigator.userAgent;return{isIphone:/[Ii][Pp]hone/.test(e),isAndroid:/[Aa]ndroid/.test(e)}},getInfoFromURL:function(e){var a,t,i,s,n,r={},o="",l=[],r={};e=e||location.href,i=/(((?:http|https):\/\/[^\/]+)(?:.*?)\/).*?(#?.*)$/.exec(e);var c=i[1];return a=i[2],i[3]&&(s=/(?:\?([^#]*))?#([^\?]*)(?:\?(.*))?/.exec(i[3]),s?(t=s[2],o=(s[1]||"")+(s[3]?(s[1]?"&":"")+s[3]:"")):(n=/(?:\?([^#]*))?/.exec(i[3]),o=n[1]),o&&(l=o.split("&"),l&&l.length>0&&l.forEach(function(e){var a=e.split("="),t=a[0],i=a[1];r[t]=decodeURI(i)}))),{host:a+"/",hash:t,path:c,param:r}},getPageSegment:function(e){return templateCompile.call(e,$(e.template),e.viewModel)}};$.fn.serializeObject=function(){var e={},a=this.serializeArray();return a.forEach(function(a){e[a.name]=a.value}),this.find('input[type="checkbox"]').each(function(a,t){var i=$(this).attr("name"),s=e[i];s instanceof Array||(e[i]=[]),this.checked&&e[i].push($(this).val())}),e},module.exports={templateCompile:templateCompile,Component:Component,validator:_validator,utils:utils,onClickContainer:onClickContainer,getPromise:getPromise,createComponent:createComponent,changeTitle:function(e){document.title=e;var a=$('<iframe  frameborder="0" src="blank.html" style="display: none;"></iframe>');a[0].onload=function(){setTimeout(function(){try{a[0]&&(a[0].onload=null),a[0].remove()}catch(e){}},100)},a.appendTo($("body"))}}},function(e,a,t){function i(e){return n[e]}var s=(t(1),-1),n=["localhost:8080","192.168.1.118:8089","192.168.1.104:3000","192.168.1.116:80","192.168.1.117","192.168.1.118","192.168.1.119"];e.exports={api:{},switchHost:i,autoSwitchHost:function(){return 3===s++&&(s=0),i[s]}}},function(e,a,t){var i=t(1),s=t(2),n=i.utils,r=n.getInfoFromURL(location.href);window.pathUrl=r.path;var o=window.requirejs||function(e,a){e.forEach(function(e){function a(e){var a=!1;return $("script").each(function(t,i){var s=$(i),n=s.attr("src");return n.indexOf(e)>=0?(a=s,!1):void 0}),a}console.log(e);var t=e.match(/\/([^\/]+)$/)[1]+".js",i=a(t);i&&i.remove();var s=document.createElement("script");s.src="./app/js/"+t,s.type="text/javascript",document.body.appendChild(s)}),a&&a()},l={pageRecorder:[],$container:$("#container"),_pageStack:[],_defaultPage:null,_pageIndex:1,setDefault:function(e){return this._defaultPage=e||"home",this},reloadPage:function(){var e=/code=(.*?)(?=&|$|#)/,a=location.href;e.test(a)?location.href=location.href.replace(e,"wxId=123"):location.reload()},setRefreshPage:function(e){var a,t,i,s,n=!1,r=null,o=function(e){var t=e;try{i=t.touches[0].clientY,a=t.touches[0].clientX,n||0!==document.body.scrollTop||(n=!0)}catch(s){}},l=function(e){var a=e;s=a.changedTouches[0].clientY,t=a.changedTouches[0].clientX,n||0!==document.body.scrollTop||(n=!0),s-i>20&&$(".refresh-icon").attr("style","transform: rotate(3600deg);transition-duration: 5s; transition-delay: 0s; visibility: visible;"),clearTimeout(r),r=setTimeout(function(){s-i>30&&n&&(window.location.href=window.location.href+"?v="+Math.random()),$(".refresh-icon").css("visibility","hidden")},1e3)},c=function(e){$(".refresh-icon").css("visibility","hidden")};"home"===e?(document.ontouchstart=o,document.ontouchmove=l,document.ontouchend=c):(document.ontouchstart=null,document.ontouchmove=null,document.ontouchend=null)},setPageAppend:function(e){return this._pageAppend=e,this},beforeInit:function(){},init:function(){var e=this;history.state&&history.state._pageIndex&&(this._pageIndex=history.state._pageIndex),this._pageIndex--;var a=n.getInfoFromURL().hash||e._defaultPage;return e._go(a),this},showTooltip:function(e,a){a=a||"error";var t=$(".js_tooltips"),i="wait";"error"===a&&(t.removeClass("weui-toptips_success"),t.addClass("weui-toptips_error")),"success"===a&&(t.removeClass("weui-toptips_error"),t.addClass("weui-toptips_success")),"none"==t.css("display")&&($(".page.cell").removeClass("slideIn"),"wait"===i&&"none"===t.css("display")&&(t.text(e),t.css("display","block"),setTimeout(function(){t.css("display","none")},6e3)))},requestBackend:function(e){l.ajaxManager({url:e.url,data:e.param||{},type:e.type||"post",success:function(a){0!=a.code?l.showTooltip(a.message):e.success(a.data)},fail:function(a){l.showTooltip("服务器错误,"+a.responseText,"error"),e.fail&&e.fail(a)}})},ajaxManager:function(e){function a(a){var t=null,i=e.form?$(e.form):$("#container").children().last().find("form");return a?"[object Object]"===Object.prototype.toString.call(a)?t=$.extend({},{wxId:window.WXID},e.data):"string"==typeof a&&(t=a):t=0!==i.length?$.extend({},{wxId:window.WXID},i.serializeObject()):$.extend({},{wxId:window.WXID}),t}function t(e){var a;return a=e.success?e.success:e.successResult?e.successResult:null,function(e){5008===e.code||5010===e.code||5007===e.code||5009===e.code?n.securityVerification(e):a&&a(e)}}function i(e){return e.fail?function(a){a.responseText.match(/^\s*\[|{/)&&JSON.parse(a.responseText),console.error(a),e.fail(a)}:function(e){l.showTooltip("数据请求超时或者异常！请重试！"),console.error(e)}}var n=this,r=s.switchHost(e.hostIndex||0);return $.ajax({url:/http|https/.test(e.url)?e.url:"http://"+r+"/"+e.url||e.pathUrl,type:e.type||"post",data:a(e.data),dataType:e.dataType||"json",success:t(e),error:i(e)}),this},clearPageStack:function(e,a,t){var i=this,s=[],n="allPages"===e,r=$("#container").children("section");(t||!(1===r.length&&r.eq(0).hasClass('"'+e+'"')||1===i._pageStack.length&&i._pageStack[0].page===e))&&(r.each(function(t,i){var s=$(i).hasClass("page-"+e);(n||(a?s:!s))&&$(i).remove()}),i._pageStack.forEach(function(t,i){var r=t.page===e;n||(a?r:!r)||s.push(t)}),i._pageStack=s)},securityVerification:function(e){var a=this;a.clearPageStack("login"),location.hash="login";var t=e.message;5009!=e.code&&""!=t&&a.showTooltip(t,"error")},getCookie:function(e){var a=/([^=]*)=([^=]*)(?:;|$)/g,t=document.cookie.match(a),i={};return t&&t.forEach(function(e){var t=a.exec(e),s=t[1],n=t[2];i[s]=n}),i[e]},setCookie:function(e,a){document.cookie=e+"="+a},go:function(e){e&&(location.hash=e)},onHashChange:function(e){function a(e,a){console.log("%c%s","color:green",a);var t,i=!1;return a.replace(/(.*?)#(.*?)(v=.*?)(&.*)?$/,function(e,a,s,n,r){if(n){i=!0;var o=/(\?|&)(v=.*?)(&|$)/;o.test(a)?a=a.replace(/(\?|&)(v=.*?)(&|$)/,function(e,a,t,i){return("&"===a?"":a)+i}):a+=/\?/.test(a)?"":"?";var l=a+"&"+n+"#"+s+(r?r.replace(/^&/,""):"");l=l.replace("?&","?"),l=l.replace(/(\?|&)$/,""),t=l}}),"undefined"!=typeof t&&(location.href=t),i}var t=(history.state||{},n.getInfoFromURL().hash||l._defaultPage);if(!a(e.oldURL,e.newURL||location.href))if(l._findInStack(t)){for(var i,s=l._pageStack.length,r=[];s--&&(i=l._pageStack[s].page,r.push(i),i!==t););r.shift();for(var o=0;o<r.length;o++)l._back(r[o])}else l._go(t)},getPageHtml:function(e,a,t){$.ajax({url:"fragment/"+e+".html?V="+Math.random(),dataType:"html",success:function(t){a(t),$(".page-"+e).find("select").each(function(e,a){var t,i;if(t=$(a).closest("[data-component*=yy-select]"),0===t.length&&($(a).parent().attr("data-component","yy-select"),t=$(a).closest("[data-component*=yy-select]")),i=t.data("component"),$(a).parent().addClass("weui-cell-mask"),$(a).prev()[0]&&"EM"===$(a).prev()[0].tagName.toUpperCase()||$("<em></em>").insertBefore($(a)),n.getDeviceInfo().isIphone&&(!i||!i.disabled))try{t.find(".weui-cell-mask em").remove()}catch(s){console.log(s)}})},error:function(e){t(e),console.log(e)}})},compileHtml:function(e,a){var t,i;return/beforeRenderPage/.test(e)&&(e=e.replace(/(class="page[^"]+)"/,'$1 hidden"')),t=$(e),i=[],t=t.map(function(e,t){function s(){var e=$(t).text(),i="",s=";\n pageCfg.template = $("+n+").html();\n $("+n+').html(utils.getPageSegment(pageCfg));\n (pageCfg.afterRenderPage && pageCfg.afterRenderPage());\n _validator.init(".page-'+a+' form")';return i=/beforeRenderPage/.test(e)?"<script>$(function(){"+e+"$.when(pageCfg.beforeRenderPage()).then(function(res){\n $("+n+').removeClass("hidden");'+s+'},function(ex){\n  setTimeout(function(){pageManager.clearPageStack("'+a+'",true,true);},0);console.log("服务器错误");});});</script>':"<script>$(function(){"+e+s+";\n });</script>"}if(t instanceof HTMLScriptElement&&$(t).attr("id")&&-1!==$(t).attr("id").indexOf("pageCfg")){var n='".page-'+a+' .page"',r=$(t).attr("src");return r?i.push({type:"src",content:r}):i.push({type:"string",content:$(t).text()}),$(s())[0]}return t}),$('<section class="page-'+a+'"></section>').append(t)},loadPage:function(e,a){function t(e){var a=!1;return $("script[data-requiremodule]").each(function(t,i){i.src&&i.src.indexOf(e+".js")>=0&&(a=!0)}),a}return t(e)&&location.reload(),"other"===e?void o(["../app/js/page-js/other/"+e],a):void o(["../app/js/page-js/"+e],a)},initPage:function(e,a,t,s){var r=this,o=Math.random().toString().replace("0.",""),l={page:a,dom:null,id:o};r._pageStack.push(l);var c={type:"append",viewModel:{text:"数据加载中"}},d=i.createComponent("toast",c),p=$('<section class="page-'+a+'"></section>');t&&(e=n.getPageSegment({template:e,viewModel:t})),p.append(e),p.find(".page").addClass("slideIn").addClass(a),p.find(".page").on("animationend webkitAnimationEnd",function(){p.find(".page").removeClass("slideIn").addClass("js_show")});var u=p.find("[name = title]").val();i.changeTitle(u),$(document).off("click","#login"),d.destroy(),r.$container.append(p),l.dom=p,s&&s(p)},getFooterText:function(e,a){var t='<div class="page__ft"><p>{text}</p></div>',i="400-6506950",s=["咨询电话: {num}","如若您对体检数据有异议，请致电{num}咨询","问卷提交后将无法修改，提交前请再次确认。&lt;br&gt;>（若提交后发现信息有误，请联系客服重新填写{num}）"],n={apply:0,"user-active":0,home:0,"BSP-tzbs":2,"OGTT-testing":1,"OGTT-testingById":1,"tel-change":0,"tel-changing":0,"Physical-testingresult":1,"Physical-testingresultById":1},r=s[n[e]];if("undefined"!=typeof r){r=r.replace(/\{num\}/g,'<a href="tel:'+i+'"> '+i+" </a>");var o=t.replace(/\{text\}/g,r);a.find(".page").append(o)}},_go:function(e){var a=this;return this._pageIndex++,history.replaceState&&history.replaceState({_pageIndex:this._pageIndex},"",location.href),a.loadPage(e),this.setRefreshPage(e),this},back:function(){history.back()},_back:function(e){this._pageIndex--;var a=this,t=this._pageStack.pop();if(t){var s=this._findInStack(n.getInfoFromURL().hash);if(s){var r=a._pageStack[a._pageStack.length-1].dom.find("[name = title]").val();i.changeTitle(r)}else a.loadPage(e);return t.dom.find(".page").addClass("slideOut").on("animationend webkitAnimationEnd",function(){t.dom.remove()}),this.setRefreshPage(e),this}},_findInStack:function(e){for(var a=null,t=0,i=this._pageStack.length;i>t;t++){var s=this._pageStack[t];if(s.page===e){a=s;break}}return a},_bind:function(e){var a=e.events||{};for(var t in a)for(var i in a[t])this.$container.on(i,t,a[t][i]);e.isBind=!0}};e.exports=l},,,,,,,,,,,,,,function(e,a,t){e.exports='<div class=component-dialog data-bind=$root> <div class="js_dialog yy-template" data-bind=attr:{id:$root.id} style=opacity:1;display:block> <div class=weui-mask data-bind=click:$root.onClickMask></div> <div class=weui-dialog> <div class=weui-dialog__hd data-bind=text:$root.title data-if=$root.isShowTitle><strong class=weui-dialog__title></strong></div> <div class=weui-dialog__bd data-bind=html:$root.content></div> <div class=weui-dialog__ft data-bind=$root.isShowFooter data-if=$root.isShowFooter> <a href=javascript:; class="weui-dialog__btn weui-dialog__btn_primary" data-bind={text:$root.primaryText,click:$root.onClickPrimary} data-if=$root.isShowGrayButton></a> <a href=javascript:; class="weui-dialog__btn weui-dialog__btn_default" data-bind={text:$root.defaultText,click:$root.onClickDefault}></a> </div> </div> </div> </div>'},function(e,a,t){e.exports="<div class=component-select data-bind=$root.options> <div class=\"weui-cells weui-cells_checkbox\" data-bind=foreach:$root.options> <div class=\"weui-cell weui-check__label\" data-bind=click:$root.onSelected> <div class=weui-cell__hd> <input type=checkbox class=weui-check data-bind=value data-attr=\"{id:'yySelect'+$index,checked:checked?'checked':'false',value:value}\"> <i class=weui-icon-checked></i> </div> <div class=weui-cell__bd> <p data-bind=text:name></p> </div> </div> </div> </div>"},function(e,a,t){e.exports='<div id=loadingToast style=display:none data-bind=$root> <div class=weui-mask_transparent></div> <div class=weui-toast> <i class="weui-loading weui-icon_toast"></i> <p class=weui-toast__content data-bind=text:$root.text></p> </div> </div>'}]);
//# sourceMappingURL=common.js.map