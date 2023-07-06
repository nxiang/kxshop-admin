import React, { Component } from 'react';
import Css from './HeaderCard.module.scss';
import appEmpty from '@/assets/icon/app-empty.png'

class HeaderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={Css['HeaderCardBox']}>
        {this.props.imgIs ? (
          <div className={Css['HeaderCardImg']}>
            <img src={this.props.leftImg || appEmpty} alt="" />
          </div>
        ) : (
          ''
        )}
        <div className={Css['HeaderCardText']}>
          <p className={Css['HeaderCardMax']}>{this.props.title || '商城应用'}</p>
          <p>{this.props.textXX || '商品详细'}</p>
        </div>
      </div>
    );
  }
}

export default HeaderCard;
