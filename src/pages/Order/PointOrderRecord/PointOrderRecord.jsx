import React, { useState, useEffect } from 'react';
import { Pagination, Space, Modal, message, Empty, Typography } from 'antd';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Panel from '@/components/Panel';
import Css from './PointOrderRecord.module.scss';

import {
  orderExportRecordList,
  orderExportRecordDownload,
  orderExportRecordDelete,
} from '@/services/order';
import { integralOrderStatus } from '@/utils/baseData';

const { Link, Text } = Typography;
const { confirm } = Modal;

export default () => {
  const [listData, setListData] = useState({});

  useEffect(() => {
    orderExportRecordListApi();
  }, []);

  const orderExportRecordListApi = page => {
    orderExportRecordList({
      page: page || 1,
      fileType: 'POINT_ORDER',
    }).then(res => {
      if (res?.success) {
        setListData(res.data);
      }
    });
  };

  const downloadReport = item => {
    orderExportRecordDownload({
      recordId: item.recordId,
    }).then(res => {
      // console.log(res);
      const blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=UTF-8',
      });
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = `${item.exportTime} 导出积分订单列表.xls`;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    });
  };

  const delReport = recordId => {
    confirm({
      title: '导出记录删除?',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '确定删除导出记录吗？',
      okType: 'danger',
      onOk() {
        orderExportRecordDelete({
          recordId,
        }).then(res => {
          if (res?.success) {
            message.success('删除成功');
            orderExportRecordListApi(listData.current);
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
      {listData?.rows?.length == 0 && <Empty />}
      {listData?.rows?.length > 0 &&
        listData?.rows?.map(item => {
          return (
            <div className={Css['export-record-item-box']} key={item.recordId}>
              <div className={Css['item-header']}>
                <Text>导出时间：{item?.exportTime}</Text>
                {item.status == 0 && (
                  <Link>
                    报表生成中，请稍后 <LoadingOutlined />
                  </Link>
                )}
                {item.status == 1 && (
                  <Space>
                    <Link onClick={() => downloadReport(item)}>下载</Link>
                    <Text type="danger" onClick={() => delReport(item.recordId)}>
                      删除
                    </Text>
                  </Space>
                )}
                {item.status == 2 && <Text type="danger">导出失败</Text>}
              </div>
              <div className={Css['item-content']}>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>订单状态：</p>
                  <p className={Css['row-text']}>
                    {integralOrderStatus.find(subItem => subItem.value == item.orderStatus)
                      ?.label || '全部'}
                  </p>
                </div>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>下单时间：</p>
                  {item.createOrderStartTime == null || item.createOrderEndTime == null ? (
                    <p className={Css['row-text']}>--</p>
                  ) : (
                    <p className={Css['row-text']}>
                      {`${item.createOrderStartTime} 至 ${item.createOrderEndTime}`}
                    </p>
                  )}
                </div>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>发货时间：</p>
                  {item.sendStartTime == null || item.sendEndTime == null ? (
                    <p className={Css['row-text']}>--</p>
                  ) : (
                    <p className={Css['row-text']}>
                      {`${item.sendStartTime} 至 ${item.sendEndTime}`}
                    </p>
                  )}
                </div>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>订单数量：</p>
                  <p className={Css['row-text']}>{item?.quantity}</p>
                </div>
              </div>
            </div>
          );
        })}
      <div className={Css['pagination-box']}>
        <Pagination
          showQuickJumper
          hideOnSinglePage
          total={listData?.total ? listData?.total : 1}
          current={listData?.current ? listData?.current : 1}
          pageSize={listData?.pageSize ? listData?.pageSize : 10}
          showSizeChanger={false}
          onChange={e => orderExportRecordListApi(e)}
        />
      </div>
    </Panel>
  );
};
