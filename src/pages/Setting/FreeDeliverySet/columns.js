import { Space } from 'antd';
import { showBut } from '@/utils/utils'

const freeDeliveryScope = props => {
  const { ModifyDelivery, DelDelivery } = props;

  const operationDom = record => {
    return (
      <Space>
        {showBut('setting_freeDeliverySet', 'setting_freeDeliverySet_edit') && <a onClick={() => ModifyDelivery(record)}>修改</a> }
        {showBut('setting_freeDeliverySet', 'setting_freeDeliverySet_del') && (<a style={{ color: '#ff4d4f' }} onClick={() => DelDelivery(record)}>删除</a>)}
      </Space>
    );
  };

  return [
    {
      title: '模板名称',
      dataIndex: 'templateName',
    },
    {
      title: '包邮规则',
      dataIndex: 'ruleDesc',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      width: 120,
      render: operationDom,
    },
  ];
};

export default { freeDeliveryScope };
