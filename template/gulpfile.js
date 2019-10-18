const { src, dest, series, watch } = require('gulp')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const minifycss = require('gulp-minify-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const minifyHTML = require('gulp-htmlmin')
const sourcemaps = require('gulp-sourcemaps')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const override = require('gulp-rev-css-url')
const revDel = require('gulp-rev-delete-original')
const rename = require("gulp-rename")

const server = require('browser-sync').create()

const config = {
  dist: 'dist',
  src: 'src',
  staticPath: ''
}

function getSrc(path = '') {
  return `${config.src}/${path}`
}
function getDist(path = '') {
  return `${config.dist}/${path}`
}

const cleanFiles = () =>
  src([getDist()], { read: false, allowEmpty: true }).pipe(clean())

  const compileLess = () =>
  src(getSrc('less/**/*.less'))
    .pipe(less())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer('last 5 version'))
    .pipe(minifycss())
    // .pipe(concat('all.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(rename(function(path) {
      path.basename += '.less'
    }))
    .pipe(dest(getSrc('styles/less-dist')))
const compileJS = () =>
  src(getSrc('js/**/*.js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    // .pipe(uglify())
    .pipe(dest(getDist('js')))
const compileHTML = () =>
  src(getSrc('*.html'))
    // .pipe(
    //   minifyHTML({
    //     collapseWhitespace: true,
    //     removeComments: true
    //   })
    // )
    .pipe(dest(getDist()))

const copyCSS = () =>
  src(getSrc('styles/**/*.css'))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer('last 5 version'))
    .pipe(minifycss())
    .pipe(dest(getDist('styles')))

const compileImg = () =>
  src(getSrc('images/**'))
    .pipe(dest(getDist('images')))

const copyLibJS = () => src(getSrc('lib/**/*.js')).pipe(dest(getDist('lib')))

// 为所有除html之外的文件加版本号
const revManifest = () =>
  src([getDist('**/*'), `!${config.dist}/**/*.html`])
    .pipe(rev()) // 加文件指纹
    .pipe(override()) // 替换css中的资源引用
    .pipe(revDel()) // 删除原版
    .pipe(dest(getDist()))
    .pipe(
      rev.manifest({
        merge: true
      })
    )
    .pipe(dest(getDist()))

const revHTML = () =>
  src([getDist('*.json'), getDist('*.html')])
    .pipe(
      revCollector({
        replaceReved: true,
        dirReplacements: {
          '': v => {
            if (isProd()) {
              return config.staticPath + v
            }
            return v
            
          }
        }
      })
    )
    .pipe(dest('dist'))
    const watchFiles = () => {
      watch(getSrc('less'), compileLess)
      watch(getSrc(), reload)
    }
    

    const serve = done => {
      server.init({
        server: { baseDir: getSrc() }
      })
      done()
    }
    const reload = done => {
      server.reload()
      done()
    }
    

  const setDevEnv = (done) => {
    process.env.NODE_ENV = 'development';
    done();
  }
  const setProdEnv = (done) => {
    process.env.NODE_ENV = 'production';
    done();
  }

  function isProd() {
    return process.env.NODE_ENV === 'production'
  }
module.exports = {
  default: series(setDevEnv, compileLess, serve, watchFiles),
  build: series(
    setProdEnv,
    cleanFiles,
    compileLess,
    compileImg,
    compileJS,
    compileHTML,
    copyCSS,
    copyLibJS,
    revManifest,
    revHTML
  )
}
