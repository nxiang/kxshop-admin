import React, { Fragment, useEffect, useState, useImperativeHandle } from 'react';
import { Button, Modal, message, Row, Col, Upload, Form, Descriptions, Space } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import Style from './style.scss';

/**
 * @param {tips} 导入提示
 * @var {status} none: 未导入, loading: 导入中, success: 导入成功, fail: 导入失败;
 * */

const formLayout = {
  labelAlign: 'left',
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const template =
  'https://kxgshop.oss-cn-hangzhou.aliyuncs.com/%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF/%E5%95%86%E5%93%81%E7%A6%81%E5%94%AE%E5%8C%BA%E5%9F%9F%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF-%E5%BC%80%E5%BF%83%E5%95%86%E5%9F%8E.xls';

const ImportFile = ({ importFileRef, visible, tips, api, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [status, setStatus] = useState('none');
  const [importData, setImportData] = useState(undefined);

  useImperativeHandle(importFileRef, () => ({
    status,
  }));

  const uploadProps = {
    accept: '.xlsx,.xls',
    maxCount: 1,
    fileList,
    showUploadList: {
      showRemoveIcon: false,
    },
    beforeUpload: file => {
      return new Promise(async (resolve, reject) => {
        if (file.size / 1024 / 1024 > 50) {
          reject(message.warning('文件大于50M，请重新上传'));
        }
        resolve();
      });
    },
    onChange: e => {
      setFileList(e.fileList);
    },
  };

  useEffect(() => {
    if (!visible) {
      setFileList([]);
      setStatus('none');
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (status === 'success') {
      onClose(true);
      message.success(`导入成功，成功导入${importData?.totalCount}条数据。`);
    }
  }, [status]);

  const submit = () => {
    console.log('form=', form.getFieldsValue());
    const { file } = form.getFieldsValue();
    if (!file || file.length <= 0) {
      return message.warning('导入文件不能为空');
    }
    setStatus('loading');
    const formData = new FormData();
    formData.append('xlsFile', file.file.originFileObj);
    api(formData).then(res => {
      if (res.success) {
        setImportData(res.data);
        if (res.data.totalCount > res.data.successCount) {
          setStatus('fail');
        } else {
          setStatus('success');
        }
      } else {
        onClose();
      }
    });
  };

  const Footer = (
    <Row justify="end" gutter={[24, 24]}>
      {status === 'none' && (
        <Col>
          <Button onClick={onClose}>取消</Button>
        </Col>
      )}
      <Col>
        <Button type="primary" onClick={status === 'none' ? submit : onClose}>
          {{ none: '开始导入', fail: '确定' }[status]}
        </Button>
      </Col>
    </Row>
  );

  return (
    <Modal
      className={Style.exportFile}
      width={600}
      title={{ none: '导入', loading: '导入中', fail: '导入结果' }[status]}
      visible={visible}
      onCancel={status !== 'loading' && onClose}
      footer={(status === 'none' || status === 'fail') && Footer}
    >
      {status === 'none' ? (
        <Fragment>
          <Form form={form} {...formLayout}>
            <Form.Item
              label="文件上传"
              name="file"
              extra={
                <Fragment>
                  仅支持上传小于50M的Excel文件　
                  <span className="g__link" onClick={() => window.open(template)}>
                    下载模版
                  </span>
                </Fragment>
              }
            >
              <Upload {...uploadProps}>
                {fileList.map((item, index) => (
                  <Fragment key={`file-${index}`}>
                    <img
                      className={Style.fileIcon}
                      src="https://img.kxll.com/data_collect_center/xls.png"
                      alt=""
                    />
                    <span className={Style.fileName}>{item.name}</span>
                  </Fragment>
                ))}
                {fileList.length <= 0 ? (
                  <Button size="small" icon={<UploadOutlined />}>
                    上传表格
                  </Button>
                ) : (
                  <span className="g__link">重新选择文件</span>
                )}
              </Upload>
            </Form.Item>
          </Form>
          <Descriptions title="导入须知" column={1} colon={false}>
            {tips?.map((item, index) => (
              <Descriptions.Item label={`${index + 1}.`} key={`tips-${index}`}>
                {item}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Fragment>
      ) : status === 'loading' ? (
        <Space>
          <LoadingOutlined />
          表格数据导入中，请勿刷新界面...
        </Space>
      ) : status === 'fail' ? (
        <Fragment>
          导入成功{importData.successCount}条，失败{importData.totalCount - importData.successCount}
          条。请下载表格查看失败原因，修改后重新导入。
          <div className="g__link" onClick={() => window.open(importData.errorFileOssUrl)}>
            下载失败数据
          </div>
        </Fragment>
      ) : null}
    </Modal>
  );
};

export default ImportFile;
