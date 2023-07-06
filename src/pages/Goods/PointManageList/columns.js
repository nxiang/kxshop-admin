import React from 'react';
import { Link } from '@umijs/max';
import { Divider, Row, Col, Image } from 'antd';
import { floatObj ,showBut } from '@/utils/utils';

const columns = ({ handleDelete, changeStatus }) => {
  const btnDisplay = ({ itemId, state }) => (
    <div>
      {
        showBut('pointManageList','pointManageList_edit')?<Link to={`/goods/PointManageList/pointManageEdit?type=update&itemId=${itemId}`}>编辑</Link>:null
      }
      <Divider type="vertical" />
      {state != 2 && showBut('pointManageList','pointManageList_down') && (
        <>
          <span
            className="g__link"
            onClick={() => {
              changeStatus(state, itemId);
            }}
          >
            {state == 1 ? '下架' : '上架'}
          </span>
          <Divider type="vertical" />
        </>
      )}
      {
        showBut('pointManageList','pointManageList_delete')? <span className="g__delete" onClick={() => { handleDelete(itemId)}}>删除</span>:null
      }
     
    </div>
  );

  return [
    {
      title: '商品名称',
      key: 'spmc',
      fixed: 'left',
      width: 220,
      render: ({ itemName, imageSrc }) => (
        <Row gutter={[8, 0]} justify="start" align="middle">
          <Col>
            <Image width={60} src={imageSrc} />
          </Col>
          <Col>{itemName}</Col>
        </Row>
      ),
    },
    { title: '商品编码', dataIndex: 'itemCode' },
    { title: '类型', dataIndex: 'className' },
    { title: '兑换价格', dataIndex: 'expendPoint', render: expendPoint => `${expendPoint}积分` },
    {
      title: '划线价',
      dataIndex: 'linePrice',
      render: linePrice => floatObj.divide(linePrice, 100),
    },
    { title: '库存', dataIndex: 'storage' },
    { title: '状态', dataIndex: 'stateText' },
    // { title: '顺序', dataIndex: 'disSort' },
    { title: '添加时间', dataIndex: 'gmtCreated' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 160,
      render: btnDisplay,
    },
  ];
};

export default columns;
