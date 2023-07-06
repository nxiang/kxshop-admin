import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { CheckCircleFilled } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import Css from './AddGoods.module.scss';

class TwoContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { getLastFn, goodsCb } = this.props;
    return (
      <div className={Css.threeContent}>
        <div className={Css.threeBox}>
          <CheckCircleFilled className={Css.checkIcon} />
        </div>
        <div className={Css.finshFont}>发布成功</div>
        <div className={Css.threeBottomBox}>
          <div>
            <Button onClick={getLastFn} style={{ marginBottom: '24px' }} type="primary">
              继续发布
            </Button>
          </div>
          <div>
            <a onClick={goodsCb}>查看商品列表</a>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TwoContent);