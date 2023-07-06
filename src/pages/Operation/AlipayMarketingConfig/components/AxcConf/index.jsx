import React, { useState, useEffect } from 'react';
import Css from './index.module.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';
import { getAxcStatus, editOpenOrCloseAxc } from '@/services/activity'
import { Spin } from 'antd';

export default props => {

  const [anxcRadio, setAnxcRadio] = useState('0');
  const [spinning, setSpinning] = useState(false);
  const [anxcList, setAnxcList] = useState([
    {label: '不展示', value: '0' },
    {label: '全部展示', value: '1' },
  ]);

  useEffect(() => {
    const getStatus = async () =>  {
      setSpinning(true)
      try {
        let res = await getAxcStatus()
        // console.log('res',res)
        if(res.success) setAnxcRadio(res.data ? '1': '0')
      } catch (error) {
        console.log(error)
      } finally {
        setSpinning(false)
      }
    }
    getStatus()
  }, []);



  const moduleRadioChange = async (e) => {
    setSpinning(true)
    try {
      let res = await editOpenOrCloseAxc({
        openAxc: e.target.value==='1'?true:false
      })
      if(res.success) setAnxcRadio(e.target.value)
    } catch (error) {
      console.log(error)
    } finally {
      setSpinning(false)
    }
  }

  return (
    <Spin size="large" spinning={spinning}>
      <h1 className={Css['setting-box-title']}>
        安心充功能：
      </h1>
      <div className={Css['setting-box']}>
        <div className={Css['setting-item']}>
          <div className={Css['setting-item-title']}>安心充开关</div>
          <LabelRadioGroup
            key="1"
            otherSetting={true}
            label=""
            value={anxcRadio}
            radioList={anxcList}
            radioChange={(e) => moduleRadioChange(e)}
          />
        </div>

        <div className={Css['setting-box-tips']}>
          <p><strong>Tips：</strong></p>
          <p><strong>1. </strong> 开启前，请先确认安心充已正常创建</p>
          <p><strong>2. </strong> 开启后，将在结算页面、我的页面展示安心充入口</p>
        </div>
      </div>
    </Spin>
  );
};
