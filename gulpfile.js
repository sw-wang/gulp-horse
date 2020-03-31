const Config = require("./gulp.config.js");
const { src, dest, series } = require('gulp');
const htmlreplace = require("gulp-html-replace");
const watch = require("gulp-watch");
const htmlmin = require('gulp-htmlmin');
const uglify = require("gulp-uglify");
const clean = require('gulp-clean');
const fs = require('fs');
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const connect = require('gulp-webserver');
const gulpif = require('gulp-if');
const cheerio = require('gulp-cheerio');
const rename = require('gulp-rename');

const browserify = require("browserify");
const babelify = require("babelify");
const stream = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const SRC_DIR = './src/';
const DIST_DIR = './dist/';
const ENTRY = `${SRC_DIR}app.js`;
const PROD = process.env.NODE_ENV === 'production';

// 根据环境变量替换接口模式
let globalHost = '/api';
if (PROD) globalHost = Config.env.api[process.env.NODE_ENV];
let baseContent = fs.readFileSync(`${SRC_DIR}config/base.js`, 'utf8');
baseContent = baseContent.replace(/\'.+?\'/, `'${globalHost}'`);
fs.writeFileSync(`${SRC_DIR}config/base.js`, baseContent, 'utf8');

// get common template content
let tmplateHtml = {};
for (let key in Config.public.template) {
    tmplateHtml[key] = {
        src: fs.readFileSync(SRC_DIR + Config.public.template[key], 'utf-8'),
        tpl: '%s'
    }
}
// task count 9
// clear dist
const clearDistTask = done => {
    console.info('clear dist ...');
    return src(DIST_DIR, { allowEmpty: true }).pipe(clean());
}
// copy public files
const copyPublicTask = done => {
    console.info('copy public files ...');
    return src(`${SRC_DIR}public/**`).pipe(dest(`${DIST_DIR}public`));
}
// copy fonts
const copyFontsTask = done => {
    console.info('copy fonts ...');
    return src(`${SRC_DIR}assets/fonts/**`).pipe(dest(`${DIST_DIR}assets/fonts/`));
}
// template html
const htmlTask = done => {
    console.info('template html ...');
    let Verson = PROD ? new Date().getTime() : process.env.NODE_ENV;
    // include common files
    tmplateHtml['js'] = Config.public.js.map(d => { return SRC_DIR + d; });
    tmplateHtml['js'].push(`${SRC_DIR}js/app.js?v=${Verson}`);
    tmplateHtml['css'] = Config.public.css.map(d => { return SRC_DIR + d; });
    tmplateHtml['css'].push(`${SRC_DIR}assets/css/app.css?v=${Verson}`);
    return src([`${SRC_DIR}**/*.html`, `!${SRC_DIR}components/**`])
        .pipe(htmlreplace(
            tmplateHtml, { resolvePaths: true }
        ))
        .pipe(
            // JS to ES5 in HTML template
            cheerio(function ($, file, cb) {
                if (PROD || Config.babel) {
                    let i = $('body script[babel]').html();
                    if (!i) {
                        cb();
                        return;
                    }
                    fs.writeFile('.cache.js', i, function (err) {
                        if (err) {
                            console.log(err);
                            cb();
                            return;
                        }
                        browserify({
                            entries: '.cache.js',
                            debug: false
                        })
                            .transform(babelify)
                            .bundle()
                            .pipe(stream('.cache.new.js'))
                            .pipe(buffer())
                            .pipe(dest('./')).on('end', () => {
                                $('body script[babel]').text(fs.readFileSync('.cache.new.js', 'utf-8'));
                                cb();
                            });
                    });
                    return;
                }
                cb();
            })
        )
        .pipe(gulpif(PROD, htmlmin({
            minifyJS: true,
            minifyCSS: true
        })))
        .pipe(dest(`${DIST_DIR}`))
        .on('end', () => { done(); });
}
// browserify js
const browserifyScriptTask = done => {
    console.info('browserify js ...');
    return browserify({
        entries: ENTRY,
        debug: false
    })
        .transform(babelify)
        .bundle()
        .pipe(stream('app.js'))
        .pipe(buffer())
        .pipe(gulpif(PROD, uglify()))
        .pipe(dest(`${DIST_DIR}js/`));
}
// sass to css
const sassTocssTask = done => {
    console.info('sass to css ...');
    return src(`${SRC_DIR}assets/scss/app.scss`)
        .pipe(sass())
        .pipe(dest(`${DIST_DIR}assets/css/`))
        .on('end', () => { done(); });
}
// min image
const minImageTask = done => {
    console.info('min image ...');
    return src(`${SRC_DIR}assets/images/**`)
        .pipe(imageMin({ progressive: true }))
        .pipe(dest(`${DIST_DIR}assets/images/`));
}
// auto pre fixer && min css
const autoprefixerTask = done => {
    console.info('auto pre fixer && min css start ...');
    return src(`${DIST_DIR}assets/css/**/*.css`)
        .pipe(autoprefixer())
        .pipe(gulpif(PROD, cleanCss()))
        .pipe(dest(`${DIST_DIR}assets/css/`));
}

// server
const proxyServerTask = done => {
    if (PROD) {
        done();
        console.log('\033[42;30m DONE \033[40;32m The production environment packaging is complete!\033[0m');
        return;
    }
    console.log('\033[42;30m DONE \033[40;32m ### ### Start the local service ### ###\033[0m');
    src(DIST_DIR).pipe(
        connect({
            livereload: Config.livereload,
            open: Config.open,
            proxies: [{
                source: '/api', target: Config.env.api[process.env.NODE_ENV]
            }]
        })
    ).on('end', () => { done(); });
}
const clearCache = done => {
    if (!PROD && !Config.babel) {
        done();
        return;
    }
    console.info('clear cache ...');
    fs.unlinkSync('.cache.js');
    fs.unlinkSync('.cache.new.js');
    done();
}
// watch
if (!PROD) {
    watch([`${SRC_DIR}**/*.html`, `!${SRC_DIR}components/**`], series(htmlTask, clearCache));
    watch(`${SRC_DIR}public/**`, series(copyPublicTask));
    watch(`${SRC_DIR}assets/fonts/**`, series(copyFontsTask));
    watch(`${SRC_DIR}**/*.js`, series(browserifyScriptTask));
    watch(`${SRC_DIR}assets/scss/**/*.scss`, series(sassTocssTask, autoprefixerTask));
    watch(`${SRC_DIR}assets/images/**`, series(minImageTask));
}


exports.default = series(
    clearDistTask
    , copyPublicTask
    , copyFontsTask
    , htmlTask
    , browserifyScriptTask
    , sassTocssTask
    , autoprefixerTask
    , minImageTask
    , clearCache
    , proxyServerTask
);