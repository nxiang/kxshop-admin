// 开发环境配置，配置项参考https://umijs.org/

import { defineConfig } from '@umijs/max'
import defaultSettings from '../../src/defaultSettings'
import { externals, headScripts } from '../externals'
import pageRoutes from '../router.config'
import webpackPlugin from './plugin.config'

const { primaryColor } = defaultSettings
const { APP_TYPE } = process.env
// const javaUrl = 'http://172.25.19.35:8091';
const javaUrl = 'https://testh5.kxll.com' // 测试
// const javaUrl = 'https://kxcube.kxll.com' // 生产
// const javaUrl = 'https://kxcubedev.kxll.com'; //开发

export default defineConfig({
  externals,
  headScripts,
  // 配置 react-helmet-async 的集成，当设置为 false 时，不会集成 react-helmet-async，此时无法从框架中 import { Helmet } 使用，同时构建产物也会减少相应的尺寸。
  helmet: false,
  // umi提供的分包策略，开发环境推荐使用depPerChunk，https://umijs.org/docs/api/config#codeSplitting
  codeSplitting: { jsStrategy: 'depPerChunk' },
  // 开启后，可通过 Option+Click/Alt+Click 点击组件跳转至编辑器源码位置，Option+Right-click/Alt+Right-click 可以打开上下文，查看父组件。
  clickToComponent: {},
  antd: {},
  dva: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true
  },
  // 让 history 带上 query。除了通过 useNavigate 进行的跳转场景，此时还需自行处理 query。
  historyWithQuery: {},
  history: { type: 'browser' },
  define: {
    APP_TYPE: APP_TYPE || ''
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor
  },
  proxy: {
    // '/proxy/kxshop/admin/item/beast': {
    //   target: 'http://mock.kxg.local/mock/84/kxshop/admin/item/beast',
    //   changeOrigin: true,
    //   pathRewrite: { '^/proxy/kxshop/admin/item/beast': '' }
    // },
    '/swordApi': {
      target: javaUrl,
      changeOrigin: true
    },
    '/proxy': {
      target: javaUrl,
      changeOrigin: true
    },
    '/node': {
      target: javaUrl,
      changeOrigin: true
    },
    '/oss': {
      // target: 'https://commontest.kxll.com', // 测试服务器
      target: 'https://common.kxll.com', // 生产服务器
      changeOrigin: true
    }
  },
  ignoreMomentLocale: true,
  lessLoader: { javascriptEnabled: true },
  chainWebpack: webpackPlugin,
  // 打包路径，默认是/
  base: '/admin/',
  // 资源访问路径，默认/
  publicPath: '/admin/',
  // 打包输出文件，默认./dist
  outputPath: './admin',
  mfsu: false,
  // mfsu: {},
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')]
})
