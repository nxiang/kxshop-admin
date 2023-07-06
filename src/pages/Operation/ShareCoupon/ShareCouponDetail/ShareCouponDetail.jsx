import React, { Component } from 'react';
import { history } from '@umijs/max';
import Css from './ShareCouponDetail.module.scss';
import QRCode from 'qrcode.react';
import { PlusOutlined } from '@ant-design/icons';
import LinkBox from '@/components/LinkBox/LinkBox';
import { Button, Select, Input, Table, Modal, message, Divider, Popconfirm } from 'antd';
import { scList ,
  scInfo,
  scInfoList,
  scExport,
  scUrls,
  scPostpone,
  scStart,
  scStop,
} from '@/services/activity';
import SelectDate from '@/components/SelectDate/SelectDate';
import copy from 'copy-to-clipboard';
import Panel from '@/components/Panel';
import { showBut } from '@/utils/utils';
import { withRouter } from '@/utils/compatible';

const { Option } = Select;
const { Column } = Table;

class ShareCouponDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        memberNickname: '',
        status: 0,
        page: 1,
      },
      urlVisible: false,
      stockUrls: [],
      visible: false,
      modalTitle: '',
      delayTime: false,
      urlData: {
        img: 'https://img.kxll.com/kxshop_web/images/alipay.jpg',
        url: '111',
      },
      activityDetail: {},
      tableData: {},
    };
  }

  componentDidMount() {
    this.getInfo();
    this.getTableData();
  }
  async getTableData() {
    const info = await scInfoList({
      ...this.state.searchForm,
      ...{ activityId: this.props.match.params.id },
    });
    if (info && info.data) {
      this.setState({
        tableData: info.data,
      });
    }
  }
  async getInfo() {
    const info = await scInfo({ activityId: this.props.match.params.id });
    if (info && info.data) {
      this.setState({
        activityDetail: info.data.activityDetail,
        delayTime: info.data.activityDetail.endTime,
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
      urlVisible: false,
      visible: false,
    });
  }
  // 选择活动时间
  setDate(phase, date) {
    console.log(phase, date);
    if (date) {
      date = date.format('YYYY-MM-DD HH:mm:ss');
    }
    this.setState({
      delayTime: date,
    });
  }
  // 弹框确认操作
  async handleOk() {
    const {delayTime} = this.state;
    const info = await scPostpone({ activityId: this.props.match.params.id, endTime: delayTime });
    if (info) {
      message.success('延期成功');
      this.getInfo();
      this.setState({
        visible: false,
      });
    }
  }

  // 输入活动名称
  inputName(e) {
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        memberNickname: e.target.value,
      },
    });
  }

  // 搜索活动
  searchActivity() {
    this.setState(
      {
        searchForm: {
          ...this.state.searchForm,
          page: 1,
        },
      },
      () => {
        this.getTableData();
      }
    );
  }
  // 状态 1 未开始 2 进行中 3 已结束 4 已暂停, ""全部
  infoStatus() {
    let color = '';
    let text = '';
    switch (this.state.activityDetail.status) {
      case 2:
        color = 'green';
        text = '进行中';
        break;
      case 1:
        color = 'orange';
        text = '未开始';
        break;
      case 4:
        color = 'grey';
        text = '已暂停';
        break;
      case 3:
        color = 'red';
        text = '已结束';
        break;
      default:
        break;
    }
    return <span className={Css[color]}>{text}</span>;
  }
  // 状态 1 进行中 2 已完成 3 已失效 4 派券失败， ""全部
  tableStatus(e) {
    let color = '';
    let text = '';
    switch (e.status) {
      case 1:
        color = 'green';
        text = '进行中';
        break;
      case 2:
        color = 'orange';
        text = '已完成';
        break;
      case 3:
        color = 'grey';
        text = '已失效';
        break;
      case 4:
        color = 'red';
        text = '派券失败';
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
        this.getTableData();
      }
    );
  }
  // 查看链接
  async showUrl() {
    const info = await scUrls({ activityId: this.props.match.params.id });
    if (info) {
      if (info.data.length == 0) {
        info.data = [{}, {}];
      } else if (info.data.length == 1) {
        info.data.push({});
      }
      this.setState({
        stockUrls: info.data,
        urlVisible: true,
      });
    }
  }
  copyFn() {
    const e = this.state.urlData.url;
    if (copy(e)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  }
  // 分享领券活动记录导出
  async exportExcel() {
    const data = await scExport({
      ...this.state.searchForm,
      ...{ activityId: this.props.match.params.id },
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([data]));
    link.target = '_blank';
    link.download = 'data.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 查看详情
  actionDetail(e) {
    // history.push({ pathname: '/operation/activitys/list/detail', state: { id: e.activityId } });
    history.push('/operation/activitys/list/detail', { id: e.activityId });
  }

  goback() {
    history.push(`/operation/activitys/shareCoupon/list`);
  }
  delayShow() {
    this.setState({
      visible: true,
    });
  }

  async stopFn() {
    const info = await scStop({ activityId: this.props.match.params.id });
    if (info) {
      message.success('暂停成功');
      this.getInfo();
    }
  }

  getHour(n = 0) {
    const hh = Math.floor(n / 60) == 0 ? '' : `${Math.floor(n / 60)  }小时`;
    return `${hh + (n % 60)  }分钟`;
  }

  async startFn() {
    const info = await scStart({ activityId: this.props.match.params.id });
    if (info) {
      message.success('启用成功');
      this.getInfo();
    }
  }
  // 根据状态动态获取操作按钮
  filterActionButton(status) {
    console.log(typeof status, status);
    switch (status) {
      case 1:
        return (
          <span>
            {
            showBut('shareCoupon', 'share_coupon_link') && (
              <Button type="primary" className={Css.button} onClick={this.showUrl.bind(this)}>
                活动链接
              </Button>
            )
          }
            {
            showBut('shareCoupon', 'share_coupon_postpone') && (
              <Button type="primary" className={Css.button} onClick={this.delayShow.bind(this)}>
                延期
              </Button>
            )
          }
            <Popconfirm
              placement="bottomRight"
              title="暂停后顾客无法发起新的活动，进行中的领券不受影响，是否继续?"
              onConfirm={this.stopFn.bind(this)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" className={Css.button}>
                暂停
              </Button>
            </Popconfirm>
          </span>
        );
      case 2:
        return (
          <span>
            {
            showBut('shareCoupon', 'share_coupon_link') && (
              <Button type="primary" className={Css.button} onClick={this.showUrl.bind(this)}>
                活动链接
              </Button>
            )
          }
            {
            showBut('shareCoupon', 'share_coupon_postpone') && (
              <Button type="primary" className={Css.button} onClick={this.delayShow.bind(this)}>
                延期
              </Button>              
            )
          }
            <Popconfirm
              placement="bottomRight"
              title="暂停后顾客无法发起新的活动，进行中的领券不受影响，是否继续?"
              onConfirm={this.stopFn.bind(this)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" className={Css.button}>
                暂停
              </Button>
            </Popconfirm>
          </span>
        );
      case 4:
        return (
          <span>
            {
            showBut('shareCoupon', 'share_coupon_link') && (
              <Button type="primary" className={Css.button} onClick={this.showUrl.bind(this)}>
                活动链接
              </Button>
            )
          }
            {
            showBut('shareCoupon', 'share_coupon_postpone') && (
              <Button type="primary" className={Css.button} onClick={this.delayShow.bind(this)}>
                延期
              </Button>              
            )
          }
            <Popconfirm
              placement="bottomRight"
              title="继续活动顾客可发起新的领券，是否继续?"
              onConfirm={this.startFn.bind(this)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" className={Css.button}>
                继续
              </Button>
            </Popconfirm>
          </span>
        );
      default:
        return (
          <span>
            {
            showBut('shareCoupon', 'share_coupon_link') && (
              <Button type="primary" className={Css.button} onClick={this.showUrl.bind(this)}>
                活动链接
              </Button>
            )
          }
            {
            showBut('shareCoupon', 'share_coupon_postpone') && (
              <Button type="primary" className={Css.button} onClick={this.delayShow.bind(this)}>
                延期
              </Button>              
            )
          }
          </span>
        );
    }
  }

  render() {
    const { tableData, activityDetail, visible } = this.state;
    const action = (
      <Button style={{ background: 'white' }} className={Css.button} onClick={this.goback}>
        返回
      </Button>
    );
    const content = (
      <div>
        <div className={Css.conBox}>
          <span className={Css.headerTitle}>
            {activityDetail.activityName}
            {this.infoStatus()}
          </span>
          {this.filterActionButton(activityDetail.status)}
        </div>
        <div className={Css.conMsg}>
          <span>
            <span style={{ color: '#999999', width: '300px' }}>活动时间:</span>
            {activityDetail.beginTime}至{activityDetail.endTime}
          </span>
          <span>
            <span style={{ color: '#999999' }}>活动优惠券:</span>
            {activityDetail.shareCouponStockName}
          </span>
          <span>
            <span style={{ color: '#999999' }}>助力人优惠券:</span>
            {activityDetail.assistCouponStockName || '无'}
          </span>
          <span>
            <span style={{ color: '#999999' }}>助力人数:</span>
            {activityDetail.assistNumber}
          </span>
          <span>
            <span style={{ color: '#999999' }}>时间限制:</span>
            {this.getHour(activityDetail.timeLimit)}
          </span>
        </div>
      </div>
    );
    return (
      // content="新建分享领券活动"
      <Panel title="活动详情" action={action} content={content}>
        <div className={Css.ActivityListBox}>
          <div className={Css.ActivityListHeader}>活动明细</div>
          <div className={Css.ActivityListBody}>
            <div className={Css.ButtonBox}>
              <Select
                className={Css.ActivityName}
                defaultValue=""
                onChange={this.selectState.bind(this)}
              >
                <Option value="">全部</Option>
                <Option value="1">进行中</Option>
                <Option value="2">已完成</Option>
                <Option value="3">已失效</Option>
                <Option value="4">派券失败</Option>
              </Select>
              <Input
                type="text"
                className={Css.ActivityName}
                value={this.state.searchForm.memberNickname}
                onChange={this.inputName.bind(this)}
                maxLength={15}
                placeholder="发起人昵称"
              />
              <Button type="primary" onClick={this.searchActivity.bind(this)}>
                搜索
              </Button>
              {
                showBut('shareCoupon', 'share_coupon_export') && (
                  <Button style={{ marginLeft: '16px' }} onClick={this.exportExcel.bind(this)}>
                    导出明细
                  </Button>
                )
              }
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
                <Column align="left" title="用户ID" dataIndex="memberId" key="memberId" />
                <Column
                  align="left"
                  title="用户昵称"
                  dataIndex="memberNickname"
                  key="memberNickname"
                />
                <Column align="left" title="发起时间" dataIndex="createTime" key="createTime" />
                <Column
                  align="left"
                  title="发起渠道"
                  dataIndex="clientId"
                  key="clientId"
                  render={r => {
                    let txt = '';
                    if (r && (`${r  }`).indexOf(1) >= 0) {
                      txt += '支付宝';
                    }
                    if (r && (`${r  }`).indexOf(2) >= 0) {
                      txt += '微信';
                    }
                    return <span>{txt}</span>;
                  }}
                />
                <Column align="left" title="助力人数" dataIndex="assistNumber" key="assistNumber" />
                <Column align="left" title="成功时间" dataIndex="successTime" key="successTime" />
                <Column
                  align="left"
                  title="状态"
                  key="status"
                  render={this.tableStatus.bind(this)}
                />
              </Table>
            </div>
            <LinkBox
              stockUrls={this.state.stockUrls}
              linkCallBack={this.hideModal.bind(this)}
              isShow={this.state.urlVisible}
            />
            <Modal
              title="延期"
              centered
              visible={visible}
              onOk={this.handleOk.bind(this)}
              onCancel={this.hideModal.bind(this)}
            >
              <div style={{ marginBottom: '12px' }}>请选择活动延期时间</div>
              <SelectDate
                onSelectDate={this.setDate.bind(this)}
                fbeginTime={activityDetail.beginTime}
                fendTime={activityDetail.endTime}
                postpone
              />
            </Modal>
          </div>
        </div>
      </Panel>
    );
  }
}
export default withRouter(ShareCouponDetail);
