'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var svgSprite = require('gulp-svg-sprite');

var dist = './dist';
var src = './src';

var data = require(src + '/data.json');

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: dist
        }
    });
});

gulp.task('scss', function () {
    gulp.src(src + '/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dist + '/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('postcss', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 version']})
    ];
    return gulp.src(dist + '/**/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(dist));
});

gulp.task('templates', function () {
    var options = {
        batch: [src + '/templates/components'],
        helpers: {
            join: function (items, separator) {
                return items.join(separator);
            }
        }
    }

    return gulp.src(src + '/templates/index.hbs')
        .pipe(handlebars(data, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {
    gulp.src(src + '/images/**/*')
        .pipe(gulp.dest(dist + '/assets/images'));
});

gulp.task('js', function () {
    gulp.src(src + '/js/**/*.js')
        .pipe(gulp.dest(dist + '/assets/js'))
        .pipe(browserSync.stream());
});

var config = {
    shape               : {
        dimension       : {         // Set maximum dimensions
            maxWidth    : 32,
            maxHeight   : 32
        }
    },
    mode: {
        symbol: true
    }
};

gulp.task('icons', function () {
    gulp.src(src + '/icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest(dist + '/assets/icons'));

});

gulp.task('build', ['templates', 'js', 'scss', 'postcss', 'images']);

gulp.task('serve', ['build', 'browser-sync']);

gulp.task('dev', ['build', 'browser-sync'], function () {
    gulp.watch(src + '/scss/**/*.scss', ['scss']);
    gulp.watch(dist + '/**/*.css', ['postcss']);
    gulp.watch(src + '/templates/**/*.hbs', ['templates']);
    gulp.watch(src + '/js/**/*.js', ['js']);
});