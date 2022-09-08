var gulp = require('gulp'),
    /** 引用配置文件 */
    connect = require('gulp-connect');

//serve
gulp.task('serve', function (cb) {
    connect.server({
        root: '',
        port: 1235,
        host: '127.0.0.1',
        livereload: {
            port: 1201
        }
    });
    cb();
});
//sass
//合并任务
gulp.task('default', gulp.series('serve'));