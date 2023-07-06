import { http } from '@/utils/http';

// 拼团规格
export const selectItem = data => http('get', '/kxshop/admin/marketing/groupon/select-item', data);

// 发布拼团
export const publish = data => http('post', '/kxshop/admin/marketing/groupon/publish', data);

// 编辑拼团
export const edit = data => http('post', '/kxshop/admin/marketing/groupon/edit', data);

// 拼团列表
export const grouponList = data => http('get', '/kxshop/admin/marketing/groupon/list', data);

// 拼团详情
export const detail = data => http('get', '/kxshop/admin/marketing/groupon/detail', data);

// 拼团分享链接
export const shareUrl = data => http('post', '/kxshop/admin/marketing/groupon/share-url', data);

// 暂停拼团
export const pause = data => http('post', '/kxshop/admin/marketing/groupon/pause', data);

// 启用拼团
export const resume = data => http('post', '/kxshop/admin/marketing/groupon/resume', data);
