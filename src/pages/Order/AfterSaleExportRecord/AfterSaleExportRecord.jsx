import React, { useState, useEffect } from 'react';
import { Pagination, Space, Modal, message, Empty, Row, Col } from 'antd';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { refundTypeRenderStatus, refundTypeStatus } from '@/utils/baseData';
import Panel from '@/components/Panel';
import Css from './AfterSaleExportRecord.module.scss';

import {
  refundExportRecordList,
  refundExportRecordDownload,
  refundExportRecordDelete,
} from '@/services/order';

const { confirm } = Modal;

export default () => {
  const [listData, setListData] = useState({});

  useEffect(() => {
    refundExportRecordListApi();
  }, []);

  const refundExportRecordListApi = page => {
    refundExportRecordList({
      page: page || 1,
    }).then(res => {
      if (res?.success) {
        setListData(res.data);
      }
    });
  };

  const downloadReport = item => {
    refundExportRecordDownload({
      recordId: item.recordId,
    }).then(res => {
      // console.log(res);
      const blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=UTF-8',
      });
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = `${item.exportTime} 导出售后单列表.xls`;
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
        refundExportRecordDelete({
          recordId,
        }).then(res => {
          if (res?.success) {
            message.success('删除成功');
            refundExportRecordListApi(listData.current);
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
                <p>导出时间：{item?.exportTime}</p>
                {item.exportStatus == 0 && (
                  <p style={{ color: 'rgba(22,119,255,1)' }}>
                    报表生成中，请稍后 <LoadingOutlined />
                  </p>
                )}
                {item.exportStatus == 1 && (
                  <Space>
                    <p className={Css['item-header-btn']} onClick={() => downloadReport(item)}>
                      下载
                    </p>
                    <p
                      className={Css['item-header-btn']}
                      style={{ color: 'rgba(247,38,51,1)' }}
                      onClick={() => delReport(item.recordId)}
                    >
                      删除
                    </p>
                  </Space>
                )}
                {item.exportStatus == 2 && <p style={{ color: 'rgba(247,38,51,1)' }}>导出失败</p>}
              </div>
              <Space direction="vertical" size={16} className={Css['item-content']}>
                <Row>
                  <Col span={8}>
                    售后状态：
                    {refundTypeRenderStatus.find(subitem => subitem.value == item.status)?.label ||
                      '- -'}
                  </Col>
                  <Col span={8}>
                    售后类型：
                    {refundTypeStatus.find(subitem => subitem.value == item.refundType)?.label ||
                      '- -'}
                  </Col>
                  <Col span={8}>
                    申请售后时间：
                    {item.createStartTime == null || item.createEndTime == null
                      ? '- -'
                      : `${item.createStartTime} 至 ${item.createEndTime}`}
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>售后单数量：{item.quantity || '- -'}</Col>
                </Row>
              </Space>
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
          onChange={e => refundExportRecordListApi(e)}
        />
      </div>
    </Panel>
  );
};
