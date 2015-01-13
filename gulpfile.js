"use strict";

// Gulp
var     gulp = require('gulp'),
		connect = require('gulp-connect'),
		opn = require('opn'),
		wiredep = require('wiredep').stream,
		useref = require('gulp-useref'),
		uglify = require('gulp-uglify'),
		clean = require('gulp-clean'),
		gulpif = require('gulp-if'),
		minifyCss = require('gulp-minify-css'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        concatCss = require('gulp-concat-css'),
        jade = require('gulp-jade');

// Подключаемся к серверу
gulp.task('connect', function () {
	connect.server({
		root: 'app',
		livereload: true
	});
	opn('http://localhost:8080/');
})

// Компилируем jade в html
gulp.task('jade', function () {
    gulp.src('app/_jade/_pages/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('app/'));
})

//Собираем css
gulp.task('concat', function () {
    gulp.src('app/_less/*.css')
        .pipe(concatCss("main.css"))
        .pipe(gulp.dest('app/css/'));
});

//html
gulp.task('html', function() {
    gulp.src('app/*.html')
        .pipe(connect.reload());
})

//js
gulp.task('js', function() {
    gulp.src('app/_scripts/_modules/*.js')
        .pipe(connect.reload());
})

//css
gulp.task('css', function() {
    gulp.src('app/_less/*main.css')
        .pipe(connect.reload());
})

//  Минификация изображений
gulp.task('img', function () {
  return gulp.src('app/img/**/*.png')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/img/'));
});

// Подключаем ссылки на bower components
gulp.task('wiredep', function () {    
  gulp.src('app/*.html')
    .pipe(wiredep({
        directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

// Слежка
gulp.task('watch', function() {
    gulp.watch(['app/*.html'], ['html']);
    gulp.watch(['app/_scripts/*.js'], ['js']);
    gulp.watch(['app/_less/*.css'], ['css']);
    gulp.watch(['bower.json'], ['wiredep']);
    gulp.watch('app/img/*', ['images']);
    gulp.watch('app/_less/*.less', ['less']);
})

// Сборка
gulp.task('dist', function () {
    var assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist')),
        gulp.src('app/fonts/*')
            .pipe(gulp.dest('dist/fonts')),
        gulp.src('app/img/**/*.png*')
            .pipe(gulp.dest('dist/img'));
})

// Очистка папки
gulp.task('clean', function () {
    return gulp.src('dist').pipe(clean());
});

// Default
gulp.task('default', ['connect', 'watch']);