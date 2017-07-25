requirejs.config({
    baseUrl: 'app/',
    map: {
        '*': {
            'css': 'js/lib/css',
            'html': 'js/lib/html'
        }
    },
    paths: {
        jquery: 'js/lib/jquery-2.1.4',
        echarts: 'js/lib/echarts.min',
        jweixin: 'js/lib/jweixin-1.0.0',
        weui: 'js/lib/weui.min',
        common: 'js/common/common',
        restAPI: 'js/common/restfulAPI',
        pageManager: 'js/common/pageManager',
        text: 'js/lib/text'
    }
});

requirejs(['js/main']);
