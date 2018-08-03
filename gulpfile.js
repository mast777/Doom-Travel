const gulp = require('gulp');
const pug = require('gulp-pug');
const del = require('del');
const browserSync = require('browser-sync').create();

// styles
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const aoutoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const cssunit = require('gulp-css-unit'); //Пересчитываем из rem в px

// // images
// const imagemin = require('gulp-imagemin');

// scripts
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

//config
let assets = true;

(assets) ? dirAssets = 'assets/': dirAssets = '';


const paths = {
    root: './dist',
    templates: {
        pages: 'src/template/pages/*.pug',
        src: 'src/template/**/*.pug',
        dest: 'dist/',
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/'+dirAssets+'styles/',
        map: '.',
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/'+dirAssets+'js',
    },
    images: {
        src: 'src/images/**/*.*',
        dest: 'dist/'+dirAssets+'images',
    },
    fonts: {
        src: 'src/fonts/*.{eot,ttf,woff2,woff}',
        dest: 'dist/'+dirAssets+'fonts',
    }

}

// Pug
function templates(){
    return gulp.src(paths.templates.pages)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.root));
}

// Styles
function styles(){
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(aoutoprefixer({
            browsers: [
                'last 4 versions',
                'ff >=20',
                'ie >= 8'
        ],
            cascade: false,
        }))
        .pipe(cssunit({
            type: 'px-to-rem',
            rootSize: 16
        }))
        .pipe(cleancss({
            level: 2
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write(paths.styles.map))
        .pipe(gulp.dest(paths.styles.dest));
}

// Webpack
function scripts(){
    return gulp.src('src/scripts/main.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}

// Images 
function images(){
    return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// Fonts
function fonts(){
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

//Clean
function clean(){
    return del(paths.root);
}

// Слежка за проектом src
function watch(){
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.scripts.src, scripts);
}

function server(){
    browserSync.init({
        server: paths.root,
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;

gulp.task('default', gulp.series(
    gulp.parallel(
        styles,
        templates,
        scripts,
    ),
    gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(
        styles,
        templates,
        scripts,
        images,
        fonts
    ),
    gulp.parallel(watch, server)
));