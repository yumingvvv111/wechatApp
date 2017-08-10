
    
    var common = require('common');
    var restAPI = require('restAPI');
    var utils = common.utils;
    var infoFromURL = utils.getInfoFromURL(location.href);
    window.pathUrl = infoFromURL.path;
    var myRequire = window.requirejs || function (requireArr, callback) {
            requireArr.forEach(function (v) {
                var scriptName = v.match(/\/([^\/]+)$/)[1] + '.js';
                var oldScript = getOldScript(scriptName);

                function getOldScript(scriptName) {
                    var exist = false;
                    $('script').each(function (i, e) {
                        var $e = $(e);
                        var src = $e.attr('src');
                        if (src.indexOf(scriptName) >= 0) {
                            exist = $e;
                            return false;
                        }
                    });
                    return exist;
                }

                if (oldScript) {
                    oldScript.remove();
                }
                var newScript = document.createElement('script');
                newScript.src = './app/js/' + scriptName;
                newScript.type = 'text/javascript'
                document.body.appendChild(newScript);
                callback && callback();
            });

        };
    var pageManager = {
        pageRecorder: [],
        $container: $('#container'),
        _pageStack: [],
        _defaultPage: null,
        _pageIndex: 1,
        refreshPageArray: [],
        setDefault: function (defaultPage) {
            this._defaultPage = defaultPage || 'home';
            return this;
        },
        reloadPage: function () {
            var reg = /code=(.*?)(?=&|$|#)/;
            var href = location.href;
            if (reg.test(href)) {
                location.href = location.href.replace(reg, 'wxId=123');
            } else {
                location.reload();
            }
        },
        setRefreshPage: function (pagesArray, callback) {
            //添加下拉刷新的行为。
            var startX, endX, startY, endY, isArrivedTop = false;
            var page = infoFromURL.hash;
            var timer = null;
            var pages = this.refreshPageArray.concat(pagesArray);
            var onTouchstart = function (event) {
                var originalEvent = event;
                try {
                    startY = originalEvent.touches[0].clientY;
                    startX = originalEvent.touches[0].clientX;
                    // console.log(startX, startY);
                    // $('<p>'+document.body.scrollTop+'</p>').insertBefore('body');
                    if (document.body.scrollTop === 0 && $('.' + page).scrollTop() === 0) {
                        isArrivedTop = true;
                    } else {
                        isArrivedTop = false;
                    }
                } catch (ex) {
                }
            };
            var onTouchmove = function (event) {
                var originalEvent = event;
                endY = originalEvent.changedTouches[0].clientY;
                endX = originalEvent.changedTouches[0].clientX;
                if (endY - startY > 20 && isArrivedTop) {
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        callback && callback();
                    }, 1000);
                }
            };
            var onTouchend = function (event) {
                // $('.refresh-icon').css('visibility', 'hidden');
            };
            if (pages.indexOf(page) >= 0) {
                document.ontouchstart = onTouchstart;
                document.ontouchmove = onTouchmove;
                document.ontouchend = onTouchend;
            } else {
                document.ontouchstart = null;
                document.ontouchmove = null;
                document.ontouchend = null;
            }
        },
        setPageAppend: function (pageAppend) {
            this._pageAppend = pageAppend;
            return this;
        },
        beforeInit: function () {
        },
        init: function () {
            var self = this;

            if (history.state && history.state._pageIndex) {
                this._pageIndex = history.state._pageIndex;
            }

            this._pageIndex--;

            var page = utils.getInfoFromURL().hash || self._defaultPage;
            self._go(page);
            return this;
        },
        showTooltip: function (msg, type) {
            type = type || 'error';
            var $tooltips = $('.js_tooltips');
            var showType = 'wait';
            if (type === 'error') {
                $tooltips.removeClass('weui-toptips_success');
                $tooltips.addClass('weui-toptips_error');
            }
            if (type === 'success') {
                $tooltips.removeClass('weui-toptips_error');
                $tooltips.addClass('weui-toptips_success');
            }
            if ($tooltips.css('display') != 'none') return;
            // toptips的fixed, 如果有`animation`, `position: fixed`不生效
            $('.page.cell').removeClass('slideIn');
            if (showType === 'wait' && $tooltips.css('display') === 'none') {
                $tooltips.text(msg);
                $tooltips.css('display', 'block');
                setTimeout(function () {
                    $tooltips.css('display', 'none');
                }, 6000);
            }
        },

        requestBackend: function (cfg) {
            pageManager.ajaxManager({
                //hostIndex: 2,
                url: cfg.url,
                data: cfg.param || {},
                type: cfg.type || 'post',
                success: function (res) {
                    if (res.code != 0) {
                        pageManager.showTooltip(res.message);
                    } else {
                        cfg.success(res.data);
                    }
                },
                fail: function (ex) {
                    pageManager.showTooltip('服务器错误,' + ex.responseText, 'error');
                    cfg.fail && cfg.fail(ex);
                }
            });
        },
        ajaxManager: function (cfg) {
            var self = this;
            var host = restAPI.switchHost(cfg.hostIndex || 0);

            function getSendData(data) {
                var result = null;
                var formElement = cfg.form ? $(cfg.form) : $('#container').children().last().find('form');
                if (data) {
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        result = $.extend({}, {wxId: window.WXID}, cfg.data);
                    } else if (typeof data === 'string') {
                        result = data;
                    }
                } else {
                    if (formElement.length !== 0) {
                        result = $.extend({}, {wxId: window.WXID}, formElement.serializeObject());
                    } else {
                        result = $.extend({}, {wxId: window.WXID});
                    }
                }
                return result;
            }

            function getSuccessHandler(cfg) {
                var fn;
                if (cfg.success) {
                    fn = cfg.success;
                } else if (cfg.successResult) {
                    fn = cfg.successResult;
                } else {
                    fn = null;
                }
                return function (res) {
                    if (res.code === 5008 || res.code === 5010 || res.code === 5007 || res.code === 5009) {
                        self.securityVerification(res);
                    } else {
                        fn && fn(res);
                    }
                };
            }

            function getErrorHandler(cfg) {
                if (cfg.fail) {
                    return function (ex) {
                        if (ex.responseText.match(/^\s*\[|{/)) {
                            JSON.parse(ex.responseText);
                        }
                        console.error(ex);
                        cfg.fail(ex);
                    };
                } else {
                    return function (ex) {
                        pageManager.showTooltip('数据请求超时或者异常！请重试！');
                        console.error(ex)
                    };
                }
            }

            $.ajax({
                url: /http|https/.test(cfg.url) ? cfg.url : ('http://' + host + '/' + cfg.url || cfg.pathUrl),
                type: cfg.type || 'post',
                data: getSendData(cfg.data),
                dataType: cfg.dataType || 'json',
                success: getSuccessHandler(cfg),
                error: getErrorHandler(cfg)
            });
            return this;
        },
        clearPageStack: function (pageName, isContain, notReturn) {
            var self = this;
            var newStack = [];
            var isAll = pageName === 'allPages';
            var containerChildren = $('#container').children('section');
            // 如果只剩一个login则返回
            if (!notReturn &&
                ((containerChildren.length === 1 && containerChildren.eq(0).hasClass('"' + pageName + '"')) || (self._pageStack.length === 1 && self._pageStack[0].page === pageName))
            ) {
                return;
            }
            containerChildren.each(function (i, e) {
                var hasClass = $(e).hasClass('page-' + pageName);
                if (isAll || (isContain ? hasClass : !hasClass)) {
                    $(e).remove();
                }
            });
            self._pageStack.forEach(function (e, i) {
                var isEqual = e.page === pageName;
                if (!(isAll || (isContain ? isEqual : !isEqual))) {
                    newStack.push(e);
                }
            });
            self._pageStack = newStack;
        },
        securityVerification: function (res) {
            var self = this;
            self.clearPageStack('login');
            location.hash = 'login';
            var msg = res.message;
            //In addition to exit the other state
            if (res.code != 5009) {
                if ("" != msg) {
                    self.showTooltip(msg, 'error');
                }
            }
        },
        getCookie: function (key) {
            var reg = /([^=]*)=([^=]*)(?:;|$)/g;
            var result = document.cookie.match(reg);
            var obj = {};
            if (result) {
                result.forEach(function (v) {
                    var d = reg.exec(v);
                    var key = d[1];
                    var value = d[2];
                    obj[key] = value;
                });
            }
            return obj[key];
        },
        setCookie: function (key, value) {
            document.cookie = key + '=' + value;
        },
        go: function (to) {
            if (!to) {
                return;
            }
            location.hash = to;
        },
        onHashChange: function (event) {
            var state = history.state || {};
            var page = utils.getInfoFromURL().hash || pageManager._defaultPage;

            function watchURL(oldURL, newURL) {
                console.log('%c%s', 'color:green', newURL);
                var isRefresh = false;
                var resultHref;
                newURL.replace(/(.*?)#(.*?)(v=.*?)(&.*)?$/, function (m0, m1, m2, m3, m4) {
                    if (m3) {
                        isRefresh = true;
                        var reg = /(\?|&)(v=.*?)(&|$)/;
                        if (reg.test(m1)) {
                            m1 = m1.replace(/(\?|&)(v=.*?)(&|$)/, function (m0, m1, m2, m3) {
                                return (m1 === '&' ? '' : m1) + m3;
                            });
                        } else {
                            m1 = m1 + (/\?/.test(m1) ? '' : '?');
                        }
                        var href = m1 + '&' + m3 + '#' + m2 + (m4 ? m4.replace(/^&/, '') : '');
                        href = href.replace('?&', '?');
                        href = href.replace(/(\?|&)$/, '');
                        resultHref = href;
                    }
                });
                if (typeof resultHref !== 'undefined') {
                    location.href = resultHref;
                }
                return isRefresh;
            }

            if (watchURL(event.oldURL, (event.newURL || location.href))) {
                return;
            }
            if (pageManager._findInStack(page)) {
                var remanentPagesLength = pageManager._pageStack.length;
                var pagesArr = [], _page;
                while (remanentPagesLength--) {
                    _page = pageManager._pageStack[remanentPagesLength].page;
                    pagesArr.push(_page);
                    if (_page === page) {
                        break;
                    }
                }
                pagesArr.shift();
                for (var i = 0; i < pagesArr.length; i++) {
                    pageManager._back(pagesArr[i]);
                }
            } else {
                pageManager._go(page);
            }
        },
        getPageHtml: function (page, callback, fail) {
            $.ajax({
                url: 'fragment/' + page + '.html?V=' + Math.random(),
                dataType: 'html',
                success: function (html) {
                    callback(html);
                    //添加自定义的选择框ios除外
                    $('.page-' + page).find('select').each(function (i, e) {
                        var selectWrapperElement, componentCfg;
                        selectWrapperElement = $(e).closest('[data-component*=yy-select]');
                        if (selectWrapperElement.length === 0) {
                            $(e).parent().attr('data-component', 'yy-select');
                            selectWrapperElement = $(e).closest('[data-component*=yy-select]');
                        }
                        componentCfg = selectWrapperElement.data('component');
                        $(e).parent().addClass('weui-cell-mask');
                        if (!$(e).prev()[0] || $(e).prev()[0].tagName.toUpperCase() !== 'EM') {
                            $('<em></em>').insertBefore($(e));
                        }
                        if (utils.getDeviceInfo().isIphone) {
                            if (!componentCfg || !componentCfg.disabled) {
                                try {
                                    selectWrapperElement.find('.weui-cell-mask em').remove();
                                } catch (ex) {
                                    console.log(ex)
                                }
                            }
                        }
                    });

                },
                error: function (ex) {
                    fail(ex)
                    console.log(ex);
                }
            });
        },
        compileHtml: function (html, page) {
            var $html, scripts;
            if (/beforeRenderPage/.test(html)) {
                html = html.replace(/(class="page[^"]+)"/, '$1 hidden"');
            }
            $html = $(html);
            scripts = [];
            $html = $html.map(function (i, e) {
                if (e instanceof HTMLScriptElement && $(e).attr('id') && $(e).attr('id').indexOf('pageCfg') !== -1) {
                    var _page = '".page-' + page + ' .page"';
                    var scriptSrc = $(e).attr('src');
                    if (scriptSrc) {
                        scripts.push({
                            type: 'src',
                            content: scriptSrc
                        });
                    } else {
                        scripts.push({
                            type: 'string',
                            content: $(e).text()
                        });
                    }
                    function getOtherScriptStr() {
                        var innerScript = $(e).text();
                        var scriptStr = '';
                        var additionalScript = ';\n pageCfg.template = $(' + _page + ').html()'
                            + ';\n $(' + _page + ').html(utils.getPageSegment(pageCfg))'
                            + ';\n (pageCfg.afterRenderPage && pageCfg.afterRenderPage())'
                            + ';\n _validator.init(".page-' + page + ' form")';
                        if (/beforeRenderPage/.test(innerScript)) {
                            scriptStr = '<script>$(function(){'
                                + innerScript
                                + '$.when(pageCfg.beforeRenderPage())'
                                + '.then('
                                + 'function(res){\n $(' + _page + ').removeClass("hidden");' + additionalScript + '},'
                                + 'function(ex){\n  setTimeout(function(){pageManager.clearPageStack("' + page + '",true,true);},0);console.log("服务器错误");})'
                                + ';});<\/script>';
                        } else {
                            scriptStr = '<script>$(function(){'
                                + innerScript
                                + additionalScript
                                + ';\n });<\/script>';
                        }
                        return scriptStr;
                    }

                    return $(getOtherScriptStr())[0];
                } else {
                    return e;
                }
            });
            return $('<section class="page-' + page + '"><\/section>').append($html);
        },
        loadPage: function (page, callback) {
            var self = this;

            function isInited(page) {
                var result = false;
                $('script[data-requiremodule]').each(function (i, e) {
                    if (e.src && e.src.indexOf(page + '.js') >= 0) {
                        result = true;
                    }
                });
                return result;
            }

            if (isInited(page)) {
                location.reload();
            }
            if (page === 'other') {
                myRequire(['../app/js/page-js/other/' + page], callback);
                return;
            }
            myRequire(['../app/js/page-js/' + page], callback);
        },
        initPage: function (html, page, scope, callback) {
            var self = this;
            var pageId = Math.random().toString().replace('0\.', '');
            var stackItem = {page: page, dom: null, id: pageId};
            self._pageStack.push(stackItem);
            //添加进度图标缓冲视觉
            var toastCfg = {
                type: 'append',
                viewModel: {
                    text: '数据加载中'
                }
            };
            var toastComponent = common.createComponent('toast', toastCfg);
            var $html = $('<section class="page-' + page + '"></section>');
            if (scope) {
                html = utils.getPageSegment({
                    template: html,
                    viewModel: scope
                });
            }
            $html.append(html);
            $html.find('.page').addClass('slideIn').addClass(page);
            $html.find('.page').on('animationend webkitAnimationEnd', function () {
                $html.find('.page').removeClass('slideIn').addClass('js_show');
            });
            var titleContent = $html.find('[name = title]').val();
            common.changeTitle(titleContent);
            $(document).off("click", "#login");
            toastComponent.destroy();
            self.$container.append($html);
            stackItem.dom = $html;
            callback && callback($html);
        },
        getFooterText: function (pageName, $html) {
            var htmlWrapper = '<div class="page__ft"><p>{text}</p></div>';
            var num = '400-6506950';
            var textArray = [
                '咨询电话: {num}',
                '如若您对体检数据有异议，请致电{num}咨询',
                '问卷提交后将无法修改，提交前请再次确认。&lt;br&gt;>（若提交后发现信息有误，请联系客服重新填写{num}）'];
            var pageMap = {
                'apply': 0,
                'user-active': 0,
                'home': 0,
                'BSP-tzbs': 2,
                'OGTT-testing': 1,
                'OGTT-testingById': 1,
                'tel-change': 0,
                'tel-changing': 0,
                'Physical-testingresult': 1,
                'Physical-testingresultById': 1
            };
            var text = textArray[pageMap[pageName]];
            if (typeof text !== 'undefined') {
                text = text.replace(/\{num\}/g, '<a href="tel:' + num + '"> ' + num + ' </a>');
                var resultHtml = htmlWrapper.replace(/\{text\}/g, text);
                $html.find('.page').append(resultHtml);
            }
        },
        _go: function (page) {
            var self = this;
            this._pageIndex++;
            history.replaceState && history.replaceState({_pageIndex: this._pageIndex}, '', location.href);
            self.loadPage(page);
            return this;
        },
        back: function () {
            history.back();
        },
        _back: function (page) {
            this._pageIndex--;
            var self = this;
            var stack = this._pageStack.pop();
            if (!stack) {
                return;
            }

            var found = this._findInStack(utils.getInfoFromURL().hash);
            if (!found) {
                self.loadPage(page);
            } else {
                var titleContent = self._pageStack[(self._pageStack.length - 1)].dom.find('[name = title]').val();
                common.changeTitle(titleContent);
            }

            stack.dom.find('.page').addClass('slideOut').on('animationend webkitAnimationEnd', function () {
                stack.dom.remove();
            });
            return this;
        },
        _findInStack: function (page) {
            var found = null;
            for (var i = 0, len = this._pageStack.length; i < len; i++) {
                var stack = this._pageStack[i];
                if (stack.page === page) {
                    found = stack;
                    break;
                }
            }
            return found;
        },
        _bind: function (page) {
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        }
    };
    module.exports = pageManager;
    
