import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from '../../ShareRebateList.module.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Input, DatePicker, Select, Table, message } from 'antd';
import { commissionWithdrawalList, commissionAudit } from '@/services/commission';
import { showBut } from '@/utils/utils'
import {encryptByDES} from 'kx-des'
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Column } = Table;
const TextArea = Input.TextArea;
// "proxy": "http://testoptional.ejoy99.com/",
class BrokerageAudit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      causeShow: false,
      auditFailreason: null,
      rejectShow: false,
      passShow: false,
      typeText: '1',
      alertShow: true,
      searchForm: {
        keyword: null,
        keywordType: '1',
        status: null,
        pageSize: 10,
        page: 1,
        startTime: null,
        endTime: null,
      },
      tableData: {},
    };
  }
  componentDidMount() {
    this.getAuditList();
  } 
  async getAuditList() {
    //佣金审核列表
    // const temp  = JSON.stringify(this.state.searchForm);
    // const param =  encryptByDES(`${temp}`);
    const info = await commissionWithdrawalList(this.state.searchForm);
    if (info) {
      this.setState({
        tableData: info.data,
      });
    }
  }
  searchUserInfo() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.startTime =
        values.visitDate && values.visitDate.length
          ? values.visitDate[0].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.endTime =
        values.visitDate && values.visitDate.length
          ? values.visitDate[1].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.status = values.status === '-1' ? null : values.status;
      values.keyword = values.keyword === '' ? null : values.keyword;
      delete values.visitDate;
      this.setState(
        {
          searchForm: {
            ...values,
            page: 1,
            pageSize: 10,
          },
        },
        () => {
          this.getAuditList();
        }
      );
    });
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
        this.getAuditList();
      }
    );
  }
  filterStatus(e) {
    let color = '';
    let text = '';
    switch (e.status) {
      case 1:
        color = 'grey-color';
        text = '待审核';
        break;
      case 2:
        color = 'green-color';
        text = '审核通过';
        break;
      case 3:
        color = 'red-color';
        text = '审核拒绝';
        break;
      case 4:
        color = 'green-color';
        text = '转账完成';
        break;
      case 5:
        color = 'red-color';
        text = '转账失败';
        break;
      default:
        break;
    }
    return (
      <div className={Css.status}>
        {/* <span className={Css[color] + " " + Css.dot}></span> */}
        <span className={Css[color]}>{text}</span>
      </div>
    );
  }
  passFn(record) {
    this.setState({
      record,
      passShow: true,
      passloading: false,
    });
  }
  rejectFn(record) {
    this.setState({
      record,
      rejectShow: true,
      causeShow: false,
      auditFailreason: null,
    });
  }
  rejectCauseFn(record) {
    // 拒绝原因
    this.setState({
      record,
      rejectShow: true,
      causeShow: true,
      auditFailreason: record.auditFailreason,
    });
  }
  // 确定通过审核
  passSuccess() {
    const { record } = this.state;
    const p = {
      statusType: 2,
      commissionWithdrawalId: record.commissionWithdrawalId,
    };
    this.setState({
      passloading: true,
    });
    this.commissionAudit(p);
  }
  rejectInputfn(e) {
    this.setState({
      auditFailreason: e.target.value,
    });
  }
  // 拒绝确定
  rejectOkFn() {
    const { record, auditFailreason, causeShow } = this.state;
    if (causeShow) {
      //查看原因
      this.setState({
        rejectShow: false,
      });
      return;
    }
    const p = {
      statusType: 3,
      commissionWithdrawalId: record.commissionWithdrawalId,
      auditFailreason,
    };
    if (!auditFailreason) {
      message.error('请填写拒绝原因');
      return;
    }
    this.commissionAudit(p);
  }
  async commissionAudit(p) {
    //审核操作
    const info = await commissionAudit(p);
    if (info) {
      message.success('操作成功');
      this.setState(
        {
          passloading: false,
          rejectShow: false,
          passShow: false,
        },
        () => {
          this.searchUserInfo();
        }
      );
    }
  }
  actionGroup(record) {
    if (record.status === 1) {
      return (
        <div className={Css.ActionBox}>
          {showBut('shareRebateList', 'share_rebate_list_pass') && <span onClick={this.passFn.bind(this, record)}>通过</span> }
         {showBut('shareRebateList', 'share_rebate_list_reject') && (<span onClick={this.rejectFn.bind(this, record)} style={{ color: 'red' }}>
            拒绝
          </span>)}
        </div>
      );
    }
    if (record.status === 3 && showBut('shareRebateList', 'share_rebate_list_reject_detail')) {
      return <a onClick={this.rejectCauseFn.bind(this, record)}>拒绝原因</a>;
    }
    if (record.status === 2) {
      return <a>审核通过</a>;
    }
  }
  typeChange(value) {
    const { searchForm } = this.state;
    searchForm.keywordType = value;
    this.setState({
      searchForm,
    });
  }
  getSaleFn(record) {
    const money = record ? (record / 100).toFixed(2) : null;
    return <div>{money}</div>;
  }
  rejectBtn() {
    const { causeShow } = this.state;
    const btnArr = [
      <Button key="1" onClick={() => this.setState({ rejectShow: false })}>
        取消
      </Button>,
      <Button key="2" type="primary" onClick={this.rejectOkFn.bind(this)}>
        确定
      </Button>,
    ];
    if (causeShow) {
      btnArr.splice(0, 1);
    }
    return btnArr;
  }
  closeAlert() {
    this.setState({
      alertShow: false,
    });
  }
  passBtn() {
    const btnArr = [
      <Button key="1" onClick={() => this.setState({ passShow: false })}>
        取消
      </Button>,
      <Button
        key="2"
        type="primary"
        loading={this.state.passloading}
        onClick={this.passSuccess.bind(this)}
      >
        通过
      </Button>,
    ];
    return btnArr;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tableData, auditFailreason, causeShow, searchForm, alertShow } = this.state;
    let searchText = null;
    if (searchForm.keywordType === '1') {
      searchText = '手机';
    }
    if (searchForm.keywordType === '2') {
      searchText = '昵称';
    }
    if (searchForm.keywordType === '3') {
      searchText = '申请编号';
    }
    return (
      <div className={Css.BrokerageBox}>
        {alertShow ? (
          <div className={Css.alertbox}>
            <p>1、审核通过后佣金直接打入顾客微信零钱，请谨慎操作</p>
            <span>
              2、未开通微信支付付款到零钱功能会导致转账失效，请先去微信支付后台开启转账到零钱功能。操作路径：微信支付后台-产品中心-企业付款到微信&nbsp;
              <a target="_blank" href="https://pay.weixin.qq.com/">
                去开通
              </a>
            </span>
            <CloseCircleOutlined onClick={this.closeAlert.bind(this)} />
          </div>
        ) : null}

        <div className={Css.BrokerageSearch}>
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('status', {
                initialValue: '-1',
              })(
                <Select style={{ width: 100 }}>
                  <Option value="-1">全部</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">审核通过</Option>
                  <Option value="3">审核拒绝</Option>
                  <Option value="4">结算完成</Option>
                  <Option value="5">转账失败</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('visitDate')(
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: 350 }}
                  placeholder={['申请时间开始', '申请时间结束']}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('keywordType', {
                initialValue: '1',
              })(
                <Select style={{ width: 100 }} onChange={this.typeChange.bind(this)}>
                  <Option value="1">手机号</Option>
                  <Option value="2">昵称</Option>
                  <Option value="3">申请编号</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('keyword')(
                <Input allowClear style={{ width: 200 }} size="default" placeholder={searchText} />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.searchUserInfo.bind(this)}>
                查询
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className={Css.BrokerTable}>
          <Table
            rowKey="commissionWithdrawalId"
            dataSource={tableData.rows}
            pagination={{
              current: tableData.current,
              pageSize: tableData.pageSize,
              total: tableData.total,
              onChange: this.PaginationChange.bind(this),
            }}
          >
            <Column
              align="left"
              title="申请编号"
              dataIndex="commissionWithdrawalId"
              key="commissionWithdrawalId"
            />
            <Column align="left" title="昵称" dataIndex="nickname" key="nickname" />
            <Column align="left" title="手机号" dataIndex="phone" key="phone" />
            <Column
              align="left"
              title="申请金额"
              dataIndex="money"
              key="money"
              render={this.getSaleFn.bind(this)}
            />
            <Column align="left" title="申请时间" dataIndex="applyTime" key="applyTime" />
            <Column align="left" title="状态" key="status" render={this.filterStatus.bind(this)} />
            <Column align="left" title="近一个月订单" dataIndex="ordersNum" key="ordersNum" />
            <Column
              align="left"
              title="操作"
              width="12%"
              key="action"
              render={this.actionGroup.bind(this)}
            />
          </Table>
        </div>
        <Modal
          width={400}
          title="通过"
          visible={this.state.passShow}
          // onOk={this.passSuccess.bind(this)}
          footer={this.passBtn()}
          onCancel={() => this.setState({ passShow: false })}
          okText="通过"
          cancelText="取消"
        >
          通过后佣金将直接打给申请人账户，<span style={{ color: 'red' }}>操作不可撤回</span>
          ，是否通过?
        </Modal>
        <Modal
          className={Css.RejectModal}
          width={700}
          title="拒绝"
          onCancel={() => this.setState({ rejectShow: false })}
          visible={this.state.rejectShow}
          footer={this.rejectBtn()}
        >
          <div className={Css.RejectBox}>
            <span>拒绝原因：</span>
            <div className={Css.RejectTextArea}>
              <TextArea
                style={{ resize: 'none' }}
                placeholder={causeShow ? '' : '请填写拒绝原因'}
                maxLength={100}
                disabled={causeShow}
                onChange={this.rejectInputfn.bind(this)}
                value={auditFailreason}
                rows="8"
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Form.create()(BrokerageAudit));
