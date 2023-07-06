import { http } from '@/utils/http';

// 店铺打印机列表
export const printerList = data => http('get', '/kxshop/admin/store/printer/list', data);

// 店铺打印机新增
export const printerAdd = data => http('post', '/kxshop/admin/store/printer/add', data);

// 店铺打印机编辑
export const printerEdit = data => http('post', '/kxshop/admin/store/printer/edit', data);

// 店铺打印机删除
export const printerDelete = data => http('post', '/kxshop/admin/store/printer/delete', data);

// 店铺打印机开启/关闭
export const printerState = data => http('post', '/kxshop/admin/store/printer/state', data);

// 打印测试
export const printTest = data => http('post', '/kxshop/admin/store/printer/print-test', data);

// 小票打印
export const tradePrint = data => http('post', '/kxshop/admin/trade/print', data);
