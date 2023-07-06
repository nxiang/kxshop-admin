import React from 'react';
import { Space } from 'antd';
import { Link } from '@umijs/max';
import { showBut } from '@/utils/utils';
import Css from './GoodsManage.module.scss';

const goodsListScope = ({ delItem, soldOut, putaway }) => {
  const operation = record => {
    return (
      <Space>
        {showBut('communityGoods', 'edit') && (
          <Link to={`/community/goodsManage/addGoods?type=update&itemId=${record.itemId}`}>
            编辑
          </Link>
        )}
        {showBut('communityGoods', 'added') && record.state == 0 && (
          <a onClick={() => putaway(record)}>上架</a>
        )}
        {showBut('communityGoods', 'offshelves') && record.state == 1 && (
          <a onClick={() => soldOut(record)}>下架</a>
        )}
        {showBut('communityGoods', 'delete') && <a onClick={() => delItem(record)}>删除</a>}
      </Space>
    );
  };

  const goodShow = record => {
    return (
      <div className={Css.goodShowBox}>
        <div className={Css.goodImgBox}>
          <img className={Css.goodImg} src={record.imageSrc} alt="" />
        </div>
        <div className={Css.goodDetailBox}>
          <div className={Css.goodDetailTitle}>{record.itemName}</div>
          <div className={Css.goodDetailId}>id：{record.itemId}</div>
        </div>
      </div>
    );
  };

  const priceShow = record => {
    if (record?.minSalePrice == record?.maxSalePrice)
      return <div>{Number(record?.minSalePrice / 100).toFixed(2)}</div>;
    return (
      <div>
        {Number(record?.minSalePrice / 100).toFixed(2)} -{' '}
        {Number(record?.maxSalePrice / 100).toFixed(2)}
      </div>
    );
  };

  return [
    {
      title: '商品',
      render: goodShow,
    },
    {
      title: '社区团购状态',
      render: render =>
        ({
          0: <p>已下架</p>,
          1: <p style={{ color: 'rgba(102, 209, 32, 1)' }}>出售中</p>,
          2: <p>已售罄</p>,
        }[render.state]),
    },
    {
      title: '社区团购价',
      render: priceShow,
      // dataIndex: 'linePrice',
    },
    {
      title: '销量',
      dataIndex: 'saleCount',
    },
    {
      title: '交易额',
      dataIndex: 'saleAmount',
      render: record => (record ? Number(record / 100).toFixed(2) : '0.00'),
    },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
      render: operation,
    },
  ];
};

export default {
  goodsListScope,
};
