// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp')

const loadPlugins = require('gulp-load-plugins') // 导入插件自动加载工具
const plugins = loadPlugins()

const browserSync = require('browser-sync') // 导入 browser-sync 插件
const bs = browserSync.create()

const del = require('del') // 导入 del 插件

const ftp = require('gulp-sftp')
const gulpConfig = require('./gulp-config.js');

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
// 清除文件
const clean = () => {
  return del(['dist', 'temp'])
}
// 样式构建任务
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))// 按照完全展开的格式转换
    .pipe(dest('temp'))
}
// 脚本构建任务
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
}
// 页面模板构建任务
const page = () => {
  return src('src/*.html', { base: 'src' }) // 假如要装换任意目录下的 .html 文件，'src/**/*.html'
    .pipe(plugins.swig({ data }))
    .pipe(dest('temp'))
}
// 图片构建任务
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
// 字体包构建任务
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
// 其他文件构建任务
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}
// 开启服务器任务
const serve = () => {
  // 监听的文件路径 文件发生变化后需要执行的构建任务
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload) // 监听文件变化，重新发送请求

  bs.init({
    notify: false, // 关掉提示
    port: 2080, // 设置端口，端口任意，只要是4位。冲突时改写一次
    livereload: true, // 实时热更新，方便调试。
    // open: false, // 取消自动打开浏览器
    files: 'temp/**', // 需要监听的文件
    server: {
      baseDir: ['temp', 'src', 'public'], // 会根据文件夹依次寻找文件
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
// 页面模板 src 地址 构建任务
const lint = () => {
  return src('dist/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true, // 压缩html里面的空白符
      minifyCSS: true, // 压缩html里面的style标签内容
      minifyJS: true // 压缩html里面的script标签内容
    })))
    .pipe(dest('dist'))
}
// Git 上传任务
const upload = (callback) => {
  return src('.' + gulpConfig.publicPath + '**')
    .pipe(ftp(Object.assign(gulpConfig.devDist, { callback })))
}

// parallel 同时执行
// series 穿行执行

// 编译任务
const compile = parallel(style, script, page)

// 上线前执行的任务
const build = series(clean, parallel(compile, image, font, extra))

// 开发阶段执行的任务
const start = series(compile, serve)

// 自动部署任务
const deploy = series(build, upload)

module.exports = {
  lint,
  compile,
  serve,
  build,
  clean,
  deploy,
  start,
}
