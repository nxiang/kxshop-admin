import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import { connect } from 'dva';
import Css from './ActivityList.module.scss';
import QRCode from 'qrcode.react';
import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Select, Input, Table, Modal, message } from 'antd';
import { actList } from '@/services/activity';
import SelectDate from '@/components/SelectDate/SelectDate';
import copy from 'copy-to-clipboard';
import { activityId } from '@/actions/index';
import Panel from '@/components/Panel';
import { showBut } from '@/utils/utils'

const { Option } = Select;
const { Column } = Table;
@connect(({ activitys }) => ({
  ...activitys,
}))
class ActivityList extends Component {
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
      visible: false,
      urlData: {
        img: 'https://img.kxll.com/kxshop_web/images/alipay.jpg',
        url: '111',
      },
      tableData: {},
    };
  }

  componentDidMount() {
    this.getActivityList();
  }

  async getActivityList() {
    const info = await actList(this.state.searchForm);
    if (info) {
      this.setState({
        tableData: info.data,
      });
    }
  }
  // 选择活动状态
  selectState(e) {
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        status: e,
      },
    });
  }

  hideModal() {
    this.setState({
      visible: false,
    });
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

  // 选择活动时间
  setDate(phase, date) {
    if (date) {
      date = date.format('YYYY-MM-DD HH:mm');
    }
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        [`${phase}Time`]: date,
      },
    });
  }

  // 筛选活动
  filterActivity() {
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
        color = 'grey';
        text = '未开始';
        break;
      case 2:
        color = 'green';
        text = '进行中';
        break;
      case 3:
        color = 'dark';
        text = '已结束';
        break;
      case 4:
        color = 'red';
        text = '已禁用';
        break;
      default:
        break;
    }
    return (
      <div className={Css.status}>
        <span className={`${Css[color]  } ${  Css.dot}`} />
        <span>{text}</span>
      </div>
    );
  }

  // 操作按钮
  actionGroup(e) {
    return (
      <div className={Css.ActionBox}>
        { showBut('activitysList', 'activitys_list_view') && <span onClick={this.actionDetail.bind(this, e)}>查看</span> }
        {e.url && showBut('activitysList', 'activitys_list_link') && <span onClick={this.showUrl.bind(this, e)}>链接</span>}
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
  showUrl(e) {
    this.setState({
      urlData: {
        url: e.url,
        img: e.url,
      },
      visible: true,
    });
  }
  copyFn() {
    const e = this.state.urlData.url;
    if (copy(e)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  }

  // 查看详情
  actionDetail(e) {
    // history.push({ pathname: '/operation/activitys/list/detail', state: { id: e.activityId } });
    history.push('/operation/activitys/list/detail',{ id: e.activityId });
  }

  addFn() {
    const {dispatch} = this.props
    dispatch(activityId(false));
    history.push(`/operation/activitys/add`);
  }

  render() {
    const { tableData } = this.state;
    return (
      <Panel>
        <div className={Css.ActivityListBox}>
          <div className={Css.ActivityListHeader}>
            <div>
              <Breadcrumb>
                <Breadcrumb.Item className={Css.ActivityListTitle}>活动列表</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            {
              showBut('activitysList', 'activitys_list_add') && (
                <Button type="primary" icon={<PlusOutlined />} onClick={this.addFn.bind(this)}>
                  新建活动
                </Button>
              )
            }
          </div>
          <div className={Css.ActivityListBody}>
            <div className={Css.ButtonBox}>
              <Select
                className={Css.ActivityState}
                defaultValue="0"
                onChange={this.selectState.bind(this)}
              >
                <Option value="0">全部</Option>
                <Option value="1">未开始</Option>
                <Option value="2">进行中</Option>
                <Option value="3">已结束</Option>
                <Option value="4">已禁用</Option>
              </Select>
              <Input
                type="text"
                className={Css.ActivityName}
                value={this.state.searchForm.activityName}
                onChange={this.inputName.bind(this)}
                maxLength={15}
                placeholder="请输入活动名称"
              />
              <span>活动时间：</span>
              <SelectDate onSelectDate={this.setDate.bind(this)} />
              <Button
                type="primary"
                className={Css.Filter}
                onClick={this.filterActivity.bind(this)}
              >
                筛选
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
                <Column align="left" title="活动名称" dataIndex="activityName" key="activityName" />
                <Column align="left" title="应用模板" dataIndex="templateName" key="templateName" />
                <Column
                  align="left"
                  title="状态"
                  key="status"
                  render={this.filterStatus.bind(this)}
                />
                <Column
                  align="left"
                  title="活动时间"
                  key="activityTime"
                  render={e => (
                    <div>
                      {e.beginTime} 至 {e.endTime}
                    </div>
                  )}
                />
                <Column
                  align="left"
                  title="参与人数"
                  dataIndex="memberQuantity"
                  key="memberQuantity"
                />
                <Column align="left" title="参与人次" dataIndex="joinQuantity" key="joinQuantity" />
                <Column align="left" title="中奖人次" dataIndex="winQuantity" key="winQuantity" />
                <Column
                  align="left"
                  title="操作"
                  key="action"
                  render={this.actionGroup.bind(this)}
                />
              </Table>
            </div>
            <Modal
              title="查看链接"
              visible={this.state.visible}
              footer={null}
              width="610px"
              onOk={this.hideModal.bind(this)}
              onCancel={this.hideModal.bind(this)}
            >
              <div className={Css.modalBox}>
                <div className={Css.imgBox}>
                  <QRCode className={Css.img} size="150" value={this.state.urlData.img} />
                  <p className={Css.msg}>支付宝/微信扫一扫</p>
                </div>
                <div className={Css.urlBox}>
                  <div className={Css.inputBox}>
                    链接地址：
                    <Input value={this.state.urlData.url} disabled />
                  </div>
                  <Button type="primary" className={Css.copyBtn} onClick={this.copyFn.bind(this)}>
                    复制链接地址
                  </Button>
                  <div style={{ width: 334, marginTop: 133 }}>
                    <Button
                      size="large"
                      style={{ marginRight: 15 }}
                      type="primary"
                      className={Css.copyBtn}
                      onClick={this.hideModal.bind(this)}
                    >
                      确定
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </Panel>
    );
  }
}
export default withRouter(ActivityList);
