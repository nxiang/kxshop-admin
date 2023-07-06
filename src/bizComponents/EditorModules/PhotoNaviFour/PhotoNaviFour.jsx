import React, { Component } from 'react';
import Css from './PhotoNaviFour.module.scss';

class PhotoNaviFour extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { itemData, itemStyle } = this.props;
    return (
      <div className={Css['photo-nav-four-box']}>
        {itemData.map((item, index) => {
          return (
            <div className={Css['nav-item']} key={index}>
              {itemStyle === 1 && (
                <img
                  className={Css['item-img']}
                  src={
                    item.image === ''
                      ? 'https://img.kxll.com/admin_manage/icon/decoration_default_img.png'
                      : item.image
                  }
                  alt=""
                />
              )}
              {itemStyle === 2 && (
                <img
                  className={Css['item-circle-img']}
                  src={
                    item.image === ''
                      ? 'https://img.kxll.com/admin_manage/icon/decoration_default_img.png'
                      : item.image
                  }
                  alt=""
                />
              )}
              <p className={Css['item-text']}>{item.title}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default PhotoNaviFour;
