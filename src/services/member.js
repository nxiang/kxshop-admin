import { http } from '@/utils/http';

// 会员等级列表查询
export const memberGradeList = data => http('get', '/kxshop/admin/member-grade/list', data);

// 会员等级详情
export const memberGradeDetail = data => http('get', '/kxshop/admin/member-grade/detail', data);

// 会员等级新增
export const memberGradeAdd = data => http('post', '/kxshop/admin/member-grade/add', data);

// 会员等级编辑
export const memberGradeEdit = data => http('post', '/kxshop/admin/member-grade/edit', data);

// 会员等级删除
export const memberGradeDelete = data => http('post', '/kxshop/admin/member-grade/delete', data);

// 会员等级礼包可添加优惠券列表查询
export const availableCouponList = data =>
  http('get', '/kxshop/admin/member-grade/availableCouponList', data);

// 积分权益配置查询
export const memberPointsRuleDetail = data =>
  http('get', '/kxshop/admin/member-points-rule/detail', data);

// 积分权益配置编辑
export const memberPointsRuleEdit = data =>
  http('post', '/kxshop/admin/member-points-rule/edit', data);

// 获取会员任务列表
export const getVipTaskListApi = data =>
  http('get', '/kxshop/admin/marketing/vipTask/lists', data);

// 获取会员详情
export const getVipTaskDetailApi = data =>
  http('get', '/kxshop/admin/marketing/vipTask/detail', data);

// 编辑会员任务
export const vipTaskEditApi = data =>
  http('post', '/kxshop/admin/marketing/vipTask/editVipTask', data);

// 签到详情获取
export const getSignConfigDetailApi = data => 
  http('get', '/kxshop/admin/marketing/memberSinIn/signConfigDetail', data);

// 设置签到详情
export const setSignConfigApi = data => 
  http('post', '/kxshop/admin/marketing/memberSinIn/signConfig', data);

// 获取banner配置
export const getBannerConfigDetailApi = data => 
  http('get', '/kxshop/admin/marketing/memberSinIn/bannerConfigDetail', data);

// 设置banner配置
export const setBannerConfigApi = data => 
  http('post', '/kxshop/admin/marketing/memberSinIn/bannerConfig', data);
