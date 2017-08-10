define(function (require) {
    var module = {};
    var common = require('common');
    var hostIndex = -1;
    var hostList = ['192.168.1.110:8080', 'localhost:8080', '192.168.1.104:8080', 'weixin.test.bioeh.com', 'weixin.test.bioeh.com', 'weixin.test.bioeh.com', 'weixin.test.bioeh.com', 'weixin.test.bioeh.com'];

    function switchHost(index) {
        return hostList[index];
    }

    module.exports = {//不要去掉,编译的时候要用
        api: {},
        switchHost: switchHost,
        autoSwitchHost: function () {
            if (hostIndex++ === 3) {
                hostIndex = 0;
            }
            return switchHost[hostIndex];
        }
    };
    return module.exports;
});