const {parallel, series, src, dest, watch} = require('gulp')
const rollup = require('rollup')
const rollupTypescript = require('@rollup/plugin-typescript')
const del = require('del')
const fs = require('fs')
const through2 = require('through2')

// 清空打包文件
const cleanTask = async function (cb) {
  await del(['dist/**/*'])

  cb()
}

// 拷贝配置文件`
const copyOptionTask = function (cb) {
  src('src/manifest.json')
    .pipe(
      through2.obj(
        {},
        function (file, _, cb) {
          if (file.isBuffer()) {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

            let fileObj = JSON.parse(file.contents.toString())
            fileObj.name = packageJson.name
            fileObj.version = packageJson.version
            fileObj.description = packageJson.description
            file.contents = Buffer.from(JSON.stringify(fileObj))

            cb(null, file)
          }
        },
        null
      )
    )
    .pipe(dest('dist'))

  cb()
}

const iconTask = function (cb) {
  src('src/*.png').pipe(dest('dist'))
  cb()
}

// 打包 content_script.js
const contentScriptTask = async function (cb) {
  const bundle = await rollup.rollup({
    input: 'src/contentScript/index.ts',
    plugins: [rollupTypescript()],
  })

  await bundle.write({
    format: 'cjs',
    exports: 'auto',
    file: 'dist/contentScript.js',
  })

  cb()
}

// 打包 background.js
const backgroundTask = async function (cb) {
  const bundle = await rollup.rollup({
    input: 'src/background/index.ts',
    plugins: [rollupTypescript()],
  })

  await bundle.write({
    format: 'cjs',
    exports: 'auto',
    file: 'dist/background.js',
  })

  cb()
}

// 打包 action.html
const actionTask = function (cb) {
  src('src/action/**/*').pipe(dest('dist'))
  cb()
}

// 开发模式
const devTask = function () {
  // 先打包一遍
  series(cleanTask, parallel(copyOptionTask, iconTask, contentScriptTask, actionTask, backgroundTask))()

  watch('src/*.png', iconTask)

  watch('src/action/**/*', actionTask)

  watch('src/contentScript/**/*.ts', contentScriptTask)

  watch('src/background/**/*.ts', backgroundTask)

  watch('src/manifest.json', copyOptionTask)
}

exports.default = series(cleanTask, parallel(copyOptionTask, iconTask, contentScriptTask, actionTask, backgroundTask))

exports.dev = devTask
