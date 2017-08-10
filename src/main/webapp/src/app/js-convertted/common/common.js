
    
    var xTemplate = {};
    xTemplate.dialog = require('html-loader?-attrs!../../component/dialog.html');
    xTemplate.select = require('html-loader?-attrs!../../component/select.html');
    xTemplate.toast = require('html-loader?-attrs!../../component/toast.html');

    /**
     * 公共方法: 模板编译
     * @param segment{$HTMLElement} jquery dom 对象
     * @param data{Object} 数据模型对象
     * @return {$HTMLElement} 编译后的$dom对象
     * @example 在构造函数中
     * compile.call(this, $(htmlString), this.viewModel)
     * */
    function templateCompile(segment, data, parentData, $index, $parentIndex, dataPath) {
        var self = this, segmentWrapper, $excludeElement;
        if (typeof dataPath === 'undefined') {
            segmentWrapper = $('<div class="segment-wrapper"></div>');
            segment = segmentWrapper.append(segment);
        }
        $excludeElement = segment.find('[data-bind*=foreach]').find('[data-bind]');
        dataPath = dataPath || [];
        //segment.find('[data-bind]').filter(function (i, e) {
        //  return !parentsHasProperty($(e), 'data-bind', 'foreach');
        //});
        function myEval(str, data) {
            var func = 'with(data){' +
                'var result;' +
                'if(typeof str === "undefined"){str = "";}' +
                'str = str.replace(/{#([^{}]+)}/g, function(m1, m2){return data[m2];});' +
                'try{result = eval(str)}catch(ex){result = str; console.log(ex);} return result;}';
            return (new Function('data', 'str', func))(data, str);
        }

        function reDraw(newVal, matchs, evalScope, $elem, $index, dataPath) {
            var self = this;
            var evalStr = matchs instanceof Array ? matchs[2] : matchs;
            var _data = newVal || myEval(evalStr, evalScope);
            var _fragment = document.createDocumentFragment();
            var oldTemplate = $elem._template || ($elem._template = $elem.html());

            function createNewFragment(cfg) {
                var _compileElement;
                var _cloneElement = $elem.clone();
                _cloneElement.html(oldTemplate);
                _compileElement = (self.compile || templateCompile).call(self, _cloneElement, cfg.data, cfg.parentData, cfg.index, cfg.parentIndex, cfg.dataPath);
                _compileElement.children().each(function (index, element) {
                    //var e = $(element).clone()[0];
                    _fragment.appendChild(element);
                });
            }

            var _path;
            if (_data instanceof Array) {
                for (var i = 0, len = _data.length; i < len; i++) {
                    _path = (dataPath.push(evalStr + '[' + i + ']'), dataPath);
                    createNewFragment.call(self, {
                        data: _data[i],
                        parentData: (function () {
                            var num = 0;
                            var len = _path.length;
                            if (len > 0) {
                                num = len - 2;
                                num = num < 0 ? 0 : num;
                                return eval(_path[num]);
                            } else {
                                return null;
                            }
                        }()),
                        index: i,
                        parentIndex: $index,
                        dataPath: _path
                    });
                }
            } else if (Object.prototype.toString.call(_data) === '[object Object]') {
                _path = (dataPath.push(evalStr), dataPath);
                createNewFragment.call(self, {
                    data: _data,
                    parentData: parentData,
                    index: $index,
                    parentIndex: $parentIndex,
                    dataPath: _path
                });
            }
            $elem.html('');
            $elem.append(_fragment);
        }

        var bindElementsArray = Array.prototype.slice.call(segment.find('[data-bind]'));

        function forEachBindElements(index, element, parentData, $parentIndex) {
            var self = this;
            var $elem = $(element);
            var expression = $elem.attr('data-bind').replace(/\$root/g, 'self.viewModel');
            var dataAttrNames = ['data-if', 'data-href', 'data-attr', 'data-bind', 'data-class'];

            function getMatchs(expression) {
                var matchs = expression.match(/^\b(\w*?)\b:(.*)/);
                var matchs2 = expression.match(/^\{(.*)\}$/);
                var bindMatch = expression.match(/\(\(([^\(\)]+)\)\)/);
                var isBindMatch = false;
                if (matchs2) {
                    return {
                        isArray: true,
                        array: matchs2[1].split(',')
                    }
                }
                if (!matchs) {
                    if (bindMatch) {
                        return {
                            isOnlyBind: true,
                            matchs: bindMatch[1]
                        };
                    } else {
                        return false;
                    }
                }
                if (bindMatch) {
                    matchs[2] = bindMatch[1];
                    isBindMatch = true;
                }
                return {
                    matchs: matchs,
                    isBindMatch: isBindMatch
                };
            }

            if (elemIsInForeach($elem, $excludeElement)) {
                return;
            }
            if (typeof data === 'array') {
                data = {_arr_: data};
            }
            var watchList = [];
            with (data) {
                var ifAttr = $elem.attr(dataAttrNames[0]);
                var hrefAttr = $elem.attr(dataAttrNames[1]);
                var attrData = $elem.attr(dataAttrNames[2]);
                var $parent = parentData;
                var evalScope = $.extend({}, data, {
                    $parent: parentData,
                    $index: $index,
                    $parentIndex: $parentIndex,
                    self: self
                });
                var _bindEvent = function ($elem, matchs, $index, myEval, evalScope, data) {
                    $elem[0][('on' + matchs[1])] = (function ($index) {
                        return function (event) {
                            try {
                                var _eval = myEval(matchs[2], evalScope);
                                _eval.call(this, event, data, $index);
                            } catch (ex) {
                                console.warn('_eval:::', _eval, 'matchs:::', matchs[2], 'evalScope:::', evalScope);
                            }
                        }
                    })($index);
                };
                var isEventName = function (text) {
                    var result = false;
                    var textArr = ['click', 'blur', 'change', 'touch', 'focus', 'load', 'scroll', 'select'];
                    textArr.forEach(function (v) {
                        if (v === text) {
                            result = true;
                        }
                    });
                    return result;
                };
                if (ifAttr) {
                    ifAttr = ifAttr.replace(/\$root/g, 'self.viewModel');
                    if (!myEval(ifAttr, evalScope)) {
                        $elem.remove();
                        return;
                    }
                }
                if (hrefAttr) {
                    hrefAttr = hrefAttr.replace(/\$root/g, 'self.viewModel');
                    hrefAttr = myEval(hrefAttr, evalScope);
                    $elem.attr('href', hrefAttr);
                }
                var classAttr = $elem.attr(dataAttrNames[4]);
                if (classAttr) {
                    classAttr = classAttr.replace(/\$root/g, 'self.viewModel');
                    classAttr = myEval(classAttr, evalScope);
                    $elem.addClass(classAttr);
                }
                if (attrData) {
                    var attrMatchs;
                    attrMatchs = myEval('attrMatchs=' + attrData, evalScope);
                    for (var _name in attrMatchs) {
                        var _val = attrMatchs[_name];
                        if (_name === 'param' || _name === 'remoteCheck') {
                            _val = JSON.stringify(_val);
                            _name = 'data-' + _name;
                        }
                        if (_name === 'addClass') {
                            $elem.addClass(_val);
                        } else {
                            $elem.attr(_name, _val);
                        }
                    }
                }

                var matchResult = getMatchs(expression);
                if (matchResult) {
                    if (matchResult.isArray) {
                        for (var _m = 0, _item, itemMatchResult; _m < matchResult.array.length; _m++) {
                            _item = matchResult.array[_m];
                            itemMatchResult = getMatchs(_item);
                            if (itemMatchResult) {
                                putValues.call(self, itemMatchResult.matchs, itemMatchResult.isBindMatch, evalScope, $elem, watchList, reDraw, myEval, isEventName, _bindEvent);
                            }
                        }
                    } else if (matchResult.isOnlyBind) {
                        $elem._template = $elem.html();
                        watchList.push({
                            key: matchResult.matchs,
                            Func: function (newVal) {
                                reDraw.call(self, newVal, matchResult.matchs, evalScope, $elem, $index, dataPath);
                            }
                        });
                    } else {
                        putValues.call(self, matchResult.matchs, matchResult.isBindMatch, evalScope, $elem, watchList, reDraw, myEval, isEventName, _bindEvent);
                    }
                }

                function putValues(matchs, isBindMatch, evalScope, $elem, watchList, reDraw, myEval, isEventName, _bindEvent) {
                    var self = this;
                    if (matchs) {
                        switch (matchs[1]) {
                            case 'text':
                                if (matchs[2] === '[]') {
                                    $elem.text(data);
                                } else {
                                    $elem.text(myEval(matchs[2], evalScope));
                                    if (isBindMatch) {
                                        watchList.push({
                                            key: matchs[2],
                                            Func: function (newVal) {
                                                $elem.text(newVal);
                                            }
                                        });
                                    }
                                }
                                break;
                            case 'html':
                                $elem.html(myEval(matchs[2], evalScope));
                                if (isBindMatch) {
                                    watchList.push({
                                        key: matchs[2],
                                        Func: function (newVal) {
                                            $elem.html(newVal);
                                        }
                                    });
                                }
                                break;
                            case 'foreach':
                                $elem._template = $elem.html();
                                reDraw.call(self, null, matchs, evalScope, $elem, evalScope.$index, dataPath);
                                if (isBindMatch) {
                                    watchList.push({
                                        key: matchs[2],
                                        Func: function (newVal) {
                                            reDraw.call(self, newVal, matchs, evalScope, $elem, evalScope.$index, dataPath);
                                        }
                                    });
                                }
                                break;
                            case 'attr':
                                //todo:attr:{a:'t1', b:'t2'}
                                var attrMatchs = matchs[2].match(/{(\w.*?):(.*)}/);
                                var _evalResult = myEval(attrMatchs[2], evalScope);
                                $elem.attr(attrMatchs[1], (attrMatchs[1] === 'data-param' || attrMatchs[1] === 'data-remote-check') ? JSON.stringify(_evalResult) : _evalResult);
                                var match2, watchStr;
                                if ((match2 = /^([\w\.]+)\b.*?\?.*:/.exec(attrMatchs[2])) !== null) {
                                    watchStr = match2[1];
                                }
                                if (isBindMatch) {
                                    watchList.push({
                                        key: matchs[2],
                                        Func: function (newVal) {
                                            $elem.attr(attrMatchs[1], myEval(attrMatchs[2], evalScope));
                                        }
                                    });
                                }
                                break;
                            default:
                                if (isEventName(matchs[1])) {
                                    _bindEvent($elem, matchs, $index, myEval, evalScope, data);
                                }
                                break;
                        }
                    }
                }

                // console.log('%c%s', 'color:green', self);
                try {
                    watch.call(self, watchList, data, self.viewModel);
                } catch (ex) {
                }
            }
            //dataAttrNames.forEach(function (e) {
            //  $elem.removeAttr(e);
            //});

        }

        for (var _i = 0; _i < bindElementsArray.length; _i++) {
            // if($(bindElementsArray[_i]).closest('[data-bind^="(("]').length !== 0 && $(bindElementsArray[_i]).closest('[data-bind^="(("]')[0] !== bindElementsArray[_i]){
            forEachBindElements.call(self, _i, bindElementsArray[_i], parentData, $parentIndex);
            // }
        }

        dataPath.pop();

        return segment.hasClass('segment-wrapper') ? segment.children() : segment;

        function elemIsInForeach($elem, $excludeElement) {
            var result = false;
            $excludeElement.each(function (index, elem) {
                if (elem === $elem[0]) {
                    result = true;
                }
            });
            return result;
        }

        function parentsHasProperty(element, proName, proValue) {
            var parent = element.parent();
            var _proName = proName;
            var reg = new RegExp('\\b' + proValue + '\\b');
            var isHas = false;
            element.parents().each(function () {
                var proName = $(this).attr(_proName);
                if (typeof proName !== 'undefined' && reg.test(proValue)) {
                    isHas = true;
                }
            });
            return isHas;
        }

        function watch(watchList, obj, modelRoot) {
            var self = this;
            for (var i = 0, item, arr = []; i < watchList.length; i++) {
                item = watchList[i];
                item.Func = [item.Func];
                for (var n = 0, item2, isRepeat = false; n < arr.length; n++) {
                    item2 = arr[n];
                    if (item.key === item2.key) {
                        item2.Func = item2.Func.concat(item.Func);
                        isRepeat = true;
                    }
                }
                !isRepeat && arr.push(item);
            }
            watchList = arr;
            watchList.forEach(function (item) {
                var watchStr = item.key, value, watchHandler, watchObj, match;
                var defaultSetFunc = function (newVal) {
                    var oldVal = value;
                    value = newVal;
                    if (watchHandler instanceof Array) {
                        watchHandler.forEach(function (handler) {
                            handler.call(self, newVal, oldVal);
                        });
                    } else {
                        watchHandler.call(self, newVal, oldVal);
                    }
                };
                if ((match = /self.viewModel.(.*)/.exec(watchStr))) {
                    watchObj = modelRoot;
                    watchStr = match[1];
                } else {
                    watchObj = obj;
                }
                if (/\./.test(watchStr)) {
                    var splitter = watchStr.split(/\./);
                    watchStr = splitter.pop();
                    watchObj = myEval(splitter.join('.'), watchObj)
                }
                if (/\{#([^{}]+)\}/.test(watchStr)) {
                    watchStr = /\{#([^{}]+)\}/.exec(watchStr)[1];
                }
                value = watchObj[watchStr];
                (function (scope) {
                    watchHandler = typeof item.Func !== 'string' ? item.Func : eval(item.Func);
                })(obj);

                Object.defineProperty(watchObj, watchStr, {
                    get: function () {
                        return value;
                    },
                    set: defaultSetFunc
                });
            });
        }

    }

    /**
     * 组件基类
     * @param dataModel{object}[optional] 视图层的数据模型
     * @param template{string}[required] html模板字符串
     * @param container{string}[optional] 指定渲染的容器
     * @param onEmpty{fuction}[optional] 当空数据的时候
     * @param type{string}[optional] 加到页面里的方法
     * */
    function Component(dataModel, template, templateCompile, container, type) {
        var segment;
        var container = $(container || '#widgetContainer');
        this.init = function () {
            this.viewModel = dataModel;
            this.compile = templateCompile;
            segment = this.compile($(template), this.viewModel);
            container.css('zIndex', 9999999);
        };
        this.destroy = function () {
            segment.fadeOut(100);
            setTimeout(function () {
                segment.remove();
            }, 100);
            container.css('zIndex', -9);
        };
        this.init();
        // segment.css('display', 'none');
        if (type === 'append') {//如果append方式就添加进页面否则就替换原有的内容
            container.append(segment);
            segment.fadeIn(200);
        } else {
            container.html(segment);
            segment.fadeIn(200);
        }

    }

    /**
     * 创建自定义组件的方法
     * @param componentName{string}[required]组件的名称
     * @param cfg{string}[required] 配置
     * */
    function createComponent(componentName, cfg) {
        var componentTagElement = $('#component' + componentName.replace(/^(.)/, function (m1, m2) {
                return m2.toUpperCase();
            }));

        var template;
        if (componentTagElement.length > 0) {
            if (cfg.templateSelector) {
                template = $(cfg.templateSelector).html();
            } else {
                template = componentElement.html().match(/<!\[CDATA\[([\s\S]*?)\]\]>/m)[1].trim()
            }
        } else {
            template = xTemplate[componentName];
        }
        return new Component(cfg.viewModel, template, templateCompile, cfg.container, cfg.type);
    }

//表单字段验证器
    var _validator = {
        hasBindSubmit: false,
        submitHandler: function (event) {
            var target = event.target;
            var pageElement = $(target).closest('section[class*="page-"]');
            var hasError = false;
            var formElement = $(pageElement.find('form'));
            var action = formElement.attr('action');
            var callback = formElement.attr('data-callback');
            var checkArray = [];
            var hasScroll = false;
            formElement.find('[data-rule]').filter(function () {
                return $(this).attr('questioncheck') || utils.visible(this);
            }).each(function (i, e) {
                var name = $(this).attr('name');
                if ($(this).attr('questioncheck')) {
                    name = $(this).attr('id').replace('_temp', '');
                    var inputElements = pageElement.find('[name=' + name + ']');
                    var questionElement = inputElements.eq(0).closest('.question');
                    if (utils.visible(questionElement) && _validator.checkHasChecked(inputElements) === 0) {
                        pageManager.showTooltip('请选择:' + (questionElement.find('.question-title').text() || questionElement.find('.title').text()), 'error');
                        questionElement.attr('haserror', 'true');
                        if (!hasScroll) {
                            setTimeout(function () {
                                $('.question').each(function (i, e) {
                                    var $this = $(e);
                                    var errorInput = $this.find('.error-input');
                                    var errorCheckBox = $this.attr('haserror');
                                    var page = $this.closest('.page');
                                    if ((errorInput.length > 0 || errorCheckBox) && !hasScroll) {
                                        console.log(this);
                                        this.scrollIntoView();
                                        hasScroll = true;
                                        page[0].scrollTop -= 50;
                                    }
                                });
                            }, 0);
                        }
                    } else {
                        questionElement.removeAttr('haserror');
                    }
                    return;
                }
                checkArray.push(_validator.checkRule.call(this));
            });
            if ($(target).attr('onclick') && $(target).attr('onclick').indexOf('confirmSubmit') !== -1) {
                return false;
            }
            function postData() {
                _validator.removeAllErrorIcon();
                pageManager.ajaxManager({
                    url: action,
                    form: formElement,
                    success: function (res) {
                        if (!_validator.responseHandler(res)) {
                            if (callback) {
                                location.hash = callback.replace('#', '') + 'v=' + Math.random();
                            }
                        }
                    },
                    fail: function () {
                        pageManager.showTooltip('数据连接超时或异常', 'error');
                    }
                })();
            }

            $.when.apply($, checkArray).done(function () {
                var args = Array.prototype.slice.call(arguments);
                args.forEach(function (res) {
                    if (res._error) {
                        hasError = true;
                    }
                });
                if (!hasError) {
                    postData();
                }
            }).fail(function (ex) {
                console.warn(ex);
            }).always(function (res) {
                console.log(res);
            });
            _validator.hasBindSubmit = true;
            event.preventDefault();
            event.stopPropagation();
            return false;
        },
        init: function (formSelector) {
            $(formSelector || 'form').find('[data-rule]').each(function (i, e) {
                var oldBlur = this.onblur;
                var elem = this;
                var onblurHandler = function (e) {
                    $.when(_validator.checkRule.call(this, e)).then(
                        function (res) {//没错误时
                            oldBlur && oldBlur.call(elem, e);
                        },
                        function (msg) {//有错误时
                            console.warn(msg);
                        }
                    );
                };
                this.onblur = onblurHandler;
                var timer;
                this.onkeyup = function (event) {
                    var elem = this;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        $.when(_validator.checkRule.call(elem, e)).then(
                            function (res) {//没错误时
                                $(elem).closest('.weui-cell').removeClass('weui-cell_warn');
                            },
                            function (msg) {//有错误时
                                console.warn(msg);
                            }
                        );
                        ;
                    }, 2000);
                };
            });
        },
        initForQuestionnaire: function (page) {
            var checkboxNames = {}, radioNames = {};
            var pages = 'BSP-birthed,BSP-food,BSP-sleep,BSP-smoking,BSP-sport,BSP-tzbs,BSP-wine,';
            if (pages.indexOf(page + ',') === -1) {
                return;
            }
            var pageName = '.page-' + utils.getInfoFromURL().hash;
            //文本框添加标记
            $(pageName).find('input[type=text]').filter(function () {
                return !($(this).siblings().find('[type=checkbox]').length > 1);
            }).attr('data-rule', 'noEmpty');
            //复选框添加标记
            $(pageName).find('input[type=checkbox]').each(function (i, e) {
                checkboxNames[$(e).attr('name')] = 1;
            });
            for (var name1 in checkboxNames) {
                $(pageName).find('[name=' + name1 + ']').after('<input type="hidden" id="' + name1 + '_temp" data-rule="noEmpty" questioncheck="true">');
            }
            //单选框添加标记
            $(pageName).find('input[type=radio]').each(function (i, e) {
                radioNames[$(e).attr('name')] = 1;
            });
            for (var name2 in radioNames) {
                $(pageName).find('[name=' + name2 + ']').last().after('<input type="hidden" id="' + name2 + '_temp" data-rule="noEmpty" questioncheck="true">');
            }
            $(pageName).find('.weui-btn_primary').addClass('submit');
            _validator.init(pageName + ' form');
        },
        checkHasChecked: function (inputElements) {
            var num = 0;
            inputElements.each(function (i, e) {
                if (e.checked) {
                    num += 1;
                }
            });
            return num;
        },
        responseHandler: function (res) {
            if (res.code != 0) {
                _validator.addErrorMsg.call(this, res.message);
                console.log('%c%s', 'color:orange', 'error');
                return res.message;
            } else {
                console.log('%c%s', 'color:green', 'success');
                return false;
            }
        }
        ,
        checkRule: function () {
            var deferred = $.Deferred();
            var targetElement = this;
            var msg = _validator.getError.call(this);
            var remoteCheck = $(this).attr('data-remoteCheck');
            var paramData = $(this).attr('data-param');
            if (msg) {//前端校验
                if (msg === '输入不能为空') {
                    try {
                        var title = $(this).closest('.question').find('.title');
                        msg = (title.text() || $(this).closest('.question').find('.question-title').text()) + '--' + msg;
                    } catch (ex) {
                    }
                }
                _validator.addErrorMsg.call(this, msg);
                deferred.reject({_error: msg});
                return deferred.promise();
            } else {//后端校验
                paramData = paramData ? JSON.parse(paramData) : {};
                remoteCheck = remoteCheck ? JSON.parse(remoteCheck) : {};
                if (remoteCheck.url) {
                    var _paramData = {};
                    if (remoteCheck.params) {
                        remoteCheck.params.forEach(function (v) {
                            _paramData[v] = null;
                        });
                    }
                    _paramData[$(this).attr('name')] = $(this).val();
                    window.pageManager.ajaxManager({
                        url: remoteCheck.url,
                        type: 'post',
                        data: $.extend({}, _paramData, paramData),
                        success: function (res) {
                            var msg = _validator.responseHandler.call(targetElement, res);
                            if (msg) {
                                deferred.reject({_error: msg});
                            } else {
                                _validator.removeErrorMsg.call(targetElement);
                                deferred.resolve({_noError: true});
                            }
                        },
                        fail: function (ex) {
                            deferred.reject({_error: ex});
                            console.log(ex);
                        }
                    })();
                } else {
                    _validator.removeErrorMsg.call(this);
                    deferred.resolve({_noError: true});
                }
            }
            return deferred.promise();
        }
        ,
        getError: function () {
            var element = this;
            var formElement = $(this).closest('.weui-cells_form');
            var rules = {
                mobile: {
                    reg: '(\\+86)\?1[3,5,6,7,8]\\d{9}',
                    errorMsg: '手机号格式不正确'
                },
                number: {
                    reg: '\\d+',
                    errorMsg: '请输入正确的数字'
                },
                verification: {
                    reg: '\\d{6}',
                    errorMsg: '请输入正确的验证码'
                },
                idCard: {
                    reg: '[0-9a-zA-Z]{15,20}',
                    errorMsg: '您输入的身份证号有误，请核对后再次输入'
                },
                noEmpty: {
                    reg: '\\S+',
                    errorMsg: '输入不能为空'
                },
                streetDetail: {
                    reg: '\\S+',
                    errorMsg: '详细地址不能为空'
                },
                birthday: {
                    reg: '\\S+',
                    errorMsg: '出生日期不能为空'
                },
                password: {
                    reg: '[^\\s\\t\\n\\r]{8,}',
                    errorMsg: '密码格式不正确，输入英文大小写字母，数字，特殊符号均可，至少8位'
                },
                verifyPassword: [{
                    reg: '[^\\s\\t\\n\\r]{8,}',
                    errorMsg: '密码格式不正确，输入英文大小写字母，数字，特殊符号均可，至少8位'
                }, {
                    expression: '"{#confirmPassword}" === "{#password}" || "{#confirmPassword}" === "{#newPassword}"',
                    errorMsg: '两次输入的密码不一致'
                }],
                name: {
                    reg: '[^\\s\\t\\n\\r]{2,10}',
                    errorMsg: '请输入2-10个字的名字'
                }
            };
            var thisRule = rules[$(this).attr('data-rule')];
            var regFromAttr = $(this).attr('pattern');
            if (thisRule) {
                if (!(thisRule instanceof Array)) {
                    thisRule = [thisRule];
                }
                for (var i = 0, _rule, regStr; i < thisRule.length; i++) {
                    _rule = thisRule[i];
                    if (_rule.reg) {
                        regStr = _rule.reg || regFromAttr;
                        var reg = new RegExp('^' + regStr + '$');
                        if (!reg.test($(this).val())) {
                            return _rule.errorMsg || '请输入正确的' + $(this).attr('title');
                        }
                    }
                    if (_rule.expression) {
                        _rule.expression = _rule.expression.replace(/{#([^{}]+)}/g, function (m1, m2) {
                            return formElement.find('[name="' + m2 + '"]').val() || '';
                        });
                        var _result;
                        try {
                            _result = eval(_rule.expression);
                        } catch (ex) {
                            console.log('_result', ex);
                            _result = false;
                        }
                        if (!_result) {
                            return _rule.errorMsg || '请输入正确的' + $(this).attr('title');
                        }

                    }
                }
            }
        }
        ,
        removeAllErrorIcon: function () {
            $('.weui-cell_warn').removeClass('weui-cell_warn');
        }
        ,
        removeErrorMsg: function () {
            var $this = $(this);
            var cellElement = $this.closest('.weui-cell');
            if (cellElement.length === 0) {
                var hasError = $this.hasClass('error-input');
                if ($this.attr('placeholder') === '不能为空') {
                    $this.attr('placeholder', '');
                }
                if (hasError) {
                    $this.removeClass('error-input');
                }
                if (typeof $this.attr('data-rule') !== 'undefined' && $this.val().trim() === '') {
                    $this.attr('placeholder', '不能为空');
                    $this.addClass('error-input');
                }
            } else {
                cellElement.removeClass('weui-cell_warn');
            }
        }
        ,
        addErrorMsg: function (msg) {
            var $this = $(this);
            var cellElement = $this.closest('.weui-cell');
            if (cellElement.length === 0) {
                if (typeof $this.attr('data-rule') !== 'undefined' && $this.val().trim() === '') {
                    $this.attr('placeholder', '不能为空');
                    $this.addClass('error-input');
                }
            } else {
                cellElement.addClass('weui-cell_warn');
            }
            pageManager.showTooltip(msg);
        }
    };

    var utils = {
        visible: function (elem) {
            elem = $(elem)
            return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
        },
        paramToString: function (obj) {
            var strArr = [];
            for (var name in obj) {
                strArr.push(name + '=' + obj[name]);
            }
            return strArr.join('&');
        },
        getDeviceInfo: function () {
            var userAgent = navigator.userAgent;
            return {
                isIphone: /[Ii][Pp]hone/.test(userAgent),
                isAndroid: /[Aa]ndroid/.test(userAgent)
            };
        },
        getInfoFromURL: function (url) {
            var host, hash, paramObj = {}, paramStr = '', paramArr = [], paramObj = {}, match1, match2, match3;
            url = url || location.href;
            match1 = /(((?:http:\/\/|https:\/\/|file:\/\/\/)[^\/]+).*)\/.*?(#?.*)$/.exec(url);
            //临时增加的
            var path = match1[1];
            host = match1[2];
            if (match1[3]) {
                match2 = /(?:\?([^#]*))?#([^\?]*)(?:\?(.*))?/.exec(match1[3]);
                if (match2) {
                    hash = match2[2];
                    paramStr = (match2[1] || '') + (match2[3] ? (match2[1] ? '&' : '') + match2[3] : '');
                } else {
                    match3 = /(?:\?([^#]*))?/.exec(match1[3]);
                    paramStr = match3[1];
                }
                if (paramStr) {
                    paramArr = paramStr.split('&');
                    if (paramArr && paramArr.length > 0) {
                        paramArr.forEach(function (v) {
                            var d = v.split('=');
                            var key = d[0];
                            var value = d[1];
                            // console.log(decodeURI(value));
                            paramObj[key] = decodeURI(value);
                        });
                    }
                }
            }
            return {
                host: host + '/',
                hash: hash,
                path: path,
                param: paramObj
            };
        },
        /**获得编译后的页面片段*/
        getPageSegment: function (cfg) {
            return templateCompile.call(cfg, $(cfg.template), cfg.viewModel)
        }
    };

//监听其它点击事件
    function onClickContainer(event) {
        var target = $(event.target);
        var component = target.closest('[data-component]');
        var router = target.closest('.js-router');
        var submitButton = target.closest('.submit');
        var tagName = target[0].tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
            target[0].focus();
        }
        if (submitButton.length > 0) {
            if (target[0].tagName.toUpperCase() === 'EM') {
                target[0].onclick();
            } else {
                _validator.submitHandler(event);
            }
        }
        //点击router
        if (router.length > 0) {
            router = router.data('router');
            window.pageManager.go(router);
        }
        //点击自定义组件
        if (component.length > 0) {
            var componentCfg = component.data('component');
            var componentName = componentCfg;
            if (componentCfg.toString() === '[object Object]') {
                componentName = componentCfg.name;
            }
            switch (componentName.replace('yy-', '')) {
                case 'select':
                    if (target[0].tagName.toUpperCase() !== 'EM' || componentCfg.disabled) {
                        return false;
                    }
                    var optionData = [];
                    var hideFirst = componentCfg.hideFirst;
                    component.find('select').find('option').each(function (i, e) {
                        if (i === 0 && (hideFirst || $(e).attr('hidden') == 'true' || /选择/.test($(e).text()))) {
                            return;
                        }
                        optionData.push({
                            value: $(e).attr('value'),
                            checked: e.selected,
                            name: $(e).text()
                        });
                    });
                    var IdNum = parseInt(Math.random() * 1000000, 10);
                    var newSelectId = 'select' + IdNum;
                    component.find('select').attr('data-widgetID', newSelectId);
                    var dialogCfg = {
                        type: 'append',
                        viewModel: {
                            id: 'dialog' + IdNum,
                            isShowTitle: false,
                            isShowFooter: false,
                            title: '标题',
                            content: '',
                            primaryText: '是',
                            onClickPrimaryText: function (event, data) {
                            },
                            defaultText: '否',
                            onClickDefault: function (event, data) {
                            },
                            onClickMask: function (event, data) {
                                setSelectData();
                            }
                        }
                    };

                function setSelectData() {
                    var value;
                    var elementId = '[data-widgetID="' + newSelectId + '"]';
                    $('.component-select').find('input').each(function (i, e) {
                        if (e.checked) {
                            value = e.value;
                        }
                    });
                    $(elementId).val(value);
                    $(elementId).trigger('change');
                    $(elementId).children().each(function (i, e) {
                        if (e.value === value) {
                            $(e).trigger('click');
                        }
                    });
                    setTimeout(function () {
                        $('#widgetContainer')[0].onclick = null;
                        dialogComponent.destroy();
                    }, 0);
                }

                    var dialogComponent = createComponent('dialog', dialogCfg);
                    var selectCfg = {
                        container: '#dialog' + IdNum + ' .weui-dialog__bd',
                        type: 'html',
                        viewModel: {
                            onSelected: function (event, data, index) {
                                var target = $(event.target);
                                var item = target.closest('.weui-check__label');
                                $(item).siblings().find('input').each(function (i, e) {
                                    e.checked = false;
                                });
                                item.find('input')[0].checked = true;
                                setSelectData();
                                return false;
                            },
                            options: optionData //下拉选项的值和选中所组成的数组
                        }
                    };
                    createComponent('select', selectCfg);
                    $('[checked=false]').removeAttr('checked');
                    break;

            }
            return false;
        }
    }

    //异步获取静态资源
    function getPromise(file, dataType) {
        var deffered = new $.Deferred();
        $.ajax({
            url: file,
            type: 'get',
            dataType: dataType,
            success: function (res) {
                var result = res;
                if (dataType === 'html') {
                    if (/html segment/.test(res)) {
                        result = res.match(/html segment begin -->(.*?)<!-- html segment end/)[1];
                    }
                }
                deffered.resolve(result);
            }
        });
        return deffered.promise();
    }

    //添加form表单ajax提交的参数方法
    $.fn.serializeObject = function () {
        var obj = {};
        var array = this.serializeArray();
        array.forEach(function (v) {
            obj[v.name] = v.value;
        });
        this.find('input[type="checkbox"]').each(function (i, e) {
            var name = $(this).attr('name');
            var checkbox = obj[name];
            if (!(checkbox instanceof Array)) {
                obj[name] = [];
            }
            if (this.checked) {
                obj[name].push($(this).val());
            }
        });
        return obj;
    };

    module.exports = {
        templateCompile: templateCompile,
        Component: Component,
        validator: _validator,
        utils: utils,
        onClickContainer: onClickContainer,
        getPromise: getPromise,
        createComponent: createComponent,
        changeTitle: function (title) {
            document.title = title;
            var $iframe = $('<iframe  frameborder="0" src="blank.html" style="display: none;"></iframe>');
            $iframe[0].onload = function () {
                setTimeout(function () {
                    try {
                        $iframe[0] && ($iframe[0].onload = null);
                        $iframe[0].remove();
                    } catch (ex) {
                    }
                }, 100);
            };
            $iframe.appendTo($('body'));
        }
    };
    
