import {
    http,
} from "@/utils/http";


// 查询储值卡详情
export const statistics = data => http("get", "/kxshop/admin/home/statistics", data);
