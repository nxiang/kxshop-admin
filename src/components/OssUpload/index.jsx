import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CloseCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message, Spin } from 'antd';
import OssOperaete from 'oss-operate';
import Css from './index.module.scss';

export default props => {
  const {
    value, // vmodel的值（资源的url）eg: 'http://xxx.jpg'
    widthPx, // 上传器的宽度 （widthPx和heightPx，选一必传）eg:'100px'
    heightPx, // 上传器的高度 （widthPx和heightPx，选一必传）eg:'100px'
    limitSize = 2, // 以M为单位，若限制为100K则传入 0.1 eg: 0.1
    hasClose = true, // 是否存在删除
    limitFormat = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'], // 限制的类型，mdn:https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
    resolvingPower = [], // 分辨率限制
    onChange = () => {}, // 变化事件
    disabled = false // 是否禁用
  } = props;

  const [spinIs, setSpinIs] = useState(false);

  const operaeteRef = useRef(new OssOperaete());

  useEffect(() => {
    operaeteRef.current.init();
  }, []);

  const operaete = useMemo(() => operaeteRef.current, [operaeteRef.current]);

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: () => {
      return new Promise(() => {});
    },
    beforeUpload: async file => {
      try {
        const isLtFotmat = limitFormat.includes(file.type);
        const isLtSize = file.size / 1024 / 1024 < limitSize;

        if (!isLtFotmat) {
          const str = limitFormat.map(item => item?.split('/')?.[1] || '').join('、');
          message.error(`仅支持${str}格式的图片`);
        }
        if (!isLtSize) {
          let unit = 'M';
          let num = limitSize;
          if (limitSize > 0 && limitSize < 0.1) {
            unit = 'b';
            num = limitSize * 1000;
          } else if (limitSize >= 0.1 && limitSize < 1) {
            unit = 'kb';
            num = limitSize * 1000;
          }
          message.error(`文件大小不能大于${num}${unit}`);
        }

        // 校验分辨率
        if (resolvingPower.length) await checkImageWH(file, resolvingPower[0], resolvingPower[1]);

        // 判断文件是否符合正则表达式的规则
        if (!(isLtFotmat && isLtSize)) return false;

        setSpinIs(true);

        const url = await operaete.upload({
          file,
          business: 'kxgshop',
          callback: ({ type, payload }) => {
            if (type === 'hashing') {
              // md5解析中
            }
            if (type === 'uploading') {
              console.log('上传中');
            }
            if (type === 'error') {
              message.error(`${file.name} 上传失败.`);
            }
          },
        });
        console.log('url', url);
        if (url) {
          onChange(url);
          message.success('图片上传成功');
        } else {
          onChange('');
          message.error('图片上传失败');
        }
      } finally {
        setSpinIs(false);
      }
      return false;
    },
  };

  const deleteImg = e => {
    onChange('');
    // 阻止事件冒泡，（阻止这个合成事件，往document上冒泡，因此不会触发click方法）
    e.nativeEvent.stopImmediatePropagation();
    // 阻止合成事件间的冒泡，不会往最外层的div的test方法冒了，如果不加这句代码，就会冒泡至外层div，执行test方法。
    e.stopPropagation();
  };

  const checkImageWH = (file, width, height) => {
    return new Promise(function(resolve, reject) {
      const filereader = new FileReader();
      filereader.onload = e => {
        const src = e.target.result;
        const image = new Image();
        image.onload = function() {
          if ((width && this.width != width) || (height && this.height != height)) {
            message.error(`请上传尺寸为${width}*${height}的图片`);
            reject();
          } else {
            resolve();
          }
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  };

  return (
    <div className={Css['item-img-box']}>
      <Spin tip="上传中..." spinning={spinIs}>
        <Upload {...uploadProps} disabled={disabled}>
          {value ? (
            <div className={Css['img-show-box']} style={{ width: widthPx, height: heightPx }}>
              <div className={Css['img-mask']}>
                <div className={Css['mask-text']}>替换</div>
                {hasClose && (
                  <CloseCircleOutlined className={Css['close-btn']} onClick={e => deleteImg(e)} />
                )}
              </div>
              <img className={Css['img-show-img']} src={value} />
            </div>
          ) : (
            <div className={Css['item-img-upload']} style={{ width: widthPx, height: heightPx }}>
              <PlusOutlined />
              <p className={Css['upload-text']}>添加图片</p>
            </div>
          )}
        </Upload>
      </Spin>
    </div>
  );
};
