import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from "./SetBusiness.module.scss";
import { Tooltip, Spin, Steps, Form, Radio, Select, Cascader, Button, Row, Col, TimePicker, DatePicker, message  } from "antd";
import Panel from '@/components/Panel';
import moment from "moment";
import { businessEdit, setInfo } from "@/services/shop";

const { Option } = Select;
const { RangePicker } = TimePicker;

const layout = {
	labelCol: { span: 3 },
	wrapperCol: { span: 16 },
  };
const tailLayout = {
	wrapperCol: { offset: 3, span: 16 },
};

function range(start, end) {
	const result = [];
	for (let i = start; i < end; i++) {
	  result.push(i);
	}
	return result;
  }

class SetBusiness extends Component {
	
	constructor(props) {
		super(props);
		this.formRef = React.createRef()
		this.state = {
            businessState: 0
		};
	}
	componentDidMount() {
        this.setInfo();
    }
    setInfo(){
        setInfo().then(res => {
            console.log('详情', res)
            if(res){
                 this.formRef.current.setFieldsValue({ 
                    buyFlag: res.data.buyFlag,
                    businessState: res.data.businessState
                 })
                 this.setState({
                    businessState: res.data.businessState
                 })
                 if(res.data.businessTime){
                    this.setState({
                        businessType: 1
                    })
                    const businessTimeArr = res.data.businessTime.split('-')
                    this.formRef.current.setFieldsValue({ 
                        businessType: 1,
                        businessTime: [moment(businessTimeArr[0], 'HH:mm'), moment(businessTimeArr[1], 'HH:mm')] 
                     })
                 }
                 if(res.data.autoBusinessDay){
                    this.setState({
                        restType: 1
                    })
                    this.formRef.current.setFieldsValue({ 
                        restType: 1,
                        autoBusinessDay: moment(res.data.autoBusinessDay, 'YYYY-MM-DD HH:mm')
                     })
                 }
            }
        })
    }
    stateChange(e){
        this.clearTime();
        this.formRef.current.setFieldsValue({ 
            businessType: 0,
            restType: 0
         })
        this.setState({
            businessState: e.target.value,
            restType: 0,
            businessType: 0
        })
    }
    openChange(e){
        this.clearTime();
        this.setState({
            businessType: e.target.value,
            restType: 0
        })
    }
    closeChange(e){
        this.clearTime();
        this.setState({
            restType: e.target.value,
            businessType: 0
        })
    }
    clearTime(){
        this.formRef.current.setFieldsValue({ 
            businessTime: null,
            autoBusinessDay: null
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
    submitFn(values){
        const businessTimeMin = values.businessTime && values.businessTime.length ? values.businessTime[0].format("HH:mm") : null;
        const businessTimeMax = values.businessTime && values.businessTime.length ? values.businessTime[1].format("HH:mm") : null;
        let businessTime = null;
        if(businessTimeMin && businessTimeMax){
           businessTime = `${businessTimeMin}-${businessTimeMax}`
        }
        const autoBusinessDay = values.autoBusinessDay ? values.autoBusinessDay.format("YYYY-MM-DD HH:mm") : null;

        const p = {
            businessState: values.businessState,
            buyFlag	: values.buyFlag
        }
        if(!values.businessState){
            p.businessTime = businessTime
        }
        if(autoBusinessDay){
            p.autoBusinessDay = autoBusinessDay
        }
        console.log("传参", p)
        businessEdit(p).then(res => {
            if(res){
                this.setInfo();
                message.success('保存成功')
            }
        }) 
    }
	render() {
        const { businessState, businessType, restType } = this.state;
        
		return (
            <Panel title="经营设置" content="店铺经营时间设置">
                <div className={Css.businessBox}>
                    <div className={Css.title}>
                        经营设置
                    </div>
                    <Form
                        ref={this.formRef}
                        {...layout}
                        onFinish={this.submitFn.bind(this)}
                        initialValues={{
                            businessState: 0,
                            restType: 0,
                            businessType: 0,
                            buyFlag: 1
                        }}
                    >
                        <Form.Item label="经营状态">
                            <Form.Item noStyle
                              name="businessState">
                                <Radio.Group onChange={this.stateChange.bind(this)}>
                                    <Radio value={0}>营业</Radio>
                                    <Radio value={1}>休息 (打样)</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Tooltip placement="top" title='选择休息后，用户下单即受到限制'>
                                <span className={Css.rightToolBox}>i</span>
                            </Tooltip>
                        </Form.Item>
                        {
                            businessState ? 
                            <Form.Item label="营业周期" onChange={this.closeChange.bind(this)} name="restType">
                                <Radio.Group>
                                    <Radio value={0}>不开业</Radio>
                                    <Radio value={1}>设置自动开业时间</Radio>
                                </Radio.Group>
                            </Form.Item> 
                            : 
                            <Form.Item label="营业周期" onChange={this.openChange.bind(this)} name="businessType">
                                <Radio.Group>
                                    <Radio value={0}>全天</Radio>
                                    <Radio value={1}>自定义时间</Radio>
                                </Radio.Group>
                            </Form.Item>
                        }
                        {
                            businessType == 1 ?
                            <Form.Item  label="时间段" rules={[{ required: true }]} name="businessTime">
                                <RangePicker format='HH:mm' />
                            </Form.Item> 
                            : null
                        }
                        {
                            restType == 1 ?
                            <Form.Item  label="自动开业时间" rules={[{ required: true }]} name="autoBusinessDay">
                              	<DatePicker 
                                showToday={false}
                                format="YYYY-MM-DD HH:mm"
                                disabledDate={this.disabledDate.bind(this)}
                                disabledTime={this.disabledDateTime.bind(this)}
                                showTime={{ format: 'HH:mm' }}
                                placeholder="请选择时间"  />
                            </Form.Item> 
                            : null
                        }
                        <Form.Item label="非营业时间"  name="buyFlag">
                            <Radio.Group>
                                <Radio value={1}>不允许下单</Radio>
                                <Radio value={0}>允许用户下单,暂停配送</Radio>
                            </Radio.Group>
                        </Form.Item>
                    	<Form.Item style={{marginTop: 32}} {...tailLayout}>
                            <Button htmlType="submit" type="primary" >
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Panel>
		);
	}
}
export default withRouter(SetBusiness)
