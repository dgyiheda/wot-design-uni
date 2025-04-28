const gulp = require('gulp')
const dartSass = require('sass')
const gulpSass = require('gulp-sass')
const concat = require('gulp-concat')
const path = require('path')
const { exec } = require('child_process')

// 插件目录
const PATH = path.join(__dirname)

// components 目录
const COMPONENTS_PATH = path.join(PATH, 'src/uni_modules/wot-design-uni/components')

// es模块打包目录
const OUTPUT_DIR_PATH = path.join(PATH, 'dist')

// lib模块打包目录
// const OUTPUT_DIR_PATH_LIB = path.join(PATH, 'lib')

const sass = gulpSass(dartSass)

/**
 * @description: 打包模块
 */
function buildModules(cb) {
  exec('npx vite build --config ./vite.modules.config.ts', (err, stdout, stderr) => {
    console.log(stdout)
    cb(err)
  })
}

/**
 * @description: 编译less成css
 */
async function compileSass() {
  return await gulp
    .src(`${COMPONENTS_PATH}/**/*.scss`) // 匹配所有 sass 文件
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(concat('index.css'))
    // 使用 gulp-less 插件编译 Less
    .pipe(gulp.dest(OUTPUT_DIR_PATH)) // 输出编译后的 CSS 文件到目标路径
}

exports.default = gulp.series(buildModules, compileSass)
