"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var del = require("del");

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
          "source/fonts/**/*.{woff,woff2}",
          "source/img/**",
          "source/js/**"
     ], {
       base: "source"
     })
     .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("sorce/img/**/*.{png,jpg,svg}")
    .pire(imagemin([
      imagemin.optipng({ortinizationLevel: 3}),
      imagemin.jpegran({progressive:true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () { 
  return gulp.src("source/img/icon-*.svg") 
    .pipe(svgstore({ 
      inlineSvg: true
   })) 
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});



gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml())
    .pipe(gulp.dest("build"));
});


gulp.task ("build", gulp.series(
    "clean",
    "copy",
    "style",
    "sprite",
    "html"
));


gulp.task("server", function() {
  server.init({
    server: "build/"
  });

  gulp.watch("sorce/sass/**/*.{scss,sass}", gulp.series("style"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});


gulp.task("start", gulp.series("build", "server"));
