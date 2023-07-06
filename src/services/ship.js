import { http } from "@/utils/http";

// 快递公司列表
export const shipList = data => http("get", "/kxshop/admin/ship/list", data);

// 保存快递公司
export const shipSave = data => http("post", "/kxshop/admin/ship/save", data);