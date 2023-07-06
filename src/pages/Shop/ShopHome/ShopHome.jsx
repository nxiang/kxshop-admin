import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import Css from './ShopHome.module.scss';
import { Breadcrumb, Button } from 'antd';
import Panel from '@/components/Panel';

// 引入接口
import { decorateIntroduction } from '@/services/shop';

class ShopHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 模板id
      decorateId: null,
    };
  }

  componentDidMount() {
    this.decorateIntroductionApi();
  }

  // 店铺当前模板id查询
  decorateIntroductionApi() {
    const that = this;
    decorateIntroduction().then(res => {
      if (res.errorCode === '0') {
        that.setState({
          decorateId: res.data,
        });
      }
    });
  }
  render() {
    const { decorateId } = this.state;
    return (
      <Panel title="店铺主页" content="展示店铺装修效果">
        <div className={Css['shop-home-box']}>
          <div className={Css['shop-home-content']}>
            <div className={Css['content-photo-box']}>
              {decorateId && decorateId === 1 ? (
                <img
                  className={Css['content-photo-img']}
                  src="https://img.kxll.com/admin_manage/photoHome.png"
                  alt=""
                />
              ) : null}
              {decorateId && decorateId === 2 ? (
                <img
                  className={Css['content-photo-img']}
                  src="https://img.kxll.com/admin_manage/photoHome_3.png"
                  alt=""
                />
              ) : null}
              {decorateId && decorateId === 3 ? (
                <img
                  className={Css['content-photo-img']}
                  src="https://img.kxll.com/admin_manage/photoHome_4.png"
                  alt=""
                />
              ) : null}
              {decorateId && decorateId === 4 ? (
                <img
                  className={Css['content-photo-img']}
                  src="https://img.kxll.com/admin_manage/photoHome_2.png"
                  alt=""
                />
              ) : null}
            </div>
            <Link to="/shop/decoration">
              <Button type="primary">去装修</Button>
            </Link>
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(ShopHome);
