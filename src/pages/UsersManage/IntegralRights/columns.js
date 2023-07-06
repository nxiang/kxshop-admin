import React from 'react';
import { showBut } from '@/utils/utils';

const integralScope = props => {
  const { setRules } = props;

  const operationDom = record => {
    if (showBut('users_integralRights', 'users_integralRights_set')) {
      return <a onClick={() => setRules(record)}>配置</a>;
    } 
    return null
  };

  const keyDom = record => {
    return {
      EXPIRES_LIMIT: '积分有效期',
      DAY_UPPER_LIMIT: '积分获取上限',
      EXCHANGE_RATE: '积分奖励规则',
    }[record];
  };

  const valueDom = record => {
    switch (record.ruleKey) {
      case 'EXPIRES_LIMIT':
        if (record.ruleValue == -1) return '永久有效';
        if (record.ruleValue.indexOf('Y') > -1)
          return `${record.ruleValue.substring(0, record.ruleValue.indexOf('Y'))}年`;
        if (record.ruleValue.indexOf('M') > -1)
          return `${record.ruleValue.substring(0, record.ruleValue.indexOf('M'))}月`;
        if (record.ruleValue.indexOf('D') > -1)
          return `${record.ruleValue.substring(0, record.ruleValue.indexOf('D'))}日`;
        return '';
      case 'DAY_UPPER_LIMIT':
        if (record.ruleValue == -1) return '无限制';
        return `每日最多获取${record.ruleValue}积分`;
      case 'EXCHANGE_RATE':
        return `每消费1元奖励${record.ruleValue}积分`;
    }
  };

  return [
    {
      title: '积分规则名称',
      dataIndex: 'ruleKey',
      render: keyDom,
    },
    {
      title: '规则详情',
      render: valueDom,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      render: operationDom,
    },
  ];
};

export default { integralScope };
