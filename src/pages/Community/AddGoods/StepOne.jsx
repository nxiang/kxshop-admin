import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Row, Col, Button, message, Form, Divider, Checkbox, Input, Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import Css from './AddGoods.module.scss';
import { http } from '@/utils/http';
import GoodsDetail from './module/GoodsDetail';
import Specifications from './Specifications';

import { kxllUpload } from '@/services/upload';
import { history } from '@umijs/max';
import { useLocation } from '@/utils/compatible';

const { TextArea } = Input;

const StepOne = props => {
  const {
    productInfo,
    stepOneParams,
    // history,
    onSubmit,
    // location: { query },
  } = props;
  const location = useLocation()
  const {query} = location
  const [form] = Form.useForm();
  const specRef = useRef();

  useEffect(() => {
    if (productInfo) {
      // if (productInfo.classId == 4) {
      //   console.log(1111);
      // }
      console.log(productInfo);
      fillForm(productInfo);
    }
  }, [productInfo]);

  useEffect(() => {
    if (query?.type == 'add') {
      fillForm(stepOneParams);
    }
  }, []);

  // useEffect(() => {
  //   console.log("specificationsDisplay", specificationsDisplay)
  //   console.log("specInfo", specInfo)
  //   if (!specificationsDisplay && productInfo) {
  //     console.log(specInfo)
  //     setSpecificationsDisplay(true);
  //   }
  // }, [specInfo]);

  const fillForm = data => {
    form.setFieldsValue({
      itemName: data?.itemName,
      jingle: data?.jingle,
      itemCode: data?.itemCode,
    });
    console.log(data);
    if (Array.isArray(data?.imageList)) {
      const goodsImgList = [];
      data.imageList.forEach(item => {
        if (!item.type) {
          goodsImgList.push(item);
        } else {
          setVideoUrl(item.imageSrc)
        }
      });
      setImgList(
        goodsImgList.map((item, index) => ({
          uid: `img-${index}`,
          name: `name-${index}`,
          status: 'done',
          url: item.imageSrc,
        }))
      );
    }
    if (productInfo) {
      setSpecInfo({
        specList: data.specList,
        skuList: data.skuList,
      });
      setSpecificationsDisplay(true);
    } else {
      setSpecificationsDisplay(true);
    }
    if (Array.isArray(data?.detail?.detailContentList)) {
      setRichTextDisplay(true);
      setEditInfo(data?.detail?.detailContentList);
    }
  };

  // 图片上传相关
  const [imgList, setImgList] = useState([]);
  const listenImgUpload = file => {
    setImgList([...file.fileList]);
  };
  const beforeImgUpload = file => {
    const fileSize = file.size / 1024;
    if (fileSize > 500) {
      message.error('图片不能大于500KB！');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 视频上传相关
  const [loading, setLoading] = useState(false);
  const [fileListTwo, setFileListTwo] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (videoUrl) {
      setVideo(videoUrl);
    }
  }, [videoUrl]);

  const setVideo = videoUrl => {
    const newFileListTwo = [];
    const videoInit = {
      uid: 1,
      name: videoUrl.substring(videoUrl.lastIndexOf('/') + 1),
      status: 'done',
      url: `${videoUrl}`,
      response: {
        data: {
          url: videoUrl,
        },
        imageUrl: videoUrl,
      },
    };
    newFileListTwo.push(videoInit);
    setLoading(false);
    setFileListTwo(newFileListTwo);
  };

  const uploadOssVideo = (uploadUrl, formData) => {
    return http('post', uploadUrl, formData);
  };

  const uploadImage = file => {
    kxllUpload({ type: 'item' }).then(res => {
      if (res.success) {
        const formData = new FormData();
        const aliyunOssToken = res.data;
        // 注意formData里append添加的键的大小写
        formData.append('key', aliyunOssToken.dir + aliyunOssToken.filename + file.name); // 存储在oss的文件路径
        formData.append('OSSAccessKeyId', aliyunOssToken.OSSAccessKeyId); // accessKeyId
        formData.append('policy', aliyunOssToken.policy); // policy
        formData.append('Signature', aliyunOssToken.signature); // 签名
        // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
        formData.append('file', file);
        formData.append('success_action_status', 200); // 成功后返回的操作码
        return uploadOssVideo(aliyunOssToken.host, formData).then(() => {
          const videoUrl = `${aliyunOssToken.host}/${aliyunOssToken.dir}${aliyunOssToken.filename}${
            file.name
          }`;
          setVideoUrl(videoUrl);
        });
      }
    });
  };

  const beforeVideo = file => {
    const isMp4 = file.type === 'video/mp4' || file.type === 'video/MP4';
    const size = file.size / 1024 / 1024 < 20;
    if (!isMp4) {
      message.warning('仅支持mp4格式');
      setLoading(false);
      return;
    }
    if (!size) {
      message.warning('视频大小不能大于20MB');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadImage(file); // 使用OSS直传,不默认上传
    };

    return false;
  };

  const uploadTwo = info => {
    const isMp4 = info.file.type === 'video/mp4' || info.file.type === 'video/MP4';
    let loading = false;
    if (!isMp4) {
      loading = false;
    }
    if (isMp4) {
      loading = !!info.fileList.length;
    }
    setLoading(loading);
  };

  const removeVideoFn = file => {
    console.log(file);
    setLoading(loading);
    setFileListTwo([]);
  };

  // 规格值相关
  const [specificationsDisplay, setSpecificationsDisplay] = useState(false);
  const [specInfo, setSpecInfo] = useState({});

  // 富文本相关
  const [richTextDisplay, setRichTextDisplay] = useState(false);
  const [detailContentList, setDetailContentList] = useState([]);
  const [editInfo, setEditInfo] = useState([]);

  const handeleRichTextDisplay = e => {
    setRichTextDisplay(e.target.checked);
  };

  const detailContentListFn = e => {
    setDetailContentList(e);
  };

  const showDetailFn = e => {
    setShowBtn(e);
  };

  const uploadVideoButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">{loading ? '上传中' : '上传视频'}</div>
    </div>
  );

  // 下一步
  const submit = () => {
    // 图片校验
    if (imgList.length <= 0) {
      return message.error('请上传图片!');
    }
    let isError = false;
    console.log(imgList);
    imgList.forEach(item => {
      if (!item.status) {
        isError = true;
      }
    });
    if (isError) {
      message.warning('请替换上传失败图片');
      return;
    }

    // 规格校验
    const Specifications = specRef.current.nextFn();
    if (!Specifications) return;

    // 视频图片集合
    const imageList = [];
    const goodsVideo = fileListTwo.map(file => {
      // 商品视频
      return (file.response && file.response.imageUrl) || file.url;
    });
    if (goodsVideo && goodsVideo.length) {
      imageList.push({
        type: 1,
        mainFlag: false,
        imageSrc: goodsVideo[0],
      });
    }
    imgList.forEach((item, index) => {
      imageList.push({
        type: 0,
        mainFlag: index === 0,
        imageSrc: item?.response ? item.response.data.url : item.url,
      });
    });
    form.validateFields().then(values => {
      const params = {
        itemType: 2,
        classId: 1,
        itemName: values.itemName,
        jingle: values.jingle,
        imageList,
        skuList: Specifications.skuList,
        specList: Specifications.specList,
        detail: { detailContentList: richTextDisplay ? detailContentList : [] },
        attributeList: [],
        itemCode: values.itemCode,
      };
      onSubmit(params);
    });
  };

  return (
    <>
      <Form form={form} labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} labelAlign="left">
        <div className={Css.commonTitle}>商品基础信息</div>
        <Form.Item
          label="商品名称"
          name="itemName"
          rules={[
            { required: true, message: '请输入商品名称' },
            { min: 3, message: '至少3个字!' },
            { max: 50, message: '不超过50个字!' },
          ]}
        >
          <Input style={{ width: 300 }} placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item label={<div className="g__will_choose">商品图片</div>}>
          <Upload
            accept=".jpg,.jpeg,.png"
            fileList={imgList}
            name="file"
            action="/proxy/cloud/oss/upload?type=goods"
            listType="picture-card"
            onChange={listenImgUpload}
            beforeUpload={beforeImgUpload}
          >
            {imgList.length < 5 ? (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>选择图片</div>
              </div>
            ) : null}
          </Upload>
          <div style={{ color: '#999' }}>主图大小500K以内,可上传5张支持jpg.jpeg.png图片</div>
        </Form.Item>
        <Form.Item label="商品卖点" name="jingle" rules={[{ max: 140, message: '不超过140个字!' }]}>
          <TextArea
            maxLength={140}
            style={{ width: 400, height: 120, resize: 'none' }}
            placeholder="商品卖点可填写商品的简介或特点，最长不超过140个汉字"
          />
        </Form.Item>
        <Form.Item label="商品视频">
          <Upload
            accept=".mp4"
            fileList={fileListTwo}
            name="file"
            action="/proxy/cloud/oss/upload?type=goods"
            listType="picture-card"
            beforeUpload={beforeVideo}
            onChange={uploadTwo}
            onRemove={removeVideoFn}
          >
            {fileListTwo.length >= 1 ? null : uploadVideoButton}
          </Upload>
          <div style={{ color: '#999' }}>视频大小20M以内,仅支持mp4格式</div>
        </Form.Item>
        {/* <Form.Item label="库存" name="storage" rules={[{ required: true, message: '请输入库存' }]}>
          <InputNumber
            style={{ width: 300 }}
            placeholder="请输入库存"
            controls={false}
            min={0}
            max={99999}
          />
        </Form.Item> */}
        <Form.Item
          label="商品编码"
          name="itemCode"
          rules={[
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
            },
          ]}
        >
          <Input style={{ width: 300 }} placeholder="请输入商品编码" />
        </Form.Item>
        {/* <Form.Item label="物流方式">包邮</Form.Item> */}
        <div className={Css.commonTitle}>商品销售信息</div>
        {specificationsDisplay && (
          <Form.Item label="商品规格">
            <Specifications ref={specRef} editInfo={specInfo || []} />
          </Form.Item>
        )}
      </Form>
      <Divider />
      <Checkbox
        checked={richTextDisplay}
        onChange={handeleRichTextDisplay}
        style={{ marginBottom: 24 }}
      >
        添加商品详情
      </Checkbox>
      {richTextDisplay && (
        <GoodsDetail
          detailEditList={editInfo || []}
          showDetailFn={() => {}}
          detailContentList={detailContentListFn}
        />
      )}
      <Divider />
      <Row justify="center" align="middle">
        <Col style={{ marginRight: 24 }}>
          {/* <Button type="primary" onClick={submit}>下一步</Button> */}
          <Button type="primary" onClick={submit}>
            发布
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => {
              history.go(-1)
            }}
          >
            取消
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default StepOne;
