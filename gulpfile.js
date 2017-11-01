var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var changed = require('gulp-changed');
var del = require('del');
var hbsHtmlPrecompiler = require('./node_custom_modules/handlebars-precompile-html.js');

var paths = {
    scripts: 'src/js/**/*.js',
    images: 'src/images/**/*',
    html: 'src/*.html',
    html_templates: 'src/html/*.hbs',
    html_templates_data:'src/data/tmpl/data.json',
    chrome_ext : 'src/chrome-ext/**/*'
};
var destinations ={
    scripts: 'dist/includes/js',
    images: 'dist/includes/images',
    html: 'dist',
    chrome_ext : 'dist'
};

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'images', 'chrome-ext' , 'html']);

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    if(this.seq[1] == "scripts"){
        return del(['dist/includes/js']);
    }
    if(this.seq[1] == "images"){
        return del(['dist/includes/images']);
    }
    if(this.seq[1] == "html"){
        return del(['dist/*.html']);
    }
    if(this.seq[1] == "chrome-ext"){
        return del(['dist/*.json']);
    }

});
gulp.task('html', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    return gulp.src(paths.html_templates)
        .pipe(hbsHtmlPrecompiler.compile({templates:paths.html_templates, data:paths.html_templates_data,html:"src"}))
        .pipe(gulp.dest(destinations.html));
});


gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(changed(destinations.scripts))
        .pipe(gulp.dest(destinations.scripts));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
    return gulp.src(paths.images)
    // Pass in options to the task
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(destinations.images));
});

// Copy files needed for chrome extension
gulp.task('chrome-ext', ['clean'], function() {
    return gulp.src(paths.chrome_ext)
    // Pass in options to the task
        .pipe(gulp.dest(destinations.chrome_ext));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.html_templates, ['html']);
});

