import React, { Component } from 'react';
import Css from './phone.module.scss';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Button, message } from 'antd';
import { connect } from 'dva';

@connect(activitys => ({
  ...activitys,
}))
class Phone extends Component {
  state = {
    loading: false,
    state: 1,
  };

  content() {
    const { phoneData } = this.props.activitys;
    switch (phoneData.templateName) {
      case '大转盘':
        return (
          <div className={Css.contentImg}>
            <img className={Css.img} src={phoneData.backgroundImage || ''} />
            <img className={Css.titleImg} src={phoneData.titleImage || ''} />
            <img className={Css.img} src="https://img.kxll.com/admin_manage/dzpicon.png" />
          </div>
        );
    }
    return <img className={Css.contentImg} src={phoneData.photoImg || ''} alt="" />;
  }

  render() {
    console.log(this.props);
    return <div className={Css.content}>{this.content()}</div>;
  }
}

export default Phone;
