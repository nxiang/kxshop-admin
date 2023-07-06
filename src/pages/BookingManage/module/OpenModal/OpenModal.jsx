import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, InputNumber, message, Upload, Icon, Modal, Select, DatePicker, Form, Row, Col } from "antd";
import Css from "./OpenModal.module.scss";
import moment from "moment";
import { orderConfirm } from "@/services/reserveOrder";

const { Option } = Select;


class OpenModal extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef()
    this.state = {
      loading: false
    }
  }
  componentDidMount () {
    const { bizOrderId } = this.props;
    this.setState({
      bizOrderId
    })
  }
  footerBtn(){
    const { loading } = this.state;
    let btnArr = null;
    btnArr = [
        <div className={Css.bottomBtn}>
             <Button loading={loading} key="1" type="primary" htmlType="submit" onClick={this.submitFn.bind(this)}>
               开单
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
        serveTime: values
      }
      this.orderConfirm(p);
		})
  }
  orderConfirm(p){
    orderConfirm(p).then(res => {
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
    return (
        <Modal
          maskClosable={false}
          title='开单'
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
                <Row>
                    <Col span={12}>
                        <Form.Item rules={[{ required: true, message: '请选择服务时间' }]} label="实际服务时间"  name="date">
                            <DatePicker style={{width: 160}} />
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

export default withRouter(OpenModal)
