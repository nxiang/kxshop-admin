import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, InputNumber, message, Upload, Icon, Modal, Select, DatePicker, Form, Row, Col } from "antd";
import Css from "./CanelModal.module.scss";
import moment from "moment";
import { orderCancel } from "@/services/reserveOrder";

const { Option } = Select;
const { TextArea } = Input;

class CanelModal extends React.Component {
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
             <Button key="1" loading={loading} type="primary" htmlType="submit" onClick={this.submitFn.bind(this)}>
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
      const p = {
        bizOrderId,
        cancelReason: values.cancelReason
      }
      this.orderCancel(p);
		})
  }
  orderCancel(p){
    orderCancel(p).then(res => {
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
          closable={false}
          maskClosable={false}
          title={'取消订单'}
          width={600}
          visible={this.props.visible}
          onCancel={this.props.closeModal}
          footer={this.footerBtn()}
        >
            <p className={Css.cancelTitle}>确定取消本次预约订单么,如果买家已付款则系统会自动退款给买家。</p>
           <Form
                ref={this.formRef}
                initialValues={{
                 
                }}
            >
                <Form.Item  label="取消原因"  name="cancelReason">
                    <TextArea
                        placeholder="请输入取消原因"
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        maxLength={200}
                        />
                </Form.Item>
              
          </Form>
        </Modal>
    )
  }
}

export default withRouter(CanelModal)
