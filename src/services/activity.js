/*
 * http://mock.kxg.local/project/33/interface/api/cat_179
 */

import { http, excel } from '@/utils/http';

// 获取活动列表
export const actList = data => http('get', '/marketing/activity/list', data);

// 活动模版列表查询
export const temList = data => http('get', '/marketing/activity/template/list', data);

// 活动创建
export const actAdd = data => http('post', '/marketing/activity/add', data);

// 活动编辑
export const actEdit = data => http('post', '/marketing/activity/edit', data);

// 获取活动详情
export const actInfo = data => http('get', '/marketing/activity/info', data);

// 活动策略设置
export const ruleAdd = data => http('post', '/marketing/activity/rule/add', data);

// 活动策略查询
export const ruleInfo = data => http('get', '/marketing/activity/rule/info', data);

// 活动策略模版查询
export const ruleTemplate = data => http('get', '/marketing/activity/rule/template', data);

// 活动策略编辑
export const ruleEdit = data => http('post', '/marketing/activity/rule/edit', data);

// 抽奖活动奖项添加
export const prizeAdd = data => http('post', '/marketing/lottery-activity/prize/add', data);

// 抽奖活动奖项编辑（新建状态）
export const prizeEdit = data => http('post', '/marketing/lottery-activity/prize/editNew', data);

// 抽奖活动奖项编辑（活动已创建）
export const prizeEditCreated = data =>
  http('post', '/marketing/lottery-activity/prize/editCreated', data);

// 抽奖活动奖项删除
export const prizeDel = data => http('get', '/marketing/lottery-activity/prize/delete', data);

// 抽奖活动奖项列表查询
export const prizeList = data => http('get', '/marketing/lottery-activity/prize/list', data);

// 抽奖活动未中奖设置
export const noPrizeAdd = data =>
  http('post', '/marketing/lottery-activity/losing-lottery/add', data);

// 抽奖活动未中奖编辑
export const noPrizeEdit = data =>
  http('post', '/marketing/lottery-activity/losing-lottery/edit', data);

// 抽奖活动未中奖查询
export const noPrizeInfo = data =>
  http('get', '/marketing/lottery-activity/losing-lottery/info', data);

// 优惠券奖品列表查询
export const couponList = data => http('get', '/marketing/coupon-prize/list', data);

// 营销活动奖品批次列表查询
export const prizeStockList = data => http('get', '/kxshop/admin/marketing/prize-stock/list', data);

// 获取抽奖记录/中奖明细
export const lotteryList = data => http('get', '/marketing/lottery-activity/record/list', data);

// 活动抽奖/中奖记录导出
export const exportData = data => excel('get', '/marketing/lottery-activity/record/export', data);

// 删除活动
export const actDelete = data => http('post', '/marketing/activity/delete', data, 'form');

// 终止活动
export const actTerminate = data =>
  http('post', '/kxshop/admin/marketing/activity/terminate', data, 'form');

// 延期活动
export const actPostpone = data => http('post', '/marketing/activity/postpone', data);

// 禁用活动
export const actDisable = data => http('post', '/marketing/activity/disable', data, 'form');

// 启用活动
export const actEnable = data => http('post', '/marketing/activity/enable', data, 'form');

// 分享领券活动新建
export const scAdd = data => http('post', '/kxshop/admin/share/activity/add', data);

// 分享领券活动新建-选择优惠券
export const scPick = data => http('get', '/kxshop/admin/share/activity/pick_coupon', data);

// 分享领取活动列表查询
export const scList = data => http('get', '/kxshop/admin/share/activity/list', data);

// 分享领券活动链接查询
export const scUrls = data => http('get', '/kxshop/admin/share/activity/urls', data);

// 分享领券活动记录列表查询
export const scInfoList = data => http('get', '/kxshop/admin/share/activity/record_list', data);

// 分享领券活动详情查询
export const scInfo = data => http('get', '/kxshop/admin/share/activity/info', data);

// 分享领券活动记录导出
export const scExport = data => excel('get', '/kxshop/admin/share/activity/record_export', data);

// 分享领券活动延期
export const scPostpone = data => http('post', '/kxshop/admin/share/activity/postpone', data);

// 分享领券活动暂停
export const scStop = data => http('post', '/kxshop/admin/share/activity/disable', data);

// 分享领券活动开启
export const scStart = data => http('post', '/kxshop/admin/share/activity/enable', data);

// 邀请有礼活动列表查询
export const inviteActivityList = data =>
  http('get', '/kxshop/admin/marketing/invite-activity/list', data);

// 邀请有礼活动详情查询
export const inviteActivityDetail = data =>
  http('get', '/kxshop/admin/marketing/invite-activity/detail', data);

// 邀请有礼活动邀请记录列表查询
export const inviteRecordList = data =>
  http('get', '/kxshop/admin/marketing/invite-activity/invite-record/list', data);

// 邀请有礼活动id生成
export const idGenerate = data => http('post', '/kxshop/admin/marketing/activity/idGenerate', data);

// 邀请有礼活动保存
export const inviteActivitySave = data =>
  http('post', '/kxshop/admin/marketing/invite-activity/save', data);

// 获取安心充展示状态
export const getAxcStatus = data => http('get', '/kxshop/admin/store/axcStatus', data);

// 修改安心充展示状态
export const editOpenOrCloseAxc = data => http('get', '/kxshop/admin/store/openOrCloseAxc', data);

// (绿色订单)后台配置获取
export const energyConfigDetailApi = data => http('get', '/kxshop/admin/marketing/antForest/energyConfigDetail', data);

// (绿色订单)后台配置
export const setEnergyConfigApi = data => http('post', '/kxshop/admin/marketing/antForest/energyConfig', data);