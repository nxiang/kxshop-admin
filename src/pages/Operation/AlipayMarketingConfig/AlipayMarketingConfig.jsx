import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from './AlipayMarketingConfig.module.scss';
import Panel from '@/components/Panel';

import AxcConf from './components/AxcConf/index.jsx'
import AlipayForestConf from './components/AlipayForestConf/index.jsx'


class SetSpecial extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Panel title="支付宝营销配置">
        <div className={Css['other-page-setting']}>
          <AxcConf></AxcConf>
          <AlipayForestConf></AlipayForestConf>
        </div>
      </Panel>
    );
  }
}

export default withRouter(SetSpecial);
