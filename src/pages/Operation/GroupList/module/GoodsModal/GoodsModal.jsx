import React from 'react';
import { withRouter } from '@/utils/compatible'
import {
  Button,
  Input,
  message,
  Upload,
  Icon,
  Modal,
  Table,
  Radio,
  Pagination,
  Tooltip,
} from 'antd';
import Css from './GoodsModal.module.scss';
import { itemList } from '@/services/item';

class GoodsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      itemName: null,
      tableData: {},
      searchForm: {
        state: 1,
        classId: 1,
        page: 1,
        pageSize: 5,
      },
    };
  }
  componentDidMount() {
    this.itemList();
  }
  searchFn() {
    // 搜索
    this.setState(
      {
        loading: true,
        searchForm: {
          ...this.state.searchForm,
          page: 1,
        },
      },
      () => {
        this.itemList();
      }
    );
  }
  itemList() {
    itemList(this.state.searchForm).then(res => {
      if (res.errorCode === '0') {
        this.setState({
          tableData: res.data,
          loading: false,
        });
      }
    });
  }
  nameChange(e) {
    const itemName = e.target.value;
    this.setState({
      itemName,
      searchForm: {
        ...this.state.searchForm,
        itemName,
      },
    });
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
        this.itemList();
      }
    );
  }
  // 价格展示dom
  price(num) {
    return (
      <p>
        <span>{num < 100 ? '0' : Math.floor(num / 100)}</span>
        <span>
          .{String((num / 100).toFixed(2)).substring(String((num / 100).toFixed(2)).length - 2)}
        </span>
      </p>
    );
  }
  goodsCheckedFn(record) {
    //选中商品数据
    this.props.checkedItem(record.itemId);
  }
  render() {
    const { itemName, tableData, loading, searchForm } = this.state;
    const columns = [
      {
        title: '',
        dataIndex: 'radio',
        width: '8%',
        render: (text, record) => {
          return <Radio onChange={this.goodsCheckedFn.bind(this, record)} />;
        },
      },
      {
        title: '商品名称',
        width: '35%',
        dataIndex: 'itemName',
        render: (text, record) => {
          return (
            <div className={Css['table-name-box']}>
              <div>
                <img className={Css['table-name-img']} src={record.imageSrc} />
              </div>
              <div style={{ marginLeft: 12 }}>{record.itemName}</div>
            </div>
          );
        },
      },
      {
        title: '售价',
        dataIndex: 'goodsMoney',
        render: (text, record) => {
          return (
            <div>
              {record.minSalePrice === record.maxSalePrice ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {this.price(record.minSalePrice)}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {this.price(record.minSalePrice)}
                  <p>-</p>
                  {this.price(record.maxSalePrice)}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: '商品库存',
        dataIndex: 'storage',
      },
    ];
    return (
      <Modal
        maskClosable={false}
        title="选择商品"
        width={650}
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        footer={false}
      >
        <div className={Css.goodsModal}>
          <div className={Css.goodsTop}>
            <div style={{ float: 'left' }}>仅显示出售中的普通商品</div>
            <div style={{ float: 'right' }}>
              <Input
                allowClear
                style={{ width: 200, marginRight: 5 }}
                value={itemName}
                onChange={this.nameChange.bind(this)}
                placeholder="商品名称"
              />
              <Button onClick={this.searchFn.bind(this)} type="primary">
                搜索
              </Button>
            </div>
          </div>
          <div className={Css.goodsTable}>
            <Table
              loading={loading}
              rowKey="itemId"
              dataSource={tableData && tableData.rows}
              columns={columns}
              pagination={false}
              scroll={{ y: 400 }}
            />
          </div>
          <div className={Css.goodsBottom}>
            <Pagination
              current={tableData.current}
              pageSize={searchForm.pageSize}
              total={tableData.total}
              onChange={this.PaginationChange.bind(this)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(GoodsModal);
