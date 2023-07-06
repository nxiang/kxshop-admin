import React, { Component } from "react";
import Css from "./ProductList.module.scss";
import { Button, Table } from "antd";
import { goodsList } from "@/services/coupon";
const columns = [
	{
		title: "商品名称",
		dataIndex: "itemName"
	},
	{
		title: "商品价格",
		dataIndex: "salePrice",
		render: price => "¥" + price / 100
	},
	{
		title: "库存",
		dataIndex: "storage"
	}
];

class ProductList extends Component {
	state = {
		// searchInputValue:'',
		tableData: [],
		page: 1
	};

	async componentWillMount() {
		const info = await goodsList({ stockId: this.props.stockId, page: this.state.page });
		this.setState({
			tableData: info.data
		});
	}

	/**
	 *  搜索框输入
	 */
	// searchInputChange = (e)=> {
	//   this.setState({
	//     searchInputValue:e.target.value
	//   })
	// }

	// /**
	//  *  提交搜索
	//  */
	// searchSubmit = ()=> {
	//   console.log(this.state.searchInputValue)
	// }

	/**
	 *  关闭
	 */
	cancelButton = () => {
		console.log("关闭");
		this.props.productCancelCallBack();
	};

	render() {
		return (
			<div className={Css["ProductList"]}>
				<div className={Css["card"]}>
					<div className={Css["title"]}>已添加商品</div>
					{/* <div className={Css["searchRow"]}>
            <Input onChange={this.searchInputChange} className={Css["searchInput"]} placeholder="商品名称" />
            <Button className={Css["searchButton"]} onClick={this.searchSubmit} type="primary">搜索</Button>
          </div> */}
					<div className={Css["con"]}>
						<Table dataSource={this.state.tableData} columns={columns} pagination={false}></Table>
					</div>
					<div className={Css["buttonGroup"]}>
						<Button type="primary" onClick={this.cancelButton}>
							关闭
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default ProductList;
