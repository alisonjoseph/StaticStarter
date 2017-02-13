var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var autoprefixer = require('gulp-autoprefixer');
var scsslint = require('gulp-scss-lint');
var nunjucksRender = require('gulp-nunjucks-render');
var ext_replace = require('gulp-ext-replace');

gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure(['app/templates/'], {watch: true});
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  .pipe(nunjucksRender())
  .pipe(gulp.dest('dist'))

});

gulp.task('images', function() {
    return gulp.src([
                'app/images/**'
            ])
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src([
                'app/fonts/**'
            ])
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('css', function() {
    return gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['> 1%', 'last 2 versions']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('mincss', function() {
    return gulp.src('dist/main.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist'))
});


//Javascript
gulp.task('js', function() {
    return gulp.src([
        'app/scripts/**/*.js'
    ])
    //.pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
});

//gulp.task('minjs', ['js'], function() {
//    return gulp.src([
//        'dist/scripts/**/*.js'
//    ])
//    .pipe(concat('main.min.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('dist/scripts'))
//});

//Html
gulp.task('html', function() {
    return gulp.src(['app/examples/*.html'])
        .pipe(gulp.dest('dist/examples'))
});

gulp.task('browser-sync', function() {
    browserSync.init(['app/*'], {
        port: 9000,
        server: {
            host: "local.dev",
            baseDir: "./dist/"
        },
        ghostMode: false
    });
});

/* Watch Files For Changes */
gulp.task('watch', ['nunjucks'], function() {
    gulp.watch('app/pages/**/*', ['nunjucks']);
    gulp.watch('app/templates/**/*', ['nunjucks']);
    gulp.watch('app/images/**', ['images']);
    gulp.watch(['app/sass/**'], ['css']);
    gulp.watch(['app/scripts/**'], ['js']);
    gulp.watch([
       'dist/**/*.html',
       'dist/scripts/**/*.js',
       'dist/images/**/*',
       'dist/main.css'
    ]).on('change', browserSync.reload);
});

gulp.task('default', ['html', 'images', 'fonts', 'css', 'js', 'watch', 'browser-sync']);

gulp.task('build', ['mincss']);
