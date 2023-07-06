import { http} from '@/utils/http';

// 查询标签列表
export const tagList = (data) => http('get', '/kxshop/admin/tag/list', data);
// 查询标签详情
export const tagDetail = (data) => http('get', '/kxshop/admin/tag/detail', data);
// 新增标签
export const addTag = (data) => http('post', '/kxshop/admin/tag/new', data);
// 快捷新增手动标签
export const addTagBatch = (data) => http('post', '/kxshop/admin/manual-tag/batch-add', data);
// 删除标签
export const deleteTag = (data) => http('post', '/kxshop/admin/tag/delete', data);
// 编辑标签
export const editTag = (data) => http('post', '/kxshop/admin/tag/edit', data);
