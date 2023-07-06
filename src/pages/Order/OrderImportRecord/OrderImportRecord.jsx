import React, { useState, useEffect } from 'react';
import { Pagination, Space, Modal, message, Empty, Typography } from 'antd';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Panel from '@/components/Panel';
import Css from './OrderImportRecord.module.scss';

import { importTaskList } from '@/services/task';

const { confirm } = Modal;
const { Text, Link } = Typography;

export default () => {
  const [listData, setListData] = useState({});

  useEffect(() => {
    importTaskListApi();
  }, []);

  const importTaskListApi = page => {
    importTaskList({
      page: page || 1,
      pageSize: 10,
    }).then(res => {
      if (res?.success) {
        setListData(res.data);
      }
    });
  };

  const orderImportRecordListApi = page => {
    // orderImportRecordList({
    //   page: page || 1,
    // }).then(res => {
    //   if (res?.success) {
    //     setListData(res.data);
    //   }
    // });
  };

  const downloadReport = item => {
    // orderImportRecordDownload({
    //   recordId: item.recordId,
    // }).then(res => {
    //   // console.log(res);
    //   const blob = new Blob([res], {
    //     type: 'application/vnd.ms-excel;charset=UTF-8',
    //   });
    //   const downloadElement = document.createElement('a');
    //   const href = window.URL.createObjectURL(blob);
    //   downloadElement.href = href;
    //   downloadElement.download = `${item.exportTime} 导出订单列表.xls`;
    //   document.body.appendChild(downloadElement);
    //   downloadElement.click();
    //   document.body.removeChild(downloadElement);
    //   window.URL.revokeObjectURL(href);
    // });
  };

  const delReport = recordId => {
    // confirm({
    //   title: '导出记录删除?',
    //   icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    //   content: '确定删除导出记录吗？',
    //   okType: 'danger',
    //   onOk() {
    //     orderImportRecordDelete({
    //       recordId,
    //     }).then(res => {
    //       if (res?.success) {
    //         message.success('删除成功');
    //         orderImportRecordListApi(listData.current);
    //       }
    //     });
    //   },
    //   onCancel() {
    //     console.log('Cancel');
    //   },
    // });
  };

  return (
    <Panel>
      {listData?.rows?.length == 0 && <Empty />}
      {listData?.rows?.length > 0 &&
        listData?.rows?.map(item => {
          return (
            <div className={Css['export-import-item-box']} key={item.recordId}>
              <div className={Css['item-header']}>
                <p>
                  导入时间：{item?.importTime}
                  <span style={{ marginLeft: 18 }}>
                    导入状态：
                    {item.taskStatus == 1 && <Text disabled>导入中...</Text>}
                    {item.taskStatus == 2 && (
                      <Text type="danger">导入失败{item?.errorMsg && `-${item.errorMsg}`}</Text>
                    )}
                    {item.taskStatus == 3 && <Text type="success">导入成功</Text>}
                  </span>
                </p>
                <a href={item?.originalUrl}>下载</a>
              </div>
              <div className={Css['item-content']}>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>导入类型：</p>
                  <p className={Css['row-text']}>{item.type}</p>
                </div>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>导入数量：</p>
                  <p className={Css['row-text']}>{item.importCount || '--'}</p>
                </div>
                <div className={Css['content-row']} />
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>导入成功：</p>
                  <p className={Css['row-text']}>{item.successCount || '--'}</p>
                </div>
                <div className={Css['content-row']}>
                  <p className={Css['row-title']}>导入失败：</p>
                  <p className={Css['row-text']}>
                    {item?.failCount ? <Text type="danger">{item.failCount}</Text> : '--'}
                  </p>
                </div>
                <div className={`${Css['content-row']} ${Css['content-row-right']}`}>
                  {item?.failUrl && (
                    <a href={item?.failUrl}>
                      <Text type="danger">下载失败文件</Text>
                    </a>
                  )}
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
          onChange={e => importTaskListApi(e)}
        />
      </div>
    </Panel>
  );
};
