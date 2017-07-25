define(function (require) {
    var module = {};
    var common = require('common');
    var hostIndex = -1;
    var hostList = ['localhost:8080', '192.168.1.118:8089', '192.168.1.104:3000', '192.168.1.116:80', '192.168.1.117', '192.168.1.118', '192.168.1.119'];
    function switchHost(index) {
        return hostList[index];
    }

    module.exports = {
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