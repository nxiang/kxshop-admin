/*
 *   author:langyan
 *   date：20200228
 *  explain:  用户管理模块列表页面
 * */
import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import { Input, Select, message } from 'antd';
import { DashboardTwoTone } from '@ant-design/icons';
import Css from './QueryList.module.scss';
import { queryTagList, queryUserNum, queryUserList, queryChannel } from '@/services/queryUser';
import Panel from '@/components/Panel';
import RadioPage from '../component/radioPage/radioPage'; // 单选组件
import UseClassify from '../component/useClassify/useClassify'; // 用户分类组件
import BatchButton from '../component/batchButton/batchButton'; // 批量操作组件
import ScreenButton from '../component/screenButton/screenButton'; // 筛选操作按钮
import ScreenModule from '../component/screenModule/screenModule'; // 更多筛选组件
import ScreenTable from '../component/screenTable/screenTable'; // 列表组件
import TagAdd from '../component/tagAdd/tagAdd'; // 添加标签组件
import GiveDiscount from '../component/giveDiscount/giveDiscount';
// 赠送优惠券
const { Option } = Select;

class QueryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSource: [], // 用户来源数据

      tagList: [], // 标签模拟数据
      screenData: {
        // 列表筛选条件
        page: 1,
        clientId: 1, // 渠道 1 支付宝 2 微信
        label: 0, // 用户标记 0 所有用户 1 新增用户 2 潜在用户 4 流失用户
        keyword: '', // 昵称/手机号码
        tagIds: '', // 标签，最多5个
        minTradeQuantity: '', // 最小交易笔数
        maxTradeQuantity: '', // 最大交易笔数
        minTradeAmount: '', // 最小交易总额
        maxTradeAmount: '', // 最大交易总额
        minAvgTradeAmount: '', // 最小平均交易金额
        maxAvgTradeAmount: '', // 最大平均交易金额
        minLastTradeTime: '', // 上次交易时间-开始
        maxLastTradeTime: '', // 上次交易时间-结束
        sex: '', // 性别1 男 2 女 0 保密
        provinceId: '', // 省ID
        cityId: '', // 市ID
        areaId: '', // 区ID
        education: '', // 学历 0 小学 1 初中 2 高中 3 本科 4 硕士 5 博士
        moreFlag: true, // 筛选更多阈值
      },
      selectList: [], // 标签多选数据
      useClassifyNum: [
        // 统计数据显示
        {
          name: '全部用户',
          num: 0,
          code: 0,
          field: 'memberQuantity',
          tipsText: '所有已授权信息的用户',
        },
        {
          name: '新增用户',
          num: 0,
          code: 1,
          field: 'newMemberQuantity',
          tipsText: '最近30天增加的用户',
        },
        {
          name: '潜在用户',
          num: 0,
          code: 2,
          field: 'potentialMemberQuantity',
          tipsText: '最近30天有加购行为，但是未下单的用户',
        },
        {
          name: '已流失的用户',
          num: 0,
          code: 3,
          field: 'churnMemberQuantity',
          tipsText: '最近30天无下单记录的用户',
        },
      ],
      zfbUseClassifyNum: [
        // 统计数据显示
        {
          name: '全部用户',
          num: 0,
          code: 0,
          field: 'memberQuantity',
          tipsText: '访问过小程序的用户',
        },
        {
          name: '注册用户',
          num: 0,
          code: 4,
          field: 'registeredMemberQuantity',
          tipsText: '通过授权或开卡已获取手机号的用户',
        },
        {
          name: '领卡用户',
          num: 0,
          code: 5,
          field: 'cardOpenedMemberQuantity',
          tipsText: '领取支付宝会员卡的用户',
        },
        {
          name: '日新增用户',
          num: 0,
          code: 1,
          field: 'dayNewMemberQuantity',
          tipsText: '每日增加的用户',
        },
        {
          name: '潜在用户',
          num: 0,
          code: 2,
          field: 'potentialMemberQuantity',
          tipsText: '最近30天有加购行为，但是未下单的用户',
        },
        {
          name: '已流失的用户',
          num: 0,
          code: 3,
          field: 'churnMemberQuantity',
          tipsText: '最近30天无下单记录的用户',
        },
      ],
      userData: {},
      submitmemberId: {
        // 用户id
        memberIdList: [], // 批量派送id
      },
    };
  }

  async componentDidMount() {
    await this.getQueryData();
    this.getQueryUserList();
    this.getAllQueryList(this.state.screenData.clientId);
  }

  // 获取标签、计算数据
  async getQueryData() {
    const { data: userSource } = await queryChannel();
    const { data: tagList } = await queryTagList();
    if (!userSource || !tagList) return;
    const screenData = Object.assign(this.state.screenData, {
      clientId: userSource[0] ? userSource[0].clientId : 1,
    });
    this.setState({
      screenData,
      tagList,
      userSource,
    });
  }

  // 获取用户数据
  async getAllQueryList(clientId) {
    const { data: useClassifyNum } = await queryUserNum({ clientId });
    const oldUseClassifyNum = this.deepCopyObj(this.state.useClassifyNum);
    const oldZfbUseClassifyNum = this.deepCopyObj(this.state.zfbUseClassifyNum);
    useClassifyNum &&
      oldUseClassifyNum.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(useClassifyNum, item.field)) {
          item.num = useClassifyNum[item.field];
        }
      });
    useClassifyNum &&
      oldZfbUseClassifyNum.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(useClassifyNum, item.field)) {
          item.num = useClassifyNum[item.field];
        }
      });
    this.setState({
      useClassifyNum: oldUseClassifyNum,
      zfbUseClassifyNum: oldZfbUseClassifyNum,
    });
  }

  // 获取列表数据
  async getQueryUserList() {
    const screenData = this.deepCopyObj(this.state.screenData);
    if (screenData.minTradeAmount != '' && screenData.minTradeAmount != null) {
      screenData.minTradeAmount = Number(screenData.minTradeAmount) * 100;
    }
    if (screenData.maxTradeAmount != '' && screenData.maxTradeAmount != null) {
      screenData.maxTradeAmount = Number(screenData.maxTradeAmount) * 100;
    }
    if (screenData.minAvgTradeAmount != '' && screenData.minAvgTradeAmount != null) {
      screenData.minAvgTradeAmount = Number(screenData.minAvgTradeAmount) * 100;
    }
    if (screenData.maxAvgTradeAmount != '' && screenData.maxAvgTradeAmount != null) {
      screenData.maxAvgTradeAmount = Number(screenData.maxAvgTradeAmount) * 100;
    }
    if (screenData.minLastTradeTime != '') {
      screenData.minLastTradeTime += ':00';
    }
    if (screenData.maxLastTradeTime != '') {
      screenData.maxLastTradeTime += ':59';
    }
    const { data } = await queryUserList(screenData);
    if (!data) return;
    data.rows.forEach(item => {
      if (Number(item.tradeAmount) > 0) {
        item.tradeAmount = Number(item.tradeAmount) / 100;
      } else {
        item.tradeAmount = '--';
      }
      if (Number(item.avgTradeAmount) > 0) {
        item.avgTradeAmount = Number(item.avgTradeAmount) / 100;
      } else {
        item.avgTradeAmount = '--';
      }
      if (Number(item.avgTradeAmount) > 0) {
        item.refundAmount = Number(item.refundAmount) / 100;
      } else {
        item.refundAmount = '--';
      }
      if (Number(item.tradeQuantity) == 0) {
        item.tradeQuantity = '--';
      }
      if (Number(item.refundQuantity) == 0) {
        item.refundQuantity = '--';
      }
      if (!item.lastTradeTime) {
        item.lastTradeTime = '--';
      }
    });
    this.setState({
      userData: data,
    });
  }

  // 深拷贝对象数组
  deepCopyObj(obj) {
    const result = typeof obj.splice === 'function' ? [] : {};
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = this.deepCopyObj(obj[key]); // 如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
        } else {
          result[key] = obj[key]; // 如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
        }
      }
      return result;
    }
    return obj;
  }

  // 用户来源选择
  radioChange(item) {
    this.restState({ clientId: item.clientId });
    this.getAllQueryList(item.clientId);
  }

  // 用户类型选择
  useClassifyClick(item) {
    this.restState({ label: item.code, clientId: this.state.screenData.clientId });
  }

  // 输入框事件
  serachInputChange(e) {
    if (e.target.value.length > 20) {
      return;
    }
    this.modificationState({ keyword: e.target.value });
  }

  // 标签选择
  handleChange(val) {
    const MAX = 5;
    if (val.length <= MAX) {
      this.setState({ selectList: val });
    } else {
      message.warning('标签最多可选5个！');
    }
  }

  // 筛选更多选择函数
  screenMoreClick() {
    this.modificationState({ moreFlag: !this.state.screenData.moreFlag });
  }

  // 筛选开始函数
  screenClick() {
    this.setState(
      {
        screenData: {
          ...this.state.screenData,
          page: 1,
          tagIds: this.state.selectList.toString(),
        },
      },
      () => {
        this.getQueryUserList();
      }
    );
  }

  // 批量设置、送优惠券
  batchButtonFun(typeId) {
    if (this.state.submitmemberId.memberIdList.length < 1) {
      message.warning('请选择用户!');
      return;
    }
    switch (typeId) {
      case 1:
        this.tagAddModule.showModal({
          memberIds: this.state.submitmemberId.memberIdList,
          sourceId: 2,
        });
        break;
      case 2:
        this.giveDiscountModule.showModal({
          memberIds: this.state.submitmemberId.memberIdList,
          sourceId: 2,
          clientId: this.state.screenData.clientId,
        });
        break;
      default:
        break;
    }
  }

  // 页面跳转函数
  pageJump(pathname,state) {
    history.push(pathname, state);
  }

  // 表格操作触发函数
  screenTableButton(typeId, event) {
    switch (typeId) {
      case 1:
        this.tagAddModule.showModal({ memberId: event, sourceId: 1 });
        break;
      case 2:
        this.giveDiscountModule.showModal({
          memberId: event,
          sourceId: 1,
          clientId: this.state.screenData.clientId,
        });
        break;
      case 3:
        // this.pageJump({
        //   pathname: '/users/list/detail',
        //   state: { memberId: event, clientId: this.state.screenData.clientId },
        // });
        this.pageJump('/users/list/detail', { memberId: event, clientId: this.state.screenData.clientId });
        break;
      default:
        break;
    }
  }

  // 批量选择用户
  batchScreenUse(data) {
    this.amendSubmitmemberId({ memberIdList: data });
  }

  // 分页改变页码函数
  paginationChange(e) {
    this.setState(
      {
        screenData: {
          ...this.state.screenData,
          page: e,
        },
      },
      () => {
        this.getQueryUserList();
      }
    );
  }

  // 弹窗操作成功回调
  moduleSuccess() {
    // console.log('成功了');
  }

  // 修改state数据函数
  modificationState(obj) {
    const newScreenData = Object.assign(this.state.screenData, obj);
    this.setState({
      screenData: newScreenData,
    });
  }

  // 重置请求参数
  restState(obj) {
    const screenData = {
      // 列表筛选条件
      page: this.state.screenData.page,
      clientId: 1, // 渠道 1 支付宝 2 微信
      label: 0, // 用户标记 0 所有用户 1 新增用户 2 潜在用户 4 流失用户
      keyword: '', // 昵称/手机号码
      tagIds: '', // 标签，最多5个
      minTradeQuantity: '', // 最小交易笔数
      maxTradeQuantity: '', // 最大交易笔数
      minTradeAmount: '', // 最小交易总额
      maxTradeAmount: '', // 最大交易总额
      minAvgTradeAmount: '', // 最小平均交易金额
      maxAvgTradeAmount: '', // 最大平均交易金额
      minLastTradeTime: '', // 上次交易时间-开始
      maxLastTradeTime: '', // 上次交易时间-结束
      sex: '', // 性别1 男 2 女 0 保密
      provinceId: '', // 省ID
      cityId: '', // 市ID
      areaId: '', // 区ID
      education: '', // 学历 0 小学 1 初中 2 高中 3 本科 4 硕士 5 博士
      moreFlag: true, // 筛选更多阈值
    };
    const newScreenData = Object.assign(screenData, obj);
    this.setState(
      {
        screenData: newScreenData,
        selectList: [],
      },
      () => {
        this.getQueryUserList();
      }
    );
  }

  // 修改用户id
  amendSubmitmemberId(obj) {
    const newSubmitmemberId = Object.assign(this.state.submitmemberId, obj);
    this.setState({
      submitmemberId: newSubmitmemberId,
    });
  }

  // 获取子组件
  onRef(name, ref) {
    switch (name) {
      case 'tagAddModule':
        this.tagAddModule = ref;
        break;
      case 'giveDiscountModule':
        this.giveDiscountModule = ref;
        break;
      default:
        break;
    }
  }

  render() {
    const {
      selectList,
      userSource,
      screenData,
      useClassifyNum,
      zfbUseClassifyNum,
      tagList,
      userData,
    } = this.state;
    return (
      <Panel title="用户查询">
        <div className={Css['query-box']}>
          {/* 筛选开始 */}
          <div className={Css['query-content']}>
            <div className={Css['query-screen']}>
              <RadioPage
                userSource={userSource}
                screenData={screenData}
                radioChange={this.radioChange.bind(this)}
              />
              {this.state.screenData.clientId == 2 && (
                <UseClassify
                  useClassifyNum={useClassifyNum}
                  screenData={screenData}
                  useClassifyClick={this.useClassifyClick.bind(this)}
                />
              )}
              {this.state.screenData.clientId == 1 && (
                <UseClassify
                  useClassifyNum={zfbUseClassifyNum}
                  screenData={screenData}
                  useClassifyClick={this.useClassifyClick.bind(this)}
                />
              )}
              <div className={Css['screen-condition']}>
                <div className={Css['screen-condition-input']}>
                  <Input
                    className={Css['photo-input']}
                    placeholder="昵称/手机号"
                    value={screenData.keyword}
                    onChange={this.serachInputChange.bind(this)}
                  />
                  <Select
                    className={Css['tab-select']}
                    mode="multiple"
                    placeholder="请选择标签"
                    value={selectList}
                    onChange={this.handleChange.bind(this)}
                    optionLabelProp="label"
                  >
                    {tagList &&
                      tagList.map(item => {
                        return (
                          <Option value={item.tagId} label={item.tagName} key={item.tagId}>
                            <span role="img" aria-label={item.tagId}>
                              {item.tagName}
                            </span>
                          </Option>
                        );
                      })}
                  </Select>
                  {this.state.screenData.moreFlag ? (
                    <ScreenButton
                      moreFlag={screenData.moreFlag}
                      screenClick={this.screenClick.bind(this)}
                      screenMoreClick={this.screenMoreClick.bind(this)}
                    />
                  ) : (
                    ''
                  )}
                </div>
                {this.state.screenData.moreFlag ? (
                  <BatchButton batchButtonFun={this.batchButtonFun.bind(this)} />
                ) : (
                  ''
                )}
              </div>
              {/* 更多筛选开始 */}
              {this.state.screenData.moreFlag ? (
                ''
              ) : (
                <div className={Css['screen-more']}>
                  <ScreenModule
                    modificationState={this.modificationState.bind(this)}
                    screenData={screenData}
                  />
                  <ScreenButton
                    moreFlag={screenData.moreFlag}
                    screenClick={this.screenClick.bind(this)}
                    screenMoreClick={this.screenMoreClick.bind(this)}
                  />
                  <BatchButton batchButtonFun={this.batchButtonFun.bind(this)} />
                </div>
              )}

              {/* 更多筛选结束 */}
            </div>
            {/* 数据展示开始 */}
            {userData ? (
              <ScreenTable
                screenTableButton={this.screenTableButton.bind(this)}
                userData={userData}
                batchScreenUse={this.batchScreenUse.bind(this)}
                paginationChange={this.paginationChange.bind(this)}
              />
            ) : (
              ''
            )}

            {/* 数据展示结束 */}
          </div>
          {/* 筛选结束 */}
          {/* 添加标签开始 */}
          <TagAdd onRef={this.onRef.bind(this)} moduleSuccess={this.moduleSuccess.bind(this)} />
          {/* 添加标签结束 */}
          {/* 赠送优惠券开始 */}
          <GiveDiscount
            onRef={this.onRef.bind(this)}
            pageJump={this.pageJump.bind(this)}
            moduleSuccess={this.moduleSuccess.bind(this)}
          />
          {/* 赠送优惠券结束 */}
        </div>
      </Panel>
    );
  }
}

export default withRouter(QueryList);
