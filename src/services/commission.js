/*
 * http://mock.kxg.local/project/33/interface/api/cat_179
 */

import { http } from "@/utils/http";

// 佣金审核列表
export const commissionWithdrawalList = data => http("post", "/commission/seller/commissionWithdrawalList", data);

// 佣金审核操作
export const commissionAudit = data => http("post", "/commission/seller/withdrawalOperation", data);

// 分佣设置编辑金额
export const updateCommissionConfig = data => http("post", "/commission/seller/updateCommissionConfig", data);

// 分佣设置查询金额
export const commissionConfig = data => http("get", "/commission/seller/commissionConfig", data);

// 获取商品列表
export const auditList = data => http("get", "/commission/seller/itemList", data);

// 编辑分佣商品
export const updateCommissionItem = data => http("post", "/commission/seller/updateCommissionItem", data);

// 分佣订单列表
export const orderList = data => http("post", "/commission/seller/orderList", data);

// 分佣商品列表
export const commissionList = data => http("get", "/commission/seller/commissionItemList", data);

// 新增分佣商品
export const addCommissionItem = data => http("post", "/commission/seller/addCommissionItem", data);

// 删除分佣商品
export const deleteCommissionItem = data => http("get", "/commission/seller/deleteCommissionItem", data);
