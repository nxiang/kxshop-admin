import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import Css from './StroedQuery.module.scss';
import { Breadcrumb, Button, Input, Modal, DatePicker, Select, Table, InputNumber } from 'antd';
import Panel from '@/components/Panel';
import { summary, balanceList } from '@/services/stored';
import { Form } from '@ant-design/compatible';
import { showBut } from '@/utils/utils'
import images80 from '@/assets/images/80px@1x.png'

const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 18 } };
const FormItem = Form.Item;

class StroedQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        pageSize: 10,
        page: 1,
      },
      totalInfo: {},
      tableData: {},
      months: '1',
    };
  }
  componentDidMount() {
    this.summary();
    this.balanceList();
  }
  searchUserInfo() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.minGmtCreated =
        values.visitDate && values.visitDate.length
          ? values.visitDate[0].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.maxGmtCreated =
        values.visitDate && values.visitDate.length
          ? values.visitDate[1].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.clientId = values.clientId === '-1' ? null : values.clientId;
      values.bizType = values.bizType === '-1' ? null : values.bizType;
      values.mobile = values.mobile || null;
      delete values.visitDate;
      this.setState(
        {
          loading: true,
          searchForm: {
            ...values,
            page: 1,
            pageSize: 10,
          },
        },
        () => {
          this.balanceList();
        }
      );
    });
  }
  summary() {
    summary({ months: this.state.months }).then(res => {
      if (res) {
        this.setState({
          totalInfo: res.data,
        });
      }
    });
  }
  PaginationChange(e) {
    this.setState(
      {
        searchForm: {
          loading: true,
          ...this.state.searchForm,
          page: e,
        },
      },
      () => {
        this.balanceList();
      }
    );
  }
  balanceList() {
    balanceList(this.state.searchForm).then(res => {
      if (res) {
        this.setState({
          loading: false,
          tableData: res.data,
        });
      }
    });
  }
  dataChangeFn(value) {
    this.setState(
      {
        months: value,
      },
      () => {
        this.summary();
      }
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tableData, months, totalInfo } = this.state;
    const columns = [
      {
        title: '类型',
        dataIndex: 'bizType',
        render: (text, record) => {
          const bizTypeArr = ['', '储值', '消费', '退款'];
          return <div>{bizTypeArr[text]}</div>;
        },
      },
      {
        title: '订单号',
        dataIndex: 'bizSerialNumber',
      },
      {
        title: '用户信息',
        dataIndex: 'memberId',
        render: (text, record) => {
          return (
            <div className={Css.userBox}>
              <img src={record.avatar || images80} />
              <div className={Css.rightBox}>
                <div style={{ maxWidth: '250px' }}>{record.nickName}</div>
                <div style={{ color: '#999' }}>{record.mobile}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        render: (text, record) => {
          return (
            <div>
              {record.amount > 0 ? '+' : ''}
              {record.amount / 100}
            </div>
          );
        },
      },
      {
        title: '来源',
        dataIndex: 'clientName',
      },
      {
        title: '时间',
        dataIndex: 'gmtCreated',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <React.Fragment>
                {showBut('stroedQuery', 'stroed_query_view') && <Link to={`/operation/stroedQuery/stroedDetail/${record.balanceDetailId}`}>查看</Link>} 
            </React.Fragment>);
        },
      },
    ];
    return (
      <Panel title="储值明细">
        <div className={Css.storedQueryBox}>
          <div className={Css.dataContent}>
            <div className={Css.dataTitle}>数据总览</div>
            <div className={Css.dataBox}>
              <Select onChange={this.dataChangeFn.bind(this)} value={months} style={{ width: 120 }}>
                <Option key="1" value="1">
                  本月
                </Option>
                <Option key="2" value="3">
                  近三个月
                </Option>
                <Option key="3" value="12">
                  近一年
                </Option>
                <Option key="4" value="36">
                  近三年
                </Option>
              </Select>
              <div className={Css.dataDetail}>
                <ul>
                  <li>
                    <div>储值总额</div>
                    <span>{totalInfo.depositAmount ? totalInfo.depositAmount / 100 : 0}</span>
                    <a>元</a>
                  </li>
                  <li>
                    <div>消费记录</div>
                    <span>{totalInfo.payAmount ? totalInfo.payAmount / 100 : 0}</span>
                    <a>元</a>
                  </li>
                  <li>
                    <div>余额</div>
                    <span>{totalInfo.balance ? totalInfo.balance / 100 : 0}</span>
                    <a>元</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={Css.storedContent}>
            <div className={Css.topBox}>
              <span className={Css.topTitle}>订单列表</span>
            </div>
            <div className={Css.tableContent}>
              <Form layout="inline">
                <FormItem>
                  {getFieldDecorator('clientId', {
                    initialValue: '-1',
                  })(
                    <Select style={{ width: 150 }} placeholder="全部来源">
                      <Option key="1" value="-1">
                        全部来源
                      </Option>
                      <Option key="2" value="2">
                        微信
                      </Option>
                      <Option key="3" value="1">
                        支付宝
                      </Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('bizType', {
                    initialValue: '-1',
                  })(
                    <Select style={{ width: 150 }} placeholder="全部类型">
                      <Option key="1" value="-1">
                        全部类型
                      </Option>
                      <Option key="2" value="1">
                        储值
                      </Option>
                      <Option key="3" value="2">
                        消费
                      </Option>
                      <Option key="4" value="3">
                        退款
                      </Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem>
                  <span style={{ padding: '0 8px' }}>选择时间</span>
                  {getFieldDecorator('visitDate')(
                    <RangePicker
                      allowClear
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                      style={{ width: 300 }}
                      placeholder={['请选择时间', '请选择时间']}
                    />
                  )}
                </FormItem>
                <FormItem>
                  <span style={{ padding: '0 8px' }}>手机号</span>
                  {getFieldDecorator('mobile')(
                    <Input style={{ width: 170 }} placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.searchUserInfo.bind(this)}>
                    搜索
                  </Button>
                </FormItem>
              </Form>
              <div style={{ marginTop: '16px' }}>
                <Table
                  rowKey="balanceDetailId"
                  dataSource={tableData && tableData.rows}
                  columns={columns}
                  pagination={{
                    current: tableData.current,
                    pageSize: tableData.pageSize,
                    total: tableData.total,
                    onChange: this.PaginationChange.bind(this),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(Form.create()(StroedQuery));
