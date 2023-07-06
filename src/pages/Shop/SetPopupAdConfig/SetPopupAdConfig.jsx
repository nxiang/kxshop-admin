import React, { useState, useEffect } from 'react';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { history } from '@umijs/max';
import {
  Button,
  Modal,
  Input,
  DatePicker,
  Radio,
  Form,
  message,
  Spin,
  Upload,
  Checkbox,
  Switch,
} from 'antd';
import Css from './SetPopupAdConfig.module.scss';
import Panel from '@/components/Panel';
import { isObject } from 'lodash-es';
import moment from 'moment';

import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather';
import SpecialSelect from '@/bizComponents/EditorModules/selects/SpecialSelect';
import GoodsIdSelect from '@/bizComponents/EditorModules/selects/GoodsIdSelect';

// 引入接口
import { saveOrUpdateAdvert, getAdvertisingDetail, dataSearch } from '@/services/shop';
import { withRouter } from '@/utils/compatible';

const { confirm } = Modal;

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

// 上传限制
function beforeUpload(file) {
  return new Promise((resolve, reject) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('仅支持jpg、jpeg、png、gif格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能大于2M');
    }
    // 判断文件是否符合正则表达式的规则
    if (!(isJpgOrPng && isLt2M)) {
      return reject(false);
    }
    return resolve(true);
  });
}

