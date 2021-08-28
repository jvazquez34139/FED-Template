"use strict";

const gulp = require('gulp'),
  {task, src, dest, series, parallel, watch} = gulp,
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  maps = require('gulp-sourcemaps'),
  cleanCSS = require('gulp-clean-css'),
  imageMin = require('gulp-imagemin'),
  // browserSync = require('browser-sync').create(),
  // works better with liveserver extention/plugin from
  // your text editor and just run the watch commands
  del = require('del');

const concatScripts = () => {
  return src([
    //add scripts here before using command
    //"./js/script1.js",
    //"./js/script2.js",
  ])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('./'))
  .pipe(dest('js'));
}

const minifyJS = () => {
  return src('js/app.js')
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(dest('js'));
}

const compileSass = () => {
  return src('styles/main.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(dest('styles/css'));
}

const minifyCSS = () => {
  return src('styles/css/main.css')
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(dest('styles/css'));
}

const clearCSS = () => {
  return del(['styles/css']);
}
const clearJS = () => {
  return del(['js/app*.js*']);
}
const clean = () => {
  return del(['dist','res/images','styles/css*','js/app*.js*']);
}

const watchCSS = () => {
  watch(['styles/**/*.scss'], series('minifyCSS'))
}

const watchFiles = () => {
  // browserSync.init({
  //   port:3001,
  //   proxy: "localhost:3000"
  //   //run server before attempting to run this proxy
  // });
  // watch(['styles/**/*.scss']).on('change', series('clearCSS','minifyCSS', browserSync.reload));
  // watch(['js/**/*.js']).on('change', series('clearJS','concatScripts', browserSync.reload));
  watch(['styles/**/*.scss']).on('change', series('clearCSS','minifyCSS'));
  watch(['js/**/*.js']).on('change', series('clearJS','concatScripts'));
}

const build = () => {
  return src([
      "styles/css/main.min.css",
      "js/app.min.js",
      "res/images",
      "license.txt",
      "package.json",
      "server.js"//not recommended, the server.js is too basic
    ], {base: "./"})
  .pipe(dest('dist'));
}

const sanity = () => {
  console.log('testing gulp');
}

task('test', sanity);
task('concatScripts', series(clearJS, concatScripts));
task('minifyJS', series('concatScripts', minifyJS));
task('compileSass', series(clearCSS, compileSass));
task('minifyCSS', series('compileSass', minifyCSS));
task('watchCSS', watchCSS);
task('watchFiles', watchFiles);
task('clearJS',clearJS);
task('clearCSS', clearCSS);
task('clean', clean);
task('default', series('clean', parallel('minifyCSS', 'minifyJS'), build));
