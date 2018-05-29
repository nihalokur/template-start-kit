var gulp = require('gulp');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var fileinclude = require('gulp-file-include');

var config = {
  dist: 'dist/',
  src: 'src/',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/*.js',
  htmlin: 'src/**/*.html',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'main.css',
  jsoutname: 'main.js',
  cssreplaceout: 'css/main.css',
  jsreplaceout: 'js/scripts.js',
  fontin: 'src/fonts/*.{ttf,otf,woff,woff2}',
  fontout: 'dist/fonts/',
  imgin: 'src/img/*.{png,gif,jpg,svg}',
  imgout: 'dist/img',
  configin: 'configs/*.*',
  faviconin: 'favicon/*.{png,ico,jpg,svg}',
  faviconout: 'dist/favicon/'
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('fileinclude', function() {
  gulp.src(['src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.htmlout));
  });

gulp.task('include-watch', ['fileinclude', 'reload']);

gulp.task('serve', ['fileinclude','sass', 'font', 'img', 'js', 'configs', 'favicon'], function() {
  browserSync({
    server: config.dist
  });

  gulp.watch([config.htmlin, config.jsin, config.fontin, config.imgin, config.configin], ['include-watch', 'font', 'img', 'js', 'configs', 'favicon', 'reload']);
  gulp.watch([config.scssin], ['sass']);
});

gulp.task('sass', function() {
  return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', 'Safari 8', 'ie >= 9']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.cssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
  return gulp.src(config.jsin)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat(config.jsoutname))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.jsout));
});

gulp.task('svg', function() {
  return gulp.src(config.svgin)
    .pipe(gulp.dest(config.svgout));
});

gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(gulp.dest(config.imgout));
});

gulp.task('font', function() {
  return gulp.src(config.fontin)
    .pipe(gulp.dest(config.fontout));
});

gulp.task('configs', function() {
  return gulp.src(config.configin)
    .pipe(gulp.dest(config.dist));
});

gulp.task('favicon', function() {
  return gulp.src(config.faviconin)
    .pipe(gulp.dest(config.faviconout));
});

gulp.task('html', function() {
  return gulp.src(config.htmlin)
    .pipe(htmlReaplce({
      'css': config.cssreplaceout,
      'js': config.jsreplaceout
    }))
    .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function() {
  return del([config.dist]);
});

gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'css']);
});

gulp.task('default', ['clean', 'serve']);