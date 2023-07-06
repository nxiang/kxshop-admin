import { http} from '@/utils/http';

// 查询店铺商品类目列表
export const storeLabelList = (data) => http('get', '/kxshop/admin/store-label/list', data);

// 新增店铺商品类目
export const storeLabelAdd = (data) => http('post', '/kxshop/admin/store-label/add', data);

// 编辑店铺商品类目
export const storeLabelEdit = (data) => http('post', '/kxshop/admin/store-label/edit', data);

// 删除店铺商品类目
export const storeLabelRemove = (data) => http('post', '/kxshop/admin/store-label/remove', data);

// 查询店铺商品类目选项
export const labelOptionList = (data) => http('get', '/kxshop/admin/store-label/label-option/list', { isLazy: true, ...data });

// 查询运费模版选项
export const templateList = (data) => http('get', '/kxshop/admin/freight-template/template-option/list', data);

// 查询运费模版详情
export const templateDetail = (data) => http('get', '/kxshop/admin/freight-template/detail', data);
