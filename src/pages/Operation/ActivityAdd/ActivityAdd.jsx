import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { connect } from 'dva';
import { Breadcrumb, PageHeader, Steps } from 'antd';
import Css from './ActivityAdd.module.scss';
import AddActivity from './modules/AddActivity/AddActivity';
import SetStrategy from './modules/SetStrategy/SetStrategy';
import SetLottery from './modules/SetLottery/SetLottery';
import Finish from './modules/Finish/Finish';
import Phone from './modules/Phone/Phone';
import { revertData, activityId } from '@/actions/index';

const { Step } = Steps;
const steps = [
  {
    title: '创建活动',
    content: <AddActivity />,
  },
  {
    title: '设置奖项',
    content: <SetLottery />,
  },
  {
    title: '设置策略',
    content: <SetStrategy />,
  },
  {
    title: '完成',
    content: <Finish />,
  },
];

@connect(activitys => ({
  ...activitys,
}))
class ActivityAdd extends Component {

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(revertData());
  }

  render() {
    const {
      addType,
      activitys: { stepPage },
    } = this.props;
    return (
      <PageHeader style={{ backgroundColor: '#fff' }}>
        {addType == 'page' && (
          <>
            <div className={Css.upHeader}>
              <Breadcrumb separator=">" className={Css.headerTitle}>
                <Breadcrumb.Item className={Css.headerTitle} href="/admin/ActivityList">
                  活动列表
                </Breadcrumb.Item>
                <Breadcrumb.Item className={Css.headerTitle} href="/admin/ActivityAdd">
                  新建活动
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className={Css.content}>
              <Steps className={Css.stepsBox} current={stepPage}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className={Css.box}>
                <Phone />
                {steps[stepPage].content}
              </div>
            </div>
          </>
        )}
        {addType == 'component' && (
          <div style={{ display: 'flex' }}>
            <div>
              <Phone />
            </div>
            <div>
              <AddActivity addType={addType} />
              <SetLottery addType={addType} />
            </div>
          </div>
        )}
      </PageHeader>
    );
  }
}

ActivityAdd.defaultProps = {
  addType: 'page',
};

export default withRouter(ActivityAdd);
