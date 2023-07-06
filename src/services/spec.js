import {
    http,
} from "@/utils/http";

// 查询规格列表
export const specList = data => http("get", "/kxshop/admin/spec/list", data);

// 查询规格列表-选项
export const specOptionList = data => http("get", "/kxshop/admin/spec/spec-option/list", data);

// 新增规格
export const addSpec = data => http("post", "/kxshop/admin/spec/new", data);

// 编辑规格
export const editSpec = data => http("post", "/kxshop/admin/spec/edit", data);

// 删除规格
export const deleteSpec = data => http("post", "/kxshop/admin/spec/delete", data);

// 查询规格值
export const specDetail = data => http("get", "/kxshop/admin/spec/detail", data);

// 查询规格值-选项
export const specValueOptionList = data => http("get", "/kxshop/admin/spec/spec-value-option/list", data);

// 添加规格值
export const addSpecValue = data => http("post", "/kxshop/admin/spec/add-value", data);
