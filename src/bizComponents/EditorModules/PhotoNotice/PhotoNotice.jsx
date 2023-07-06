import React, { Component } from 'react';
import Css from './PhotoNotice.module.scss';

class PhotoNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={Css['photo-notice-box']}>
        <img
          className={Css['notice-img']}
          src="https://img.kxll.com/kxshop_uniapp/home-notice-icon.png"
          alt=""
        />
        <p className={Css['notice-text']}>
          {this.props.itemData && this.props.itemData.length && this.props.itemData[0].data}
        </p>
      </div>
    );
  }
}

export default PhotoNotice;
