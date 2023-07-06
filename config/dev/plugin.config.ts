// Change theme plugin

// import MergeLessPlugin from 'antd-pro-merge-less'
// import AntDesignThemePlugin from 'antd-theme-webpack-plugin'
import { IConfig } from '@umijs/bundler-webpack/dist/types'
// const isProd = process.env.NODE_ENV === 'production'

// const config = new Config();

const chainWebpack: IConfig['chainWebpack'] = (config) => {
  // config.externalsType('window')
  // 打印umi的webpack配置
  // console.log('config',config.toConfig())
  // 配合umi的mfsu使用
  // config.module
  //   .rule('mjs-rule')
  //   .test(/.m?js/)
  //   .resolve.set('fullySpecified', false)
  // webpack5的cache优化
  // config.cache({
  //   type: 'filesystem',
  //   allowCollectingMemory: true,
  //   buildDependencies: {
  //     config: [__filename]
  //   }
  // })
  // // webpack 按路由懒编译
  // config.experiments({
  //   lazyCompilation: true
  // })
  // if (isProd) {
  //   // 合理分包，让代码尽量不重复打包
  //   config.merge({
  //     optimization: {
  //       minimize: true,
  //       splitChunks: {
  //         chunks: 'async',
  //         minSize: 30000,
  //         minChunks: 1,
  //         automaticNameDelimiter: '.',
  //         cacheGroups: {
  //           // antd相关
  //           antdesigns: {
  //             name: 'antdesigns',
  //             chunks: 'all',
  //             test: /[\\/]node_modules[\\/](@antv|antd|@ant-design|rc-form|rc-util|rc-animate|tinycolor2|rc-tooltip|rc-trigger|rc-motion)/,
  //             priority: 20
  //           },
  //           // react相关
  //           reacts: {
  //             name: 'reacts',
  //             chunks: 'all',
  //             test: /[\\/]node_modules[\\/](react-intl|intl-messageformat|react-color|react-amap|react-dnd|dnd-core|react-helmet|react-redux|redux|react-slick|react-router|renderer-react|react-is|qrcode.react|reactcss)/,
  //             priority: 20
  //           },
  //           // 工具相关
  //           utils: {
  //             name: 'utils',
  //             chunks: 'all',
  //             test: /[\\/]node_modules[\\/](lodash|lodash-es|ahooks|@ahooksjs|axios|alife-logger|umi-request|qs|js-base64|query-string|core-js|hash.js|qr.js)/,
  //             priority: 20
  //           },
  //           // node_modules中的其它
  //           vendors: {
  //             name: 'vendors',
  //             chunks: 'all',
  //             test: /[\\/]node_modules[\\/]/,
  //             priority: 10
  //           },
  //           // 装修组件相关
  //           bizComponents: {
  //             name: 'bizComponents',
  //             chunks: 'all',
  //             test: /[\\/]src[\\/](bizComponents)/,
  //             priority: 5
  //           },
  //           // 公共的业务代码
  //           commons: {
  //             name: 'commons',
  //             // 其余同步加载包
  //             chunks: 'all',
  //             minChunks: 2,
  //             priority: 1,
  //             // 这里需要注意下，webpack5会有问题， 需加上这个 enforce: true，
  //             // refer: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257#issuecomment-432594711
  //             enforce: true
  //           }
  //         }
  //       }
  //     }
  //   })
  // }
  // config.resolve.alias.set("~@", path.resolve(__dirname, "../src"))
  // 给比较耗时的sass-loader添加thread-loader
  // config.module
  //   .rule('sass')
  //   .oneOf('normal')
  //   .resourceQuery(/modules/)
  //   .use('css-loader')
  //   .loader('thread-loader')
  // console.log('oneOfs', )
  // config.module
  //   .rule('sass')
  //   // .oneOf('')
  //   .use('cache-loader')
  //   .loader('cache-loader')
  // config.module
  //   .rule('js')
  //   .use('thread-loader')
  //   .loader('thread-loader')
  //   .before('babel-loader')
  // pro 和 开发环境再添加这个插件
  // if (
  //   process.env.APP_TYPE === 'site' ||
  //   process.env.NODE_ENV !== 'production'
  // ) {
  //   // 将所有 less 合并为一个供 themePlugin使用
  //   const outFile = path.join(__dirname, '../.temp/ant-design-pro.less')
  //   const stylesDir = path.join(__dirname, '../src/')
  //   config.plugin('merge-less').use(MergeLessPlugin, [
  //     {
  //       stylesDir,
  //       outFile
  //     }
  //   ])
  //   config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
  //     {
  //       antDir: path.join(__dirname, '../node_modules/antd'),
  //       stylesDir,
  //       varFile: path.join(
  //         __dirname,
  //         '../node_modules/antd/lib/style/themes/default.less'
  //       ),
  //       mainLessFile: outFile, //     themeVariables: ['@primary-color'],
  //       indexFileName: 'index.html',
  //       generateOne: true,
  //       lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js'
  //     }
  //   ])
  // }
}
export default chainWebpack
