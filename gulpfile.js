var gulp = require('gulp'),
    /** 引用配置文件 */
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    proxy = require('http-proxy-middleware');

//serve
var proxyUrlPrefix = "http://192.168.1.66:5801";
gulp.task('serve', function (cb) {
    connect.server({
        root: '',
        port: 1235,
        host: '127.0.0.1',
        livereload: {
            port: 1201
        },
        middleware: function (connect, opt) {
            return [
                proxy.createProxyMiddleware('/handler/', {
                    target: proxyUrlPrefix + '/handler/',//代理的目标地址
                    changeOrigin: true,//
                    pathRewrite: {//路径重写规则 
                        '^/handler/': ''
                    }
                }),
                proxy.createProxyMiddleware('/uploadfiles/', {
                    target: proxyUrlPrefix + '/uploadfiles/',//代理的目标地址
                    changeOrigin: true,//
                    pathRewrite: {//路径重写规则 
                        '^/uploadfiles/': ''
                    }
                })
            ]
        }
    });
    cb();
});
//sass
//合并任务
gulp.task('default', gulp.series('serve'));