/**
 * Created by CLAKE on 2016/8/7.
 */
import gulp from 'gulp';
import browserSync from 'browser-sync';
import del from 'del';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import gutil from 'gulp-util';
import pkg from './package.json';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import historyApiFallback from 'connect-history-api-fallback';
import header from 'gulp-header';
import gulpLoadPlugins from 'gulp-load-plugins';
let $ = gulpLoadPlugins();

const banner = `/* ${pkg.name} v${pkg.version} | by Clake
 * Copyright (c) ${$.util.date(Date.now(), 'UTC:yyyy')} Clake,
 * ${$.util.date(Date.now(), 'isoDateTime')}
 */
`;

gulp.task('server', () => {
    let webpackConfigDev = require('./webpack.dev').default;
    const bundler = webpack(webpackConfigDev);
    const bs = browserSync.create();

    bs.init({
        logPrefix: 'AMT',
        ghostMode: false,
        server: {
            baseDir: ['example'],
            middleware: [
                historyApiFallback(),
                webpackDevMiddleware(bundler, {
                    publicPath: '/',  //webpackConfig.output.publicPath,
                    stats: {colors: true},
                    lazy:false,
                    watchOptions:{
                        aggregateTimeout: 300,
                        poll: true
                    },
                    hot: true,
                }),
                webpackHotMiddleware(bundler)
            ]
        }
    });
});

gulp.task('clean:publish', (callback) => {
    return del([
        'lib/*'
    ],callback);
});

gulp.task('clean:build', (callback) => {
    return del([
        'dist/*'
    ],callback);
});

gulp.task('clean',gulp.series('clean:build','clean:publish'));

gulp.task('publish:pack',()=>{
    return gulp.src(['src/**/*.js','src/**/*.ts','src/**/*.tsx'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            "presets": [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
            ],
            "plugins": [
                "@babel/plugin-proposal-object-rest-spread",
                ["@babel/plugin-transform-runtime",{
                    "helpers": false,
                    "useESModules": true,
                }],
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-optional-chaining"
            ]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(header(banner))
        .pipe(gulp.dest('lib'));
});

gulp.task('publish:css',(callback)=>{
    return gulp.src('src/css/*.less')
        .pipe(gulp.dest('lib/css'));
});

gulp.task('build:pack', (callback)=>{
    let webpackConfig = require('./webpack.prod').default;
    webpack(webpackConfig,function(err,stats){
        gutil.log("[webpack]", stats.toString({
            colors:true
        }));
        callback();
    });
});

gulp.task('build:over',(callback)=>{
    return gulp.src('dist/*.js')
        .pipe(header(banner))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series('server'));

gulp.task('build',gulp.series('clean:build','build:pack','build:over'));
gulp.task('publish',gulp.series('clean:publish','publish:css','publish:pack'));

gulp.task('build-publish',gulp.series('build','publish'))