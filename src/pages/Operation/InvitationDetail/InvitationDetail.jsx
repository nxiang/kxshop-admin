import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import { withRouter } from '@/utils/compatible'
import Panel from '@/components/Panel';
import { PageHeader, Row, Col, Image, Table, Button } from 'antd';
import Css from './InvitationDetail.module.scss';

import { inviteActivityDetail, prizeList } from '@/services/activity';

const columns = [
  {
    title: '奖品信息',
    dataIndex: 'prizeName',
    width: 230,
    render: (e, r) => (
      <span className={Css.tableInfoBox}>
        <img className={Css.tableImg} src={r.image} />
        <div>
          <p className={Css.tableMsg}>{e}</p>
          <p className={Css.tableMsg}>{r.prizeConfName}</p>
        </div>
      </span>
    ),
  },
  {
    title: '数量',
    dataIndex: 'stockQuantity',
    width: 90,
  },
  {
    title: '已发放',
    dataIndex: 'winQuantity',
    width: 90,
  },
  {
    title: '中奖概率',
    dataIndex: 'probability',
    width: 90,
  },
];

export default withRouter(props => {
  const [activityInfo, setActivityInfo] = useState({});
  const [activityRule, setActivityRule] = useState({});
  const [listData, setListData] = useState([]);

  useEffect(() => {
    inviteActivityDetailApi();
    prizeListApi();
  }, []);

  const inviteActivityDetailApi = () => {
    const { location } = props
    inviteActivityDetail({
      activityId: location.query?.activityId || undefined,
    }).then(res => {
      if (res.success) {
        setActivityInfo(res.data.activityInfo);
        setActivityRule(res.data.activityRule);
      }
    });
  };

  const prizeListApi = () => {
    const { location } = props
    prizeList({
      activityId: location.query?.activityId || undefined,
    }).then(res => {
      if (res.success) {
        setListData(res.data);
      }
    });
  };

  const BackTo = () => {
    history.go(-1);
  };

  return (
    <Panel title="邀请有礼活动详情" content="查看邀请有礼活动相关配置信息">
      <PageHeader style={{ background: '#fff' }} title="活动详情">
        <Row>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>活动名称：</div>
            {activityInfo?.activityName}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>活动时间：</div>
            {activityInfo?.beginTime} 至 {activityInfo?.endTime}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>页面背景：</div>
            {activityInfo?.backgroundImage && (
              <Image style={{ width: 187 }} src={activityInfo.backgroundImage} />
            )}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>分享按钮：</div>
            {activityInfo?.buttonImage && (
              <Image style={{ width: 187 }} src={activityInfo.buttonImage} />
            )}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>活动说明：</div>
            <div style={{ width: 400 }}>{activityInfo?.ruleDesc}</div>
          </Col>
        </Row>
      </PageHeader>
      <PageHeader style={{ background: '#fff' }} title="活动规则">
        <Row>
          <Col offset={1} span={12} className={Css['Col']}>
            <p style={{ fontWeight: 600 }}>邀请人获奖励门槛</p>
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>注册人数达到：</div>
            {activityRule?.inviterAwardThreshold}人
          </Col>
          <Col offset={1} span={12} className={Css['Col']}>
            <p style={{ fontWeight: 600 }}>抽奖活动配置</p>
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>活动标题：</div>
            <div style={{ backgroundColor: 'rgba(1,1,1,0.5)' }}>
              {activityRule?.lotteryActivityConfig?.titleImage && (
                <Image style={{ width: 375 }} src={activityRule.lotteryActivityConfig.titleImage} />
              )}
            </div>
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>活动背景：</div>
            {activityRule?.lotteryActivityConfig?.backgroundImage && (
              <Image
                style={{ width: 375 }}
                src={activityRule.lotteryActivityConfig.backgroundImage}
              />
            )}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>活动奖项：</div>
            <Table columns={columns} dataSource={listData} pagination={false} />
          </Col>
          <Col offset={1} span={12} className={Css['Col']}>
            <p style={{ fontWeight: 600 }}>未中奖设置</p>
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>未中奖名称：</div>
            {activityRule?.lotteryActivityConfig?.losingLotteryName}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>图片：</div>
            {activityRule?.lotteryActivityConfig?.losingLotteryImage && (
              <Image
                style={{ width: 64 }}
                src={activityRule.lotteryActivityConfig.losingLotteryImage}
              />
            )}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>提示语：</div>
            {activityRule?.lotteryActivityConfig?.losingLotteryHint}
          </Col>
          <Col span={24} className={Css['Col']}>
            <div className={Css['Col-title']}>达标可以获得抽次数：</div>
            {activityRule?.inviterAwardContent}次
          </Col>
          {activityRule?.inviteeAwardContent && (
            <Col span={24} className={Css['Col']}>
              <div className={Css['Col-title']}>被邀请人注册奖励：</div>
              {activityRule?.inviteeAwardContent}
            </Col>
          )}
          <Col span={24} className={Css['Col']}>
            <Button style={{ marginLeft: 30 }} type="primary" onClick={BackTo}>
              返回
            </Button>
          </Col>
        </Row>
      </PageHeader>
    </Panel>
  );
});
