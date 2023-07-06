import React, { Component } from 'react'
import { withRouter } from '@/utils/compatible'
import Css from './PrintList.module.scss'
import { Button } from "antd";
import { Breadcrumb, Pagination } from 'antd'
import Panel from '@/components/Panel';

import { printOrder } from '@/services/order'

class PrintList extends Component {
	constructor() {
		super();
		this.state = {
			orderid: '',
			listData: [
			],
			// 分页相关
			page: {
				current: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},
			receiptInfo: {
				orderList: []
			}
		}
	}

	componentDidMount() {
		this.getOrderList()
	}

	async getOrderList() {
		const data = await orderList({ page: 1 })
		if (data.data) {
			data.data.rows = data.data.rows || []
			this.setState({
				listData: data.data.rows,
				page: {
					current: data.data.current,
					pageSize: data.data.pageSize,
					total: data.data.total,
				},
			}, () => {
			})
		}
	}
	async changePage(page) {
		const data = await orderList({ page: page })
		if (data.data) {
			data.data.rows = data.data.rows || []
			this.setState({
				listData: data.data.rows,
				page: {
					current: data.data.current,
					pageSize: data.data.pageSize,
					total: data.data.total,
				},
			}, () => {
			})
		}
	}

	async Print(orderid) {
		const data = await printOrder({ bizOrderId: orderid });
		if (data.data) {
			data.data.orderList = data.data.orderList || []
			this.setState({
				receiptInfo: data.data,
			}, () => {
				var el = document.getElementById('printArea');
				var iframe = document.createElement('IFRAME');
				var doc = null;
				iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
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
				if (navigator.userAgent.indexOf("MSIE") > 0) {
					document.body.removeChild(iframe);
				}
			})
		}

	}

	orderid_change(e) {
		this.setState({
			orderid: e.target.value,
		})
	}

	render() {
		let orderListItem = this.state.receiptInfo.orderList.map((data, index) =>
			<tr key={index}>
				<td>{data.itemName}</td>
				<td>{data.quantity}</td>
				<td>{(data.price) / 100}</td>
			</tr>
		)
		return (
			<Panel title="小票打印">
				<div className={Css["PrintPage"]}>
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
								<label>订单备注：{this.state.receiptInfo.buyerMessage}</label>
							</div>
							<span>**************************</span>
							<div className="section3">
								<label>订单编号：{this.state.receiptInfo.orderNo}</label>
								<label>下单时间：{this.state.receiptInfo.createOrderTime}</label>
								<label>商家电话：{this.state.receiptInfo.storePhone}</label>
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
										<tbody>
											{orderListItem}
										</tbody>
									</table>
								</div>
								<div className="other_fee">
									{/* <div className="canh"> */}
									<div className="peis">
										<label className="left">配送费</label>
										<label className="right">{(this.state.receiptInfo.freightAmount) / 100}</label>
										<div className="clearfix"></div>
									</div>
									<div className="manj">
										<label className="left">立减优惠</label>
										<label className="right">{((this.state.receiptInfo.freightAmount + this.state.receiptInfo.totalAmount - this.state.receiptInfo.actualAmount)) / 100}</label>
										<div className="clearfix"></div>
									</div>
								</div>
								<div className="total">
									<label className="left">总计</label>
									<label className="right">{(this.state.receiptInfo.actualAmount) / 100}</label>
									<div className="clearfix"></div>
								</div>
								<div className="style3">
									<label>顾客已付款</label>
								</div>
								<span>**************************</span>
							</div>
							<div className="section5">
								<label>姓名：{this.state.receiptInfo.receiveName}</label>
								<label>地址：{this.state.receiptInfo.receiveAddress}</label>
								<label>电话：{this.state.receiptInfo.receivePhone}</label>
							</div>
							<span>**************************</span>
						</div>
					</div>
					
					<div className={Css["message-box"]}>
						<div style={{ cursor: 'pointer' }} className={Css["message-title"] + ' ly-flex'}>
							<div className={Css["card-card-title"]}>订单编号</div>
							<div className={Css["card-card-operation"]}>操作</div>
						</div>
						{
							this.state.listData.map((item, index) => {
								return <div style={{ cursor: 'pointer' }} className={Css["message-card"] + ' ly-flex'} key={index}>
									<div className={Css["card-card-title"]}>{item.bizOrderId}</div>
									<Button onClick={this.Print.bind(this, item.bizOrderId)}>打印</Button>
								</div>
							})
						}
						<Pagination
							className="ly-flex ly-flex-just-end"
							style={{ marginTop: "32px", paddingBottom: '40px' }}
							defaultCurrent={1}
							total={this.state.page.total}
							current={this.state.page.current}
							pageSize={this.state.page.pageSize}
							onChange={(page) => {
								this.changePage(page)
							}}
						></Pagination>
					</div>
				</div>
			</Panel>
		)
	}
}

export default withRouter(PrintList)
