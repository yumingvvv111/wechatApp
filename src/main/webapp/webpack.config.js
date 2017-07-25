var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var files = {};

    function putFiles(pathStr) {
        var jsPath = path.resolve(srcDir, pathStr);
        var dirs = fs.readdirSync(jsPath);
        var matchs = [];
        dirs.forEach(function (item) {
            matchs = item.match(/(.+)\.js$/);
            if (matchs) {
                files[matchs[1]] = path.resolve(srcDir, pathStr, item);
            }
        });
    }

    putFiles('app/js-convertted');
    putFiles('app/js-convertted/page-js');
    console.log('mmmmmmmmmm', JSON.stringify(files));
    return files;
}

module.exports = {
    cache: true,
    devtool: "#source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/app/js/"),
        publicPath: "dist/app/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: srcDir + "/app/js-convertted/lib/jquery-2.1.4.js",
            zepto: srcDir + "/app/js-convertted/lib/zepto.min.js",
            ui: srcDir + "/app/js-convertted/ui",
            jweixin: srcDir + '/app/js-convertted/lib/jweixin-1.0.0.js',
            weui: srcDir + '/app/js-convertted/lib/weui.min.js',
            common: srcDir + '/app/js-convertted/common/common.js',
            restAPI: srcDir + '/app/js-convertted/common/restfulAPI.js',
            pageManager: srcDir + '/app/js-convertted/common/pageManager.js',
            text: srcDir + '/app/js-convertted/lib/text.js',
            echarts: srcDir + '/app/js-convertted/lib/echarts.min.js'
        }
    },
    plugins: [
        new CommonsChunkPlugin('common.js'),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        rules: [
            {test: /\.jpg$/, use: ["file-loader"]},
            {test: /\.png$/, use: ["url-loader?mimetype=image/png"]}
        ]
    }
};