import React, { Component } from "react";
import { withRouter } from '@/utils/compatible'
import Css from "../../ShareRebateList.module.scss";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Table, InputNumber, Button, message } from "antd";
import { auditList, addCommissionItem, updateCommissionItem } from "@/services/commission";
const FormItem = Form.Item;

class AddCommodity extends Component {
    constructor(props) {
		super(props);
		this.state = {
            searchForm: {
              page: 1,
              pageSize: 10
            },
            tableData: {},
            selectedRowKeys: []
		};
    }
    componentDidMount() {
      if(this.props.type === 'create'){
        this.getAuditList();
      }else{
        const { tableData } = this.state;
        const { record } = this.props;
        record.key = record.itemId
        tableData.rows = [record]
        this.setState({
          tableData
        })
      }
    }
    async getAuditList() {
      const info = await auditList(this.state.searchForm);
      if (info) {
        info.data.rows.map(item => {
          item.key = item.itemId
        })
        this.setState({
          tableData: info.data
        });
      }
    }
    // 分页
	  PaginationChange(e) {
      this.setState(
        {
          searchForm: {
            ...this.state.searchForm,
            page: e
          },
          selectedRowKeys: [],
          selectedRows: []
        },
        () => {
          this.getAuditList()
        }
      );
    }
    // 确定选择商品
    AddCommodityFn() {
      const { selectedRows } = this.state;
      const { type } = this.props;
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        const prams = [];
        if(type === 'create'){
            let isPercent = false;
            for (var key in values){
              if(values[key]){
                selectedRows.map( item => {
                  if(item.itemId == key){
                    item.percent = values[key]
                  }
                })
              }
            }
            if(selectedRows.length){
              selectedRows.map( (item) => {
                if(!item.percent){
                  isPercent = true;
                }
              })
            }
            if(isPercent){
              message.error('请输入佣金比例')
              return;
            }
            selectedRows.map( item => {
              const data={
                "itemId": item.itemId,
                "commissionRatio": item.percent
              }
              prams.push (data)
            })
            // if(selectedRows.length > 10){
            //   message.error('最多一次添加十件商品')
            //   return;
            // }
            this.addCommissionItem(prams)
        } else {
          let isPercent = false;
          const data = {};
          for (var key in values){
            if(!values[key]){
              isPercent = true;
            }else{
              data.itemId = Number(key)
              data.commissionRatio = values[key]
            }
          }
          if(isPercent){
            message.error('请输入佣金比例')
            return;
          }
          this.updateCommissionItem(data)
        }
      })
    }
    async addCommissionItem(prams) {
      const info = await addCommissionItem(prams);
      if (info) {
        message.success('商品添加成功')
        this.props.onOkModal();
        this.props.onCancelModal()
      }
    }
    async updateCommissionItem(prams) {
      const info = await updateCommissionItem(prams);
      if (info) {
        message.success('商品编辑成功')
        this.props.onOkModal();
        this.props.onCancelModal()
      }
    }
    footerBtnFn() {
      const { selectedRowKeys, tableData } = this.state;
      const { type } = this.props;
      const btnArr = [
        <div style={{ float: 'left' }} key='0'>已选择: {selectedRowKeys.length} / {tableData.pageSize} </div>,
        <Button key='1' onClick={this.props.onCancelModal}>取消</Button>,
        <Button key='2' type="primary" onClick={this.AddCommodityFn.bind(this)}>确定</Button>
      ]
      if(type === 'edit') {
        btnArr.splice(0, 1)
      }
      return btnArr;
    }
    // 点击选择行
    onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys, selectedRows });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { tableData, selectedRowKeys } = this.state;
        const { type } = this.props;
        const columns = [{
            title: '商品名称',
            dataIndex: 'itemName'
          }, 
          {
            title: 'SPU',
            dataIndex: 'itemId',
          }, 
          {
            title: '商品售价',
            dataIndex: 'salePrice',
            render:(text, record) => {
              const money = text ? (text / 100).toFixed(2) : null;
              return(
                <div>{money}</div>
              )
            }
          },
          {
            title: '佣金比例%',
            dataIndex: 'commissionRatio',
            className: Css.ratioInput,
            render:(text, record) => {
              const { type } = this.props;
              return(
                <Form>
                  <FormItem className={Css.formitem}>
                  {getFieldDecorator(`${record.key}`,{
                    initialValue: type === 'edit' ? record.commissionRatio : null
                  })(
                     <InputNumber 
                     placeholder="0.01-99.99"
                     style={{ width: 150 }}
                     min={0.01} max={99.99}
                     precision={2}
                     />
                  )}
                  </FormItem>
                </Form>
              )
            }
          }
        ];
          const rowSelection = {
            columnTitle:' ',
            hideDefaultSelections:true,
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
          };
          const pageConfig = {
            current: tableData.current,
            pageSize: tableData.pageSize,
            total: tableData.total,
            onChange: this.PaginationChange.bind(this)
          };
        return(
            <Modal
                style={{ top: 20 }}
                maskClosable={false}
                title={ this.props.type === 'edit' ? "编辑商品" : "添加商品" }
                visible={this.props.visible}
                onCancel={this.props.onCancelModal}
                footer={this.footerBtnFn()}
                width={700}
            >
              <div className={Css.AddCommodityBox}>
                  <Table
                    rowSelection={type === 'edit' ? null : rowSelection}
                    columns={columns}
                    dataSource={tableData.rows}
                    pagination={type === 'edit' ? false : pageConfig}
                  
                />
              </div>
            </Modal>
        )
    }
}
export default Form.create()(AddCommodity)

