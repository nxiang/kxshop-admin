import React, { Fragment, useState } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Css from './ChoiceIcon.module.scss';

const beforeUpload = file => {
  return new Promise((resolve, reject) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('仅支持jpg、png、jpeg、gif格式');
      return false;
    }
    const size = file.size < 102400;
    if (!size) {
      message.error('文件不能大于100k');
      return false;
    }
    return resolve(true);
  });
};

export default ({ name, value, onChange }) => {
  const uploadPic = info => {
    let newfileList = [...info.fileList];
    newfileList = newfileList.map(file => {
      if (file.response?.data) {
        return {
          ...file,
          url: file.response.data.url,
        };
      }
      return file;
    });
    newfileList = newfileList.filter(file => {
      if (file.response?.success) {
        return file.response.success || file.status === 'done';
      }
      return true;
    });
    newfileList = newfileList.map(item => {
      if (item.response?.success == false) {
        message.error('图片上传失败');
        return {
          ...item,
          status: 'error',
        };
      }
      if (!item.status) {
        message.error('图片上传失败');
        return {
          ...item,
          status: 'error',
        };
      }
      if (item.size / 1024 / 1024 > 2) {
        message.error('图片上传失败，图片过大');
        return {
          ...item,
          status: 'error',
        };
      }
      return item;
    });
  };
  const onRemove = () => {
    onChange([]);
    return false;
  };
  const complate = res => {
    onChange(res.data);
  };
  return (
    <Fragment>
      <div className={Css['pic_list']}>
        <div className={Css['pic_word']}>
          <p style={{textAlign:'center',paddingLeft:'30px'}}>{name}</p>
          <Upload
            className={Css['test']}
            fileList={value}
            name="file"
            action="/proxy/cloud/oss/upload?type=goods"
            listType="picture-card"
            maxCount="1"
            accept="image/*"
            beforeUpload={beforeUpload}
            onChange={uploadPic}
            onRemove={onRemove}
            onSuccess={complate}
          >
            {(!value || value.length == 0) && (
              <div>
                <UploadOutlined />
                <span style={{ marginLeft: 4 }}>上传</span>
              </div>
            )}
          </Upload>
        </div>
      </div>
    </Fragment>
  );
};
