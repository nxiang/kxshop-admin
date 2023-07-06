import {
    http,
} from "@/utils/http";

// 上传图片OSS
export const kxllUpload = data => http("get", "/cloud/oss/policy", data);

export const stsToken = data => http("post", "/cloud/oss/auth-credentials", data);
