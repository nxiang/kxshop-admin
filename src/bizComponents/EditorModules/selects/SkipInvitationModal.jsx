// 营销活动选择
import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Table } from 'antd';
import Css from './SkipInvitationModal.module.scss';
import { inviteActivityList } from '@/services/activity';

export default props => {
  const inviteActivityListApi = () => {
    inviteActivityList({
      status: 2,
      pageSize: 10,
      page: 1,
    }).then(res => {
      if (res.success) {
        Modal.info({
          title: '邀请有礼配置说明',
          width: 700,
          content: (
            <div>
              <p style={{ marginBottom: 8 }}>
                配置完成邀请有礼后，点击跳转对应进行中的邀请有礼活动
              </p>
              <Table
                rowKey="activityId"
                dataSource={res.data.rows}
                columns={[
                  { title: '活动ID', dataIndex: 'activityId', align: 'center' },
                  { title: '活动名称', dataIndex: 'activityName', align: 'center' },
                  {
                    title: '活动时间',
                    align: 'center',
                    render: record => `${record?.beginTime} 至 ${record?.endTime}`,
                  },
                ]}
                pagination={false}
              />
            </div>
          ),
        });
      }
    });
  };

  const showModal = () => {
    inviteActivityListApi();
  };

  return (
    <Fragment>
      <div
        style={{ width: props.width ? `${props.width}px` : '238px' }}
        className={Css['selectInput']}
        onClick={showModal}
      >
        邀请有礼配置说明
      </div>
    </Fragment>
  );
};
