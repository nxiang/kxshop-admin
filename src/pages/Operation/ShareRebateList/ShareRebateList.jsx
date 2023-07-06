import React, { Component } from "react";
import { withRouter } from '@/utils/compatible'
import Css from "./ShareRebateList.module.scss";
import { Breadcrumb, Button, Tabs, Modal } from "antd";
import Panel from '@/components/Panel';
import BrokerageAudit from "./modules/BrokerageAudit/BrokerageAudit";
import RebateOrder from "./modules/RebateOrder/RebateOrder";
import RebateConfig from "./modules/RebateConfig/RebateConfig";
const { TabPane } = Tabs;

class ShareRebateList extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	componentDidMount() {

	}
	render() {
		return (
			<Panel title="店铺信息" content="设置店铺基础信息">
				<div className={Css.ShareRebateBox}>
					<div className={Css.tableBox}>
						<div>
							<Tabs defaultActiveKey="brokerageAudit" animated={false} >
								<TabPane tab="佣金审核" key="brokerageAudit">
									<BrokerageAudit />
								</TabPane>
								<TabPane tab="返佣订单明细" key="rebateOrder">
									<RebateOrder />
								</TabPane>
								<TabPane tab="返佣设置" key="RebateConfig">
									<RebateConfig />
								</TabPane>
							</Tabs>
						</div>
					</div>
				</div>
			</Panel>
		);
	}
}

export default withRouter(ShareRebateList)
