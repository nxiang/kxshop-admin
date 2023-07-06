import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from "./EditMallCoupon.module.scss";
import Panel from '@/components/Panel';
import ProductList from "@/components/ProductList/ProductList";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Breadcrumb,
    Input,
    Button,
    DatePicker,
    Radio,
    InputNumber,
    message,
    Checkbox,
} from "antd";
import moment from "moment";
import { editCoupon, detail } from "@/services/coupon";
const { TextArea } = Input;
const { RangePicker } = DatePicker;
class EditMallCoupon extends Component {
	constructor() {
		super();
		this.state = {
			couponSendRule: [
				{
					name: "直接领取",
					value: 0
				},
				{
					name: "活动领取",
					value: 1
				}
			],
			couponInfo: {},
			isShowProduct: false // 是否展示商品详情
		};
	}

	componentWillMount() {
		this.getData();
	}
	async getData() {
		const info = await detail({ stockId: this.props.location.state.id });
		this.setState({
			couponInfo: info.data
		});
	}
	/**
	 *  查看详情
	 */
	goDetail() {
		this.setState({
			isShowProduct: true
		});
	}
	productCancelCallBack() {
		this.setState({
			isShowProduct: false
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			console.log(values);
			if (err) {
				return false;
			}
			let data = {
				stockId: this.props.location.state.id,
				comment: values["comment"],
				instructions: values["instructions"],
				availableBeginTime: values["availableBeginTime"][0].format("YYYY-MM-DD HH:mm:ss"),
				availableEndTime: values["availableBeginTime"][1].format("YYYY-MM-DD HH:mm:ss"),
				maxQuantity: this.state.couponInfo.couponSendRule.maxQuantity,
				addQuantity: 0,
				maxCouponsPerUser: values["maxCouponsPerUser"]
			};

			const info = await editCoupon(data);
			if (info) {
				message.success("修改成功");
				history.push("/operation/couponManage")
			}
		});
	}
	goBack() {
		history.push("/operation/couponManage")
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const data = this.state.couponInfo;
		const { couponUseRule } = this.state.couponInfo;

		return (
			<Panel title="编辑优惠券" content="配置优惠券信息">
				<div className={Css["EditCoupon"]}>
					<Form labelCol={{ span: 3 }}>
						<div className={Css["CouponBase"]}>
							<div className={Css["title"]}>优惠基本信息配置</div>
							<Form.Item required label="名称">
								<Input disabled value={data.couponName} />
							</Form.Item>
							<Form.Item required label="类型">
								<Input disabled value={data.couponType == "NORMAL" ? "满减券" : "折扣券"} />
							</Form.Item>
							<Form.Item required label="券数量">
								<Input placeholder="请输入券数量" disabled value={data.stockQuantity} />
							</Form.Item>

							<Form.Item label="使用须知">
								{getFieldDecorator("instructions", { initialValue: data.instructions })(
									<TextArea placeholder="请输入文本说明，最多300字，可换行" maxLength={300} style={{ width: 468, height: 88 }}></TextArea>
								)}
							</Form.Item>
						</div>

						<div className={Css["UseRules"]}>
							<div className={Css["title"]}>使用限制</div>
							<Form.Item required label="最低消费金额">
								<Input style={{width: 460}} placeholder="请输入最低消费金额" disabled value={data.discountCoupon || data.discountCoupon || 0} />
							</Form.Item>
							{couponUseRule && (
								<Form.Item className={Css["timeRadioBox"]} required label="使用时间">
									<Radio.Group className={Css["timeRadio"]} value={couponUseRule.couponAvailableTime.isFixedTime}>
										<Radio value={true} disabled>
											指定日期范围
									</Radio>
										<Radio value={false} disabled>
											领取后指定期限
									</Radio>
									</Radio.Group>
								</Form.Item>
							)}

							{couponUseRule && couponUseRule.couponAvailableTime.isFixedTime ? (
								<Form.Item className={Css["datePicker"]}>
									<Input style={{ width: 350 }} disabled value={couponUseRule.couponAvailableTime.availableBeginTime + " 至 " + couponUseRule.couponAvailableTime.availableEndTime} />
								</Form.Item>
							) : (
									""
								)}
							{couponUseRule && !couponUseRule.couponAvailableTime.isFixedTime ? (
								<div className={Css["afterReceiveBox"]}>
									<Form.Item className={Css["dataInput"]}>
										<div>
											<span>领取后 </span>
											<InputNumber disabled value={couponUseRule.couponAvailableTime.daysAvailableAfterReceive} step={1} style={{ width: 147 }} placeholder="填写0表示立即生效" />
											<span> 天生效</span>
										</div>
									</Form.Item>
									<Form.Item>
										<div>
											<InputNumber disabled value={couponUseRule.couponAvailableTime.availableDays} step={1} style={{ width: 108 }} placeholder="填写有效天数" />
											<span> 内有效</span>
										</div>
									</Form.Item>
								</div>
							) : (
									""
								)}

							{couponUseRule && (
								<Form.Item required label="可使用商品">
									{couponUseRule.availableItems.length == 0 ? (
										<span>全部商品可用</span>
									) : (
											<div>
												<span>已添加</span>
												<span className={Css["red"]}>{couponUseRule.availableItems.length}</span>
												<span>件商品</span>
												<button className={Css["blueButton"]} onClick={this.goDetail.bind(this)}>
													查看详情
										</button>
											</div>
										)}
								</Form.Item>
							)}

							{couponUseRule && (
								<Form.Item required label="可用渠道">
									<Checkbox defaultChecked={couponUseRule.couponAvailableClients.includes(1)} disabled>
										支付宝小程序
								</Checkbox>
									<Checkbox defaultChecked={couponUseRule.couponAvailableClients.includes(2)} disabled>
										微信小程序
								</Checkbox>
								</Form.Item>
							)}
						</div>

						{/*GetCoupon*/}
						<div className={Css["GetCoupon"]}>
							<div className={Css["title"]}>优惠券领券</div>
							<Form.Item required label="可领取时间">
								{getFieldDecorator("availableBeginTime", {
									rules: [
										{
											required: true,
											message: "请输入可领取时间"
										}
									],
									initialValue: [moment(data.availableBeginTime, "YYYY-MM-DD hh:mm:ss"), moment(data.availableEndTime, "YYYY-MM-DD hh:mm:ss")]
								})(<RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />)}
							</Form.Item>
							<Form.Item className={Css["useBox"]} required label="派券方式">
								{data.couponSendRule && (
									<Radio.Group disabled defaultValue={data.couponSendRule.couponReceiveWay} className={Css["RadioBox"]}>
										{this.state.couponSendRule.map((item, index) => {
											return (
												<Radio key={index} value={item.value}>
													{item.name}
												</Radio>
											);
										})}
									</Radio.Group>
								)}
							</Form.Item>
							{data.couponSendRule && (
								<Form.Item className={Css["checkBoxLeft"]} required label="每人限领张数">
									{getFieldDecorator("maxCouponsPerUser", {
										rules: [
											{
												required: true,
												message: "请输入优惠券每人限领数量"
											}
										],
										initialValue: data.couponSendRule.maxCouponsPerUser
									})(<InputNumber style={{ width: 297 }} min={0} max={999} step={1} className={Css["checkBoxInput"]} placeholder="可领取优惠券数量" />)}
								</Form.Item>
							)}
							<Form.Item className={Css["submitRow"]}>
								<Button type="primary" onClick={this.handleSubmit.bind(this)}>
									保存修改
							</Button>
								<Button onClick={this.goBack.bind(this)}>取消</Button>
							</Form.Item>
						</div>
					</Form>
					{this.state.isShowProduct ? <ProductList stockId={this.props.location.state.id} productCancelCallBack={this.productCancelCallBack.bind(this)}></ProductList> : ""}
				</div>
			</Panel>
		);
	}
}

export default withRouter(Form.create()(EditMallCoupon));
