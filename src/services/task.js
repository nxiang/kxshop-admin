import { http } from '@/utils/http';

// 上传导入oss地址
export const importTaskUpLoad = data => http('get', '/kxshop/admin/importTask/upLoad', data);

// 获取当前是否有正在执行的上传任务
export const checkHasTask = data => http('get', '/kxshop/admin/importTask/checkHasTask', data);

// 获取当前是否有正在执行的上传任务
export const importTaskList = data => http('get', '/kxshop/admin/importTask/list', data);

