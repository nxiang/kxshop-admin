import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, InputNumber, message, Upload, Icon, Modal, Select, DatePicker, Form, Row, Col } from "antd";
import Css from "./ChangeModal.module.scss";
import moment from "moment";
import { orderDelay } from "@/services/reserveOrder";

const { Option } = Select;


class ChangeModal extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef()
    this.state = {
      loading: false
    }
  }
  componentDidMount () {
    const { bizOrderId, reserveTimeText } = this.props;
    this.setState({
      reserveTimeText,
      bizOrderId
    })
  }
  footerBtn(){
    const { loading } = this.state;
    let btnArr = null;
    btnArr = [
        <div className={Css.bottomBtn}>
             <Button loading={loading} key="1" type="primary" htmlType="submit" onClick={this.submitFn.bind(this)}>
               确定
            </Button>
            <Button key="2"  onClick={this.props.closeModal}>
               取消
            </Button>
        </div>
     ];
	return btnArr;
  }
  submitFn(){
    const { bizOrderId } = this.state;
		this.formRef.current.validateFields().then(values => {
      values.date = values.date ? values.date.format("YYYY-MM-DD") : null;
      this.setState({
        loading: true
      })
      const p = {
        bizOrderId,
        reserveTime: values
      }
      this.orderDelay(p);
		})
  }
  orderDelay(p){
    orderDelay(p).then(res => {
      this.setState({
        loading: false
      })
      if(res && res.success){
        message.success("操作成功")
        this.props.changeSuccess()
      }
    })
  }
  render() {
    const { reserveTimeText } = this.state;
    return (
        <Modal
          maskClosable={false}
          title='改期'
          width={600}
          visible={this.props.visible}
          onCancel={this.props.closeModal}
          footer={this.footerBtn()}
        >
           <Form
                ref={this.formRef}
                initialValues={{
                    // date: moment('2019-02-02')
                }}
            >
                <Form.Item  label="当前预约时间"  name="nowDate">
                    {reserveTimeText}
                </Form.Item>
                <Row>
                    <Col span={12}>
                        <Form.Item rules={[{ required: true, message: '请选择服务时间' }]} label="改时间至"  name="date">
                            <DatePicker  style={{width: 160}} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item rules={[{ required: true, message: '请选择服务时间段' }]} name="meridiem">
                            <Select style={{width: 120}} placeholder="时间段">
                              <Option  value={0}>上午</Option>
															<Option  value={1}>下午</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
          </Form>
        </Modal>
    )
  }
}

export default withRouter(ChangeModal)
