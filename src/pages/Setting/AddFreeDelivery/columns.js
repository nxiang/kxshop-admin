import { Space } from 'antd';

const deliveryScope = props => {
  const { editDelivery, delDelivery } = props;

  const operationDom = record => {
    return (
      <Space>
        <a onClick={() => editDelivery(record)}>修改</a>
        <a style={{ color: '#ff4d4f' }} onClick={() => delDelivery(record)}>
          删除
        </a>
      </Space>
    );
  };

  return [
    {
      title: '包邮区域',
      dataIndex: 'areaNames',
    },
    {
      title: '操作',
      width: 120,
      render: operationDom,
    },
  ];
};

export default { deliveryScope };
