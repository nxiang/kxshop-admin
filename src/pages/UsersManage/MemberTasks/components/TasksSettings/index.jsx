import React, { useState, useEffect, useRef } from 'react';
import Css from './index.module.scss';
import { connect } from 'dva';
import { Spin, Button, Table, Space, message } from 'antd';
import { history } from '@umijs/max';

import { getVipTaskListApi } from '@/services/member';

const { Column } = Table;
const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

export default connect(mapStateToProps)(({ collapsed, tabsKey }) => {

  // 展示切换判断重新加载数据
  useEffect(() => {
    if (tabsKey == 2) getListData()
  }, [tabsKey]);

  // laoding
  const [spinning, setSpinning] = useState(false);
  const [listData, setListData] = useState([]);

  const typeDictionaries = {
    joinVip: '加入会员',
    joinFansGroup: '加入粉丝群',
    favoriteApplet: '收藏小程序',
    firstOrderOfDay: '每日首单',
    order: '下单得积分',
    comment: '评论得积分',
  }

  const tableColumn = [
    {
      title: 'icon',
      align: 'center',
      dataIndex: 'icon',
      key: 'icon',
      render: text => (
        <div>
          <img style={{ width: '50px', height: '50px' }} src={text} alt="" />
        </div>
      ),
    },
    {
      title: '任务名称',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '任务类型',
      align: 'center',
      dataIndex: 'type',
      key: 'type',
      render: text => (
        <div>{typeDictionaries[text]}</div>
      ),
    },
    {
      title: '积分',
      align: 'center',
      dataIndex: 'presentPoint',
      key: 'presentPoint',
      render: text => (
        <div>+{text}</div>
      ),
    },
    {
      width: '80px',
      align: 'center',
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => goDetail(record.id)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const getListData = async () => {
    try {
      setSpinning(true)
      const res = await getVipTaskListApi()
      if (res.success) setListData(res.data) 
      setSpinning(false)
    } catch (error) {
      setSpinning(false)
    }
  }

  
  // 查看详情
  const goDetail = id => {
    history.push(`/users/memberTasks/edit/${  id}`);
  }

  return (
    <Spin size="large" spinning={spinning}>
      <div className={Css['pd10']}>
        {/* 表格 */}
        <Table
          ellipsis
          bordered
          rowKey={record => record.id}
          dataSource={listData}
          columns={tableColumn}
          pagination={false}
          // scroll={{ y: 300 }}
          size="middle"
        />
      </div>
    </Spin>
  );
});