function AliyunOSSUpload(props) {
  const [spinIs, setSpinIs] = useState(false);

  const { item } = props;
  return (
    <div className={Css['item-img-box']}>
      <Spin tip="上传中..." spinning={spinIs}>
        <Upload
          name="file"
          action="/proxy/cloud/oss/upload"
          data={{ type: 'tenant' }}
          response={'{"status": "success"}'}
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={info => {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList, '上传中');
            }
            if (info.file.status === 'uploading') {
              setSpinIs(true);
            }
            if (info.file.status === 'done') {
              if (info.file.response) {
                let res = info.file.response;
                if (res.errorCode === '0') {
                  props.alterImage(res.data.url);
                  message.success(`${info.file.name} 上传成功`);
                } else {
                  message.error(res.errorMsg);
                }
                setSpinIs(false);
              }
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败.`);
              setSpinIs(false);
            }
          }}
        >
          {item ? (
            <div className={Css['img-show-box']} style={{ width: 355 }}>
              <div className={Css['img-mask']}>
                <div className={Css['mask-text']}>替换</div>
              </div>
              <img className={Css['img-show-img']} src={item} />
            </div>
          ) : (
            <div className={Css['item-img-upload']} style={{ width: 355, minHeight: 100 }}>
              <PlusOutlined />
              <p className={Css['upload-text']}>添加图片</p>
            </div>
          )}
        </Upload>
      </Spin>
    </div>
  );
}

function SetSpecialConfig(props) {
  const {
    collapsed,
    match: {
      params: { popupId },
    },
  } = props;

  const formPropsData = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    initialValues: {
      advertisingName: '',
      rangeTime: [],
      showPage: [],
      launchStrategy: 'everyTime',
      imageLongPress: false,
    },
    autoComplete: 'off',
  };

  // 弹窗图片
  const [imageUri, setImageUri] = useState('');
  // 跳转路径
  const [jumpData, setJumpData] = useState({ type: 'none', link: '' });
  // 是否展示专题页具体选项
  const [specialInfoShow, setSpecialInfoShow] = useState(false);
  // 专题页Id
  const [specialId, setSpecialId] = useState({ id: '', value: '' });
  // 是否展示商品详情页具体选项
  const [goodsDetailShow, setGoodsDetailShow] = useState(false);
  const [goodsDetailId, setGoodsDetailId] = useState({
    id: '',
    value: '',
  });

  const [form] = Form.useForm();

  useEffect(() => {
    getDetailData();
  }, []);

  const getDetailData = () => {
    if (popupId !== 'add') {
      getAdvertisingDetail({ oneId: popupId }).then(async res => {
        console.log('res', res);
        if (res.data && res.success) {
          const {
            advertisingName,
            imageLongPress,
            launchStrategy,
            pageInfoResults,
            linkInfo,
            launchStartDate,
            launchEndDate,
            showPage,
            imageUri,
          } = res.data;

          // 处理跳转链接并调取接口获取回显参数
          const requestState = [];
          if (
            linkInfo?.type !== 'none' &&
            linkInfo?.type !== 'keyword' &&
            linkInfo?.type !== 'h5Url' &&
            linkInfo?.type !== 'pageSkip' &&
            linkInfo?.type !== 'wxapp' &&
            linkInfo?.type !== 'aliapp' &&
            linkInfo?.type !== 'alipayCoupon' &&
            linkInfo?.type !== 'alipayMembers' &&
            linkInfo?.type !== 'alipaySkip' &&
            linkInfo?.data != ''
          ) {
            linkInfo?.link &&
              requestState.push({
                type: linkInfo?.type,
                id: linkInfo?.link,
                slefDo: 2,
              });
          } else {
            let itemData;
            try {
              itemData = JSON.parse(linkInfo?.link);
              if (!(typeof itemData === 'object' && itemData)) {
                itemData = linkInfo?.link;
              }
            } catch (error) {
              itemData = linkInfo?.link;
            }
            linkInfo.link = itemData;
          }
          // 如果是跳转到专题页，还需要二外获取下专题页的信息
          const special = pageInfoResults.find(item => item.pageType == 'special');
          if (special) {
            requestState.push({
              type: 'special',
              id: special.pageId,
              slefDo: 1,
            });
            setSpecialInfoShow(true);
          }
          const goodsDetail = pageInfoResults.find(item => item.pageType == 'goodsDetail');
          if (goodsDetail) {
            requestState.push({
              type: 'goodsDetail',
              id: goodsDetail.pageId,
              slefDo: 3,
            });
            setGoodsDetailShow(true);
          }
          setJumpData({
            ...linkInfo,
          });
          if (requestState.length > 0) {
            let result = await dataSearch(requestState);
            if (result.errorCode === '0') {
              requestState.forEach((ele, idx) => {
                if (ele.slefDo == 1) {
                  setSpecialId({
                    id: result.data[idx].id,
                    value: result.data[idx].value,
                  });
                } else if (ele.slefDo == 2) {
                  setJumpData({
                    type: result.data[idx].type,
                    link: result.data[idx],
                  });
                } else if (ele.slefDo == 3) {
                  setGoodsDetailId({
                    id: result.data[idx].id,
                    value: result.data[idx].value,
                  });
                }
              });
            }
          }
          setImageUri(imageUri);
          form.setFieldsValue({
            showPage: pageInfoResults.map(item => item.pageType),
            rangeTime: [moment(launchStartDate), moment(launchEndDate)],
            launchStrategy,
            advertisingName,
            imageLongPress,
          });
        }
      });
    }
  };

  const selfJudgeParams = data => {
    const { jumpData, showPage, specialId, imageUri } = data;
    // 判断跳转路径有无填写
    if (
      ![
        'none',
        'skipInvitation',
        'dailyAttendance',
        'live',
        'integralMall',
        'memberCenter',
        'dailyAttendance',
        'community',
      ].includes(jumpData.type) &&
      !jumpData.link
    ) {
      console.log('jumpData.type', jumpData.type);
      message.warning('请选择具体跳转参数');
      return true;
    }
    // 判断为专题页时需要有专题页信息
    if (showPage.includes('special') && !specialId?.id) {
      message.warning('请选择具体的专题页');
      return true;
    }
    if (showPage.includes('goodsDetail') && !goodsDetailId?.id) {
      message.warning('请选择具体的商品');
      return true;
    }
    // 判断图片是否有
    if (!imageUri) {
      message.warning('请添加图片');
      return true;
    }

    return false;
  };

  const saveAndSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { showPage, advertisingName, rangeTime, launchStrategy, imageLongPress } = values;

      // 判断是否信息完全
      let hasAll = selfJudgeParams({ jumpData, showPage, specialId, imageUri });
      if (hasAll) return;

      let pageInfoParamList = [];
      if (showPage.includes('main')) {
        pageInfoParamList.push({ pageType: 'main', pageId: 0 });
      }
      if (showPage.includes('vipCenter')) {
        pageInfoParamList.push({ pageType: 'vipCenter', pageId: 0 });
      }
      if (showPage.includes('special')) {
        pageInfoParamList.push({
          pageType: 'special',
          pageId: specialId?.id,
        });
      }
      if (showPage.includes('goodsDetail')) {
        pageInfoParamList.push({
          pageType: 'goodsDetail',
          pageId: goodsDetailId?.id,
        });
      }
      if (showPage.includes('paySuccess')) {
        pageInfoParamList.push({ pageType: 'paySuccess', pageId: 0 });
      }
      if (showPage.includes('paySuccess')) {
        pageInfoParamList.push({ pageType: 'paySuccess', pageId: 0 });
      }
      let jumpDataLink = jumpData.link;

      if (jumpData.type === 'none') {
        jumpDataLink = '';
      } else if (
        jumpData.type === 'keyword' ||
        jumpData.type === 'h5Url' ||
        jumpData.type === 'pageSkip' ||
        jumpData.type === 'wxapp' ||
        jumpData.type === 'aliapp' ||
        jumpData.type === 'alipayCoupon' ||
        jumpData.type === 'alipayMembers' ||
        jumpData.type === 'alipaySkip'
      ) {
        jumpDataLink = jumpDataLink;
      } else {
        jumpDataLink = String(jumpDataLink?.id || '');
      }
      // popupId
      const params = {
        advertisingName,
        imageUri,
        imageLongPress,
        launchStrategy,
        pageInfoParamList,
        linkInfo: {
          type: jumpData.type,
          link: isObject(jumpDataLink) ? JSON.stringify(jumpDataLink) : jumpDataLink,
        },
        launchStartDate: rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
        launchEndDate: rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      if (popupId !== 'add') params.oneId = popupId;
      // todo save
      console.log('params=', params);
      let res = await saveOrUpdateAdvert(params);
      if (res.success) {
        popupId == 'add' ? message.success('添加成功') : message.success('修改成功');
        history.go(-1);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // 返回上个页面
  const backtrack = () => {
    confirm({
      title: '返回',
      content: '确认直接返回吗？返回后将不保留当前修改内容。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        history.go(-1);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const alterType = type => {
    setJumpData({
      type,
      link: '',
    });
  };

  const alterData = link => {
    setJumpData({
      ...jumpData,
      link,
    });
  };
  const alterFocus = e => {};
  const alterSpecialId = data => {
    setSpecialId({
      ...specialId,
      ...data,
    });
  };

  const showPageChange = data => {
    console.log('data', data);
    setSpecialInfoShow(data.includes('special'));
    setGoodsDetailShow(data.includes('goodsDetail'));
  };

  return (
    <Panel title={popupId == 'add' ? '新建弹窗' : '编辑弹窗'}>
      <div className={Css['set-popup-config-box']}>
        <div className={Css['popup-main']}>
          <div className={Css['preview-phone']}>
            <div className={Css['popup-box']}>
              {imageUri && <img className={Css['choosed-img']} src={imageUri} alt="" />}
              {!imageUri && (
                <div className={Css['default-img-box']}>
                  <img
                    src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
                    alt=""
                  />
                </div>
              )}
              <CloseCircleOutlined className={Css['close-btn']} />
            </div>
          </div>
          <div className={Css['opt-content-box']}>
            <Form name="popSet" form={form} {...formPropsData}>
              <Form.Item
                label="广告名称"
                name="advertisingName"
                rules={[{ required: true, message: '请输入广告名称' }]}
              >
                <Input placeholder="请输入广告名称" maxLength={30} />
              </Form.Item>
              <Form.Item label="跳转路径">
                <div className={Css['select-gather-box']}>
                  <SelectGather
                    allChoose
                    type={jumpData.type}
                    data={jumpData.link}
                    alterType={e => alterType(e)}
                    alterData={e => alterData(e)}
                    alterFocus={e => alterFocus(e)}
                  />
                </div>
              </Form.Item>
              <Form.Item label="长按保存" name="imageLongPress" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                name="rangeTime"
                label="投放时间"
                rules={[{ type: 'array', required: true, message: '请选择投放时间' }]}
              >
                <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
              <Form.Item
                name="showPage"
                label="应用页面"
                rules={[{ required: true, message: '请选择应用页面' }]}
              >
                <Checkbox.Group onChange={data => showPageChange(data)}>
                  <Checkbox value="main">首页</Checkbox>
                  <div className={Css['flex-box']}>
                    <Checkbox value="special">专题页</Checkbox>
                    {specialInfoShow && (
                      <SpecialSelect
                        itemType={0}
                        itemData={specialId}
                        alterData={data => alterSpecialId(data)}
                      />
                    )}
                  </div>
                  <Checkbox value="vipCenter">会员中心</Checkbox>
                  <div className={Css['flex-box']}>
                    <Checkbox value="goodsDetail">商品详情页</Checkbox>
                    {goodsDetailShow && (
                      <GoodsIdSelect
                        itemType={0}
                        itemData={goodsDetailId}
                        alterData={data => setGoodsDetailId(data)}
                      />
                    )}
                  </div>
                  <Checkbox value="paySuccess">支付成功页</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="launchStrategy" label="推送频次" required>
                <Radio.Group>
                  <Radio value="everyTime">每次进入</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="添加图片" required>
                <AliyunOSSUpload item={imageUri} alterImage={imgUrl => setImageUri(imgUrl)} />
                <p className={Css['item-text']}>推荐图片尺寸840*1080，大小不超过2M</p>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
          <Button style={{ marginRight: 16 }} onClick={() => backtrack()}>
            返回
          </Button>
          <Button type="primary" onClick={() => saveAndSubmit()}>
            保存
          </Button>
        </div>
      </div>
    </Panel>
  );
}

export default withRouter(connect(mapStateToProps)(SetSpecialConfig));
