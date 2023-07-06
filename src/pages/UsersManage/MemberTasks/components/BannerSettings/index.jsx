import React, { useState, useEffect, useRef } from 'react';
import Css from './index.module.scss';
import { connect } from 'dva';
import { Spin, Radio, Col, Row, Button, message } from 'antd';
import OssUpload from '@/components/OssUpload/index';
import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather'
import { CloseCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { dealDecorationFn, dealAdAndImagesAdData } from '@/bizComponents/EditorTemplate/publicFun'
import { getBannerConfigDetailApi, setBannerConfigApi } from '@/services/member';

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

export default connect(mapStateToProps)(({ collapsed, tabsKey }) => {
  // const { tabsKey } = props;
  // laoding
  const [spinning, setSpinning] = useState(false);

  // 页面数据
  const [formData, setFormData] = useState({
    hasPdLR: { // 左右边距
      id: 1,
      value: 1,
    },
    hasPdTb: { // 上下边距
      id: 2,
      value: 1,
    },
    hasRadius:  { // 圆角
      id: 3,
      value: 1,
    },
    list: [
      {
        image: '',
        type: 'none',
        data: ''
      }
    ]
  })

  const { hasPdLR, hasPdTb, hasRadius, list } = formData

  // 展示切换判断重新加载数据
  useEffect(() => {
    if (tabsKey == 3) getData()
  }, [tabsKey]);

  // 数据修改
  const formDataChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  // banner数据变更 新增
  const listEdit = (type, index, e) => {
    // 新增一行
    if (type==='add') {
      list.push({
        image: '',
        type: 'none',
        data: ''
      })
    }

    // 删除一行
    if (type === 'del') {
      list.splice(index, 1)
    }

    // 跳转类型变更
    if (type === 'type') { 
      list[index] = {
        ...list[index],
        type: e,
        data: ''
      }
    }

    // 跳转值变更
    if (type === 'data') { 
      list[index] = {
        ...list[index],
        data: e
      }
    }

    // 图片变更
    if (type === 'image') { 
      list[index] = {
        ...list[index],
        image: e
      }
    }
    formDataChange('list', list)
  }

  const getData = async () => {
    try {
      setSpinning(true)
      let res = await getBannerConfigDetailApi()
      if (res.success&&res.data) {
        let data
        try {
          data = JSON.parse(res.data)
        } catch (error) {
          console.log(error)
        }
        const { itemData, propertiesArr: [ hasPdLR, hasPdTb, hasRadius ] } = data
        let tmp = await dealDecorationFn([{
          itemData,
          itemIndex: 1,
          itemType: "ad"
        }])
        const { itemData: list } = tmp[0]
        if (!list?.length) listEdit('add')
        let formData = {
          list,
          hasPdLR,
          hasPdTb,
          hasRadius
        }
        setFormData(formData)
      }
      setSpinning(false)
    } catch (error) {
      setSpinning(false)
    }
  }

  const judgeData = (itemData) => {
    try {
      itemData.forEach(subItem => {
        // 子类空图片判断
        if (subItem.image === '') {
          message.warning('图片未配置');
          throw new Error();
        }
        // 子类空跳转判断
        if (
          subItem.data === '' &&
          subItem.type !== 'none' &&
          subItem.type !== 'skipInvitation' &&
          subItem.type !== 'live' &&
          subItem.type !== 'integralMall' &&
          subItem.type !== 'memberCenter' &&
          subItem.type !== 'dailyAttendance' &&
          subItem.type !== 'community'
        ) {
          message.warning('跳转未配置');
          throw new Error();
        }
        // 子类空优惠券判断
        if (subItem.type === 'alipayCoupon') {
          if (!subItem?.data?.couponText) {
            message.warning('支付宝优惠券未配置');
            throw new Error();
          }
          // 子类空模板ID判断
          if (subItem?.data?.couponType == 1 && !subItem?.data?.couponCardUrl) {
            message.warning('支付宝优惠券对应支付宝会员模板ID未配置');
            throw new Error();
          }
        }
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  const sumbitData = async () => {
    let itemData = list.map(item => {
      item?.data?.jsonStr && (delete item.data.jsonStr)
      // 处理数据
      return dealAdAndImagesAdData(item)
    })
    let params = {
      itemData,
      propertiesArr: [
        hasPdLR,
        hasPdTb,
        hasRadius
      ]
    }
    let flag = judgeData(itemData)
    if (!flag) return
    try {
      setSpinning(true)
      let res = await setBannerConfigApi({ bannerConfig: JSON.stringify(params) })
      if (res.success) message.success('保存成功')
      setSpinning(false)
    } catch (error) {
      setSpinning(false)
    }
  }

  return (
    <Spin size="large" spinning={spinning}>
      <div className={Css['pd10']}>
        {/* 页面边距 */}
        <Row className={Css['mb16']} wrap={false} align="middle">
          <Col flex="90px">
            <span className={Css['red']}>*</span>
            页面边距：
          </Col>
          <Col flex="auto">    
            <Radio.Group 
              value={hasPdLR.value}
              onChange={(e) => formDataChange('hasPdLR', {id:1 , value:e.target.value})} 
            >
              <Radio value={1}>左右留白</Radio>
              <Radio value={2}>通栏</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {/* 组件样式 */}
        <Row className={Css['mb16']} wrap={false} align="middle">
          <Col flex="90px">
            <span className={Css['red']}>*</span>
            组件样式：
          </Col>
          <Col flex="auto">    
            <Radio.Group 
              onChange={(e) => formDataChange('hasPdTb', {id: 2, value: e.target.value})} 
              value={hasPdTb.value}
            >
              <Radio value={1}>上下留高</Radio>
              <Radio value={2}>常规</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {/* 倒角 */}
        <Row className={Css['mb16']} wrap={false} align="middle">
          <Col flex="90px">
            <span className={Css['red']}>*</span>
            倒角：
          </Col>
          <Col flex="auto">    
            <Radio.Group 
              onChange={(e) => formDataChange('hasRadius', {id: 3, value: e.target.value})}
              value={hasRadius.value}
            >
              <Radio value={2}>直角</Radio>
              <Radio value={1}>圆角</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {list.length && 
          list.map((item, index) => {
            return (
              <div key={index} className={Css['listItem']}>
                {list.length > 1 && (
                  <CloseCircleOutlined
                    className={Css['alter-del']}
                    onClick={() => listEdit('del', index)}
                  />
                )}
                <OssUpload 
                  value={item.image}
                  widthPx='355px'
                  heightPx='160px'
                  hasClose={false}
                  limitSize={2}
                  limitFormat={['image/jpeg', 'image/jpg', 'image/png', 'image/gif']}
                  onChange={(e)=>listEdit('image', index, e)}
                />
                <p>推荐图片尺寸710*200，大小不超过2M</p>
                <SelectGather
                  type={item?.type}
                  data={item?.data}
                  alterType={(e) => listEdit('type', index, e)}
                  alterData={(e) => listEdit('data', index, e)}
                />
              </div>
            )
          })
        }
        {/* 添加图片 */}
        {(!list || list?.length < 5) && (
          <div className={Css['add-banner-box']} onClick={() => listEdit('add')}>
            <PlusOutlined />
            <p className={Css['add-banner-text']}>添加图片</p>
          </div>
        )}
        {/* 保存按钮 */}
        <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
          <Button type="primary" size="large" onClick={sumbitData}> banner设置-保存 </Button>
        </div>
      </div>
    </Spin>
  );
});
