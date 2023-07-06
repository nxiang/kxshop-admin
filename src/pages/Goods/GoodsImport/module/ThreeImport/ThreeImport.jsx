import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from "../../Import.module.scss";
import { Breadcrumb, Spin, Steps, Form, Radio, Select, Cascader, Button, Row, Col } from "antd";
import { labelOptionList, templateList, templateDetail } from "@/services/storeLabel";
import { freightEdit, importResult } from "@/services/import";
import { classOption, sellerAttrs } from "@/services/itemClass";
const { Option } = Select;

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 16 },
  };
const tailLayout = {
	wrapperCol: { offset: 0, span: 16 },
};
class ThreeImport extends Component {
	
	constructor(props) {
		super(props);
		this.formRef = React.createRef()
		this.state = {
			importId: null,
			freightInfo: []
		};
	}
	componentDidMount() {
		this.importResult();
		this.labelOptionList();  // 类目
		this.templateList()  // 模板
		this.classOption();  //商品属性
	}
	importResult(){
	  importResult().then(res => {
		  if(res){
			this.setState({
				importId: res.data.importId
			})
		  }
	  })
	}
	classOption(){  //查询商品分类选项
		classOption().then(res => {
			if(res){
				this.sellerAttrs(res.data[0].classId);
			}
		
		})
	}
	sellerAttrs(classId){ //  获取卖家属性
		sellerAttrs({classId}).then(res => {
			if(res){
				console.log("商品属性",res.data)
				this.setState({
					deliveryTypes:  res.data.deliveryTypes[0]
				})
				this.formRef.current.setFieldsValue({ deliveryTypes: res.data.deliveryTypes[0] })
			}
		})
	}
	labelOptionList() {  // 商品类目列表
        labelOptionList().then(res => {
            if(res){
                const storeData = [];
                res.data.map(item => {
                    storeData.push({
                        value: item.storeLabelId,
                        label: item.storeLabelName,
                        isLeaf: !item.childFlag
                    })
                })
                this.setState({
                    storeData
                })
            }
        })
	}
	loadData = selectedOptions => {
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		const p = {
			storeLabelId: targetOption.value
		}
		labelOptionList(p).then( info => {
			if(info){
				targetOption.loading = false;
				targetOption.children = [];
				if(info.data){
					info.data.map(item => {
						targetOption.children.push({
							value: item.storeLabelId,
							label: item.storeLabelName,
							parentId: item.parentId,
							isLeaf: true
						})
					})
					this.setState({
						storeData: [...this.state.storeData]
					});
				}
			}
		})
    }
	templateList() {
        templateList().then(res => {
            if(res){
                this.setState({
                    freightInfo: res.data
                })
            }
        })
	}
	freightChange(value){
		if(!value){
			this.setState({
				templateInfo: null
			})
			return
		}
		const p = {
			freightId: value
        }
        this.templateDetail(p)
    }
    templateDetail(p){
        templateDetail(p).then(res => {
			if(res){
                this.setState({
                    templateInfo: res.data
                })
            }
		})
	}
	submitFn(values){
		const { importId } = this.state;
		if(values.storeLabelId && values.storeLabelId.length){
			values.storeLabelId = values.storeLabelId[values.storeLabelId.length - 1];
		}else{
			values.storeLabelId = null;
		}
		const p = {
			importId,
			storeLabelId: values.storeLabelId || null,
			delivery: {
				type: values.deliveryTypes,
				freightId: values.freightId || null
			}
		}
		freightEdit(p).then(res => {
			if(res){
				this.props.nextStep();
			}
		})
	}
	render() {
		const { freightInfo, templateInfo, storeData, deliveryTypes } = this.state;
		return (
            <div className={Css.threeBox}>
                <div className={Css.titleText}>批量为本次导入的商品指定配送方式和类目信息</div>
				<div className={Css.commonTitle}>物流信息</div>
				<Form
				    ref={this.formRef}
					{...layout}
					onFinish={this.submitFn.bind(this)}
				>
					 <Form.Item
						 name="deliveryTypes"
						 label="配送方式"
					>
						 <Radio.Group>
							 {
								 deliveryTypes == 2 ?
								 <Radio value={2}>
									即时配送
									<Link to="/order/deilvery"
										target="_blank"
										style={{paddingLeft: '15px'}}>
										配送设置
									</Link>
								</Radio> : 
								<Radio value={1}>快递物流</Radio>
							 }
						</Radio.Group>
					</Form.Item>
					{
						deliveryTypes == 1 ?
						<div>
							<Form.Item 
							rules={[{ required: true, message: '请选择快递模板' }]}
							name="freightId" label="快递模板">
								<Select 
										allowClear
										onChange={this.freightChange.bind(this)}
										style={{ width: '300px' }} 
										placeholder="请选择模板">
									{
										freightInfo && freightInfo.length ? 
										freightInfo.map(item => {
											return(
											<Option key={item.freightId} value={item.freightId}>{item.freightName}</Option>
											)
										}) : null
									}
									
								</Select>
							</Form.Item>
							<Row>
							<Col span={2}></Col>
							<Col span={16}>
							{
									templateInfo && templateInfo.freightAreaList && templateInfo.freightAreaList.map((item, index) =>{
										return(
											<div key={index} className={Css.freightBox}>
											<div>模板规则</div>
											<div>
												配送区域: {item.areaNames}
											</div>
											<div>
												续重规则:
												{
													templateInfo.calcType === 'number' ?
													<span>
														{item.firstItem}件内{item.firstPrice}元,每增加{item.nextItem}件,加{item.nextPrice}元
													</span> : null
												}
											</div>
											</div>
										)
									})
								}
								</Col>
							</Row>
						</div> : null
					}
					<div className={Css.commonTitle}>其他</div>
					<Form.Item label="店铺商品类目">
						<Form.Item noStyle  name="storeLabelId">
							<Cascader 
									allowClear={true}
									style={{width: '220px'}}
									options={storeData}
									loadData={this.loadData}
									changeOnSelect
									placeholder="请选择商品类目"
								/>
						</Form.Item>
						<Link to="/goods/classifyList"
										target="_blank"
										style={{paddingLeft: '15px'}}>
										编辑店铺类目
						</Link>
					</Form.Item>
					<Row>
						<Col span={2}></Col>
						<Col span={16}>
						用于店铺商品分类展示，可不选择，完成导入后在商品中单独编辑
						</Col>
					</Row>
					<Form.Item style={{marginTop: 40}} {...tailLayout}>
						<Button htmlType="submit" type="primary" >
						  下一步
						</Button>
					</Form.Item>
				</Form>
            </div>
		);
	}
}
export default withRouter(ThreeImport)
