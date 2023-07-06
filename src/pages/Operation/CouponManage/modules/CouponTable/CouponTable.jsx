import React, { Component } from "react";
import Css from "./CouponTable.module.scss";
import { history } from '@umijs/max';
import { Button, Select, Input, Table, Radio, Modal, message } from "antd";
import AddCouponBox from "@/components/AddCouponBox/AddCouponBox";
import { couponList, continueC, deleteCoupon } from "@/services/coupon";
import { showBut } from '@/utils/utils'

const { Option } = Select;
const { Column } = Table;
const { confirm } = Modal;
class CouponTable extends Component {
	state = {
		defaultValue: "",
		current: 1,
		tableData: {
			current: 0,
			pageSize: 0,
			total: 0
		},
		isShowNumBox: false,
		selectInfo: {},
		searchForm: {
			state: "",
			couponType: "",
			keyWord: "",
			page: 1,
			couponReceiveWay: ""
		},
		page: {
			current: 1,
			pageSize: 10,
			total: 100,
			pages: 5
		}
	};

	componentWillMount() {
		this.getData();
	}
	async getData() {
		const info = await couponList(this.state.searchForm);
		if (info) {
			this.setState({
				tableData: info.data
			});
		}
	}
	// 选择优惠券状态
	selectState(e) {
		this.setState(
			{
				searchForm: {
					...this.state.searchForm,
					state: e.target.value
				}
			},
			() => {
				this.getData();
			}
		);
	}

	// 选择派劵方式
	selectReceive(e) {
		this.setState({
			searchForm: {
				...this.state.searchForm,
				couponReceiveWay: e
			}
		})
	}

	// 选择优惠券类型
	selectCoupon(e) {
		this.setState({
			searchForm: {
				...this.state.searchForm,
				couponType: e
			}
		});
	}

	// 输入关键字
	serachInputChange(e) {
		this.setState({
			searchForm: {
				...this.state.searchForm,
				keyWord: e.target.value
			}
		});
	}

	search() {
		this.getData();
	}

	/**
	 *  分页
	 */
	PaginationChange(e) {
		this.setState(
			{
				searchForm: {
					...this.state.searchForm,
					page: e
				}
			},
			() => {
				this.getData();
			}
		);
	}

	/**
	 *  操作 0 待发布  1 发放中 2 已暂停 3 已结束
	 */
	actionGroup(e) {
		let actionButton = "";
		switch (e.state) {
			case 0:
				actionButton = (
  <div className={Css["actionBox"]}>
    { showBut('couponManage', 'coupon_manage_edit') && <span onClick={this.actionEdit.bind(this, e)}>编辑</span> }
    { showBut('couponManage', 'coupon_manage_del') && <span onClick={this.actionDel.bind(this, e)}>删除</span> }
  </div>
				);
				break;
			case 1:
				actionButton = (
  <div className={Css["actionBox"]}>
    { showBut('couponManage', 'coupon_manage_detail') && <span onClick={this.actionDetail.bind(this, e)}>详情</span> }
    { showBut('couponManage', 'coupon_manage_edit') && <span onClick={this.actionEdit.bind(this, e)}>编辑</span> }
    { showBut('couponManage', 'coupon_manage_add') && <span onClick={this.actionAdd.bind(this, e)}>增加</span> }
  </div>
				);
				break;
			case 2:
				actionButton = (
  <div className={Css["actionBox"]}>
    { showBut('couponManage', 'coupon_manage_detail') && <span onClick={this.actionDetail.bind(this, e)}>详情</span> }
    { showBut('couponManage', 'coupon_manage_edit') && <span onClick={this.actionEdit.bind(this, e)}>编辑</span> }
    { showBut('couponManage', 'coupon_manage_continue') && <span onClick={this.actionNext.bind(this, e)}>继续</span> }
  </div>
				);
				break;
			default:
				actionButton = (
  <div className={Css["actionBox"]}>
    { showBut('couponManage', 'coupon_manage_detail') && <span onClick={this.actionDetail.bind(this, e)}>详情</span> }
  </div>
				);
				break;
		}
		return actionButton;
	}

	/**
	 * 详情
	 */
	actionDetail(e) {
		// history.push({ pathname: "/operation/couponDetail", state: { id: e.stockId } })
		history.push( "/operation/couponDetail",{ id: e.stockId })
	}

	/**
	 *  编辑
	 */
	actionEdit(e) {
		console.log("编辑", e);
		if (e.state === 0) {
			// history.push({ pathname: "/operation/addCoupon/addMallCoupon", state: { id: e.stockId } })
			history.push("/operation/addCoupon/addMallCoupon",{ id: e.stockId })
		} else {
			// history.push({ pathname: "/operation/addCoupon/editMallCoupon", state: { id: e.stockId } })
			history.push("/operation/addCoupon/editMallCoupon",{ id: e.stockId })
		}
	}

