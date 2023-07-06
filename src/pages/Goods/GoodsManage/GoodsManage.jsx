import Panel from '@/components/Panel'
import {
  CloseCircleOutlined,
  EditOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { Link } from '@umijs/max'
import {
  Button,
  ConfigProvider,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  Table,
  TreeSelect,
  Typography,
  message
} from 'antd'
import React, { Component } from 'react'
import Css from './GoodsManage.module.scss'
import SkuTable from './modules/SkuTable/index.tsx'
import SkuTableEdit from './modules/SkuTableEdit/index'
import StoreMove from './modules/StoreMove/StoreMove'

import {
  itemDelete,
  itemDelisting,
  itemEditDisplaySort,
  itemEditName,
  itemList,
  itemListing
} from '@/services/item'

import { labelOptionList } from '@/services/storeLabel'
import { showBut } from '@/utils/utils'

const { Option } = Select
const { Column } = Table
const { confirm } = Modal
const { Text } = Typography

class GoodsManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 列表加载阀门
      spinIs: false,
      // 列表展示数组
      listData: [],
      // 列表分页
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // 商品状态值
      state: '1',
      // 商品类目列表
      itemClassList: [],
      storeLabelId: undefined,
      // 搜索类型
      itemType: 'itemName',
      // 搜索文本
      itemSearchText: '',
      // 确定搜索用数据
      determineText: {
        storeLabelId: '',
        itemType: '',
        itemSearchText: ''
      },
      // 列表选中数组
      selectedRowKeys: [],
      // 列表排序类型
      sortType: '',
      // 列表正反序列
      sortOrder: '',
      editId: null,
      // 编辑商品弹框阀门
      editVisible: false,
      editText: '',
      // 编辑展示排序弹框阀门
      editShowVisible: false,
      editShowText: ''
    }
    this.skuTableEditRef = React.createRef(null)
    this.skuTableRef = React.createRef(null)
  }

  componentDidMount() {
    this.itemListApi()
    this.labelOptionListApi()
  }

  // 后端数据更新有延迟，前端处理
  reloadData(data) {
    const { listData } = this.state
    listData.find((val) => {
      if (val.itemId == data.itemId) {
        val = data
        return true
      }
      return false
    })
    this.setState({
      listData
    })
  }

  // 商品列表请求
  async itemListApi(page) {
    try {
      this.setState({ spinIs: true })
      let data = {
        page: page || 1,
        pageSize: this.state.sourcePage.pageSize,
        sortType: this.state.sortType,
        sortOrder: this.state.sortOrder,
        storeLabelId: this.state.determineText.storeLabelId
      }
      if (this.state.state < 3) {
        data = {
          ...data,
          state: this.state.state
        }
      }
      if (this.state.determineText.itemType === 'itemName') {
        data = {
          ...data,
          itemName: this.state.determineText.itemSearchText
        }
      }
      if (this.state.determineText.itemType === 'itemId') {
        data = {
          ...data,
          itemId: this.state.determineText.itemSearchText
        }
      }
      if (this.state.determineText.itemType === 'itemCode') {
        data = {
          ...data,
          itemCode: this.state.determineText.itemSearchText
        }
      }
      const res = await itemList(data)
      if (res.errorCode === '0') {
        // 判断当前页是否还有数据
        if (res.data.rows.length === 0 && this.state.sourcePage.current > 1) {
          await this.itemListApi(this.state.sourcePage.current - 1)
        } else {
          this.setState({
            listData: res.data.rows,
            sourcePage: {
              current: res.data.current,
              pageSize: res.data.pageSize,
              total: res.data.total
            }
          })
        }
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      this.setState({ spinIs: false })
    }
  }

  // 商品类目列表请求
  async labelOptionListApi() {
    const res = await labelOptionList()
    if (res.errorCode === '0') {
      const itemClassList = res.data.map((i) => ({
        id: i.storeLabelId,
        pId: 0,
        value: i.storeLabelId,
        title: i.storeLabelName,
        isLeaf: !i.childFlag
      }))
      this.setState({
        itemClassList
      })
    }
  }

  // 输入change事件
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value.trim()
    })
  }

  // 类型change事件
  stateChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value.trim(),
        selectedRowKeys: []
      },
      () => {
        this.itemListApi()
      }
    )
  }

  // 商品类目懒加载
  itemClassLoadData = (treeNode) =>
    new Promise((resolve) => {
      const { itemClassList } = this.state
      labelOptionList({ storeLabelId: treeNode.id }).then((res) => {
        const childData = res.data.map((i) => ({
          id: i.storeLabelId,
          pId: treeNode.id,
          value: i.storeLabelId,
          title: i.storeLabelName,
          isLeaf: !i.childFlag
        }))
        this.setState(
          {
            itemClassList: itemClassList.concat(childData)
          },
          () => {
            resolve()
          }
        )
      })
    })

  // 商品类目change事件
  itemClassChange = (value) => {
    this.setState({
      storeLabelId: value
    })
  }

  // 搜索开始
  searchStart() {
    this.setState(
      (prevState) => ({
        determineText: {
          storeLabelId: prevState.storeLabelId,
          itemType: prevState.itemType,
          itemSearchText: prevState.itemSearchText
        }
      }),
      // {
      //   determineText: {
      //     storeLabelId: this.state.storeLabelId,
      //     itemType: this.state.itemType,
      //     itemSearchText: this.state.itemSearchText,
      //   },
      // },
      () => {
        this.itemListApi()
      }
    )
  }

  // 价格展示dom
  price(num) {
    return (
      <p>
        <span>{num < 100 ? '0' : Math.floor(num / 100)}</span>
        <span>
          .
          {String((num / 100).toFixed(2)).substring(
            String((num / 100).toFixed(2)).length - 2
          )}
        </span>
      </p>
    )
  }
  // 后端无法及时更新数据，故前端手动修改源数据展示
  changeData(key, val) {
    const { editId, listData } = this.state
    listData.find((v, i) => {
      if (v.itemId === editId) {
        listData[i][key] = val
        return true
      }
      return false
    })
    console.log(listData)
    this.setState({
      listData
    })
  }

  // 编辑商品弹框打开
  editShowModal(record) {
    this.setState({
      editVisible: true,
      editId: record.itemId,
      editText: record.itemName
    })
  }

  // 编辑商品弹框成功
  async editOk() {
    if (this.state.itemName === '') {
      message.warning('请输入商品名称')
      return
    }
    const res = await itemEditName({
      itemId: this.state.editId,
      name: this.state.editText
    })
    if (res.errorCode === '0') {
      this.setState({
        editVisible: false
      })
      this.changeData('itemName', this.state.editText)
    }
  }

  // 编辑商品弹框取消
  editCancel() {
    this.setState({
      editVisible: false
    })
  }

  // 编辑展示顺序弹框打开
  editShowShowModal(record) {
    this.setState({
      editShowVisible: true,
      editId: record.itemId,
      editShowText: record.disSort
    })
  }

  // 编辑展示顺序弹框成功
  async editShowOk() {
    if (this.state.editShowText === '' || this.state.editShowText === null) {
      message.warning('请输入顺序序号')
      return
    }
    const res = await itemEditDisplaySort({
      itemId: this.state.editId,
      disSort: this.state.editShowText
    })

    if (res.errorCode === '0') {
      this.setState({
        editShowVisible: false
      })
      this.changeData('disSort', this.state.editShowText)
    }
  }

  // 编辑展示顺序弹框取消
  editShowCancel() {
    this.setState({
      editShowVisible: false
    })
  }

  bulkbewerkingShowModal(item) {
    console.log('bulkbewerkingShowModal', item, this.skuTableEditRef)
    this.skuTableEditRef.current.showModal(item)
  }

  // 下架
  soldOut(record) {
    itemDelisting({
      itemIds: [record.itemId]
    }).then((res) => {
      if (res.errorCode === '0') {
        message.success('下架成功')
        this.itemListApi(this.state.sourcePage.current)
      }
    })
  }

  // 上架
  async putaway(record) {
    const res = await itemListing({
      itemIds: [record.itemId]
    })
    if (res.errorCode === '0') {
      message.success('上架成功')
      this.itemListApi(this.state.sourcePage.current)
    }
  }

  // 批量下架
  async batchSoldOut() {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning('请选中需要下架的商品')
      return
    }
    const res = await itemDelisting({
      itemIds: this.state.selectedRowKeys
    })

    if (res.errorCode === '0') {
      this.setState({
        selectedRowKeys: []
      })
      message.success('下架成功')
      this.itemListApi()
    }
  }

  // 批量上架
  async batchPutaway() {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning('请选中需要上架的商品')
      return
    }
    const res = await itemListing({
      itemIds: this.state.selectedRowKeys
    })
    if (res.errorCode === '0') {
      this.setState({
        selectedRowKeys: []
      })
      message.success('上架成功')
      this.itemListApi()
    }
  }

  // 删除商品
  delItem(record) {
    confirm({
      icon: <CloseCircleOutlined style={{ color: 'rgba(247, 38, 51, 1)' }} />,
      title: '确定要删除该商品?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        const res = await itemDelete({
          itemId: record.itemId
        })

        if (res.errorCode === '0') {
          message.success('删除成功')
          this.itemListApi(this.state.sourcePage.current)
        }
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    let sortType = ''
    let sortOrder = ''
    if (sorter && sorter.column) {
      switch (sorter.column.key) {
        case 'minSalePrice':
          sortType = 'salePrice'
          break
        case 'saleVolume':
          sortType = 'salesVolume'
          break
        case 'storage':
          sortType = 'storage'
          break
        case 'disSort':
          sortType = 'disSort'
          break
        default:
          sortType = ''
      }

      switch (sorter.order) {
        case 'ascend':
          sortOrder = 'asc'
          console.log('asc')
          break
        case 'descend':
          sortOrder = 'desc'
          console.log('desc')
          break
        default:
          sortOrder = ''
      }
    }
    console.log(sortType && sortOrder)
    this.setState(
      {
        sortType,
        sortOrder
      },
      () => {
        this.itemListApi(pagination.current)
      }
    )
  }

  customizeRenderEmpty = () => (
    // 这里面就是我们自己定义的空状态
    <div style={{ textAlign: 'center', height: 650 }}>
      <img
        style={{ marginTop: 114, marginBottom: 18 }}
        src="https://img.kxll.com/admin_manage/wsp.png"
      />
      {this.state.determineText.storeLabelId === '' &&
      this.state.determineText.itemSearchText === '' ? (
        <p>暂无商品，快去添加一些吧</p>
      ) : (
        <p>暂无商品</p>
      )}
    </div>
  )
  showStoreFn() {
    this.setState({
      storeShow: true
    })
  }
  closeModal() {
    this.setState({
      storeShow: false
    })
  }

  render() {
    return (
      <Panel title="商品管理" content="商品信息管理">
        <div className={Css['goods-box']}>
          <div className={Css['content-box']}>
            <div>
              {showBut('manageList', 'manageList_send') ? (
                <Link to="/goods/manageList/addGoods?type=add">
                  <Button style={{ marginBottom: '24px' }} type="primary">
                    发布商品
                  </Button>
                </Link>
              ) : null}
              {showBut('manageList', 'manageList_export') ? (
                <Link to="/goods/manageList/goodsimport">
                  <Button type="primary" style={{ marginLeft: '24px' }}>
                    批量导入
                  </Button>
                </Link>
              ) : null}
              {showBut('manageList', 'manageList_transfer') ? (
                <Button
                  type="primary"
                  onClick={this.showStoreFn.bind(this)}
                  style={{ marginLeft: '24px' }}
                >
                  一键迁店
                </Button>
              ) : null}
            </div>
            <div className={Css['table-header-box']}>
              <div>
                <Radio.Group
                  name="state"
                  value={this.state.state}
                  onChange={this.stateChange}
                >
                  <Radio.Button value="1">出售中</Radio.Button>
                  <Radio.Button value="2">已售罄</Radio.Button>
                  <Radio.Button value="0">已下架</Radio.Button>
                  <Radio.Button value="3">全部</Radio.Button>
                </Radio.Group>
              </div>
              <div className={Css['table-header-box-right']}>
                {/* 请选择商品类目 */}
                <TreeSelect
                  treeDataSimpleMode
                  style={{ width: 160, marginRight: 16 }}
                  value={this.state.storeLabelId}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择商品类目"
                  allowClear
                  onChange={this.itemClassChange}
                  loadData={this.itemClassLoadData}
                  treeData={this.state.itemClassList}
                />
                <Select
                  style={{ width: 160, marginRight: 16 }}
                  placeholder="商品名称"
                  value={this.state.itemType}
                  onChange={(e) => {
                    this.setState({
                      itemType: e
                    })
                  }}
                >
                  <Option value="itemName">商品名称</Option>
                  <Option value="itemCode">商品编码</Option>
                  <Option value="itemId">商品ID</Option>
                </Select>
                <Input
                  style={{ width: 140, marginRight: 16 }}
                  placeholder="请输入"
                  name="itemSearchText"
                  value={this.state.itemSearchText}
                  onChange={this.onChange}
                />
                <Button type="primary" onClick={this.searchStart.bind(this)}>
                  搜索
                </Button>
              </div>
            </div>
            <div className={Css['table-batch-box']}>
              {showBut('manageList', 'manageList_batchDown') &&
              this.state.state &&
              (this.state.state === '1' || this.state.state === '3') ? (
                <Button
                  className={Css['batch-btn']}
                  onClick={this.batchSoldOut.bind(this)}
                >
                  批量下架
                </Button>
              ) : null}
              {showBut('manageList', 'manageList_batchDown') &&
              this.state.state &&
              (this.state.state === '0' || this.state.state === '3') ? (
                <Button
                  className={Css['batch-btn']}
                  onClick={this.batchPutaway.bind(this)}
                >
                  批量上架
                </Button>
              ) : null}
              <p className={Css['batch-text']}>
                已选商品（
                {this.state.selectedRowKeys &&
                this.state.selectedRowKeys.length > 0
                  ? this.state.selectedRowKeys.length
                  : 0}
                ）
              </p>
            </div>
            <Spin spinning={this.state.spinIs} size="large">
              <ConfigProvider renderEmpty={this.customizeRenderEmpty}>
                <Table
                  ellipsis
                  rowKey={(record) => record.itemId}
                  dataSource={this.state.listData}
                  rowSelection={{
                    selectedRowKeys: this.state.selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                      this.setState({
                        selectedRowKeys
                      })
                    }
                  }}
                  pagination={{
                    current: this.state.sourcePage.current,
                    pageSize: this.state.sourcePage.pageSize,
                    total: this.state.sourcePage.total
                  }}
                  onChange={this.handleTableChange}
                >
                  <Column
                    title="商品名称"
                    width={250}
                    render={(record) => (
                      <div className={Css['table-name-box']}>
                        <div className={Css['left-shop-imgBox']}>
                          <Image
                            className={Css['table-name-img']}
                            src={record.imageSrc}
                          />
                          {record.classId == 2 ? (
                            <span className={Css['table-subscribe']}>
                              可预约
                            </span>
                          ) : null}
                          {record.classId == 3 ? (
                            <span className={Css['table-subscribe']}>
                              服务商品
                            </span>
                          ) : null}
                        </div>

                        <div className={Css['table-item-name-box']}>
                          <p>
                            {record.itemName}
                            <EditOutlined
                              className={Css['table-item-name-icon']}
                              onClick={this.editShowModal.bind(this, record)}
                            />
                          </p>
                          <p className={Css['table-item-id']}>
                            id:{record.itemId}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                  <Column title="商品编码" dataIndex="itemCode" width={120} />
                  <Column
                    title="SKU信息"
                    width={90}
                    render={(record) => (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          const itemId = record.itemId
                          this.skuTableRef.current.open(itemId)
                        }}
                      >
                        查看
                      </Button>
                    )}
                  />
                  <Column title="创建时间" dataIndex="gmtCreated" />
                  <Column
                    title="售价"
                    sorter
                    key="minSalePrice"
                    render={(record) => (
                      <div className={Css['table-price-box']}>
                        {record.minSalePrice === record.maxSalePrice ? (
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            {this.price(record.minSalePrice)}
                            <EditOutlined
                              className={Css['table-price-icon']}
                              onClick={this.bulkbewerkingShowModal.bind(
                                this,
                                record
                              )}
                            />
                          </div>
                        ) : (
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            {this.price(record.minSalePrice)}
                            <p>-</p>
                            {this.price(record.maxSalePrice)}
                            <EditOutlined
                              className={Css['table-price-icon']}
                              onClick={this.bulkbewerkingShowModal.bind(
                                this,
                                record
                              )}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <Column
                    title="销量"
                    sorter
                    key="saleVolume"
                    dataIndex="saleVolume"
                  />
                  <Column
                    title="库存"
                    sorter
                    key="storage"
                    render={(record) => (
                      <div className={Css['table-storage-box']}>
                        {record.storage}
                        <EditOutlined
                          className={Css['table-price-icon']}
                          onClick={this.bulkbewerkingShowModal.bind(
                            this,
                            record
                          )}
                        />
                      </div>
                    )}
                  />
                  <Column
                    width={120}
                    title={() => {
                      return (
                        <div className={Css['table-order-box']}>
                          展示顺序
                          <InfoCircleOutlined
                            className={Css['table-order-icon']}
                          />
                          <div className={Css['order-mask-box']}>
                            <div className={Css['mask-content']}>
                              商品在小程序端无排序规则时的展示顺序，数值越大越靠前
                            </div>
                            <div className={Css['mask-triangle']} />
                          </div>
                        </div>
                      )
                    }}
                    sorter
                    key="disSort"
                    render={(record) => (
                      <div className={Css['table-dis-sort-box']}>
                        {record.disSort}
                        <EditOutlined
                          className={Css['table-dis-sort-icon']}
                          onClick={this.editShowShowModal.bind(this, record)}
                        />
                      </div>
                    )}
                  />
                  <Column
                    title="状态"
                    render={(record) => (
                      <div>
                        {record.state === 0 ? <p>已下架</p> : null}
                        {record.state === 1 ? (
                          <p style={{ color: 'rgba(102, 209, 32, 1)' }}>
                            出售中
                          </p>
                        ) : null}
                        {record.state === 2 ? <p>已售罄</p> : null}
                      </div>
                    )}
                  />
                  <Column
                    title="操作"
                    render={(record) => (
                      <Space>
                        {showBut('manageList', 'manageList_edit') && (
                          <Link
                            to={`/goods/manageList/addGoods?type=edit&itemId=${record.itemId}`}
                          >
                            编辑
                          </Link>
                        )}
                        <Link
                          to={`/goods/manageList/addGoods?type=copy&itemId=${record.itemId}`}
                        >
                          复制
                        </Link>
                        {record.state === 0 &&
                          showBut('manageList', 'manageList_put') && (
                            <Link onClick={() => this.putaway(record)}>
                              上架
                            </Link>
                          )}
                        {record.state === 1 &&
                          showBut('manageList', 'manageList_pop') && (
                            <Link onClick={() => this.soldOut(record)}>
                              下架
                            </Link>
                          )}
                        {showBut('manageList', 'manageList_delete') && (
                          <Text
                            type="danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => this.delItem(record)}
                          >
                            删除
                          </Text>
                        )}
                      </Space>
                    )}
                  />
                </Table>
              </ConfigProvider>
            </Spin>
          </div>

          <Modal
            centered
            title="编辑商品名称"
            width="364px"
            visible={this.state.editVisible}
            okText="保存"
            onOk={this.editOk.bind(this)}
            onCancel={this.editCancel.bind(this)}
          >
            <Input
              style={{ marginBottom: 8 }}
              placeholder="请输入，50字以内"
              name="editText"
              value={this.state.editText}
              onChange={this.onChange}
            />
          </Modal>

          <Modal
            centered
            title="编辑展示顺序"
            width="364px"
            visible={this.state.editShowVisible}
            okText="保存"
            onOk={this.editShowOk.bind(this)}
            onCancel={this.editShowCancel.bind(this)}
          >
            <InputNumber
              style={{ width: 310, marginBottom: 8 }}
              placeholder="请输入0-9999"
              min={0}
              max={9999}
              value={this.state.editShowText}
              onChange={(e) => {
                this.setState({
                  editShowText: e
                })
              }}
            />
          </Modal>
          <SkuTableEdit
            ref={this.skuTableEditRef}
            reloadData={this.reloadData.bind(this)}
          />
          <SkuTable ref={this.skuTableRef} />
          {this.state.storeShow ? (
            <StoreMove
              closeModal={this.closeModal.bind(this)}
              visible={this.state.storeShow}
            />
          ) : null}
        </div>
      </Panel>
    )
  }
}

export default GoodsManage
