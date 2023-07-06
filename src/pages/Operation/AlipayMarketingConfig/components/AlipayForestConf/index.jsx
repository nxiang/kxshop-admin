import React, { useState, useEffect, useRef, useMemo } from 'react';
import Css from './index.module.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Spin, Input, InputNumber } from 'antd';
import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather';
import OssUpload from '@/components/OssUpload/index';

import { 
  getAxcStatus,
  editOpenOrCloseAxc,
  energyConfigDetailApi,
  setEnergyConfigApi
} from '@/services/activity'

export default props => {

  const [orderIdent, setOrderIdent] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [orderIdentList, setOrderIdentList] = useState([
    {label: '关闭', value: false },
    {label: '开启', value: true },
  ]);
  const [sucJumpLink, setSucJumpLink] = useState({
    type: 'home',
    link: ''
  });
  const [failText, setFailText] = useState('');
  const [integral, setIntegral] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const needDataType = ['special', 'pageSkip']


  useEffect(() => {
    getStatus()
  }, []);

  const getStatus = async () =>  {
    setSpinning(true)
    try {
      // let res = await getAxcStatus()
      let res = await energyConfigDetailApi()
      // console.log('res',res)
      if(res.success) {
        setOrderIdent(res.data.openOrClose)
        setIntegral(res.data.point)
        setFailText(res.data.failedInfo)
        setLogoUrl(res.data.logoImage)

        let successLinkInfo_link = res.data.successLinkInfo.link
        let successLinkInfo_type = res.data.successLinkInfo.type
        if(successLinkInfo_type === 'special') {
          successLinkInfo_link = JSON.parse(successLinkInfo_link)
        }
        setSucJumpLink({
          type: successLinkInfo_type,
          link: successLinkInfo_link
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSpinning(false)
    }
  }

  const moduleRadioChange = async (e) => {
    let res = await editFn({ openOrClose: e.target.value })
    if(res.success) setOrderIdent(e.target.value)
  }

  const editFn = async data => {
    const { type, link } = sucJumpLink
    let tmpLink = link
    if (type === 'special') tmpLink = tmpLink ? JSON.stringify(link) : ''

    let tmp_successLinkInfo = {
      type,
      link: tmpLink,
    }
    let params = {
      openOrClose: orderIdent,
      logoImage: logoUrl,
      successLinkInfo: tmp_successLinkInfo,
      failedInfo: failText,
      point: integral,
      ...data
    }

    if (needDataType.includes(params.successLinkInfo.type) && !params.successLinkInfo.link) {
      return message.warning('跳转路径不能为空')
    }

    let res = {}
    try {
      setSpinning(true)
      res = await setEnergyConfigApi(params)
      if(res.success) {
        message.success('自动保存成功');
      } else {
        message.error('自动保存失败');
        getStatus()
      }
    } catch (error) {
      res = { success: false }
      console.log(error)
      message.error('自动保存失败');
    } finally {
      setSpinning(false)
    }
    return res
  }

  // 修改跳转类型
  const alterType = async e => {
    let params = {
      type: e,
      link: ''
    }
    
    if(needDataType.includes(e)) {
      setSucJumpLink(params)
    } else {
      let res = await editFn({ successLinkInfo: params })
      if (res.success) setSucJumpLink(params)
    }
  }

  // 修改跳转目标
  const alterData = async data => {
    let params = {
      ...sucJumpLink,
      link: data
    }
    let res
    if (sucJumpLink.type === 'special') params.link = JSON.stringify(data)
    
    if (data) {
      res = await editFn({ successLinkInfo: params })
    } else {
      res = { success: true }
    }

    if (res.success) setSucJumpLink({
      ...sucJumpLink,
      link: data
    })

  }

  // 设置图片保存
  const logoImageSave = async data => {
    let res = await editFn({ logoImage: data })
    if(res.success) setLogoUrl(data)
  }

  return (
    <Spin size="large" spinning={spinning}>
      <h1 className={Css['setting-box-title']}>
        蚂蚁森林活动：
      </h1>
      <div className={Css['setting-box']}>
        <div className={Css['setting-item']}>
          <div className={Css['setting-item-title']}>订单识别方案</div>
          <LabelRadioGroup
            key="2"
            otherSetting={true}
            label=""
            value={orderIdent}
            radioList={orderIdentList}
            radioChange={(e) => moduleRadioChange(e)}
          />
        </div>
        <div className={Css['setting-item']}>
          <span className={Css['setting-item-title']}>一物一码方案</span>
          <span className={Css['setting-item-text']}>无需设置</span>
        </div>
        <div className={`${Css['setting-item']} ${Css['noFlex']}`}>
          <div className={Css['setting-item-title']}>能量弹窗配置</div>
          <div className={Css['setting-item-content']}>
            <div className={Css['setting-form-row']}>
              <div className={Css['setting-form-rowH']}>品牌logo：</div>
              <div className={Css['setting-form-rowC']}>
                <OssUpload 
                  value={logoUrl}
                  heightPx='60px'
                  limitSize={0.1}
                  limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
                  onChange={(e)=>logoImageSave(e)}
                />
                <div className={Css['setting-form-tips']}>
                  <p>1. 上传图片，支持PNG/JPG/JPEG格式。用于弹窗顶部展示</p>
                  <p>2. 图片大小需小于100kb，尺寸高度为54，宽度小于333</p>
                  <p>3. 若未上传图片，则弹窗顶部不展示logo</p>
                </div>
              </div>
            </div>
            <div className={Css['setting-form-row']}>
              <div className={Css['setting-form-rowH']}>领取成功，跳转路径：</div>
              <div className={Css['setting-form-rowC']}>
                <SelectGather
                  noMargin
                  type={sucJumpLink.type}
                  data={sucJumpLink.link}
                  storeType="alipayForest"
                  alterType={(e) => alterType(e)}
                  alterData={(e) => alterData(e)}
                />
              </div>
            </div>
            <div className={Css['setting-form-row']}>
              <div className={Css['setting-form-rowH']}>领取失败，文案展示：</div>
              <div className={Css['setting-form-rowC']}>
                <Input
                  className={Css['setting-form-input']}
                  placeholder="请输入领取失败文案（中英文数字）"
                  value={failText}
                  maxLength={15}
                  onChange={(e) => setFailText(e.target.value)}
                  onBlur={() => editFn({ failedInfo: failText })}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={`${Css['setting-item']} ${Css['noFlex']}`}>
          <span className={Css['setting-item-title']}>赠送积分配置</span>
            <div className={Css['setting-form-row']}>
              <div className={Css['setting-form-rowH']}>赠送积分：</div>
              <div className={Css['setting-form-rowC']}>
                <InputNumber
                  precision={0}
                  min={0}
                  max={999}
                  value={integral}
                  style={{ width: '200px' }}
                  placeholder="请输入赠送积分"
                  onChange={(e) => setIntegral(e)}
                  onBlur={() => editFn({ point: integral })}
                />
              </div>
            </div>
        </div>
      </div>
    </Spin>
  );
};
