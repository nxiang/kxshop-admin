import React, { useState, useEffect } from 'react';
import Css from './SetService.module.scss';
import Panel from '@/components/Panel';
import KxUpload from '@/components/KxUpload/KxUpload';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';

import { kxllUpload } from '@/services/upload';
import { getAvatarMsg, setAvatarMsg } from '@/services/im';
import { showBut } from '@/utils/utils'

const { TextArea } = Input;

export default function SetService() {
  const [userId, setUserId] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [OSSData, setOSSData] = useState({});
  const [chitchatGreetings, setChitchatGreetings] = useState('');

  useEffect(() => {
    OSSDataInit();
    getAvatarMsgApi();
  }, [9999]);

  function OSSDataInit() {
    kxllUpload({
      type: 'avtar',
    }).then(res => {
      if (res.success) {
        setOSSData(res.data);
      }
    });
  }

  function getAvatarMsgApi() {
    getAvatarMsg().then(res => {
      if (res.success) {
        setUserId(res.data.id);
        setImageUrl(res.data.kefu_avatar);
        setChitchatGreetings(res.data.kefu_msg);
      }
    });
  }

  function setAvatarMsgApi() {
    setAvatarMsg({
      id: userId,
      url: imageUrl,
      msg: chitchatGreetings,
    }).then(res => {
      if (res.success) {
        message.success('提交成功');
      }
    });
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      let newImageUrl = OSSData.host + '/' + OSSData.dir + OSSData.filename + info.file.name;
      console.log(newImageUrl);
      setImageUrl(newImageUrl);
    }
  };

  function beforeUpload(file) {
    const isImg =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const size = file.size / 1024 / 1024 < 2;
    if (!isImg) {
      message.warning('仅支持图片格式');
    }
    if (!size) {
      message.warning('图片大小不能大于2MB');
    }
    console.log(size && isImg);
    return size && isImg;
  }

  function getExtraData(file) {
    return {
      key: OSSData.dir + OSSData.filename + file.name,
      OSSAccessKeyId: OSSData.OSSAccessKeyId,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  }

  return (
    <Panel title="客服设置">
      <div className={Css['set-service-box']}>
        <div className={Css['set-avatar-box']}>
          <p className={Css['set-avatar-title']}>客服头像：</p>
          <Upload
            name="file"
            listType="picture-card"
            action={OSSData.host}
            className="avatar-uploader"
            showUploadList={false}
            data={getExtraData}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <UploadOutlined />
            )}
          </Upload>
        </div>
        <p className={Css['set-notification-title']}>
          客服通知：<span className={Css['grey-text']}>（用户访问客服时，将显示该通知内容）</span>
        </p>
        <div>
          <TextArea
            value={chitchatGreetings}
            className={Css['set-notification-text']}
            rows={4}
            maxLength={500}
            placeholder={'请输入通知内容，最多500个字'}
            onChange={e => setChitchatGreetings(e.target.value)}
          />
        </div>
        {
          showBut('setService', 'set_service_submit') && (
            <Button type="primary" onClick={setAvatarMsgApi}>
              提交
            </Button>
          )
        }
      </div>
    </Panel>
  );
}
