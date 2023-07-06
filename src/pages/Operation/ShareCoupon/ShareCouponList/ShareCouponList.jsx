import React, { Component } from 'react';
import { history } from '@umijs/max';
import Css from './ShareCouponList.module.scss';
import QRCode from 'qrcode.react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select, Input, Table, Modal, message, Radio, Divider } from 'antd';
import SelectDate from '@/components/SelectDate/SelectDate';
import Panel from '@/components/Panel';
import LinkBox from '@/components/LinkBox/LinkBox';
import { scList, scUrls } from '@/services/activity';
import { showBut } from '@/utils/utils'
const { Option } = Select;
const { Column } = Table;

class ShareCouponList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        activityName: '',
        status: 0,
        page: 1,
        beginTime: null,
        endTime: null,
      },
      stockUrls: [],
      visible: false,
      tableData: {},
    };
  }

  componentDidMount() {
    this.getActivityList();
  }

  async getActivityList() {
    const info = await scList(this.state.searchForm);
    if (info) {
      this.setState({
        tableData: info.data,
      });
    }
  }

  // 输入活动名称
  inputName(e) {
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        activityName: e.target.value,
      },
    });
  }
  stateChange(e) {
    this.setState(
      {
        searchForm: {
          ...this.state.searchForm,
          status: e.target.value,
        },
      },
      () => {
        this.getActivityList();
      }
    );
  }

  // 筛选活动
  searchFn() {
    this.setState(
      {
        searchForm: {
          ...this.state.searchForm,
          page: 1,
        },
      },
      () => {
        this.getActivityList();
      }
    );
  }

  // 展示活动状态 1 未开始  2 进行中 3 已结束 4 已禁用
  filterStatus(e) {
    let color = '';
    let text = '';
    switch (e.status) {
      case 1:
        color = 'orange';
        text = '未开始';
        break;
      case 2:
        color = 'green';
        text = '进行中';
        break;
      case 3:
        color = 'grey';
        text = '已结束';
        break;
      case 4:
        color = 'red';
        text = '暂停';
        break;
      default:
        break;
    }
    return (
      <div className={Css.status}>
        <span className={Css[color]}>{text}</span>
      </div>
    );
  }

  /**
   *  分页
   */
  PaginationChange(e) {
    this.setState(
      {
        searchForm: {
          ...this.state.searchForm,
          page: e,
        },
      },
      () => {
        this.getActivityList();
      }
    );
  }
  // 查看链接
  async showUrl(e) {
    const info = await scUrls({ activityId: e.activityId });
    if (info) {
      if (info.data.length == 0) {
        info.data = [{}, {}];
      } else if (info.data.length == 1) {
        info.data.push({});
      }
      this.setState({
        stockUrls: info.data,
        visible: true,
      });
    }
  }
  hideModal() {
    this.setState({
      visible: false,
    });
  }

  // 查看详情
  actionDetail(e) {
    history.push('/operation/activitys/shareCoupon/detail/' + e.activityId);
  }

  addFn() {
    history.push(`/operation/activitys/shareCoupon/new`);
  }

  render() {
    const { tableData } = this.state;
    return (
      <Panel title="分享领券" content="裂变式的营销派券方式，帮助商家快速派券拓客">
        <div className={Css.ActivityListBox}>
          <div className={Css.ActivityListHeader}>
          {
            showBut('shareCoupon', 'share_coupon_add') && (
              <Button type="primary" icon={<PlusOutlined />} onClick={this.addFn.bind(this)}>
                新建活动
              </Button>
            )
          }
          </div>
          <div className={Css.ActivityListBody}>
            <div className={Css.ButtonBox}>
              <Radio.Group
                name="state"
                value={this.state.searchForm.status}
                onChange={this.stateChange.bind(this)}
              >
                <Radio.Button value="0">全部</Radio.Button>
                <Radio.Button value="2">进行中</Radio.Button>
                <Radio.Button value="1">未开始</Radio.Button>
                <Radio.Button value="4">暂停</Radio.Button>
                <Radio.Button value="3">已结束</Radio.Button>
              </Radio.Group>
              <Input
                type="text"
                className={Css.ActivityName}
                value={this.state.searchForm.activityName}
                onChange={this.inputName.bind(this)}
                maxLength={15}
                placeholder="输入活动名称\活动ID"
              />
              <Button type="primary" className={Css.Filter} onClick={this.searchFn.bind(this)}>
                搜索
              </Button>
            </div>
            <div>
              <Table
                rowKey={record => record.activityId}
                dataSource={tableData.rows}
                pagination={{
                  current: tableData.current,
                  pageSize: tableData.pageSize,
                  total: tableData.total,
                  onChange: this.PaginationChange.bind(this),
                }}
              >
                <Column align="left" title="活动ID" dataIndex="activityId" key="activityId" />
                <Column align="left" title="活动名称" dataIndex="activityName" key="activityName" />
                <Column align="left" title="创建时间" dataIndex="createTime" key="createTime" />
                <Column align="left" title="开始时间" dataIndex="beginTime" key="beginTime" />
                <Column align="left" title="结束时间" dataIndex="endTime" key="endTime" />
                <Column
                  align="left"
                  title="状态"
                  key="status"
                  render={this.filterStatus.bind(this)}
                />
                <Column
                  align="left"
                  title="操作"
                  key="action"
                  render={e => {
                    return (
                      <div className={Css.ActionBox}>
                        {showBut('shareCoupon', 'share_coupon_detail') && <span onClick={this.actionDetail.bind(this, e)}>详情</span>}
                        <Divider type="vertical" />
                        {showBut('shareCoupon', 'share_coupon_link') && <span onClick={this.showUrl.bind(this, e)}>链接</span>}
                      </div>
                    );
                  }}
                />
              </Table>
            </div>
          </div>
        </div>
        <LinkBox
          stockUrls={this.state.stockUrls}
          linkCallBack={this.hideModal.bind(this)}
          isShow={this.state.visible}
        />
      </Panel>
    );
  }
}
export default ShareCouponList;
