const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
const livereload = require('gulp-livereload');
const spawn = require('child_process').spawn;
const rename = require("gulp-rename");
const rm = require( 'gulp-rm' )

gulp.task('styles', () => {
  return sass('public/css/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});

gulp.task('scripts', () => {
  return gulp.src('public/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(livereload());
});

gulp.task('ejs', () => {
    return gulp.src('views/**/*.ejs')
    .pipe(livereload());
});

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch('app/dist/**/*.*');
    gulp.watch('public/css/**/*.scss', ['styles']);
    gulp.watch('public/js/*.js', ['scripts']);
    gulp.watch('views/**/*.ejs', ['ejs']);
});

gulp.task('server', () => {
    nodemon({
        'script': './bin/www',
        //'ignore': 'public/js/*.js'
    });
});

gulp.task('build', (done) => {
  spawn('ng', ['build'], { cwd: 'app/', stdio: 'inherit' })
    .on('close', () => {
      gulp.src("./public/index.html")
          .pipe(rename('index.ejs'))
          .pipe(gulp.dest('./views/'))
          .on('end', () => {
            gulp.src("./public/index.html")
                .pipe(rm());
          });
    });
});

gulp.task('serve', ['server','watch']);
