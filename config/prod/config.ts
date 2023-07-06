// 生产环境配置，配置项参考https://umijs.org/

import { defineConfig } from '@umijs/max'
import defaultSettings from '../../src/defaultSettings'
import { externals, headScripts } from '../externals'
import pageRoutes from '../router.config'
import webpackPlugin from './plugin.config'

const { primaryColor } = defaultSettings
const { APP_TYPE } = process.env

export default defineConfig({
  externals,
  headScripts,
  // 配置 react-helmet-async 的集成，当设置为 false 时，不会集成 react-helmet-async，此时无法从框架中 import { Helmet } 使用，同时构建产物也会减少相应的尺寸。
  helmet: false,
  // umi提供的分包策略，生产环境推荐使用granularChunks，https://umijs.org/docs/api/config#codeSplitting
  codeSplitting: { jsStrategy: 'granularChunks' },
  antd: {},
  dva: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true
  },
  metas: [
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache'
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache'
    },
    {
      httpEquiv: 'Expires',
      content: '0'
    }
  ],
  // 让 history 带上 query。除了通过 useNavigate 进行的跳转场景，此时还需自行处理 query。
  historyWithQuery: {},
  history: { type: 'browser' },
  define: {
    APP_TYPE: APP_TYPE || ''
  },
  // 兼容ie11时，只能使用terser
  jsMinifier: 'terser',
  targets: {
    ie: 11
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor
  },
  ignoreMomentLocale: true,
  lessLoader: { javascriptEnabled: true },
  manifest: {
    basePath: '/admin/'
  },
  hash: true,
  chainWebpack: webpackPlugin,
  // 打包路径，默认是/
  base: '/admin/',
  // 资源访问路径，默认/
  publicPath: '/admin/',
  // 打包输出文件，默认./dist
  outputPath: './admin',
  // 生产环境清除console.log
  // extraBabelPlugins: ['transform-remove-console'],
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')]
})
