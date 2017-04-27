'use strict';

var browserify = require('browserify'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    vinylPaths = require('vinyl-paths'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    Server = require('karma').Server;

gulp.task('js', function() {
    var b = browserify({
        entries: './app/js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        //.pipe(sourcemaps.init({ loadMaps: true }))
        //.pipe(uglify())
        .on('error', gutil.log)
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
})

gulp.task('server', ['build'], function() {
    watch('app/**/*', function() {
        gulp.start('watch')
    })
    connect.server({
        root: 'dist',
        livereload: true
    });

})

gulp.task('html', function() {
    gulp.src('./app/img/**/*.png')
        .pipe(gulp.dest('./dist/img/'))
    gulp.src('./app/views/**/*.html')
        .pipe(gulp.dest('./dist/views/'))
    gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

gulp.task('css', function() {
    gulp.src('./app/scss/*.scss')
        .pipe(sass.sync().on('error', function(error) {
            console.log(error)
        }))
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('test', function(done) {
    var b = browserify({
        entries: './app/js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .on('error', gutil.log)
        .pipe(gulp.src('./node_modules/angular-mocks/angular-mocks.js'))
        .pipe(gulp.dest('./tests/lib/'));
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('build', ['css', 'html', 'js'])

gulp.task('watch', ['build'], function() {
    connect.reload();
});

gulp.task('default', ['server']);
