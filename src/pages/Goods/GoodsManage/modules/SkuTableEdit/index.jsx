import { EditOutlined } from '@ant-design/icons'
import { InputNumber, Modal, Table, message } from 'antd'
import { Component } from 'react'
import Css from './index.module.scss'

// 接入接口
import { itemSkuEditPriceStorage, itemSkuList } from '@/services/item'

const { Column } = Table

class SkuTableEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      // sku批量编辑售价阀门
      skuBatchPriceVisible: false,
      skuBatchPrice: 0.01,
      // sku批量编辑库存阀门
      skuBatchStorageVisible: false,
      skuBatchStorage: 0,
      // sku列表数组
      skuListData: [],
      // sku列表分页
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      confirmLoading: false,
      // 父级传入数据
      itemData: {}
    }
  }

  // 弹框打开
  async showModal(item) {
    console.log(item)
    const res = await itemSkuList({
      itemId: item.itemId
    })
    if (res.errorCode === '0') {
      const listData = res.data.map((ele) => {
        return {
          ...ele,
          salePrice: ele.salePrice / 100
        }
      })
      this.setState({
        itemData: item,
        skuListData: listData,
        sourcePage: {
          current: 1,
          pageSize: 10,
          total: listData.length
          // total: 199,
        },
        visible: true
      })
    }
  }

  // 弹框成功
  handleOk() {
    this.setState({
      confirmLoading: true
    })
    const that = this
    const { skuListData, itemData } = this.state
    const priceArray = []
    let storageNum = 0
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in skuListData) {
      if (
        !(skuListData[i].salePrice >= 0.01) ||
        skuListData[i].salePrice === null
      ) {
        message.warning('售价不能低于0.01，且不能为空')
        return
      }
      if (skuListData[i].storage === '' || skuListData[i].storage === null) {
        message.warning('库存不能为空值')
        return
      }
      priceArray.push(skuListData[i].salePrice)
      storageNum += skuListData[i].storage
    }
    priceArray.sort()
    itemData.storage = storageNum
    itemData.minSalePrice = priceArray[0] * 100
    itemData.maxSalePrice = priceArray[priceArray.length - 1] * 100
    const skuList = skuListData.map((item) => {
      return {
        skuId: item.skuId,
        salePrice: Math.round(item.salePrice * 100),
        storage: item.storage
      }
    })
    itemSkuEditPriceStorage({
      skuList
    }).then((res) => {
      if (res.errorCode === '0') {
        message.success('修改成功')
        this.setState({
          visible: false,
          skuBatchPriceVisible: false,
          skuBatchPrice: 0.01,
          skuBatchStorageVisible: false,
          skuBatchStorage: 0
        })
        that.props.reloadData(itemData)
      }
      that.setState({
        confirmLoading: false
      })
    })
  }

  // 弹框取消
  handleCancel(e) {
    this.setState({
      visible: false,
      skuBatchPriceVisible: false,
      skuBatchPrice: 0.01,
      skuBatchStorageVisible: false,
      skuBatchStorage: 0
    })
  }

  // 翻页
  sourcePageCut(page) {
    this.setState((prevState) => ({
      sourcePage: {
        ...prevState.sourcePage,
        current: page
      }
    }))
    // this.setState({
    //   sourcePage: {
    //     ...this.state.sourcePage,
    //     current: page,
    //   },
    // });
  }

  // 批量保存
  skuBatchPrice() {
    const {
      skuListData,
      skuBatchPrice,
      skuBatchStorage,
      skuBatchPriceVisible,
      skuBatchStorageVisible
    } = this.state
    const newSkuListData = skuListData
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in skuListData) {
      if (skuBatchPriceVisible) {
        newSkuListData[i].salePrice = skuBatchPrice
      }
      if (skuBatchStorageVisible) {
        newSkuListData[i].storage = skuBatchStorage
      }
    }
    this.setState({
      skuListData: newSkuListData
    })
  }

  // 取消批量
  skuBatchStorage() {
    this.setState({
      skuBatchPriceVisible: false,
      skuBatchStorageVisible: false
    })
  }

  render() {
    const { visible, confirmLoading } = this.state
    return (
      <Modal
        centered
        title="批量编辑"
        // width="675px"
        visible={visible}
        confirmLoading={confirmLoading}
        okText="确认"
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
      >
        <Table
          className={Css['sku-table-box']}
          ellipsis
          rowKey={(record) => record.skuId}
          dataSource={this.state.skuListData}
          pagination={{
            current: this.state.sourcePage.current,
            pageSize: this.state.sourcePage.pageSize,
            total: this.state.sourcePage.total,
            onChange: (page) => this.sourcePageCut(page)
          }}
        >
          <Column
            title="SKUID"
            key="skuId"
            width={120}
            render={(record) => <div>{record.skuId}</div>}
          />
          <Column
            title="规格"
            width={100}
            key="specsDesc"
            render={(record) => (
              <div>{record.specsDesc ? record.specsDesc : '默认'}</div>
            )}
          />
          <Column
            width={250}
            title={() => {
              return (
                <div className={Css['sale-price-box']}>
                  售价
                  {this.state.skuBatchPriceVisible ? (
                    <InputNumber
                      className={Css['sale-price-inoput-number']}
                      value={this.state.skuBatchPrice}
                      min={0.01}
                      precision={2}
                      type="number"
                      onChange={(e) => {
                        this.setState({
                          skuBatchPrice: e
                        })
                      }}
                    />
                  ) : (
                    <EditOutlined
                      className={Css['sale-price-icon']}
                      onClick={() => {
                        this.setState({
                          skuBatchStorageVisible: false,
                          skuBatchPriceVisible: true
                        })
                      }}
                    />
                  )}
                  {this.state.skuBatchPriceVisible ? (
                    <div className={Css['sku-setting-box']}>
                      <p
                        className={Css['sku-setting-text']}
                        onClick={this.skuBatchPrice.bind(this)}
                      >
                        保存
                      </p>
                      <p
                        className={Css['sku-setting-text']}
                        onClick={this.skuBatchStorage.bind(this)}
                      >
                        取消
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            }}
            render={(text, record, index) => {
              console.log('售价', text, record, index)
              return (
                <InputNumber
                  style={{
                    marginLeft: this.state.skuBatchPriceVisible ? '38px' : 0
                  }}
                  value={record.salePrice}
                  min={0.01}
                  precision={2}
                  type="number"
                  onChange={(e) => {
                    // eslint-disable-next-line react/no-access-state-in-setstate
                    const skuListData = this.state.skuListData
                    skuListData[index].salePrice = e
                    this.setState({
                      skuListData
                    })
                  }}
                />
              )
            }}
          />
          <Column
            width={250}
            title={() => {
              return (
                <div className={Css['sale-price-box']}>
                  库存
                  {this.state.skuBatchStorageVisible ? (
                    <InputNumber
                      className={Css['sale-price-inoput-number']}
                      value={this.state.skuBatchStorage}
                      min={0}
                      type="number"
                      onChange={(e) => {
                        this.setState({
                          skuBatchStorage: e
                        })
                      }}
                    />
                  ) : (
                    <EditOutlined
                      className={Css['sale-price-icon']}
                      onClick={() => {
                        this.setState({
                          skuBatchStorageVisible: true,
                          skuBatchPriceVisible: false
                        })
                      }}
                    />
                  )}
                  {this.state.skuBatchStorageVisible ? (
                    <div className={Css['sku-setting-box']}>
                      <p
                        className={Css['sku-setting-text']}
                        onClick={this.skuBatchPrice.bind(this)}
                      >
                        保存
                      </p>
                      <p
                        className={Css['sku-setting-text']}
                        onClick={this.skuBatchStorage.bind(this)}
                      >
                        取消
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            }}
            render={(text, record, index) => (
              <InputNumber
                style={{
                  marginLeft: this.state.skuBatchStorageVisible ? '38px' : 0
                }}
                value={record.storage}
                min={0}
                type="number"
                onChange={(e) => {
                  // eslint-disable-next-line react/no-access-state-in-setstate
                  const skuListData = this.state.skuListData
                  skuListData[index].storage = e
                  this.setState({
                    skuListData
                  })
                }}
              />
            )}
          />
        </Table>
      </Modal>
    )
  }
}

export default SkuTableEdit
