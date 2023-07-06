import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import Panel from '@/components/Panel';
import { Link } from 'react-router-dom';
import { Button, PageHeader, Table, Modal, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Columns from './columns';
import { showBut } from '@/utils/utils'

import { memberGradeList, memberGradeDelete } from '@/services/member';

const { confirm } = Modal;

export default props => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    memberGradeListApi();
  }, []);

  const memberGradeListApi = () => {
    memberGradeList().then(res => {
      if (res?.success) {
        setListData(res.data);
      }
    });
  };

  const configLevel = gradeId => {
    history.push(`/users/levelList/add?gradeId=${gradeId}`);
  };

  const delLevel = gradeId => {
    confirm({
      title: '删除会员等级',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '确定删除会员等级吗？',
      okType: 'danger',
      onOk() {
        memberGradeDelete({
          gradeId,
        }).then(res => {
          if (res?.success) {
            memberGradeListApi();
            message.success('会员等级删除成功');
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Panel>
      <PageHeader
        style={{ backgroundColor: '#fff' }}
        title=""
        extra={[
          <Link to="/users/levelList/add">
            { showBut('users_levelList', 'users_level_add') && <Button type="primary">添加会员等级</Button> }
          </Link>,
        ]}
      >
        <Table
          dataSource={listData}
          rowKey="gradeId"
          columns={Columns.ListScope({ configLevel, delLevel })}
          pagination={false}
        />
      </PageHeader>
    </Panel>
  );
};
