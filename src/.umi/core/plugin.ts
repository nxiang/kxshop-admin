// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import * as Plugin_0 from '/Users/xiangnan/Desktop/gitStore/adminManage/src/app.js';
import * as Plugin_1 from '/Users/xiangnan/Desktop/gitStore/adminManage/src/.umi/plugin-clickToComponent/runtime.tsx';
import * as Plugin_2 from '/Users/xiangnan/Desktop/gitStore/adminManage/src/.umi/plugin-dva/runtime.tsx';
import * as Plugin_3 from '/Users/xiangnan/Desktop/gitStore/adminManage/src/.umi/plugin-locale/runtime.tsx';
import { PluginManager } from 'umi';

function __defaultExport (obj) {
  if (obj.default) {
    return typeof obj.default === 'function' ? obj.default() :  obj.default
  }
  return obj;
}
export function getPlugins() {
  return [
    {
      apply: __defaultExport(Plugin_0),
      path: process.env.NODE_ENV === 'production' ? void 0 : '/Users/xiangnan/Desktop/gitStore/adminManage/src/app.js',
    },
    {
      apply: Plugin_1,
      path: process.env.NODE_ENV === 'production' ? void 0 : '/Users/xiangnan/Desktop/gitStore/adminManage/src/.umi/plugin-clickToComponent/runtime.tsx',
    },
    {
      apply: Plugin_2,
      path: process.env.NODE_ENV === 'production' ? void 0 : '/Users/xiangnan/Desktop/gitStore/adminManage/src/.umi/plugin-dva/runtime.tsx',
    },
    {
      apply: Plugin_3,
      path: process.env.NODE_ENV === 'production' ? void 0 : '/Users/xiangnan/Desktop/gitStore/adminManage/src/.umi/plugin-locale/runtime.tsx',
    },
  ];
}

export function getValidKeys() {
  return ['patchRoutes','patchClientRoutes','modifyContextOpts','modifyClientRenderOpts','rootContainer','innerProvider','i18nProvider','accessProvider','dataflowProvider','outerProvider','render','onRouteChange','antd','dva','locale','qiankun',];
}

let pluginManager = null;

export function createPluginManager() {
  pluginManager = PluginManager.create({
    plugins: getPlugins(),
    validKeys: getValidKeys(),
  });


  return pluginManager;
}

export function getPluginManager() {
  return pluginManager;
}
