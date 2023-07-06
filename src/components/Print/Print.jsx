import React, { Component } from 'react';
import Css from './Print.module.scss';
import { Button } from 'antd';
import { printOrder } from '@/services/order';

class Print extends Component {
  constructor() {
    super();
    this.state = {
      orderid: '',
      receiptInfo: {
        orderList: [],
      },
    };
  }

  async print(orderid) {
    const data = await printOrder({ bizOrderId: orderid });
    if (data.data) {
      data.data.orderList = data.data.orderList || [];
      this.setState(
        {
          receiptInfo: data.data,
        },
        () => {
          var el = document.getElementById('printArea');
          var iframe = document.createElement('IFRAME');
          var doc = null;
          iframe.setAttribute(
            'style',
            'position:absolute;width:0px;height:0px;left:-500px;top:-500px;'
          );
          document.body.appendChild(iframe);
          doc = iframe.contentWindow.document;
          doc.write(`<style>
                *{padding:0;margin: 0;font-size: 16px;}
                h1{font-size: 20px;}
                h3{font-size: 16px;}
                .left{
                    float: left;
                }
                .right{
                    float:right;
                }
                .clearfix{
                    clear: both;
                }
                ul{list-style: none;}
                .printContainer{
                    padding: 20px;
                    width: 188px;
                    box-sizing: content-box;
                }
                .section1{
                }
                .section2 label{
                    display: block;
                }
                .section3 label{
                    display: block;
                }
                .section4{
                }
                .section4 .total label{
                    display: block;
                }
                .section4 .other_fee{
                    border-bottom: 1px solid #DADADA;
                }
                .section5 label{
                    display: block;
                }
                .style1{
                    border-bottom: 1px solid #DADADA;
                }
                .style2{
                    width: 100%;
                }
                .style3{
                    text-align: right;
                }
                </style>`);

          doc.write('<div>' + el.innerHTML + '</div>');
          doc.close();
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          if (navigator.userAgent.indexOf('MSIE') > 0) {
            document.body.removeChild(iframe);
          }
        }
      );
    }
  }

  render() {
    let orderListItem = this.state.receiptInfo.orderList.map((data, index) => (
      <tr key={index}>
        <td>{data.itemName}</td>
        <td>{data.quantity}</td>
        <td>{data.price / 100}</td>
      </tr>
    ));
    const { receiptInfo } = this.state
    return (
      <div className={Css['PrintPage']}>
        <div id="printArea" style={{ position: 'fixed', left: '-1500px' }}>
          <div className="printContainer">
            <h1>给顾客专用</h1>
            <span>**************************</span>
            <div className="section1">
              <h3>{this.state.receiptInfo.storeName}</h3>
              <h3>即时配送</h3>
            </div>
            <span>**************************</span>
            <div className="section2">
              <label>订单备注：{receiptInfo.buyerMessage}</label>
            </div>
            <span>**************************</span>
            <div className="section3">
              <label>订单编号：{receiptInfo.orderNo}</label>
              <label>下单时间：{receiptInfo.createOrderTime}</label>
              <label>商家电话：{receiptInfo.storePhone}</label>
            </div>
            <span>**************************</span>
            <div className="section4">
              <div className="style1">
                <table className="style2">
                  <thead>
                    <tr>
                      <td width="60%">商品名称</td>
                      <td width="20%">数量</td>
                      <td width="20%">金额</td>
                    </tr>
                  </thead>
                  <tbody>{orderListItem}</tbody>
                </table>
              </div>
              <div className="other_fee">
                {/* <div className="canh"> */}
                <div className="peis">
                  <label className="left">配送费</label>
                  <label className="right">{receiptInfo.freightAmount && (receiptInfo.freightAmount / 100)}</label>
                  <div className="clearfix" />
                </div>
                <div className="manj">
                  <label className="left">立减优惠</label>
                  <label className="right">
                    {(receiptInfo.freightAmount && (receiptInfo.freightAmount +
                      receiptInfo.totalAmount -
                      receiptInfo.actualAmount) /
                      100)}
                  </label>
                  <div className="clearfix" />
                </div>
              </div>
              <div className="total">
                <label className="left">总计</label>
                <label className="right">{receiptInfo.actualAmount && (receiptInfo.actualAmount / 100)}</label>
                <div className="clearfix" />
              </div>
              <div className="style3">
                <label>顾客已付款</label>
              </div>
              <span>**************************</span>
            </div>
            <div className="section5">
              <label>姓名：{receiptInfo.receiveName}</label>
              <label>地址：{receiptInfo.receiveAddress}</label>
              <label>电话：{receiptInfo.receivePhone}</label>
            </div>
            <span>**************************</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Print;
