import { http } from '@/utils/http';

// 查询标记用户数量
export const queryUserNum = data => http('get', '/kxshop/admin/user/count', data);
// 查询用户列表
export const queryUserList = data => http('get', '/kxshop/admin/user/list', data);
// 查询标签选项
export const queryTagList = data => http('get', '/kxshop/admin/tag-option/list', data);
// 查询下级地区列表
export const queryDistrict = data => http('get', '/kxshop/admin/sub-area/list', data);
// 添加用户标签
export const addUserTag = data => http('post', '/kxshop/admin/user/tag/add', data);
// 批量添加用户标签
export const addUserTapBatch = data => http('post', '/kxshop/admin/user/tag/batch-add', data);
// 查询可用优惠券批次列表
export const queryDiscountList = data => http('get', '/kxshop/admin/favor/stock/list', data);
// 赠送用户优惠券
export const giveDiscount = data => http('post', '/kxshop/admin/user/coupon/present', data);
// 批量赠送用户优惠券
export const giveDiscountBatch = data =>
  http('post', '/kxshop/admin/user/coupon/batch-present', data);
// 查询用户详情
export const queryUserDetail = data => http('get', '/kxshop/admin/user/detail', data);
// 设置用户备注
export const setUserRemark = data => http('post', '/kxshop/admin/user/remark/edit', data);
// 删除用户标签
export const deleteUserTag = data => http('post', '/kxshop/admin/user/tag/delete', data);
// 快捷新增手动标签
export const addTagBatch = data => http('post', '/kxshop/admin/manual-tag/batch-add', data);

// 查询应用开通渠道
export const queryChannel = data => http('get', '/kxshop/admin/client/list', data);

// 用户分析数量统计
export const quantityStat = data => http('get', '/kxshop/admin/user/analyze/quantityStat', data);
// 用户数量分析
export const memberQuantity = data =>
  http('get', '/kxshop/admin/user/analyze/memberQuantity', data);
// 用户性别分析
export const analyzeSex = data => http('get', '/kxshop/admin/user/analyze/sex', data);
// 用户年龄分析
export const analyzeAge = data => http('get', '/kxshop/admin/user/analyze/age', data);
// 用户开卡入口分析
export const openCardSource = data =>
  http('get', '/kxshop/admin/user/analyze/openCardSource', data);

// 积分明细列表查询
export const memberPointsRecordList = data => http('get', '/kxshop/admin/member-points-record/list', data);