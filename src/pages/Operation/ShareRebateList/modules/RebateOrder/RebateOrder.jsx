import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from '../../ShareRebateList.module.scss';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { history } from '@umijs/max';
import { Button, Input, DatePicker, Select, Table } from 'antd';
import { orderList } from '@/services/commission';
import { showBut } from '@/utils/utils';
import { encryptByDES } from 'kx-des';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Column } = Table;

class RebateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        activityName: '',
        keyword: null,
        keywordType: '1',
        status: null,
        page: 1,
        startTime: null,
        endTime: null,
      },
      tableData: {
        page: {},
      },
    };
  }
  componentDidMount() {
    this.getOrderList();
  }
  async getOrderList() {
    const info = await orderList(this.state.searchForm);
    // const temp = JSON.stringify(this.state.searchForm);
    // const param = encryptByDES(`${temp}`);
    // const info = await orderList(param);
    if (info) {
      this.setState({
        tableData: info.data,
      });
    }
  }
  typeChange(value) {
    const { searchForm } = this.state;
    searchForm.keywordType = value;
    this.setState({
      searchForm,
    });
  }
  searchUserInfo() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.startTime =
        values.orderDate && values.orderDate.length
          ? values.orderDate[0].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.endTime =
        values.orderDate && values.orderDate.length
          ? values.orderDate[1].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.status = values.status === '3' ? null : values.status;
      delete values.orderDate;
      this.setState(
        {
          searchForm: {
            ...values,
            page: 1,
          },
        },
        () => {
          this.getOrderList();
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
        this.getOrderList();
      }
    );
  }
  filterStatus(e) {
    let color = '';
    let text = '';
    switch (e.status) {
      case 0:
        color = 'grey';
        text = '交易中';
        break;
      case 1:
        color = 'green';
        text = '交易成功';
        break;
      case 2:
        color = 'red';
        text = '交易关闭';
        break;
      default:
        break;
    }
    return (
      <div className={Css.status}>
        <span className={Css[color] + ' ' + Css.dot} />
        <span>{text}</span>
      </div>
    );
  }
  actionGroup(record) {
    return (
      <div className={Css.ActionBox}>
        {showBut('shareRebateList', 'share_rebate_list_detail') && (
          <span onClick={this.jumpOrder.bind(this, record)}>订单详情</span>
        )}
      </div>
    );
  }
  jumpOrder(record) {
    const { orderId } = record;
    // const fristUrl = 'http://10.20.16.64';
    // const fristUrl = 'https://kxshop.ejoy99.com/';
    // const url = `${fristUrl}/seller/orders/info/${orderId}`
    // window.open(url);
    history.push('/order/orderList/OrderDetail/' + orderId);
  }
  getSaleFn(record) {
    const money = record ? (record / 100).toFixed(2) : null;
    return <div>{money}</div>;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tableData, searchForm } = this.state;
    let searchText = null;
    if (searchForm.keywordType === '1') {
      searchText = '返佣人手机号';
    }
    if (searchForm.keywordType === '3') {
      searchText = '商品名称';
    }
    return (
      <div className={Css.BrokerageBox}>
        <div className={Css.BrokerageSearch}>
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('status', {
                initialValue: '3',
              })(
                <Select style={{ width: 150 }}>
                  <Option value="3">全部交易状态</Option>
                  <Option value="0">交易中</Option>
                  <Option value="1">交易成功</Option>
                  <Option value="2">交易关闭</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('orderDate')(
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: 350 }}
                  placeholder={['订单时间开始', '订单时间结束']}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('keywordType', {
                initialValue: '1',
              })(
                <Select style={{ width: 100 }} onChange={this.typeChange.bind(this)}>
                  <Option value="1">返佣人</Option>
                  <Option value="3">商品名称</Option>
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
            rowKey="orderId"
            dataSource={tableData.rows}
            pagination={{
              current: tableData.page.current,
              pageSize: tableData.page.pageSize,
              total: tableData.page.total,
              onChange: this.PaginationChange.bind(this),
            }}
          >
            <Column
              align="left"
              title="返佣人昵称"
              dataIndex="sharerNickname"
              key="sharerNickname"
            />
            <Column align="left" title="返佣人手机号" dataIndex="sharerPhone" key="sharerPhone" />
            <Column align="left" title="订单编号" dataIndex="orderId" key="orderId" />
            <Column align="left" title="商品名称" dataIndex="goodsName" key="goodsName" />
            <Column
              align="left"
              title="佣金比例%"
              dataIndex="commissionRatio"
              key="commissionRatio"
            />
            <Column
              align="left"
              title="佣金金额"
              dataIndex="commissionMoney"
              key="commissionMoney"
              render={this.getSaleFn.bind(this)}
            />
            <Column align="left" title="订单创建时间" dataIndex="createTime" key="createTime" />
            <Column
              align="left"
              title="状态"
              width="10%"
              key="status"
              render={this.filterStatus.bind(this)}
            />
            <Column
              align="left"
              title="操作"
              width="12%"
              key="action"
              render={this.actionGroup.bind(this)}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(RebateOrder));
