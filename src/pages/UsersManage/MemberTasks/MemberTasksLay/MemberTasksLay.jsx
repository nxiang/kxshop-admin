import React, { useState, useEffect, useRef } from 'react';
import Css from './MemberTasksLay.module.scss';
import { history } from '@umijs/max';
import Panel from '@/components/Panel';
import { Tabs, PageHeader, Spin } from 'antd';
import SignInSettings from '../components/SignInSettings/index'
import BannerSettings from '../components/BannerSettings/index'
import TasksSettings from '../components/TasksSettings/index'
import { withRouter } from '@/utils/compatible';

const { TabPane } = Tabs;

export default withRouter(props =>  {
  // 支持地址栏指向特定tab
  const prosTabskey = props?.location?.query?.key

  // tab的key
  const [tabsKey, setTabsKey] = useState(prosTabskey||'1')

  const tabsChange = (key) => {
    setTabsKey(key)
    history.push(`/users/memberTasks?key=${key}`)
  };

  return (
    <Panel>
      <PageHeader style={{ background: '#fff' }} title="会员任务">
        <Tabs className={Css['memberTasksPage']} type="card" defaultActiveKey={tabsKey} onChange={tabsChange}>
          <TabPane tab="签到设置" key="1">
            <SignInSettings tabsKey={tabsKey} />
          </TabPane>
          <TabPane tab="任务设置" key="2">
            <TasksSettings tabsKey={tabsKey} />
          </TabPane>
          <TabPane tab="banner设置" key="3">
            <BannerSettings tabsKey={tabsKey} />
          </TabPane>
        </Tabs>
      </PageHeader>
    </Panel>
  );
})
