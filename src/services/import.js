import { http } from '@/utils/http';

// 商品数据导入
export const itemImport = data => http('post', '/kxshop/admin/item/import', data);

// 商品图片导入
export const imageImport = data => http('post', '/kxshop/admin/item/image/import', data);

// 设置商品店铺分类及物流配送方式
export const freightEdit = data =>
  http('post', '/kxshop/admin/item/store-label-and-freight/edit', data);

// 查询导入结果
export const importResult = data => http('get', '/kxshop/admin/item/import-result', data);
