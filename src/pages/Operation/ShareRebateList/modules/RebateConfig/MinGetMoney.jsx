import React, { Component } from "react";
import { withRouter } from '@/utils/compatible'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, InputNumber } from "antd";
import { updateCommissionConfig } from "@/services/commission";

const FormItem = Form.Item;
const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

class MinGetMoney extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {}
	updateCommissionConfig(p) {
		//  设置提现金额
		updateCommissionConfig(p).then(info => {
			console.log("设置返回", info);
			if (info) {
				this.props.minMoneyOkFn();
			}
		});
	}
	resetOkFn() {
		const me = this;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			values.withdrawalMin = Number(values.withdrawalMin) * 100;
			me.updateCommissionConfig(values);
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal maskClosable={false} width={450} title="设置最低提现金额" okText="确认" visible={this.props.visible} onOk={this.resetOkFn.bind(this)} onCancel={this.props.resetCancel}>
				<Form>
					<FormItem {...formItemLayout} label="最低提现金额">
						{getFieldDecorator("withdrawalMin", {
							rules: [{ required: true, message: "请输入最低提现金额" }]
						})(<InputNumber placeholder="1.00到5000.00之间两位小数" style={{ width: 244 }} min={1.0} max={5000.0} precision={2} />)}
					</FormItem>
				</Form>
			</Modal>
		);
	}
}

export default withRouter(Form.create()(MinGetMoney));
