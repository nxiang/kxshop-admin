import React, { Component } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Spin } from 'antd';
import Css from './AlterVipCard.module.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';
import AlterHeader from '../Modules/AlterHeader/AlterHeader';
import { Link } from 'react-router-dom';
const { confirm } = Modal;
class AlterVipCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  alterImage(imgUrl) {
    let itemData = [
      {
        image: imgUrl,
      },
    ];
    this.props.alterTrigger(itemData);
  }

  moduleDel() {
    const that = this;
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.alterDel();
        message.success('模块删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  propertiesRadioChange(index, e) {
    let { propertiesArr } = this.props;
    propertiesArr[index].value = e.target.value;
    this.props.alterPropertiesArr(propertiesArr);
  }

  render() {
    const { propertiesArr } = this.props;
    return (
      <div className={Css['alter-assist-ad-box']}>
        <AlterHeader
          title="会员卡"
          alterDel={() => {
            this.props.alterDel();
          }}
        />
        {propertiesArr &&
          propertiesArr.map((item, index) => {
            return (
              <LabelRadioGroup
                key={item.id}
                label={item.label}
                value={item.value}
                radioList={item.radioList}
                radioChange={this.propertiesRadioChange.bind(this, index)}
              />
            );
          })}
        <div>
          会员中心装修好后,请配置会员卡片{' '}
          <Link
            target = "_blank"
            to={`/users/levelList`}
            style={{ marginRight: '15px',color:"#1890FF"}}
          >
            立即去配置
          </Link>
        </div>
      </div>
    );
  }
}

export default AlterVipCard;
