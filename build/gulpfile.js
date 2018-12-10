const glob = require('glob');
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');

const uglify = require('gulp-uglify');
const connect   = require('gulp-connect');
const header = require('gulp-header');

var pkg = require('../package.json');

const buildDir = process.env.NODE_ENV === 'production'?'../dist':'../test/dist';

const targetSDKs = readTargetDir();

const defaultTask = targetSDKs.map((folder)=>{
    createTargetSDKTask(folder);
    return `build:${folder}`;
}).concat(['build:sdk']);
if(process.env.NODE_ENV !== 'production'){
    defaultTask.unshift('server','auto');
}

// 创建js代码压缩任务
gulp.task('build:sdk', function(){
    gulp.src('../libs/*.js')
        .pipe(header(headerTemplate('sdk'), {pkg: pkg, name: 'sdk'}))
        .pipe(concat('sdk.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(connect.reload());
});

function headerTemplate(){
    var banner = ['/**',
  ' * ${pkg.name}:${name}',
  ' * @version v${pkg.version}',
  ' * @author ${pkg.author}',
  ' * @license ${pkg.license}',
  ' */',
  ''].join('\n');
  return banner;
}

function readTargetDir(){
    const baseDir = path.join(__dirname, '../libs');
    return glob.sync('*', {cwd: baseDir, ignore: '*.js'}) || [];
}

function createTargetSDKTask(folder){
    gulp.task(`build:${folder}`,function(){
        gulp.src(`../libs/${folder}/*.js`)
            .pipe(header(headerTemplate(folder), {pkg: pkg, name: folder}))
            .pipe(concat(`${folder}.js`))
            .pipe(gulp.dest(buildDir))
            .pipe(connect.reload());
    });
}

function createTargetSDKWatch(folder){
    gulp.watch(`../libs/${folder}/*.js`, [`build:${folder}`]);
}

// 创建文件修改监听任务
gulp.task('auto', function(){
    // 源码有改动就进行压缩以及热刷新
    gulp.watch('../libs/*.js', ['build:sdk']);
    targetSDKs.forEach((folder)=>{
        createTargetSDKWatch(folder);
    });
});

// 创建热加载任务
gulp.task('reload', function(){
    gulp.src('../test/*')
        .pipe(connect.reload());
    console.log('html change');
});

// gulp服务器
gulp.task('server', function(){
    connect.server({
        root: '../test',
        livereload: true,
        host: '0.0.0.0'
    });
});


// 默认任务
gulp.task('default', defaultTask);