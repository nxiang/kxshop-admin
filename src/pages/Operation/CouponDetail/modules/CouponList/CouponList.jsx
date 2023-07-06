import React, { Component } from "react";
import { Select, Input, Button, Table } from "antd";
import Css from "./CouponList.module.scss";
import { couponUse, exportC } from "@/services/coupon";
import { showBut } from '@/utils/utils'
const { Option } = Select;
const { Column } = Table;

class CouponList extends Component {
	state = {
		current: 1,
		searchData: {
			stockId: "",
			keyWord: "",
			page: 1,
			state: ""
		},
		page: {
			current: 1,
			pageSize: 10,
			total: 100,
			pages: 5
		},
		tableData: {}
	};

	async componentWillMount() {
		this.setState(
			{
				searchData: { ...this.state.searchData, ...{ stockId: this.props.stockId } }
			},
			() => {
				this.getData();
			}
		);
	}

	async getData() {
		const info = await couponUse(this.state.searchData);
		if (info) {
			this.setState({
				tableData: info.data
			});
		}
	}

	onChange = page => {
		console.log(page);
		this.setState({
			current: page
		});
	};

	selectChange(e) {
		this.setState({
			searchData: { ...this.state.searchData, ...{ state: e } }
		});
	}

	/**
	 * 过滤状态
	 */
	filterState(e) {
		let text = "";
		let color = "dark";
		switch (e) {
			case 0:
				text = "未核销";
				color = "dark";
				break;
			case 1:
				text = "已锁定";
				color = "dark";
				break;
			case 2:
				text = "已使用";
				color = "green";
				break;
			case 3:
				text = "已过期";
				color = "light";
				break;
			default:
				break;
		}
		return <span className={Css[color]}>{text}</span>;
	}

	/**
	 *  用户姓名输入框
	 */
	serachInputChange(e) {
		this.setState({
			searchData: { ...this.state.searchData, ...{ keyWord: e.target.value } }
		});
	}

	/**
	 *  分页
	 */
	PaginationChange(e) {
		this.setState(
			{
				searchData: { ...this.state.searchData, ...{ page: e } }
			},
			() => {
				this.getData();
			}
		);
	}

	/**
	 *  导出
	 */
	async outDetail() {
		const data = await exportC(this.state.searchData);
		let link = document.createElement("a");
		link.href = window.URL.createObjectURL(new Blob([data]));
		link.target = "_blank";
		link.download = "data.xls";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	render() {
		return (
			<div className={Css["CouponList"]}>
				<div className={Css["title"]}>领取明细</div>
				<div className={Css["listBox"]}>
					<div className={Css["listHeader"]}>
						<Select className={Css["headerSelect"]} defaultValue="" onChange={this.selectChange.bind(this)}>
							<Option value="">全部状态</Option>
							<Option value="0">未核销</Option>
							<Option value="1">已锁定</Option>
							<Option value="2">已使用</Option>
							<Option value="3">已过期</Option>
						</Select>
						<Input type="text" value={this.state.searchData.keyWord} className={Css["headerInput"]} onChange={this.serachInputChange.bind(this)} placeholder="用户姓名/手机"></Input>
						<Button className={Css["headerSearch"]} type="primary" onClick={this.getData.bind(this)}>
							搜索
						</Button>
						{
							showBut('couponManage', 'couponManage_export') && <Button className={Css["headerOut"]} type="primary" onClick={this.outDetail.bind(this)}>导出明细</Button>
						}
					</div>
					<div className={Css["tableBox"]}>
						<Table
							className={Css["tableDetail"]}
							pagination={{
								current: this.state.tableData.current,
								total: this.state.tableData.total,
								pageSize: this.state.tableData.pageSize,
								onChange: this.PaginationChange.bind(this)
							}}
							dataSource={this.state.tableData.rows}>
							<Column title="用户ID" dataIndex="userId" key="userId"></Column>
							<Column title="用户姓名" dataIndex="userName" key="userName"></Column>
							<Column title="用户手机" dataIndex="userPhone" key="userPhone"></Column>
							<Column title="领取时间" dataIndex="gmtCreated" key="gmtCreated"></Column>
							<Column title="优惠券ID" dataIndex="couponId" key="couponId"></Column>
							<Column title="优惠券状态" dataIndex="state" key="state" render={this.filterState.bind(this)}></Column>
							<Column title="领取渠道" dataIndex="receiveClient" key="receiveClient"></Column>
							<Column title="领取方式" dataIndex="receiveMode" key="receiveMode"></Column>
							<Column title="核销渠道" dataIndex="usedClient" key="usedClient"></Column>
						</Table>
					</div>
				</div>
			</div>
		);
	}
}

export default CouponList;
