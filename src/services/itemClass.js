import {
    http,
} from "@/utils/http";

// 查询商品分类选项
export const classOption = data => http("get", "/kxshop/admin/item-class/class-option/list", data);

// 查询商品分类卖家属性
export const sellerAttrs = data => http("get", "/kxshop/admin/item-class/seller-attrs", data);

