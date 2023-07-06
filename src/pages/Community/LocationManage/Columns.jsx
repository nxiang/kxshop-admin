import { useMemo } from 'react';

const LocationScope = ({ businessShow, activeShow, inShow, pickShow }) =>
  useMemo(() => {
    return [
      {
        title: '自提点ID',
        width: 70,
        dataIndex: 'id',
        fixed: 'left',
      },
      {
        title: '自提点名称',
        width: 140,
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '自提点地址',
        width: 200,
        dataIndex: 'address',
        fixed: 'left',
      },
      {
        title: '团长姓名',
        width: 90,
        dataIndex: 'majorName',
      },
      {
        title: '团长手机号',
        width: 130,
        dataIndex: 'majorPhone',
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
      },
      {
        title: '创建人',
        width: 90,
        dataIndex: 'creatorName',
      },
      {
        title: '配送站',
        width: 160,
        dataIndex: 'distributionName',
      },
      {
        title: '营业状态',
        width: 90,
        dataIndex: 'businessStatus',
        render: render => {
          return {
            ...businessShow,
          }[render];
        },
      },
      {
        title: '状态',
        width: 90,
        dataIndex: 'isEnable',
        render: render => {
          return {
            ...pickShow,
          }[render];
        },
      },
      {
        title: '进件状态',
        width: 90,
        dataIndex: 'inStatus',
        render: render => {
          return {
            ...inShow,
          }[render];
        },
      },
      {
        title: '激活状态',
        width: 90,
        dataIndex: 'status',
        render: render => {
          return {
            ...activeShow,
          }[render];
        },
      },
    ];
  }, [businessShow, activeShow, inShow, pickShow]);

export { LocationScope };
