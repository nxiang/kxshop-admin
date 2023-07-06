import React, { Component } from "react";
import Css from "./AddCouponBox.module.scss";
import { CloseCircleOutlined } from '@ant-design/icons';
import { InputNumber, Button, message } from 'antd';
import{add} from '@/services/coupon'

class AddCouponBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validate:false,
      defaultValue:''
    };
  }

  closeButton () {
    this.setState({
      validate:false,
      defaultValue:''
    })
    this.props.NumCallBack()
  }

  setDefaultValue (e) {
    if(!e){
      return
    }
    let validate = true
    if(!isNaN(Number(e))){
      e = String(e).replace(/^(-)*(\d+)\.(\d{1,4}).*$/, '$1$2')
    } else {
      e = ''
      validate = false
    }
    this.setState({
      defaultValue: e,
      validate
    })
   
  }

  keyPress (e) {
    const invalidChars = ['-', '+', 'e', 'E']
    if(invalidChars.indexOf(e.key) !== -1){
        e.preventDefault()
    }
  }
  
  /**
   *  确定
   */
  async confirmButton () {
    if(!this.state.validate || !this.state.defaultValue){
      return this.setState({
        validate:false
      })
    }
    const self = this
    const info = await add({stockId:self.props.stockId,maxQuantity:self.props.maxQuantity,addQuantity:self.state.defaultValue})
    if(info){
      message.success('增加成功')
      this.setState({
        validate:false,
        defaultValue:''
      })
    }
    this.props.NumCallBack()
  }

  render() {
    return this.props.isShow?
    <div className={Css["AddCouponBox"]}>
      <CloseCircleOutlined className={Css["closeButton"]} onClick={this.closeButton.bind(this)} />
      <div className={Css["title"]}>增加数量</div>
      <InputNumber 
        min={1} max={99999} 
        className={Css["input"]}
        onKeyPress={this.keyPress}     
        value={this.state.defaultValue}
        onChange={this.setDefaultValue.bind(this)}
      />
      {
        !this.state.validate?<div className={Css["tips"]}>
          请输入正确的数量
        </div>
        :''
      }
      <div className={Css["buttonGroup"]}>
        <Button className={Css["confirm"]} onClick={this.confirmButton.bind(this)}>确定</Button>
        <Button className={Css["cancel"]} onClick={this.closeButton.bind(this)}>取消</Button>
      </div>
    </div>
    :
    '';
  }
}

export default AddCouponBox;
