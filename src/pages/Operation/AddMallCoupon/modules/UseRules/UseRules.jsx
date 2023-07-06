import React, { Component } from "react";
import Css from "./UseRules.module.scss";
import { history } from '@umijs/max';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Checkbox, Radio, DatePicker, InputNumber, Modal, Button, Row, Col } from "antd";
import AddProduct from "../AddProduct/AddProduct";
import { clientList } from "@/services/coupon";
import { withRouter } from '@/utils/compatible'

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

class UseRules extends Component {
	state = {
		hasMinimum: false,
		visible: false,
		totalDataSource: [],
		couponAvailableClients: [
			{ label: "支付宝", value: 1 },
			{ label: "微信", value: 2 }
		],
		isShowAdd: false // 是否展示添加商品弹窗
	};

	componentWillMount() {
		this.init();
	}
	//初始化可用渠道
	async init() {
		const info = await clientList();
		if (info && info.data.length > 0) {
			const newlist = [];
			info.data.filter(val => {
				const { clientName: label, clientId: value } = val;
				newlist.push({ label, value });
			});
			this.setState({
				couponAvailableClients: newlist
			});
		} else {
			this.setState({
				visible: true
			});
		}
	}

	checkBoxChange = e => {
		if (e.target.checked) {
			this.props.props.form.setFieldsValue({
				transactionMinimum: 0
			});
		}

		this.setState(
			{
				hasMinimum: e.target.checked
			},
			() => {
				this.props.props.form.validateFields(["transactionMinimum"], { force: true }, () => {
					console.log("ok");
				});
			}
		);
	};

	/**
	 *  编辑可用商品
	 */
	editUseProduct() {
		console.log("编辑可用商品");
		this.setState({
			isShowAdd: true
		});
	}

	/**
	 *  新增取消按钮回调
	 */
	cancelCallBack() {
		this.setState({
			isShowAdd: false
		});
	}

	/**
	 *  增加商品回调
	 */
	addProductCallBack(e, d) {
		console.log(e);
		this.setState({
			isShowAdd: false,
			totalDataSource: d
		});
		this.props.props.form.setFieldsValue({ useProductList: e });
	}

	goback() {
		history.push("/operation/couponManage")
	}

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.props.form;
		return (
			<div className={Css["UseRules"]}>
				<Modal title="提示" visible={this.state.visible} okText="知道了" onOk={this.goback.bind(this)} onCancel={this.goback.bind(this)}>
					<p>暂无可用渠道，无法创建优惠券</p>
				</Modal>
				<div className={Css["title"]}>使用限制</div>
				<Form.Item label="最低消费金额">
							{getFieldDecorator("transactionMinimum", {
								rules: [
									{
										required: !this.state.hasMinimum,
										message: "请输入最低消费金额"
									}
								]
							})(<InputNumber style={{ width: 250 }} disabled={this.state.hasMinimum} className={Css["checkBoxInput"]} placeholder="满足优惠券使用条件订单总金额" />)}
							
							<Checkbox className={Css["checkBox"]} checked={this.state.hasMinimum} onChange={this.checkBoxChange}>
								无门槛券
							</Checkbox>
				</Form.Item>
				<Form.Item className={Css["timeRadioBox"]} required label="使用时间">
					{getFieldDecorator("isFixedTime", {
						initialValue: getFieldValue("isFixedTime") || true,
						rules: [
							{
								required: true,
								message: "请选择使用时间类型"
							}
						]
					})(
						<Radio.Group className={Css["timeRadio"]}>
							<Radio value={true}>指定日期范围</Radio>
							<Radio value={false}>领取后指定期限</Radio>
						</Radio.Group>
					)}
				</Form.Item>

				{getFieldValue("isFixedTime") ? (
					<Form.Item wrapperCol={{ offset: 3 }}>
						{getFieldDecorator("availableTime", {
							rules: [
								{
									required: true,
									message: "请选择正确的时间范围"
								}
							]
						})(<RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />)}
					</Form.Item>
				) : (
					<div style={{ display: "flex", marginLeft: "12.5%" }}>
						<Form.Item style={{ width: 260 }}>
							<span>领取后 </span>
							{getFieldDecorator("receiveTime", {
								rules: [
									{
										required: true,
										message: "请选择正确的时间范围"
									}
								]
							})(<InputNumber min={0} max={365} step={1} style={{ width: 147 }} placeholder="填写0表示立即生效" />)}
							<span> 天生效</span>
						</Form.Item>
						<Form.Item>
							{getFieldDecorator("effectiveTime", {
								rules: [
									{
										required: true,
										message: "请选择正确的时间范围"
									}
								]
							})(<InputNumber min={0} max={365} step={1} style={{ width: 108 }} placeholder="填写有效天数" />)}
							<span> 内有效</span>
						</Form.Item>
					</div>
				)}

				{/* <Form.Item label="可使用商品" className={Css["useProductBox"]}>
					{getFieldDecorator(
						"useProductList",
						{}
					)(
						getFieldValue("useProductList") && getFieldValue("useProductList").length > 0 ? (
							<div>
								<span>已添加</span>
								<span className={Css["red"]}>{getFieldValue("useProductList").length}</span>
								<span>件商品</span>
							</div>
						) : (
							<span>全部商品可用</span>
						)
					)}
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 3 }} className={Css["editButton"]}>
					<Button onClick={this.editUseProduct.bind(this)}>编辑可用商品</Button>
					<div className={Css["tips"]}>不添加即不限制商品</div>
				</Form.Item> */}

				<Form.Item required label="可用渠道">
					{getFieldDecorator("couponAvailableClients", {
						rules: [
							{
								required: true,
								message: "请至少选择一项"
							}
						],
						initialValue: [1, 2]
					})(<CheckboxGroup style={{ width: 200, height: 38 }} className={Css["availableItems"]} options={this.state.couponAvailableClients} />)}
				</Form.Item>
				{this.state.isShowAdd ? (
					<AddProduct
						addProductCallBack={this.addProductCallBack.bind(this)}
						useProductList={getFieldValue("useProductList") || []}
						totalDataSource={this.state.totalDataSource}
						cancelCallBack={this.cancelCallBack.bind(this)}
						stockId={this.props.stockId}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}

export default withRouter(Form.create()(UseRules));
