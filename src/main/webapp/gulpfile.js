var gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    // minifyCSS = require('gulp-minify-css'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    through2 = require('through2'),
    sass = require('gulp-sass');

var host = {
    path: 'dist/',
    port: 3000,
    html: 'index.html'
};

//mac chrome: "Google chrome", 
var browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

//将图片拷贝到目标目录
gulp.task('copy:images', function (done) {
    gulp.src(['src/app/images/**/*'])
        .pipe(gulp.dest('dist/app/images'))
        .on('end', done);
});

//压缩合并css
gulp.task('lessmin', function (done) {
    function modifyIt(file, enc, cb) {

        if (file.isStream()) {
            return cb();
        }
        if (file.isBuffer()) {
            var content = file.contents.toString(enc);
            content = content.replace(/\.\.\/\.\.\/images\//g, '../images/');
            file.contents = new Buffer(content, enc);

        }

        this.push(file);
        cb();
    }

    gulp.src(['src/app/style/**/*'])
        .pipe(through2.obj(modifyIt))
        .pipe(less())
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        .pipe(spriter({
            'spriteSheet': 'dist/app/images/spritesheet.png'
        }))
        .pipe(cssmin())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/app/style'))
        .on('end', done);
});


gulp.task('sass', function () {
    return gulp.src('src/app/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/app/style'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/app/sass/**/*.scss', ['sass']);
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function (done) {
    gulp.src('dist/js/*.js')
        .pipe(md5(10, 'dist/app/*.html'))
        .pipe(gulp.dest('dist/js'))
        .on('end', done);
});

//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['sprite'], function (done) {
    gulp.src('dist/app/style/*.css')
        .pipe(md5(10, 'dist/app/*.html'))
        .pipe(gulp.dest('dist/app/style'))
        .on('end', done);
});


gulp.task('remove:redundant-amd', function (done) {
    function removeIt(file, enc, cb) {
        if (file.isStream()) {
            return cb();
        }
        if (file.isBuffer()) {
            var content = file.contents.toString(enc);
            content = content.replace(/(?:^[\s\S]*<!--html\ssegment\sbegin-->)|(?:<!--html\ssegment\send-->[\s\S]*$)/g, '');

            content = content.replace(/..\/..\/images\//g, 'app/images/');
            content = content.replace(/<!--segment\sexclude\sbegin[\s\S]*?segment\sexclude\send-->/g, '');

            if (/text\/html/.test(content)) {
                content = content.match(/<script\stype="text\/html">([\s\S]*)<\/script>\s*$/)[1];
            }

            file.contents = new Buffer(content, enc);

        }

        this.push(file);
        cb();
    }

    gulp.src('src/app/pages/**/*')
        .pipe(through2.obj(removeIt))
        .pipe(gulp.dest('dist/app/pages'))
        .on('end', done);

});


gulp.task('remove:redundant-cmd', function (done) {
    function removeIt(file, enc, cb) {
        if (file.isStream()) {
            return cb();
        }
        if (file.isBuffer()) {
            var content = file.contents.toString(enc);
            content = content.replace(/(?:^[\s\S]*<!--html\ssegment\sbegin-->)|(?:<!--html\ssegment\send-->[\s\S]*$)/g, '');

            content = content.replace(/..\/..\/images\//g, 'app/images/');
            content = content.replace(/<!--segment\sexclude\sbegin[\s\S]*?segment\sexclude\send-->/g, '');

            if (/text\/html/.test(content)) {
                content = content.match(/<script\stype="text\/html">([\s\S]*)<\/script>\s*$/)[1];
            }

            file.contents = new Buffer(content, enc);

        }

        this.push(file);
        cb();
    }

    gulp.src('src/app/pages-original/**/*')
        .pipe(through2.obj(removeIt))
        .pipe(gulp.dest('src/app/pages'))
        .on('end', done);


});


//用于在html文件中直接include文件
gulp.task('fileinclude', function (done) {
    gulp.src(['src/app/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/app'))
        .on('end', done);
    // .pipe(connect.reload())
});

//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:images', 'lessmin'], function (done) {
    var timestamp = +new Date();
    gulp.src('dist/app/style/style.min.css')
        .pipe(spriter({
            spriteSheet: 'dist/app/images/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS: '../images/spritesheet' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/app/style'))
        .on('end', done);
});

gulp.task('clean', function (done) {
    gulp.src(['dist'])
        .pipe(clean())
        .on('end', done);
});

gulp.task('watch', function (done) {
    gulp.watch('src/**/*', ['lessmin', 'build-js', 'fileinclude'])
        .on('end', done);
});

gulp.task('connect', function () {
    console.log('connect------------');
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/?wxId=123#user-equipment'
        }))
        .on('end', done);
});

var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);


