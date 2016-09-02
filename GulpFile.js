/// <reference path="./typings/node.d.ts" />
var gulp=require('gulp');
var ts=require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
gulp.task('tsc', function () {
    del(['out/*']);
    var tsResult =gulp.src('src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: 'es5',//把typescript转换成es5标准的js文件,也可以是es6,但这个node版本不支持
            sourceMap: true
            })
        )
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('out'));
});