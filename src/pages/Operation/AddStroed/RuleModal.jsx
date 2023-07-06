import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, message, Upload, Icon, Modal } from "antd";
import Css from "./AddStroed.module.scss";
import { Form } from '@ant-design/compatible';

const { TextArea } = Input;
const FormItem = Form.Item;

class RuleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        
    }
  }
  componentDidMount () {
    const { explanation } = this.props;
    if(explanation){
      const editText = explanation.replace(/<br\/>/g,'\n');
      this.setState({
        editText
      })
    }
  }
  textOkFn (){
    this.props.form.validateFieldsAndScroll((err, values) => {
			if (err) {
				return;
      }
      values.explanation = values.explanation.trim();
      const newText = values.explanation.replace(/\n/g,"<br/>");
      this.props.okModal(newText);
      this.props.closeModal();
    })
  }
  footerBtn(){
    const { isEdit } = this.props;
    let btnArr = null;
    if(isEdit){
      btnArr = [
        <Button key="1" onClick={this.props.closeModal}>
          取消
        </Button>,
        <Button key="2" type="primary"  onClick={this.textOkFn.bind(this)}>
          确定
        </Button>,
      ];
    }else{
      btnArr = [
        <Button key="1" onClick={this.props.closeModal}>
          关闭
        </Button>
      ];
    }
    
		return btnArr;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isEdit } = this.props;
    return (
        <Modal
          maskClosable={false}
          title='使用规则'
          width={500}
          visible={this.props.visible}
          onCancel={this.props.closeModal}
          footer={this.footerBtn()}
        >
          <Form
            style={{textAlign: 'center'}}
          >
            <FormItem>
                  {getFieldDecorator('explanation', {
                    rules: [
                      {
                        required: true,
                        message: '请输入使用规则',
                      },
                      { max: 120, message: '不超过120个字!' }
                    ],
                    initialValue: this.state.editText
                  })(
                    <TextArea 
                        disabled={!isEdit}
                        style={{ width: 450, height: 200, resize: 'none' }}
                        placeholder="请输入使用规则">
                    </TextArea>
                  )}
                </FormItem>
          </Form>
        </Modal>
    )
  }
}

export default withRouter(Form.create()(RuleModal))
