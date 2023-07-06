import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Row, Col, Button, Space, Upload, message, Spin } from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const beforeUpload = file => {
  return new Promise(resolve => {
    const isXls =
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const size = file.size / 1024 / 1024 < 5;
    if (!isXls) {
      message.error('仅支持xls、xlsx格式');
      return false;
    }
    if (!size) {
      message.error('文件不能大于5MB');
      return false;
    }
    return resolve(true);
  });
};

export default ({
  title = '标题',
  action = '/proxy/cloud/oss/upload?type=xls',
  loading = false,
  visible = false,
  setVisible = {},
  promptText,
  // 下载失败链接
  errorUrl,
  // 下载dom开关
  downloadShow = true,
  // 下载按钮文不能
  downloadText = '下载模版',
  // 下载的url链接
  downloadUrl = '',
  // 上传按钮文本
  uploadText = '上传表格',
  // 上传事件透出
  uploadSubmit = () => {},
  /**
   * 展示状态
   * 0 无结果
   * 1 全部失败
   * 2 部分失败
   * 3 全部成功
   */
  resulType = 0,
  // 上传成功文本
  importSuccessText = '',
}) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) setFileList([]);
  }, [visible]);

  const uploadOne = info => {
    console.log(info);
    const newFile = info.file;
    if (newFile.response?.data) {
      newFile.url = newFile.response.data.url;
    }
    if (newFile.response?.success == false) {
      newFile.status = 'error';
    }
    if (!newFile.status) {
      newFile.status = 'error';
    }
    if (newFile.size / 1024 / 1024 > 5) {
      newFile.status = 'error';
    }
    setFileList([newFile]);
    // let newfileList = [...info.fileList];
    // newfileList = newfileList.map(file => {
    //   if (file.response?.data) {
    //     return {
    //       ...file,
    //       url: file.response.data.url,
    //     };
    //   }
    //   return file;
    // });
    // newfileList = newfileList.filter(file => {
    //   if (file.response?.success) {
    //     return file.response.success || file.status === 'done';
    //   }
    //   return true;
    // });
    // newfileList = newfileList.map(item => {
    //   if (item.response?.success == false) {
    //     return {
    //       ...item,
    //       status: 'error',
    //     };
    //   }
    //   if (!item.status) {
    //     return {
    //       ...item,
    //       status: 'error',
    //     };
    //   }
    //   if (item.size / 1024 / 1024 > 2) {
    //     return {
    //       ...item,
    //       status: 'error',
    //     };
    //   }
    //   return item;
    // });
    // console.log(newfileList)
    // setFileList(newfileList);
  };

  const documentSubmit = () => {
    if (fileList.length == 0) {
      message.warning('请上传文件');
      return;
    }
    if (fileList[0].status == 'uploading') {
      message.warning('文件上传中，请耐心等待');
      return;
    }
    if (fileList[0].status != 'done') {
      message.warning('失败文件，请重新上传');
      return;
    }
    uploadSubmit(fileList[0].url);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      width={600}
      footer={null}
      closable={false}
      keyboard={false}
      maskClosable={false}
      onCancel={() => setVisible(false)}
    >
      <Spin spinning={loading}>
        {resulType == 0 ? (
          <Row>
            {downloadShow && (
              <Col span={24} style={{ margin: '20px 0 20px 0' }}>
                <a href={downloadUrl} download>
                  <Button icon={<DownloadOutlined />}>{downloadText}</Button>
                </a>
              </Col>
            )}
            <Col span={24} style={{ margin: '20px 0 40px 0' }}>
              <Upload
                fileList={fileList}
                name="file"
                action={action}
                // data={{ type: 'tenant' }}
                maxCount="1"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                beforeUpload={beforeUpload}
                onChange={uploadOne}
              >
                <Button icon={<UploadOutlined />}>{uploadText}</Button>
              </Upload>
            </Col>
            <Col span={24}>{promptText && promptText}</Col>
            <Col span={24} style={{ marginTop: 20 }}>
              <Row justify="end">
                <Space>
                  <Button onClick={() => setVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit" onClick={() => documentSubmit()}>
                    确认
                  </Button>
                </Space>
              </Row>
            </Col>
          </Row>
        ) : (
          <Row align="middle" gutter={[16, 40]}>
            {resulType == 1 && (
              <Fragment>
                <Col span={24}>
                  <Space>
                    <ExclamationCircleOutlined style={{ fontSize: 24, color: '#f81f22' }} />
                    全部导入失败！
                  </Space>
                </Col>
                <Col offset={2} span={22}>
                  <a href={errorUrl} download>
                    下载失败数据
                  </a>
                </Col>
              </Fragment>
            )}
            {resulType == 2 && (
              <Fragment>
                <Col span={24}>
                  <Space>
                    <CloseCircleOutlined style={{ fontSize: 24, color: '#ff9527' }} />
                    部分导入成功！
                  </Space>
                </Col>
                <Col offset={2} span={22}>
                  <a href={errorUrl} download>
                    下载失败数据
                  </a>
                </Col>
              </Fragment>
            )}
            {resulType == 3 && (
              <Fragment>
                <Col span={24}>
                  <Space>
                    <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    {importSuccessText || '全部导入成功！'}
                  </Space>
                </Col>
              </Fragment>
            )}
            <Col span={24}>
              <Row justify="end">
                <Button onClick={() => setVisible(false)}>关闭</Button>
              </Row>
            </Col>
          </Row>
        )}
      </Spin>
    </Modal>
  );
};
