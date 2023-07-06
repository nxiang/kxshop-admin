import { http } from '@/utils/http';

// 查询运费模版列表
export const freightList = data => http('get', '/kxshop/admin/freight-template/list', data);

// 查询地区列表
export const areaList = data => http('get', '/kxshop/admin/freight-template/area/list', data)

// 查询运费模版所关联的商品spu列表
export const detailItemList = data => http('get', '/kxshop/admin/freight-template/detail/itemList', data)

// 新增运费模版
export const newFreight = data => http('post', '/kxshop/admin/freight-template/new', data);

// 查询运费模板详情
export const detailFreight = data => http('get', '/kxshop/admin/freight-template/detail', data);

// 编辑运费模板
export const editFreight = data => http('post', '/kxshop/admin/freight-template/edit', data);

// 删除运费模板
export const deleteFreight = data => http('post', '/kxshop/admin/freight-template/delete', data);

// 复制运费模板
export const copyFreight = data => http('post', '/kxshop/admin/freight-template/copy', data);

// 运费包邮模版列表查询
export const freightFreeTemplateList = data =>
  http('get', '/kxshop/admin/freight-free-template/list', data);

// 运费包邮模版新增
export const freightFreeTemplateAdd = data =>
  http('post', '/kxshop/admin/freight-free-template/add', data);

// 运费包邮模版编辑
export const freightFreeTemplateEdit = data =>
  http('post', '/kxshop/admin/freight-free-template/edit', data);

// 运费包邮模版详情
export const freightFreeTemplateDetail = data =>
  http('get', '/kxshop/admin/freight-free-template/detail', data);

// 运费包邮模版删除
export const freightFreeTemplateDelete = data =>
  http('post', '/kxshop/admin/freight-free-template/delete', data);
