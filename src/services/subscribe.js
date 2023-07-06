import { http } from '@/utils/http';

// 获取订阅消息列表
export const subscribeList = data => http('get', '/kxshop/admin/subscribe/list', data);

// 开关订阅消息
export const subscribeOpen = data => http('post', '/kxshop/admin/subscribe/open', data);
