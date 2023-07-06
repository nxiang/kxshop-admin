/*
 * http://mock.kxg.local/project/33/interface/api/cat_179
 */

import { http } from '@/utils/http';

// 根据区地址编码找父级地址编码列表
export const findParentIdsBycode = data => http('get', '/area/findParentIdsBycode', data);

// 获得地区列表
export const areaList = data => http('post', '/area/list', data);

// 店铺设置
export const setting = data => http('post', '/kxshop/admin/store/setting', data);

// 获得店铺详情
export const storeInfo = data => http('get', '/kxshop/admin/store/info', data);

// 获得即时配送详情
export const instantInfo = data => http('get', '/kxshop/admin/delivery/instant/info', data);

// 即时配送设置
export const instantAdd = data => http('post', '/kxshop/admin/delivery/instant/add', data);

// 即时配送编辑
export const instantEdit = data => http('post', '/kxshop/admin/delivery/instant/edit', data);

// 三方配送服务开通
export const openedAdd = data => http('post', '/kxshop/admin/delivery/open/add', data);

// 三方配送服务开通状态查询
export const openedInfo = data => http('get', '/kxshop/admin/delivery/opened/info', data);

// 三方配送服务已开通城市查询
export const cityInfo = data => http('get', '/kxshop/admin/delivery/city/info', data);

// 三方配送服务业务类型查询
export const businessInfo = data => http('get', '/kxshop/admin/delivery/business/info', data);

// 开始送账户余额
export const kssBalance = data => http('get', '/kxshop/admin/delivery/kss-balance', data);

// 开始送配送明细
export const deliveryList = data =>
  http('get', '/kxshop/admin/delivery/kss-balance/delivery-list', data);

// 开始送账户余额调整明细
export const adjustList = data =>
  http('get', '/kxshop/admin/delivery/kss-balance/adjust-list', data);

// 店铺装修模板查询
export const decorateIntroduction = data =>
  http('post', '/kxshop/admin/store/decorateIntroduction', data);

// 店铺装修查询
// export const decorate = data => http("post", "/kxshop/admin/store/decorate", data);

// 店铺装修查询(v1.8.0)
export const decorate = data => http('get', 'store/v1/decorate', data);

// 店铺装修保存
// export const decorateSave = data => http("post", "/kxshop/admin/store/decorateSave", data);

// 店铺装修保存(v.1.8.0)
export const decorateSaveNew = data => http('post', '/kxshop/admin/store/decorateSaveNew', data);

// 装修内容聚合查询（v1.8.0）
export const dataSearch = data => http('post', '/store/dataSearch', data);

// 选择优惠券
export const choseCoupon = data => http('post', '/kxshop/admin/store/choseCoupon', data);

// 选择专题页
export const choseTheme = data => http('get', '/kxshop/admin/store/choseTheme', data);

// 选择分类
export const choseStoreLabel = data => http('get', '/kxshop/admin/store/choseStoreLabel', data);

// 选择分类
export const choseStoreLabelGoods = data =>
  http('get', '/kxshop/admin/store/choseStoreLabelGoods', data);

// 选择商品
export const choseItem = data => http('get', '/kxshop/admin/store/choseItem', data);

// 选择营销活动
export const choseMarketingActivity = data =>
  http('get', '/kxshop/admin/store/choseMarketingActivity', data);

// 数组id查询商品
export const choseItemListById = data =>
  http('post', '/kxshop/admin/store/choseItemListById', data);

// 新增专题接口
export const addDecorateSpecial = data =>
  http('post', '/kxshop/admin/store/addDecorateSpecial', data);

// 编辑专题接口
export const updateDecorateSpecial = data =>
  http('post', '/kxshop/admin/store/updateDecorateSpecial', data);

// 删除专题接口
export const deleteDecorateSpecial = data =>
  http('get', '/kxshop/admin/store/deleteDecorateSpecial', data);

// 查询专题配置
export const selectDecorateSpecial = data =>
  http('get', '/kxshop/admin/store/selectDecorateSpecial', data);

// 查询专题配置
export const configDecorateSpecial = data =>
  http('post', '/kxshop/admin/store/configDecorateSpecial', data);

// 营业时间修改
export const businessEdit = data => http('post', '/kxshop/admin/store/businessEdit', data);

// 营业时间查询
export const setInfo = data => http('get', '/kxshop/admin/store/setInfo', data);

// 营业时间查询
export const decorateSpecialUrl = data =>
  http('get', '/kxshop/admin/store/decorateSpecialUrl', data);

// 新增/修改广告弹窗
export const saveOrUpdateAdvert = data =>
  http('post', '/kxshop/admin/store/advertisingConfig/saveOrUpdateAdvert', data);

// 删除广告详情
export const delAdvertising = data =>
  http('get', '/kxshop/admin/store/advertisingConfig/delAdvertising', data);

// 查询广告列表
export const getAdConfigLists = data =>
  http('get', '/kxshop/admin/store/advertisingConfig/lists', data);

// 获取广告详情
export const getAdvertisingDetail = data =>
  http('get', '/kxshop/admin/store/advertisingConfig/getAdvertisingDetail', data);

// 商家地址列表查询接口
export const getStoreAddressListApi = data => 
  http('get', '/kxshop/admin/store/address/list', data);

// 新建商家地址接口
export const addStoreAddressApi = data => 
  http('post', '/kxshop/admin/store/address/add', data);

// 修改商家地址接口
export const editStoreAddressApi = data => 
  http('post', '/kxshop/admin/store/address/edit', data);

// 商家地址详情接口
export const getStoreAddressInfoApi = data => 
  http('get', '/kxshop/admin/store/address/info', data);

// 删除商家地址接口
export const deleteStoreAddressApi = data => 
  http('post', '/kxshop/admin/store/address/delete', data);

// 查询所有商家地址
export const getShopAddressSelectDataApi = data => 
  http('get', '/kxshop/admin/store/address/listAll', data);


