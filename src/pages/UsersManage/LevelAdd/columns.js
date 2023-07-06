import React from 'react';

const CouponsScope = props => {
  const { delCoupons, operationIs = false } = props;

  const couponTypeDom = record => {
    return {
      NORMAL: '代金券',
      DISCOUNT: '折扣券',
    }[record];
  };

  const statusDom = record => {
    return {
      0: '待发布',
      1: '发放中',
      2: '已暂停',
      3: '已结束',
    }[record];
  };

  const timeDom = record => {
    return `${record.availableBeginTime} - ${record.availableEndTime}`;
  };

  const operationDom = record => {
    return (
      <a style={{ color: '#ff4d4f' }} onClick={() => delCoupons(record.stockId)}>
        删除
      </a>
    );
  };

  const data = [
    { title: '券名称', dataIndex: 'couponName' },
    { title: '券类型', dataIndex: 'couponType', render: couponTypeDom },
    { title: '状态', dataIndex: 'status', render: statusDom },
    { title: '可领取时间', render: timeDom },
  ];

  if (operationIs) {
    data.push({ title: '操作', width: 100, render: operationDom });
  }

  return data;
  // return [
  //   { title: '券名称', dataIndex: 'kaTypeName' },
  //   { title: '券类型', dataIndex: 'kaTypeName' },
  //   { title: '状态', dataIndex: 'kaTypeName' },
  //   { title: '可领取时间', dataIndex: 'kaTypeName' },
  //   { title: '操作', width: 100, render: operationDom },
  // ];
};

export default { CouponsScope };
