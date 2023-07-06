import React, { Component } from "react";
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from "./AddStroed.module.scss";
import RuleModal from "./RuleModal";
import { Checkbox, Breadcrumb, Button, Input, Modal, Upload, message, InputNumber, Tooltip, Radio, DatePicker } from "antd";
import Panel from '@/components/Panel';
import { Form } from '@ant-design/compatible';
import { LoadingOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { newCard, cardDetail, editCard, delisting, listing, renew } from "@/services/stored";
import moment from "moment";
import { showBut } from '@/utils/utils'
import tbbb from '@/assets/images/tbbb.png'

const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } }
const { confirm } = Modal;
const FormItem = Form.Item;
const explanationText = "账户余额不可提现；<br/>余额目前仅支持在线消费使用；<br/>所有储值及消费记录请在余额明细中查看；<br/>如有储值疑问及其他问题，请直接联系商家。"
function range(start, end) {
	const result = [];
	for (let i = start; i < end; i++) {
	  result.push(i);
	}
	return result;
  }


class AddStroed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			btnLoading: false,
			neverExpired: 1,
			explanation: explanationText,
			editList: null,
			stroedStatus: null,
			explanationTextArr: ["账户余额不可提现；","余额目前仅支持在线消费使用；", "所有储值及消费记录请在余额明细中查看；","如有储值疑问及其他问题，请直接联系商家。"],  // 规则显示数组
			ruleShow: false,
			denomination: null, // 面额
			giftAmount: null,  //赠送金额
			cardName: null,  // 储值名称
			coverImage: "https://kxgshop.oss-cn-hangzhou.aliyuncs.com/goods/2020/4/2020042116221185673463.png",  // 储值卡封面
			expiredTime: null,  // 有效时间
		};
	}
	componentDidMount() {
		let cardId = this.props.match.params.cardId;
	    this.setState({
			stroedStatus: cardId === 'add' ? 1 : 0
		})
		if(cardId !== 'add'){
			this.setState({
				cardId
			}, () => {
				this.cardDetail();
			})
			
		}
	}
	cardDetail(){
		const { cardId } = this.state;
		cardDetail({cardId}).then(res => {
			if(res){
				console.log('详情',res.data)
				const explanationTextArr = res.data.explanation.split("<br/>");
				this.setState({
					giftAmount: res.data.giftAmount || res.data.giftAmount === 0 ? res.data.giftAmount / 100 : null,
					giftAmountCheck:  res.data.giftAmount || res.data.giftAmount === 0 ? true : false,
					expiredTime: !res.data.neverExpired ? res.data.expiredTime : null,
					cardName: res.data.cardName,
					denomination: res.data.denomination ? res.data.denomination / 100 : null,
					neverExpired: res.data.neverExpired,
					explanation: res.data.explanation,
					explanationTextArr,
					coverImage : res.data.coverImage,
					editList: res.data,
					stroedState: res.data.state   // 储值卡状态 ：1 出售中 2 已停售 3 已过期
				})
			}
		})
	}
	beforeUpload (file){
		const size = file.size / 1024 / 1024 < 2;
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
		if (!isJpgOrPng) {
			message.warning("仅支持jpg、png、jpeg格式");
		}
		if (!size) {
			message.warning("文件不能大于2MB");
		}
		return size && isJpgOrPng;
	}
	uploadOne(info) {
		let fileListOne = info.fileList;
		if(info.file.status === "uploading"){
			this.setState({
				bannerLoading: true
			})
		}
		if(info.file.status === "done"){
			this.setState({
				bannerLoading: false
			})
		}
		fileListOne = fileListOne.map((file) => {
		  if (file.response) {
			 file.url = file.response.data.url
		   }
		  return file;
		});
		fileListOne = fileListOne.filter((file, index) => {
			if (file.response) {
			  return file.response.success || file.status === 'done';
			}
			return true;
		});
		const coverImage = fileListOne.map((file) =>{ //商品图片
			return (file.response && file.response.imageUrl) || file.url
		});
		let isEmpty = false;
		if(coverImage.length){  // 如果替换图片不规范则设回默认图
			if(!coverImage[coverImage.length - 1]){
				isEmpty = true;
			}
		}
		const { editList } = this.state;
		const defaultImg= "https://kxgshop.oss-cn-hangzhou.aliyuncs.com/goods/2020/4/2020042116221185673463.png";
		const imgUrl = editList && editList.coverImage ? editList.coverImage : defaultImg;
		this.setState({ 
			coverImage: !isEmpty ? coverImage[coverImage.length - 1] : imgUrl
		});
	}
	validateToDenomination(rule, value, callback){
		const reg = /^\d+(\.\d{1,2})?$/; //整数或保留二位小数
		if(!isNaN(value) && value > 5000){
			callback('不得超过最大值5000元');
		}
		if(!isNaN(value) && value <= 5000){  //校验通过
			this.setState({
				denomination: value
			})
		}
		callback();
	}
	onTimeChange(value, dateString) {
		this.setState({
			expiredTime:  `${dateString}:00`
		})
	}
	onUpdateTimeChange(value, dateString) { 
		this.setState({
			expiredTime: `${dateString}:00`
		})
	}
	disabledDate(current) {
		const today = moment(moment().format('YYYY-MM-DD'))
		return moment(current).isBefore(today)
	}
	disabledDateTime(current) {
		const HH = moment().format("HH")
		const mm = moment().add(1, 'm').format("mm")
		const today = moment().format('YYYY-MM-DD');
		const currentDate = current ?  moment(current).format('YYYY-MM-DD') : null;

		if( current && ( (today === currentDate ) || !currentDate ) ){   // 只限今天判断HHMM
            const nowHH = moment().format('HH');
            if( nowHH == moment(current).format('HH') ){
                return {
                    disabledHours: () => range(0, HH),
                    disabledMinutes: () => range(0, mm)
                };
            }else{
                return {
                    disabledHours: () => range(0, HH)
                };
            }
		}
	}
	giftAmountFn (value) {
		this.setState({
			giftAmount: value
		})
	}
	submitPush (publishFlag) {
		this.props.form.validateFieldsAndScroll((err, values) => {
				if (err) {
						return;
				}
				let { editList, giftAmountCheck, giftAmount, expiredTime, cardName, denomination, explanation, coverImage } = this.state;
				const p = {
					neverExpired: values.neverExpired ? true : false,
					explanation,
					cardName,
					coverImage,
					denomination: denomination * 100,
					publishFlag
				}
				if(!explanation){
					message.warning("请填写使用规则")
					return;
				}
				if(!values.neverExpired){
					if(!expiredTime){
						message.warning("请选择有效期");
						return;
					}
					p.expiredTime = expiredTime
				}
				if(giftAmountCheck){
					p.giftAmount = giftAmount * 100
				}
				console.log("传参", p)
				this.setState({
					btnLoading: true
				})
				if(editList && editList.cardId){
					p.cardId = this.state.cardId;
					this.editCard(p)
				}else{
					this.newCard(p)
				}
				
		})
	}
	editCard(p){ // 新增储值
		editCard(p).then(res => {
			if(res.success){
				message.success("编辑成功")
				this.setState({
					btnLoading: false
				})
				history.push("/operation/stroedConfig")
			}
		})
	}
	newCard(p){ // 新增储值
		newCard(p).then(res => {
			if(res.success){
				message.success("新增成功")
				this.setState({
					btnLoading: false
				})
				history.push("/operation/stroedConfig")
			}
		})
	}
	giftAmountCheckFn(e){
		this.setState({
			giftAmountCheck: e.target.checked
		})
	}
	onCardNameChange(e){
		this.setState({
			cardName: e.target.value
		})
	}
	onRuleChangeFn(isEdit){
		this.setState({
			isEdit,
			ruleShow: true
		})
	}
	closeModal(){
		this.setState({
			ruleShow: false
		})
	}
	okModal(explanation){
		const explanationTextArr = explanation.split("<br/>");
		this.setState({
			explanationTextArr,
			explanation
		})
	}
	goOnDateFn() {
		this.setState({
			dateShow: true
		})
	}
	okUpdateTimeFn() { //确定更新时间
		const { expiredTime, cardId } = this.state;
		const p = {
			expiredTime,
			cardId
		}
		renew(p).then(res => {
			if(res){
				message.success("续期成功");
				this.setState({
					dateShow: false
				}, () => {
					this.cardDetail();
				})
			}
		})
	}
	editCardFn(){
		this.setState({
			stroedStatus: 1
		})
	}
	pushCardFn() {  // 顶部立即发布
		const me = this;
		confirm({
			title: '提示',
			content: '确定发布该储值产品么？',
			okText: '确认',
			cancelText: '取消',
			onOk() {
				listing({cardId: me.state.cardId}).then(res => {
					if(res){
						message.success("商品已发布")
						me.cardDetail();
					}
				})
			}
		});
	}
	stopCardFn() {  // 停售
		const me = this;
		confirm({
			icon: <CloseCircleOutlined type="close-circle"  style={{color: "#F72633"}}/>,
			// icon: <LegacyIcon type="close-circle"  style={{color: "#F72633"}}/>,
			title: '提示',
			content: '停售后用户将无法购买此储值卡，确定停售么？',
			okText: '确认',
			cancelText: '取消',
			onOk() {
				delisting({cardId: me.state.cardId}).then(res => {
					if(res){
						message.success("商品已停售")
						me.cardDetail();
					}
				})
			}
		});
	}
	dateTypeChange(e){  // 有效期类型
		if(e.target.value === 1){
			this.setState({
				expiredTime: null
			})
		}
		this.setState({
			neverExpired: e.target.value
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const {
			 explanation,btnLoading,
			 neverExpired, expiredTime,
			 isEdit, editList, stroedState, stroedStatus,
			 explanationTextArr, ruleShow, coverImage, bannerLoading, 
			 giftAmount, giftAmountCheck, denomination, cardName } = this.state;
		const uploadButton = (
			<div>
			  { bannerLoading ? <LoadingOutlined/> : <PlusOutlined/>}
			  {/* <LegacyIcon type={bannerLoading ? 'loading' : 'plus'} /> */}
			  {
				  bannerLoading ? null :  <span className="ant-upload-text"> 添加图片</span>
			  }
			 
			</div>
		);
		let timeDetail = null;
		if(neverExpired){
			timeDetail = '永久有效'
		}else{
			timeDetail = expiredTime
		}
		let cardId = this.props.match.params.cardId;
		return (
			<Panel title="储值配置" content={ cardId === 'add' ? '新增储值' : stroedStatus  === 1 ? '编辑' : '储值详情' }>
			<div className={Css.storedAddBox}>
				  <div className={Css.addStoredContent}>
					  <div className={Css.titleBox}>
					  { cardId === 'add' ? '新增储值' : stroedStatus  === 1 ? '编辑' : '储值详情' }
						<div className={Css.topBtnBox}>
							{
								stroedState === 1 && showBut('stroedConfig', 'stroed_config_stop') ?   // 出售中
									<Button className={Css.topCommon} type="primary" onClick={this.stopCardFn.bind(this)}>停售</Button>
								: null
							}
							{
								stroedState === 2 ?  // 已停售
								    <div>
									   { stroedStatus != 1 ?
										<div>
											{showBut('stroedConfig', 'stroed_config_release') && <Button className={Css.topCommon} type="primary" onClick={this.pushCardFn.bind(this)}>发布</Button>}
											{showBut('stroedConfig', 'stroed_config_edit') && <Button className={Css.topCommon} type="primary" onClick={this.editCardFn.bind(this)}>编辑</Button>}
										</div> 
										: null }
									</div>
								: null
							}
								{
								stroedState === 3 ?  // 已过期
								  <div>
									  {
										stroedStatus != 1 ?
										<div>
											{showBut('stroedConfig', 'stroed_config_renewal') && <Button className={Css.topCommon} type="primary" onClick={this.goOnDateFn.bind(this)}>续期</Button>}
											{showBut('stroedConfig', 'stroed_config_edit') && <Button className={Css.topCommon} type="primary" onClick={this.editCardFn.bind(this)}>编辑</Button>}
										</div>
										: null
									 }
									</div>
								: null
							}
						
						
						</div>
					  </div>
					  <div className={Css.content}>
						 <div className={Css.leftBox}>
							<div className={Css.topBg}></div>
							<div className={Css.cardTitle}>
								储值卡预览
								<img src={tbbb} />
							</div>
							<div className={Css.cardContent}>
								<div className={Css.cardBox} 
								style={{ backgroundImage: `url(${coverImage})` }}>
								   {/* <span>{cardName || '开心果商城充值卡'}</span> */}
								   <div className={Css.moneyBox}>
										 {
										 	denomination ? 
										 <span>{denomination}元</span>: <span>0元</span>
										}
								   </div>
								</div>
								{
									giftAmountCheck ? 
									<div>
										<div className={Css.descTitle}>
											<span></span>
											充值送好礼
										</div>
										<div className={Css.descContent}>
											{ (giftAmount || giftAmount === 0) && giftAmountCheck ? `赠送${giftAmount}元` : ''}
										</div>
									</div>
									: null
								}
							

								<div className={Css.descTitle}>
									<span></span>
									使用规则
								</div>
								<div className={Css.ruleContent}>
									{
										explanationTextArr.map((item, index) => {
											return(
												<div key={index}>{item}</div>
											)
										})
									}
								</div>
								<div className={Css.payBtn}>
									立即购买
								</div>
							</div>
						 </div>

						 <div className={Css.rightBox}>
							<div className={Css.title}>
							   基本信息
							</div>
							<Form {...formItemLayout} >
								<FormItem label="储值卡名称">
									{ stroedStatus === 1 ? getFieldDecorator('cardName', {
										rules: [
											{
												required: true,
												message: '请输入储值卡名称',
											},
											{
												max: 12,
												message: '最多输入12个字符'
											}
										],
										initialValue: editList && editList.cardName ? editList.cardName : null
									})(
										<Input 
										onChange={this.onCardNameChange.bind(this)}
										placeholder="请输入，如存100送50"/>
									) :  cardName }
								</FormItem>
								<div className={Css.bannerTitle}>储值卡封面</div>
								<div className={Css.stroedImgBox}>
								{ stroedStatus === 1 ? 
									<Upload
										className={Css.uploadBox}
										showUploadList={false}
										name="file"
										action="/proxy/cloud/oss/upload?type=goods"
										listType="picture-card"
										beforeUpload={this.beforeUpload.bind(this)}
										onChange={this.uploadOne.bind(this)}>
										{coverImage ?
										<div className={Css.coverImage}>
											<img  src={coverImage} /> 
											<div className={Css.coverEdit}>
												<div>替换</div>
											</div>
										</div>
										: uploadButton}
									</Upload> : <div className={Css.coverImage}>
											<img  src={coverImage} /> 
										</div>}
								</div>
								<div className={Css.imgText}>推荐图片尺寸710x360，大小不超过2M</div>
								<FormItem label="设置面额">
									{ stroedStatus === 1 ? getFieldDecorator('denomination', {
										  rules: [
											{
											  required: true,
											  message: '请输入面额',
											},
											{
											  validator: this.validateToDenomination.bind(this),
											}
										],
										initialValue: editList && editList.denomination ? editList.denomination / 100 : null
									})(
										<InputNumber  
										max={5000}
										min={0.01}
										disabled={editList && editList.denomination ? true : false}
										style={{width: 140}} 
										precision={2}  
										placeholder="请输入面额"/>
									) : denomination || 0 } 元 
									{
										stroedStatus === 1 ?
										<Tooltip title="为用户购买时实际需要支付的金额，不超过5000.00元">
										<span className={Css.toolBox}>?</span>
								  		</Tooltip> : null
									}
								
								</FormItem>
								<FormItem label="设置有效期">
									{ stroedStatus === 1 ? getFieldDecorator('neverExpired', {
										initialValue: neverExpired
									})(
										<Radio.Group onChange={this.dateTypeChange.bind(this)}>
											<Radio value={1}>永久有效</Radio>
											<Radio value={0}>
												<DatePicker 
												 disabled={neverExpired ? true : false}
												 value={expiredTime ? moment(expiredTime, "YYYY-MM-DD HH:mm") : null}
												 disabledDate={this.disabledDate.bind(this)}
												 disabledTime={this.disabledDateTime.bind(this)}
												 format="YYYY-MM-DD HH:mm"
												 onChange={this.onTimeChange.bind(this)}
												 showTime={{ format: 'HH:mm' }}
												 showToday={false}
												 placeholder="请选择时间"  />
											</Radio>
										</Radio.Group>
									):  timeDetail }
									
								</FormItem>
								<div className={Css.title}>
								   营销设置
								</div>
								<FormItem label="营销内容">
								{ stroedStatus === 1 ? getFieldDecorator('giftAmountCheck')(
										<Checkbox 
										defaultChecked= {editList && ( editList.giftAmount || editList.giftAmount ===0 ) ? true : false}
										onChange={this.giftAmountCheckFn.bind(this)}>
												<span>赠送金额</span>
										</Checkbox>
									) : null }
									{ stroedStatus === 1  ? 
										<InputNumber 
										    max={5000}
											min={0}
										    defaultValue={editList && ( editList.giftAmount || editList.giftAmount ===0 )  ? editList.giftAmount  / 100 : null}
											onChange={this.giftAmountFn.bind(this)}
											style={{width: 140}} 
											precision={2} placeholder="请输入，如存100" />
									: 
									giftAmount ||  giftAmount === 0 ? `赠送金额 ${giftAmount}元` : ""
									} 
									
									{ stroedStatus === 1 ?
										<Tooltip title="用户储值完成后,赠送的金额直接送给用户。">
											<span className={Css.toolBox}>?</span>
										</Tooltip> : null }
								</FormItem>
							</Form>
								<div className={Css.title}>
									使用规则
								</div>
								{ stroedStatus === 1 ? 
									<div>
									规则内容 《使用规则》
									<a onClick={this.onRuleChangeFn.bind(this, true)}>点击编辑</a>
									</div> : 
									<div>
										规则内容 <a onClick={this.onRuleChangeFn.bind(this, false)}>《使用规则》</a>
									</div>
								}
								{ stroedStatus === 1 ? 
								<div className={Css.bottomBtnBox}>
										<Button loading={btnLoading} onClick={this.submitPush.bind(this, true)} type="primary" style={{marginRight: 20}}>保存并发布</Button>
										<Button loading={btnLoading} onClick={this.submitPush.bind(this, false)} type="primary">保存</Button>
								</div> : null }
						 </div>
					  </div>
				  </div>
				  {
					  this.state.dateShow ? 
						<Modal
							width={450}
							title="提示"
							visible={this.state.dateShow}
							onOk={this.okUpdateTimeFn.bind(this)}
							onCancel={() => this.setState({ dateShow: false })}
							okText="确认"
							cancelText="取消">
							<div style={{paddingBottom: '8px'}}>
								请设置新的到期时间
							</div>
							<DatePicker 
							 showToday={false}
							 format="YYYY-MM-DD HH:mm"
							 disabledDate={this.disabledDate.bind(this)}
							 disabledTime={this.disabledDateTime.bind(this)}
							 showTime={{ format: 'HH:mm' }}
							 onChange={this.onUpdateTimeChange.bind(this)}
							 placeholder="请选择时间"  />
						</Modal>
					  : null
				  }
					
					{
						ruleShow ? 
							<RuleModal 
								explanation={explanation}
								isEdit={isEdit}
								okModal={this.okModal.bind(this)}
								closeModal={this.closeModal.bind(this)} 
								visible={ruleShow} /> : null
					}
					
			</div>
			</Panel>
		);
	}
}

export default withRouter(Form.create()(AddStroed))
