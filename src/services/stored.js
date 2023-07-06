import {
    http,
} from "@/utils/http";

// 创建储值卡
export const newCard = data => http("post", "/kxshop/admin/stored-value-card/new", data);

// 编辑储值卡
export const editCard = data => http("post", "/kxshop/admin/stored-value-card/edit", data);

// 查询储值卡详情
export const cardDetail = data => http("get", "/kxshop/admin/stored-value-card/detail", data);

// 查询储值卡列表
export const cardList = data => http("get", "/kxshop/admin/stored-value-card/list", data);

// 停售
export const delisting = data => http("post", "/kxshop/admin/stored-value-card/delisting", data);

// 发布
export const listing = data => http("post", "/kxshop/admin/stored-value-card/listing", data);

// 续期
export const renew = data => http("post", "/kxshop/admin/stored-value-card/renew", data);

// 查询储值数据总览
export const summary = data => http("get", "/kxshop/admin/vip/balance/summary", data);

// 查询会员余额明细
export const balanceList = data => http("get", "/kxshop/admin/vip/balance-detail/list", data);

// 查询会员明细详情
export const balanceDetail = data => http("get", "/kxshop/admin/vip/balance-detail/detail", data);