gulp.task("build-js-amd", ['fileinclude'], function (callback) {

    function modifyIt(file, enc, cb) {
        if (file.isStream()) {
            return cb();
        }
        if (file.isBuffer()) {
            var content = file.contents.toString(enc);
            content = content.replace(/'css![^']+',?\s*/g, '');
            content = content.replace(/(function\s*?\()(?:c\d+,\s*)+/g, '$1');
            file.contents = new Buffer(content, enc);

        }

        this.push(file);
        cb();
    }

    gulp.src(['src/app/js/**/*'])
    // .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(through2.obj(modifyIt))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/app/js'))
        .on('end', callback);
});



function convertJS(file, enc, cb) {
    if (file.isStream() || file.path.match(/lib\//)) {
        return cb();
    }
    if (file.isBuffer()) {
        var content = file.contents.toString(enc);
        // if(/^\s*define\s*\(function/.test(content)){
        content = content.replace(/define[^\{]+\{/, function (m) {
            var reg = /['"]([^'"]+)['"],?/g;
            var matchs = m.match(reg);
            var replaceArr = [];
            // console.dir(matchs);
            if(matchs && matchs.forEach){
                matchs.forEach(function(v){
                    var matchs2 = /['"]([^'"]+)\\?['"]/.exec(v)[1];
                    var matchs3 = /html!(.*?pages\/)(.+)\.html$/.exec(matchs2);
                    var matchs4 = /css!(.*?)$/.exec(matchs2);
                    if(matchs3){
                        replaceArr.push('var html = require("html-loader?-attrs!../../pages/'+ matchs3[2] +'.html");')
                    }else if(matchs4){

                    }else{
                        replaceArr.push('var ' + matchs2 + '=require("' + matchs2 + '");');
                    }

                });
            }else{
                replaceArr.push('');
            }
            return replaceArr.join('\n');
        });
        content = content.replace(/var \s*module\s*=\s*\{\};/g, '');
        content = content.replace(/\}\);?\s*$/, '');
        content = content.replace(/return\s+module\.exports;?/, '');
        content = content.replace(/require\('text!([^']+)'\);?/g, "require('html-loader?-attrs!../../$1');");
        // }
        file.contents = new Buffer(content, enc);

    }

    this.push(file);
    cb();
}

gulp.task("convert-js1-cmd", function (callback) {
    gulp.src(['src/app/js/main.js'])
        .pipe(through2.obj(convertJS))
        .pipe(gulp.dest('src/app/js-convertted'))
        .on('end', callback);
});

gulp.task("convert-js2-cmd", function (callback) {
    gulp.src(['src/app/js/page-js/*'])
        .pipe(through2.obj(convertJS))
        .pipe(gulp.dest('src/app/js-convertted/page-js'))
        .on('end', callback);
});

gulp.task("convert-js3-cmd", function (callback) {
    gulp.src(['src/app/js/common/*'])
        .pipe(through2.obj(convertJS))
        .pipe(gulp.dest('src/app/js-convertted/common'))
        .pipe(gulp.dest('src/app/js-convertted/common'))
        .on('end', callback);
});

gulp.task("build-js-cmd", ['fileinclude', 'convert-js1-cmd', 'convert-js2-cmd', 'convert-js3-cmd'], function (callback) {
    devCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});


gulp.task("copy:component", function (done) {
    gulp.src(['src/app/component/*'])
        .pipe(gulp.dest('dist/app/component'))
        .on('end', done);
});


gulp.task("moveother-amd", function (done) {
    function modifyIt(file, enc, cb) {

        if (file.isStream()) {
            return cb();
        }
        if (file.isBuffer() && file.path.match(/index\.html\s*$/)) {
            var content = file.contents.toString(enc);
            content = content.replace(/<link[^>]+>/g, '');
            content = content.replace(/<\/head>/, '<link rel="stylesheet" href="./app/style/style.min.css"/></head>');
            file.contents = new Buffer(content, enc);
        }

        this.push(file);
        cb();
    }

    gulp.src(['src/app.js', 'src/blank.html', 'src/index.html'])
        .pipe(through2.obj(modifyIt))
        .pipe(gulp.dest('dist'))
        .on('end', done);

});


gulp.task("moveother-cmd", function (done) {
    function modifyIt(file, enc, cb) {

        if (file.isStream()) {
            return cb();
        }
        if (file.isBuffer() && file.path.match(/index\.html\s*$/)) {
            var content = file.contents.toString(enc);
            content = content.replace(/<link[^>]+>/g, '');
            content = content.replace(/<\/head>/, '<link rel="stylesheet" href="./app/style/style.min.css"/></head>');
            content = content.replace(/<script.*?require.js.*?<\/script>/, '<script type="text/javascript" src="./app/js/common.js"></script><script type="text/javascript" src="./app/js/main.js"></script>')
            file.contents = new Buffer(content, enc);

        }

        this.push(file);
        cb();
    }

    gulp.src(['src/app.js', 'src/blank.html', 'src/index.html'])
        .pipe(through2.obj(modifyIt))
        .pipe(gulp.dest('dist'))
        .on('end', done);

});


gulp.task("copy:jslib", function (done) {
    gulp.src(['src/app/js/lib/*'])
        .pipe(gulp.dest('dist/app/js/lib'))
        .on('end', done);
});

// gulp.task('default', ['connect', 'fileinclude', 'md5:css', 'md5:js', 'open']);


//PUBLISH:
gulp.task('default', ['connect', 'fileinclude', 'md5:css', 'md5:js', 'open']);

//DEV:使用AMD
gulp.task('amd', [
    'connect',
    'copy:images',
    'fileinclude',
    'lessmin',
    'remove:redundant-amd',
    'build-js-amd',
    'copy:component',
    'moveother-amd',
    // 'watch',
    'open']);

//DEV:使用CMD
gulp.task('cmd', [
    'connect',
    'copy:images',
    'copy:jslib',
    'convert-js1-cmd',
    'convert-js2-cmd',
    'convert-js3-cmd',
    'fileinclude',
    'lessmin',
    // 'remove:redundant-cmd',
    'build-js-cmd',
    'moveother-cmd',
    // 'watch',
    'open']);