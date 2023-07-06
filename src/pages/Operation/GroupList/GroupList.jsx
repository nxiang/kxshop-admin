import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import Css from './GroupList.module.scss';
import {
  Popover,
  Breadcrumb,
  Button,
  Tabs,
  Modal,
  Switch,
  Select,
  Table,
  message,
  Form,
  Radio,
  Input,
  Spin,
} from 'antd';
import Panel from '@/components/Panel';
import { subscribeList, subscribeOpen } from '@/services/subscribe';
import { grouponList, shareUrl, pause, resume } from '@/services/groupon';
import GroupModal from './module/GroupModal/GroupModal';

import { showBut } from '@/utils/utils'

class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupShow: false,
      loading: true,
      state: null,
      grouponName: null,
      tableData: {},
      searchForm: {
        page: 1,
        pageSize: 10,
      },
    };
  }
  componentDidMount() {
    this.grouponList();
  }
  shareUrlFn(grouponId) {
    shareUrl(grouponId).then(res => {
      if (res) {
        this.setState({
          shareData: res.data,
        });
      }
    });
  }
  pauseFn(grouponId) {
    this.setState({
      loading: true,
    });
    pause(grouponId).then(res => {
      this.setState({
        loading: false,
      });
      if (res) {
        this.searchFn();
      }
    });
  }
  goOnFn(grouponId) {
    this.setState({
      loading: true,
    });
    resume(grouponId).then(res => {
      this.setState({
        loading: false,
      });
      if (res) {
        this.searchFn();
      }
    });
  }
  grouponList() {
    grouponList(this.state.searchForm).then(res => {
      if (res) {
        this.setState({
          loading: false,
          tableData: res.data,
        });
      }
    });
  }
  orderChange(e) {
    const state = e.target.value;
    this.setState(
      {
        state,
      },
      () => {
        this.searchFn();
      }
    );
  }
  nameChange(e) {
    const grouponName = e.target.value;
    this.setState({
      grouponName,
    });
  }
  searchFn() {
    const { grouponName, state } = this.state;
    this.setState(
      {
        loading: true,
        searchForm: {
          ...this.state.searchForm,
          grouponName,
          state,
          page: 1,
        },
      },
      () => {
        this.grouponList();
      }
    );
  }
  PaginationChange(e) {
    this.setState(
      {
        loading: true,
        searchForm: {
          ...this.state.searchForm,
          page: e,
        },
      },
      () => {
        this.grouponList();
      }
    );
  }

  createGroupFn() {
    this.setState({
      groupShow: true,
      type: 'add',
    });
  }
  closeModal() {
    this.setState({
      groupShow: false,
    });
  }
  submitModal() {
    this.setState(
      {
        loading: true,
        groupShow: false,
        grouponName: null,
        state: null,
      },
      () => {
        this.searchFn();
      }
    );
  }
  editGrouponFn(grouponId) {
    this.setState({
      groupShow: true,
      type: 'edit',
      grouponId,
    });
  }
  downLoadFn(qrCodeUrl) {
    window.open(qrCodeUrl);
  }
  showCode() {
    const { shareData } = this.state;
    if (shareData) {
      if (!shareData.length) {
        return <div>暂未生成二维码</div>;
      } else {
        return (
          <div className={Css['LinkCodeBox']}>
            <div className={Css['signBox']}>
              {shareData.map(item => {
                return (
                  <div className={Css['signItem']}>
                    <div className={Css['signRow']}>
                      <img className={Css['signImg']} src={item.qrCodeUrl} alt="下载二维码" />
                      <a
                        target="_blank"
                        onClick={this.downLoadFn.bind(this, item.qrCodeUrl)}
                        download="下载二维码"
                        rel="noreferrer noopener"
                      >
                        下载二维码
                      </a>
                    </div>
                    <div className={Css['signName']}>
                      {item.clientId == 1 ? '支付宝二维码' : '微信二维码'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    } else {
      <Spin />;
    }
  }
  render() {
    const { loading, state, grouponName, tableData, groupShow, type, grouponId } = this.state;
    const columns = [
      {
        title: '活动ID',
        dataIndex: 'grouponId',
      },
      {
        title: '活动名称',
        dataIndex: 'grouponName',
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreated',
      },
      {
        title: '开始时间',
        dataIndex: 'beginTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '参团人数',
        dataIndex: 'userNumJoined',
        render: (text, record) => {
          const userNumJoined = record.state === 0 ? '--' : record.userNumJoined;
          return <div>{`${userNumJoined} / ${record.userNumOpening}`}</div>;
        },
      },
      {
        title: '活动状态',
        dataIndex: 'state',
        render: (text, record) => {
          const stateArr = ['未开始', '进行中', '暂停中', '已结束'];
          const colorArr = ['started', 'goon', 'stop', 'finish'];
          return <div className={Css[`${colorArr[text]}`]}>{stateArr[text]}</div>;
        },
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record) => {
          return (
            <div className={Css.activeBtnBox}>
              <div style={{ marginRight: 8 }}>
                {record.state !== 3 && showBut('grouplist', 'grouplist_code') ? (
                  <Popover content={this.showCode.bind(this)} title="二维码链接" trigger="click">
                    <a onClick={this.shareUrlFn.bind(this, record.grouponId)}>二维码</a>
                  </Popover>
                ) : null}
              </div>
              <div>
                {record.state === 0 && showBut('grouplist', 'grouplist_edit') ? (
                  <a onClick={this.editGrouponFn.bind(this, record.grouponId)}>编辑</a>
                ) : null}
                {record.state === 1 && showBut('grouplist', 'grouplist_pause') ? (
                  <a onClick={this.pauseFn.bind(this, record.grouponId)} className={Css.stop}>
                    暂停
                  </a>
                ) : null}
                {record.state === 2 && showBut('grouplist', 'grouplist_resume') ? (
                  <a onClick={this.goOnFn.bind(this, record.grouponId)} className={Css.goon}>
                    启用
                  </a>
                ) : null}
              </div>
            </div>
          );
        },
      },
    ];
    return (
      <Panel title="拼团" content="以拼团的形式销售商品,让商品自带引流属性">
        <div className={Css.groupBox}>
          <div>
          {
            showBut('grouplist', 'grouplist_group') && (
            <Button type="primary" onClick={this.createGroupFn.bind(this)}>
              +发布拼团
            </Button>
            )
          }
          </div>
          <div style={{ marginTop: '40px' }}>
            <Radio.Group value={state} onChange={this.orderChange.bind(this)}>
              <Radio.Button value={null}>全部订单</Radio.Button>
              <Radio.Button value={1}>进行中</Radio.Button>
              <Radio.Button value={0}>未开始</Radio.Button>
              <Radio.Button value={2}>暂停中</Radio.Button>
              <Radio.Button value={3}>已结束</Radio.Button>
            </Radio.Group>
            <div style={{ float: 'right' }}>
              <Input
                allowClear
                className={Css.searchInput}
                value={grouponName}
                onChange={this.nameChange.bind(this)}
                placeholder="活动名称"
              />
              <Button type="primary" onClick={this.searchFn.bind(this)}>
                搜索
              </Button>
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Table
              loading={loading}
              rowKey="grouponId"
              dataSource={tableData && tableData.rows}
              columns={columns}
              pagination={{
                current: tableData.current,
                total: tableData.total,
                pageSize: 10,
                onChange: this.PaginationChange.bind(this),
              }}
            />
          </div>
        </div>
        {groupShow ? (
          <GroupModal
            type={type}
            visible={groupShow}
            grouponId={grouponId}
            submitModal={this.submitModal.bind(this)}
            closeModal={this.closeModal.bind(this)}
          />
        ) : null}
      </Panel>
    );
  }
}

export default withRouter(GroupList);
