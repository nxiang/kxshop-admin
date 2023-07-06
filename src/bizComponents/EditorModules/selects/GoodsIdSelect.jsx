import React, { useState } from 'react';
import { Modal, Table, message } from 'antd';
import Css from './GoodsIdSelect.module.scss';

import { choseItem } from '@/services/shop';

const { Column } = Table;

export default ({
  itemType,
  alterData,
  width,
  itemData
}) => {
  const [visible, setVisible] = useState(false);
  const [listData, setListData] = useState([]);
  const [sourcePage, setSourcePage] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取商品列表
  const choseItemApi = page => {
    const data = {
      page: page || 1,
      pageSize: sourcePage.pageSize,
      couponReceiveWay: 0,
      itemType,
    };
    choseItem(data).then(res => {
      setListData(res.data.rows);
      setSourcePage({
        current: res.data.current,
        pageSize: res.data.pageSize,
        total: res.data.total,
      });
    });
  };

  const empty = e => {
    alterData('');
    e.stopPropagation();
  };

  const showModal = () => {
    choseItemApi();
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  // 设置商品id
  const goodsIdSet = record => {
    const data = {
      id: record.id,
      value: record.name,
    };
    alterData(data);
    handleCancel();
    message.success('商品详情设置完成');
  };

  return (
    <div className={Css['goods-select-box']}>
      <div
        style={{ width: width ? `${width}px` : '238px' }}
        className={Css.selectInput}
        onClick={showModal}
      >
        {itemData?.value ? itemData.value : '请选择要跳转的内容'}
        {itemData?.value ? (
          <img
            onClick={empty}
            className={Css.slesctImg}
            src="https://img.kxll.com/admin_manage/del-icon.png"
            alt=""
          />
        ) : null}
      </div>
      <Modal title="商品选择" width="674px" visible={visible} footer={null} onCancel={handleCancel}>
        <p>请选择商品</p>
        <Table
          ellipsis
          rowKey={record => record.id}
          dataSource={listData}
          pagination={{
            current: sourcePage.current,
            pageSize: sourcePage.pageSize,
            total: sourcePage.total,
            onChange: page => choseItemApi(page),
          }}
        >
          <Column
            align="center"
            title="商品图片"
            width={100}
            render={record => (
              <img style={{ width: '40px', height: '40px' }} src={record.imagePath} alt="" />
            )}
          />
          <Column align="center" title="商品名称" dataIndex="name" />
          <Column
            align="center"
            title="操作"
            width={100}
            render={record => (
              <p style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => goodsIdSet(record)}>
                选择
              </p>
            )}
          />
        </Table>
      </Modal>
    </div>
  );
};
