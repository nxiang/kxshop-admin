// 优惠券选择
import React, { Component } from 'react'
import { Modal, Table, message } from 'antd'
import Css from './CouponSelect.module.scss'

import { choseCoupon } from '@/services/shop'
import { channelTypeMap } from '@/consts'

const { Column } = Table


class CouponSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      listData: [],
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  }

  // 优惠券接口请求
  async choseCouponApi(page) {
    let data = {
      page: page || 1,
      couponReceiveWay: 0,
      clientId: channelTypeMap[this.props.channelType]
    }
    const res = await choseCoupon(data)
    this.setState({
      listData: res.data.rows,
      sourcePage: {
        current: res.data.current,
        pageSize: res.data.pageSize,
        total: res.data.total
      }
    })
  }

  couponChoice(record) {
    let data = {
      id: record.stockId,
      value: record.couponName
    }
    this.props.alterData(data)
    this.setState({
      visible: false
    })
    message.success('优惠券设置完成')
  }

  empty(e) {
    this.props.alterData('')
    e.stopPropagation()
  }

  showModal = () => {
    this.choseCouponApi()
    this.setState({
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <div className={Css['coupon-select-box']}>
        <div
          style={{
            width: this.props.width ? `${this.props.width}px` : '238px'
          }}
          className={Css['selectInput']}
          onClick={this.showModal}
        >
          {this.props.itemData && this.props.itemData.value
            ? this.props.itemData.value
            : '请选择要跳转的内容'}
          {this.props.itemData && this.props.itemData.value ? (
            <img
              onClick={this.empty.bind(this)}
              className={Css['slesctImg']}
              src="https://img.kxll.com/admin_manage/del-icon.png"
            />
          ) : null}
        </div>
        <Modal
          title="优惠券选择"
          width={'674px'}
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请选择要跳转的优惠券</p>
          <Table
            ellipsis
            rowKey={(record) => record.stockId}
            dataSource={this.state.listData}
            pagination={{
              current: this.state.sourcePage.current,
              pageSize: this.state.sourcePage.pageSize,
              total: this.state.sourcePage.total,
              onChange: (page) => this.choseCouponApi(page)
            }}
          >
            <Column align="center" title="优惠券ID" dataIndex="stockId" />
            <Column align="center" title="优惠劵名称" dataIndex="couponName" />
            <Column
              align="center"
              title="操作"
              render={(record) => (
                <div
                  className={Css['bule-text']}
                  onClick={this.couponChoice.bind(this, record)}
                >
                  选择
                </div>
              )}
            />
          </Table>
        </Modal>
      </div>
    )
  }
}

export default CouponSelect