	/**
	 *  删除
	 */
	actionDel(e) {
		const self = this;
		confirm({
			title: "确认删除？",
			content: "删除后优惠券信息不可恢复，是否确认删除",
			async onOk() {
				const info = await deleteCoupon({ stockId: e.stockId });
				if (info) {
					message.success("删除成功");
					self.getData();
				}
			},
			onCancel() { }
		});
	}

	/**
	 *  增加数量
	 */
	async actionAdd(e) {
		this.setState({
			selectInfo: e,
			isShowNumBox: true
		});
	}

	// 关闭增加数量弹框
	NumCallBack() {
		this.getData();
		this.setState({
			isShowNumBox: false
		});
	}

	/**
	 *  继续
	 */
	actionNext(e) {
		const self = this;
		confirm({
			title: "确认继续发放？",
			content: "继续发放，优惠券可继续被领取",
			async onOk() {
				const info = await continueC({ stockId: e.stockId });
				if (info) {
					self.getData();
				}
			},
			onCancel() { }
		});
	}

	/**
	 *  过滤状态 0 待发布  1 发放中 2 已暂停 3 已结束
	 */
	filterStatus(e) {
		let color = "";
		let text = "";
		switch (e) {
			case 0:
				color = "orange";
				text = "待发布";
				break;
			case 1:
				color = "green";
				text = "发放中";
				break;
			case 2:
				color = "red";
				text = "暂停";
				break;
			case 3:
				color = "light";
				text = "已结束";
				break;
			default:
				break;
		}
		return <span className={Css[color]}>{text}</span>;
	}

	render() {
		const { tableData } = this.state;
		return (
  <div className={Css["CouponTable"]}>
    <div className={Css["ButtonBox"]}>
      <Radio.Group onChange={this.selectState.bind(this)} defaultValue={this.state.searchForm.state} className={Css["left"]}>
        <Radio.Button value="">全部</Radio.Button>
        <Radio.Button value="1">发放中</Radio.Button>
        <Radio.Button value="2">已暂停</Radio.Button>
        <Radio.Button value="0">待发放</Radio.Button>
        <Radio.Button value="3">已结束</Radio.Button>
      </Radio.Group>
      <div className={Css["right"]}>
        <Select style={{ width: 126, marginRight: 8 }} defaultValue={this.state.searchForm.couponReceiveWay} onChange={this.selectReceive.bind(this)}>
          <Option value="">全部派劵方式</Option>
          <Option value="0">直接领取</Option>
          <Option value="1">活动领取</Option>
        </Select>
        <Select style={{ width: 126, marginRight: 8 }} className={Css["headerSelect"]} defaultValue={this.state.searchForm.couponType} onChange={this.selectCoupon.bind(this)}>
          <Option value="">全部类型</Option>
          <Option value="NORMAL">代金券</Option>
          <Option value="DISCOUNT">折扣券</Option>
        </Select>
        <Input style={{ width: 170, marginRight: 8 }} type="text" value={this.state.searchForm.keyWord} className={Css["headerInput"]} onChange={this.serachInputChange.bind(this)} placeholder="优惠券名称/券ID" />
        <Button className={Css["headerSearch"]} type="primary" onClick={this.search.bind(this)}>
          搜索
        </Button>
      </div>
    </div>
    <div className={Css["tableBox"]}>
      <Table
        className={Css["tableDetail"]}
        pagination={{
							current: tableData.current,
							pageSize: tableData.pageSize,
							total: tableData.total,
							onChange: this.PaginationChange.bind(this)
						}}
        dataSource={tableData.rows}
      >
        <Column align="center" title="券名称" dataIndex="couponName" key="couponName" />
        <Column align="center" title="券备注" dataIndex="comment" key="comment" />
        <Column align="center" title="券ID" dataIndex="stockId" key="stockId" />
        <Column align="center" title="券类型" dataIndex="couponType" key="couponType" render={res => (res == "NORMAL" ? "代金券" : "折扣券")} />
        <Column align="center" title="总数" dataIndex="maxQuantity" key="maxQuantity" />
        <Column align="center" title="已领取" dataIndex="receivedQuantity" key="receivedQuantity" />
        <Column title="状态" dataIndex="state" key="state" align="center" render={this.filterStatus.bind(this)} />
        <Column align="center" title="操作" className={Css["actionGroup"]} render={this.actionGroup.bind(this)} />
      </Table>
    </div>
    {/* 增加数量弹窗 */}
    <AddCouponBox maxQuantity={this.state.selectInfo.maxQuantity} stockId={this.state.selectInfo.stockId} NumCallBack={this.NumCallBack.bind(this)} isShow={this.state.isShowNumBox} />
  </div>
		);
	}
}

export default CouponTable;
