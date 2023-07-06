import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from '../../ShareRebateList.module.scss';
import AddCommodity from './AddCommodity';
import MinGetMoney from './MinGetMoney';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Table, Modal, message } from 'antd';
import { showBut } from '@/utils/utils'
import { commissionList, deleteCommissionItem, commissionConfig } from '@/services/commission';
const FormItem = Form.Item;
const { Column } = Table;

class RebateConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withdrawalMin: null,
      deleteShow: false,
      resetShow: false,
      addVisible: false,
      searchForm: {
        keyword: '',
        page: 1,
      },
      tableData: {},
    };
  }
  componentDidMount() {
    this.commissionConfig();
    this.getCommissionList();
  }
  minMoneyOkFn() {
    this.setState(
      {
        resetShow: false,
      },
      () => {
        this.commissionConfig();
      }
    );
  }
  commissionConfig() {
    //  查询提现金额
    commissionConfig({}).then(info => {
      if (info) {
        if (info.data) {
          this.setState({
            withdrawalMin: info.data.withdrawalMin,
          });
        }
      }
    });
  }
  getCommissionList() {
    const { searchForm } = this.state;
    commissionList(searchForm).then(info => {
      if (info) {
        this.setState({
          tableData: info.data,
        });
      }
    });
  }
  searchUserInfo() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState(
        {
          searchForm: {
            ...values,
            page: 1,
          },
        },
        () => {
          this.getCommissionList();
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
        this.getCommissionList();
      }
    );
  }
  // 编辑商品
  editGoods(record) {
    this.setState({
      addVisible: true,
      type: 'edit',
      record,
    });
  }
  actionGroup(record) {
    return (
      <div className={Css.ActionBox}>
        {showBut('shareRebateList', 'share_rebate_list_edit') && <span onClick={this.editGoods.bind(this, record)}>编辑</span>}
        {showBut('shareRebateList', 'share_rebate_list_del') && (<span onClick={this.deleteGoods.bind(this, record)} style={{ color: 'red' }}>
          删除
        </span>)}
      </div>
    );
  }
  // 删除商品
  deleteGoods(record) {
    this.setState({
      deleteShow: true,
      record,
    });
  }
  addCommodityFn() {
    this.setState({
      type: 'create',
      addVisible: true,
    });
  }
  onAddOkModal() {
    this.setState(
      {
        searchForm: {
          ...this.state.searchForm,
          page: 1,
        },
      },
      () => {
        this.getCommissionList();
      }
    );
  }
  onCancelModal() {
    this.setState({
      deleteShow: false,
      addVisible: false,
      resetShow: false,
    });
  }
  //   点击删除
  resetFn() {
    this.setState({
      resetShow: true,
    });
  }
  //  确认删除
  deleteOkFn() {
    const { record } = this.state;
    const prams = {
      commissionItemId: record.commissionItemId,
      itemId: record.itemId,
    };
    deleteCommissionItem(prams).then(info => {
      if (info) {
        message.success('删除成功');
        this.setState(
          {
            deleteShow: false,
            searchForm: {
              ...this.state.searchForm,
              page: 1,
            },
          },
          () => {
            this.getCommissionList();
          }
        );
      }
    });
  }
  getSaleFn(record) {
    const money = record ? (record / 100).toFixed(2) : null;
    return <div>{money}</div>;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tableData, addVisible, resetShow, deleteShow, record, withdrawalMin } = this.state;
    let minText = null;
    if (withdrawalMin) {
      minText = (
        <div className={Css.setMoney}>
          {`最低提现金额${withdrawalMin / 100}元`}
          <a onClick={this.resetFn.bind(this)}> 重设</a>
        </div>
      );
    } else {
      minText = (
        <div className={Css.setMoney} onClick={this.resetFn.bind(this)}>
          设置最低提现金额
        </div>
      );
    }
    return (
      <div className={Css.BrokerageBox}>
        <div className={Css.BrokerageSearch + ' ' + Css.SetTable}>
          <div className={Css.Form}>
          {
            showBut('shareRebateList', 'share_rebate_list_add') && (
            <Button type="primary" onClick={this.addCommodityFn.bind(this)}>
              {' '}
              + 添加商品
            </Button>
            )
          }
            {minText}
          </div>

          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('keyword')(
                <Input
                  onPressEnter={this.searchUserInfo.bind(this)}
                  allowClear
                  style={{ width: 200 }}
                  size="default"
                  placeholder="商品名称"
                />
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
            rowKey="commissionItemId"
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
              title="返佣ID"
              dataIndex="commissionItemId"
              key="commissionItemId"
            />
            <Column align="left" title="商品名称" dataIndex="itemName" key="itemName" />
            <Column align="left" title="商品ID" dataIndex="itemId" key="itemId" />
            <Column
              align="left"
              title="销售价格"
              dataIndex="salePrice"
              key="salePrice"
              render={this.getSaleFn.bind(this)}
            />
            <Column
              align="left"
              title="返佣比例%"
              dataIndex="commissionRatio"
              key="commissionRatio"
            />
            <Column
              align="left"
              title="累计返佣订单金额"
              dataIndex="totalOrderMoney"
              key="totalOrderMoney"
              render={this.getSaleFn.bind(this)}
            />
            <Column
              align="left"
              title="累计返佣金额"
              dataIndex="commissionMoney"
              key="commissionMoney"
              render={this.getSaleFn.bind(this)}
            />
            <Column align="left" title="操作" key="action" render={this.actionGroup.bind(this)} />
          </Table>
        </div>
        <Modal
          className={Css.deleteModal}
          maskClosable={false}
          width={450}
          title="删除"
          okText="确认"
          visible={deleteShow}
          onOk={this.deleteOkFn.bind(this)}
          onCancel={() => this.setState({ deleteShow: false })}
        >
          <div className={Css.delContent}>
            <CloseCircleOutlined className={Css.closeIcon} />
            确定要删除商品吗?
          </div>
        </Modal>
        {// 添加 && 编辑商品
        addVisible ? (
          <AddCommodity
            record={record}
            type={this.state.type}
            onOkModal={this.onAddOkModal.bind(this)}
            onCancelModal={this.onCancelModal.bind(this)}
            visible={addVisible}
          />
        ) : null}
        {// 设置最小金额
        resetShow ? (
          <MinGetMoney
            minMoneyOkFn={this.minMoneyOkFn.bind(this)}
            resetCancel={this.onCancelModal.bind(this)}
            visible={resetShow}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(Form.create()(RebateConfig));
