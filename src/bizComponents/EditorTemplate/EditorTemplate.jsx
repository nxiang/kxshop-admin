/* eslint-disable react/no-array-index-key */
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react'
import { Spin } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import Css from './EditorTemplate.module.scss'

// 引入设定数据
import { moduleDataList, fixedCom } from './formatData'

// 引入校验
import modalSubmitJudge from './publicFun'

import {
  ModuleShow,
  PhotoStyleBackground,
  PhotoFloatingWindow,
  PhotoAd,
  PhotoImagesAd,
  PhotoAssistAd,
  PhotoCouponAd,
  PhotoNaviThree,
  PhotoNaviFour,
  PhotoNaviEight,
  PhotoNaviTen,
  PhotoNotice,
  PhotoRecommend,
  PhotoRichText,
  PhotoVideo,
  PhotoShopInfo,
  PhotoCommunity,
  PhotoAlipayMkt,
  PhotoShopCart,
  PhotoPromotionGoods,
  PhotoSubscribe,
  PhotoAnXinChong,
  PhotoVipCard,
  PhotoVipInfo,
  PhotoZmGo,
  PhotoSignIn,
  PhotoMemberTask,
  AlterStyle,
  AlterAd,
  AlterImagesAd,
  AlterAssistAd,
  AlterCouponAd,
  AlterNavi,
  AlterNotice,
  AlterRecommend,
  AlterRichText,
  AlterVideo,
  AlterShopInfo,
  AlterCommunity,
  AlterAlipayMkt,
  AlterShopCart,
  AlterPromotionGoods,
  AlterSubscribe,
  AlterAnXinChong,
  AlterIntegral,
  AlterVipCard,
  AlterVipInfo,
  AlterZmGo,
  AlterSignIn,
  AlterMemberTask
} from '@/bizComponents/EditorModules/EditorModules'

import { dealAdAndImagesAdData } from '@/bizComponents/EditorTemplate/publicFun'

export default forwardRef(
  ({
    cRef,
    templateSpin = false,
    templateData = [],
    importBasisNum = [],
    subjectColor,
    importSetting,
    specialJudge = 'no',
    // 商城展示选项
    /**
     * custom 首页
     * community 社团团购
     */
    storeType = 'custom',
    // 商品类型
    itemType = 0,
    channelType
  }) => {
    const configPhoto = useRef()
    const configBtnBox = useRef()

    // 模板参数
    const [specialList, setSpecialList] = useState([])
    // 模板样式
    const [specialSetting, setSpecialSetting] = useState({
      backgroundType: 1,
      backgroundImg: '',
      backgroundColor: {
        r: '255',
        g: '255',
        b: '255',
        a: '1'
      }
    })
    // 模板选中
    const [specialOnPut, setSpecialOnPut] = useState(0)
    // 排序阀门
    const [specialRank, setSpecialRank] = useState(false)
    // 基础模板个数
    const [basisNum, setBasisNum] = useState({})

    console.log('templateData', templateData)

    useEffect(() => {
      setSpecialList([...templateData])
      if (specialJudge == 'special')
        setSpecialSetting({
          ...importSetting
        })
    }, [templateData])

    // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
    useImperativeHandle(cRef, () => ({
      // changeVal 就是暴露给父组件的方法
      getTemplate: () => {
        const data = {
          saveTemplate: saveTemplate()
        }
        if (specialJudge == 'special') {
          if (specialSetting.backgroundType == 1) {
            specialSetting.backgroundColor = {
              r: '255',
              g: '255',
              b: '255',
              a: '1'
            }
          } else if (specialSetting.backgroundType == 2) {
            specialSetting.backgroundImg = ''
          }
          data.specialSetting = specialSetting
        }
        return data
      }
    }))

    // 点击设置页面样式
    const setPageStyleShow = () => {
      setSpecialOnPut('style')
      setSpecialRank(false)
    }

    // 点击选中组件事件
    const specialOnPutItemClick = (index, isTrue) => {
      setSpecialOnPut(index)
      setSpecialRank(isTrue)
    }

    const alterSpecialStyle = (itemData) => {
      console.log(itemData)
      setSpecialSetting({ ...itemData })
    }

    // 模块样式修改事件
    const alterModuleStyle = (num) => {
      specialList[specialOnPut].itemStyle = num
      setSpecialList(specialList.slice())
    }

    // 模块对应数量修改
    const alterModuleNum = (num) => {
      specialList[specialOnPut].itemNum = num
      setSpecialList(specialList.slice())
    }

    // 模块对应是否副标题修改
    const alterModuleTitleSet = (data) => {
      const { itemSubTitle, itemTitleColor } = data
      if (itemSubTitle) specialList[specialOnPut].itemSubTitle = itemSubTitle
      if (itemTitleColor)
        specialList[specialOnPut].itemTitleColor = itemTitleColor
      setSpecialList(specialList.slice())
    }

    // 模块背景颜色
    // const alterBackgroundSet = data => {
    //   specialList[specialOnPut].itemData.color = data;
    //   setSpecialList(specialList.slice());
    // };
    // 模块对应是否副标题修改
    const alterModulePropertiesArr = (data) => {
      specialList[specialOnPut].propertiesArr = data
      setSpecialList(specialList.slice())
    }

    // 模块子类修改事件
    const alterModuleTrigger = (itemData) => {
      specialList[specialOnPut].itemData = itemData
      setSpecialList(specialList.slice())
    }

    // 模块额外传参修改事件
    const alterModuleEntrance = (itemEntrance) => {
      specialList[specialOnPut].itemEntrance = itemEntrance
      setSpecialList(specialList.slice())
    }

    // 模块删除事件
    const alterModuleDel = () => {
      specialList.splice(specialOnPut, 1)
      if (specialOnPut > 0) {
        setSpecialList(specialList.slice())
        setSpecialOnPut(specialOnPut - 1)
      } else {
        setSpecialList(specialList.slice())
      }
    }
    // 基础组件个数计算
    const basisNumNumeration = () => {
      const basis = {}
      importBasisNum.forEach((item) => {
        basis[item] = 0
      })
      specialList.forEach((item) => {
        if (basis[item.itemType] >= 0) basis[item.itemType] += 1
      })
      setBasisNum({ ...basis })
    }

    useEffect(() => {
      basisNumNumeration()
    }, [specialList])

    // 禁用拖拽进入事件
    const configDragOver = (e) => {
      const event = e || window.event
      event.preventDefault()
    }

    // 拖拽开始事件
    const configDragStart = (index, e) => {
      const event = e || window.event
      event.dataTransfer.setData('type', 'index')
      event.dataTransfer.setData('configBtn', index)
    }

    // 拖拽添加事件
    const configPhotoDrop = (e) => {
      const event = e || window.event
      e.preventDefault()
      const type = event.dataTransfer.getData('type')
      if (type !== 'chunk') return
      const chunk = event.dataTransfer.getData('configChunk')
      console.log('chunk==================>', chunk)
      const ny = event.clientY
      const child = configPhoto.current.children
      const childList = []
      child.forEach((item, index) => {
        if (index == 0 && specialJudge != 'no') {
          return
        }
        const ClientRect = item.getBoundingClientRect()
        childList.push(ClientRect.top + ClientRect.height / 2)
      })
      let newIndex = 0
      console.log(childList)
      console.log(specialList)
      childList.forEach((item, listIndex) => {
        if (item < ny) newIndex = Number(listIndex) + 1
      })
      const newList = [...specialList]
      // eslint-disable-next-line consistent-return
      moduleDataList.forEach((item, listIndex) => {
        if (item.itemType == chunk) {
          newList.splice(
            newIndex,
            0,
            JSON.parse(JSON.stringify(moduleDataList[listIndex]))
          )
          setSpecialList([...newList])
          // basisNumNumeration();
          return true
        }
      })
    }

    // 拖拽排序事件
    const configDrop = (e) => {
      const event = e || window.event
      e.preventDefault()
      const type = event.dataTransfer.getData('type')
      if (type !== 'index') return
      const index = event.dataTransfer.getData('configBtn')
      const target = event.target || event.srcElement
      const targetIndex = target.getAttribute('name')
      if (index != targetIndex) {
        const ny = event.clientY
        const child = configBtnBox.current.children
        const childList = []
        child.forEach((item) => {
          const ClientRect = item.getBoundingClientRect()
          childList.push(ClientRect.top + ClientRect.height / 2)
        })
        let newIndex = 0
        childList.forEach((item, listIndex) => {
          if (item < ny) newIndex = Number(listIndex) + 1
        })
        // 排除同元素同位置移动
        if (newIndex != index && newIndex != Number(index) + 1) {
          const newList = [...specialList]
          if (index < newIndex) {
            let data = newList[index]
            newList.splice(newIndex, 0, data)
            data = newList.splice(index, 1)
          } else {
            const data = newList.splice(index, 1)
            newList.splice(newIndex, 0, data[0])
          }
          setSpecialList([...newList])
        }
      }
    }

    // 向上移动
    const upward = () => {
      if (specialOnPut > 0) {
        const data = specialList.splice(specialOnPut, 1)
        specialList.splice(specialOnPut - 1, 0, data[0])
        setSpecialList([...specialList])
        setSpecialOnPut(specialOnPut - 1)
      }
    }

    // 向下移动
    const downward = () => {
      if (specialOnPut < specialList.length - 1) {
        const data = specialList.splice(specialOnPut, 1)
        specialList.splice(specialOnPut + 1, 0, data[0])
        setSpecialList([...specialList])
        setSpecialOnPut(specialOnPut + 1)
      }
    }

    const recursionNode = (nodeList) => {
      nodeList.forEach((item) => {
        if (item.nodeName == 'FONT') {
          const span = document.createElement('span')
          span.innerHTML = item.innerHTML
          if (item.attributes?.size) {
            switch (item.attributes.size.nodeValue) {
              case '1':
                span.style.fontSize = '10px'
                break
              case '2':
                span.style.fontSize = '13px'
                break
              case '3':
                span.style.fontSize = '16px'
                break
              case '4':
                span.style.fontSize = '18px'
                break
              case '5':
                span.style.fontSize = '24px'
                break
              case '6':
                span.style.fontSize = '32px'
                break
              case '7':
                span.style.fontSize = '48px'
                break
              default:
            }
          }
          if (item.attributes?.color) {
            span.style.color = item.attributes.color.nodeValue
          }
          item.parentNode.replaceChild(span, item)
        }
        if (item.childNodes) {
          recursionNode(item.childNodes)
        }
      })
    }

    const saveTemplate = () => {
      // 上传条件判断
      if (!modalSubmitJudge(specialList, channelType)) return false
      // 上传数据整理
      const decorateData = specialList.map((item, index) => {
        let { itemData } = item
        // 轮播模块
        if (item.itemType === 'ad' || item.itemType === 'images_ad') {
          itemData = item.itemData.map((subItem) => {
            return dealAdAndImagesAdData(subItem)
          })
        }
        // 优惠券模块
        if (item.itemType === 'coupon_ad') {
          itemData = item.itemData.map((subItem) => {
            return {
              ...subItem,
              type: 'coupon',
              data: String(subItem.data.id || '')
            }
          })
        }
        // 导航模块
        if (item.itemType === 'navi') {
          itemData = item.itemData.map((subItem) => {
            if (subItem.type === 'none') {
              return {
                ...subItem,
                data: ''
              }
            }
            if (
              subItem.type === 'keyword' ||
              subItem.type === 'h5Url' ||
              subItem.type === 'pageSkip' ||
              subItem.type === 'wxapp' ||
              subItem.type === 'aliapp' ||
              subItem.type === 'alipayCoupon' ||
              subItem.type === 'alipayMembers' ||
              subItem.type === 'alipaySkip' ||
              subItem.type === 'getCoupon'
            ) {
              return {
                ...subItem
              }
            }
            if (!subItem.type) {
              return {
                ...subItem,
                type: 'none',
                id: ''
              }
            }
            return {
              ...subItem,
              data: String(subItem.data.id || '')
            }
          })
        }
        // 商品推荐模块
        if (item.itemType === 'recommend') {
          itemData = item.itemData.map((subItem) => {
            let { data } = subItem
            if (subItem.data !== '') {
              data = subItem.data
                .map((dataItem) => {
                  return dataItem.itemId
                })
                .join(',')
            }
            return {
              ...subItem,
              data
            }
          })
        }
        // 积分商品
        if (item.itemType === 'integral') {
          itemData = item.itemData.map((subItem) => {
            let { data } = subItem
            if (subItem.data !== '') {
              data = subItem.data
                .map((dataItem) => {
                  return dataItem.itemId
                })
                .join(',')
            }
            return {
              ...subItem,
              data
            }
          })
        }
        // 社区团购入口模块
        if (item.itemType === 'community') {
          itemData = itemData.map((i) => i.itemId).join(',')
        }
        // 富文本img 处理
        if (item.itemType === 'rich_text') {
          const div = document.createElement('div')
          div.innerHTML = itemData[0] && itemData[0].data
          recursionNode(div.childNodes)

          const newHtml = String(div.innerHTML)
          const reg = /([^<img]*)><\/img>/g // 处理<img ></img>  ==> <img />
          const newHtmlStr = newHtml.replace(reg, '$1/>')
          const reg2 = /(<img.*?)\/>/gi // 处理<img />  ==> <img>
          const newHtmlStr2 = newHtmlStr.replace(reg2, '$1>')
          const reg3 = /(<img.*?)>/gi // 处理<img >  ==> <img/>
          const newHtmlStr3 = newHtmlStr2.replace(reg3, '$1/>')
          const reg4 = /<br>/gi
          const newHtmlStr4 = newHtmlStr3.replace(reg4, '<br/>')
          itemData[0].data = newHtmlStr4
        }
        return {
          ...item,
          itemIndex: index + 1,
          itemData
        }
      })
      console.log('saveTemplate123', channelType, decorateData)
      return JSON.stringify(decorateData)
    }
    const {
      backgroundType: backgroundTypeValue,
      backgroundImg: backgroundImgValue,
      antForestShow,
      shopShow
    } = specialSetting
    const specialSettingShow =
      (backgroundTypeValue == 1 && backgroundImgValue) ||
      backgroundTypeValue == 2
    const floatingWindowShow = antForestShow || shopShow
    return (
      <Spin size="large" spinning={templateSpin}>
        <div className={Css['template-config-box']}>
          <ModuleShow basisNum={basisNum} importBasisNum={importBasisNum} />
          <div className={Css['config-middle']}>
            {specialSettingShow && (
              <div onClick={() => setPageStyleShow()}>
                <PhotoStyleBackground itemData={specialSetting} />
              </div>
            )}
            {floatingWindowShow && (
              <PhotoFloatingWindow itemData={specialSetting} />
            )}
            <div className={Css['config-middle-overflow']}>
              <div
                className={Css['config-photo']}
                ref={configPhoto}
                onDragOver={(e) => configDragOver(e)}
                onDrop={(e) => configPhotoDrop(e)}
              >
                {specialJudge == 'special' && (
                  <div className={Css['config-style-box']}>
                    <div className={Css['config-style-left']}>
                      <LeftOutlined />
                      <p>显示专题页名称</p>
                    </div>
                    <p
                      className={Css['config-style-right']}
                      onClick={() => setPageStyleShow()}
                    >
                      页面样式
                    </p>
                  </div>
                )}
                {specialJudge == 'home' && subjectColor && (
                  <div
                    className={Css['config-photo-header']}
                    style={{ background: subjectColor.titleColor }}
                  >
                    <img
                      className={Css['photo-header-img']}
                      src="https://img.kxll.com/admin_manage/photo_header.png"
                      alt=""
                    />
                  </div>
                )}
                {specialList.map((item, index) => {
                  return (
                    // 是否为固定底部组件
                    !fixedCom.includes(item.itemType) ? (
                      <div
                        className={`${Css['config-photo-item']} ${
                          index === specialOnPut &&
                          Css['config-photo-item-hover']
                        }`}
                        key={index}
                      >
                        <div
                          onClick={() => specialOnPutItemClick(index, false)}
                        >
                          {item.itemType === 'ad' && (
                            <PhotoAd
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {item.itemType === 'images_ad' && (
                            <PhotoImagesAd
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {item.itemType === 'assist_ad' && (
                            <PhotoAssistAd
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {item.itemType === 'coupon_ad' && (
                            <PhotoCouponAd
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                            />
                          )}
                          {item.itemType === 'navi' && item.itemNum === 3 && (
                            <PhotoNaviThree
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                            />
                          )}
                          {item.itemType === 'navi' && item.itemNum === 4 && (
                            <PhotoNaviFour
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                            />
                          )}
                          {item.itemType === 'navi' && item.itemNum === 8 && (
                            <PhotoNaviEight
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                            />
                          )}
                          {item.itemType === 'navi' && item.itemNum === 10 && (
                            <PhotoNaviTen
                              itemData={item.itemData}
                              itemStyle={item.itemStyle || 1}
                            />
                          )}
                          {item.itemType === 'notice' && (
                            <PhotoNotice itemData={item.itemData} />
                          )}
                          {item.itemType === 'recommend' && (
                            <PhotoRecommend
                              itemData={item.itemData}
                              itemStyle={item.itemStyle}
                              itemNum={item.itemNum}
                              itemSubTitle={item.itemSubTitle || 2}
                              itemTitleColor={item.itemTitleColor}
                              itemType="recommend"
                            />
                          )}
                          {item.itemType === 'integral' && (
                            <PhotoRecommend
                              itemData={item.itemData}
                              itemStyle={item.itemStyle}
                              itemNum={item.itemNum}
                              itemSubTitle={item.itemSubTitle || 2}
                              itemTitleColor={item.itemTitleColor}
                              itemType="integral"
                            />
                          )}
                          {item.itemType === 'video' && (
                            <PhotoVideo
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {item.itemType === 'rich_text' && (
                            <PhotoRichText itemData={item.itemData} />
                          )}
                          {item.itemType === 'shop_info' && (
                            <PhotoShopInfo itemData={item.itemData} />
                          )}
                          {item.itemType === 'community' && (
                            <PhotoCommunity itemData={item.itemData} />
                          )}
                          {item.itemType === 'alipay_mkt' && (
                            <PhotoAlipayMkt itemData={item.itemData} />
                          )}
                          {item.itemType === 'anXinChong' && (
                            <PhotoAnXinChong itemData={item.itemData} />
                          )}
                          {item.itemType === 'promotion_goods' && (
                            <PhotoPromotionGoods itemData={item.itemData} />
                          )}
                          {item.itemType === 'subscribe' && (
                            <PhotoSubscribe
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {item.itemType === 'vipcard' && (
                            <PhotoVipCard
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {item.itemType === 'vipinfo' && (
                            <PhotoVipInfo
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {/* 芝麻go */}
                          {item.itemType === 'zmGo' && <PhotoZmGo />}
                          {/* 签到 */}
                          {item.itemType === 'signIn' && (
                            <PhotoSignIn
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                          {/* 任务列表 */}
                          {item.itemType === 'memberTask' && (
                            <PhotoMemberTask
                              itemData={item.itemData}
                              propertiesArr={item.propertiesArr}
                            />
                          )}
                        </div>
                        {!specialRank && index === specialOnPut && (
                          <div className={Css['config-operation-box']}>
                            <div
                              className={`${Css['config-operation-item']} ${Css['icon-direction']}`}
                              onClick={() => setSpecialRank(true)}
                            />
                            <div
                              className={`${Css['config-operation-item']} ${Css['icon-upward']}`}
                              onClick={() => upward()}
                            />
                            <div
                              className={`${Css['config-operation-item']} ${Css['icon-downward']}`}
                              onClick={() => downward()}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      item.itemType === 'shop_cart' && (
                        <div
                          key={index}
                          className={`${Css['fixed-bottom-box']} ${
                            index === specialOnPut &&
                            Css['fixed-bottom-box-hover']
                          }`}
                          onClick={() => specialOnPutItemClick(index, false)}
                        >
                          <PhotoShopCart itemData={item.itemData} />
                        </div>
                      )
                    )
                  )
                })}
                {/* 购物车底部占位 */}
                <div
                  className={`${
                    specialList.find((item) => item.itemType === 'shop_cart') &&
                    Css['fixd-bottom-block']
                  }`}
                />
                {specialJudge == 'home' && subjectColor && (
                  <div className={Css['config-photo-bottom']} />
                )}
              </div>
              {specialRank && (
                <div
                  className={Css['config-btn-box']}
                  ref={configBtnBox}
                  onDragOver={(e) => configDragOver(e)}
                  onDrop={(e) => configDrop(e)}
                >
                  {specialList.map((item, index) => {
                    return (
                      <div
                        key={index}
                        name={index}
                        className={
                          specialOnPut === index
                            ? `${Css['config-btn']} ${Css['blue-btn']}`
                            : Css['config-btn']
                        }
                        draggable="true"
                        onClick={() => specialOnPutItemClick(index, true)}
                        onDragStart={(e) => configDragStart(index, e)}
                      >
                        {item.itemType === 'ad' && '轮播'}
                        {item.itemType === 'images_ad' && '图片'}
                        {item.itemType === 'assist_ad' && '辅助'}
                        {item.itemType === 'coupon_ad' && '优惠券'}
                        {item.itemType === 'navi' && '导航'}
                        {item.itemType === 'notice' && '公告'}
                        {item.itemType === 'recommend' && '商品推荐'}
                        {item.itemType === 'video' && '视频'}
                        {item.itemType === 'rich_text' && '富文本'}
                        {item.itemType === 'shop_info' && '店铺信息'}
                        {item.itemType === 'community' && '社区团购'}
                        {item.itemType === 'alipay_mkt' && '支付宝劵组件'}
                        {item.itemType === 'shop_cart' && '快捷购物车'}
                        {item.itemType === 'promotion_goods' && '促销组件'}
                        {item.itemType === 'subscribe' && '订阅消息'}
                        {item.itemType === 'anXinChong' && '安心充'}
                        {item.itemType === 'integral' && '积分商品'}
                        {item.itemType === 'vipcard' && '会员'}
                        {item.itemType === 'vipinfo' && '会员信息'}
                        {item.itemType === 'zmGo' && '芝麻go'}
                        {item.itemType === 'signIn' && '签到'}
                        {item.itemType === 'memberTask' && '任务列表'}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            {subjectColor && (
              <div className={Css['config-photo-foot']}>
                <div className={Css['config-photo-foot-item']}>
                  <img
                    className={Css['item-img']}
                    src={subjectColor.homeHoverIcon}
                    alt=""
                  />
                  <p className={Css['item-text']}>首页</p>
                </div>
                <div className={Css['config-photo-foot-item']}>
                  <img
                    className={Css['item-img']}
                    src={subjectColor.classIcon}
                    alt=""
                  />
                  <p className={Css['item-text']}>分类</p>
                </div>
                <div className={Css['config-photo-foot-item']}>
                  <img
                    className={Css['item-img']}
                    src={subjectColor.shopIcon}
                    alt=""
                  />
                  <p className={Css['item-text']}>购物</p>
                </div>
                <div className={Css['config-photo-foot-item']}>
                  <img
                    className={Css['item-img']}
                    src={subjectColor.myIcon}
                    alt=""
                  />
                  <p className={Css['item-text']}>首页</p>
                </div>
              </div>
            )}
          </div>
          <div className={Css['config-right']}>
            {specialOnPut == 'style' && (
              <AlterStyle
                itemData={specialSetting}
                alterTrigger={alterSpecialStyle}
              />
            )}
            {specialList?.length >= 1 && typeof specialOnPut === 'number' && (
              <div>
                {/* 轮播 */}
                {specialList[specialOnPut].itemType === 'ad' && (
                  <AlterAd
                    storeType={storeType}
                    itemType={itemType}
                    itemData={specialList[specialOnPut].itemData}
                    itemStyle={specialList[specialOnPut].itemStyle || 1}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterTrigger={alterModuleTrigger}
                    alterStyle={alterModuleStyle}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 图片 */}
                {specialList[specialOnPut].itemType === 'images_ad' && (
                  <AlterImagesAd
                    storeType={storeType}
                    itemType={itemType}
                    itemData={specialList[specialOnPut].itemData}
                    itemStyle={specialList[specialOnPut].itemStyle || 1}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterTrigger={alterModuleTrigger}
                    alterStyle={alterModuleStyle}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 辅助 */}
                {specialList[specialOnPut].itemType === 'assist_ad' && (
                  <AlterAssistAd
                    itemData={specialList[specialOnPut].itemData}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 优惠券 */}
                {specialList[specialOnPut].itemType === 'coupon_ad' && (
                  <AlterCouponAd
                    itemData={specialList[specialOnPut].itemData}
                    itemStyle={specialList[specialOnPut].itemStyle || 1}
                    channelType={channelType}
                    alterTrigger={alterModuleTrigger}
                    alterStyle={alterModuleStyle}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 导航 */}
                {specialList[specialOnPut].itemType === 'navi' && (
                  <AlterNavi
                    itemData={specialList[specialOnPut].itemData}
                    itemStyle={specialList[specialOnPut].itemStyle || 1}
                    itemNum={specialList[specialOnPut].itemNum || 1}
                    alterTrigger={alterModuleTrigger}
                    alterStyle={alterModuleStyle}
                    alterNum={alterModuleNum}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 公告 */}
                {specialList[specialOnPut].itemType === 'notice' && (
                  <AlterNotice
                    itemData={specialList[specialOnPut].itemData}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 商品推荐 */}
                {(specialList[specialOnPut].itemType === 'recommend' ||
                  specialList[specialOnPut].itemType === 'integral') && (
                  <AlterRecommend
                    itemType={itemType}
                    asideType={specialList[specialOnPut].itemType}
                    itemData={specialList[specialOnPut].itemData}
                    itemStyle={specialList[specialOnPut].itemStyle || 1}
                    itemNum={specialList[specialOnPut].itemNum || 1}
                    itemSubTitle={specialList[specialOnPut].itemSubTitle || 2}
                    itemTitleColor={specialList[specialOnPut].itemTitleColor}
                    alterTrigger={alterModuleTrigger}
                    alterStyle={alterModuleStyle}
                    alterTitleSet={alterModuleTitleSet}
                    alterNum={alterModuleNum}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 富文本编辑 */}
                {specialList[specialOnPut].itemType === 'rich_text' && (
                  <AlterRichText
                    itemData={specialList[specialOnPut].itemData}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                    indexNum={specialOnPut}
                  />
                )}
                {/* 视频内容 */}
                {specialList[specialOnPut].itemType === 'video' && (
                  <AlterVideo
                    itemData={specialList[specialOnPut].itemData}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 店铺信息 */}
                {specialList[specialOnPut].itemType === 'shop_info' && (
                  <AlterShopInfo
                    itemData={specialList[specialOnPut].itemData}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 社区团购 */}
                {specialList[specialOnPut].itemType === 'community' && (
                  <AlterCommunity
                    itemData={specialList[specialOnPut].itemData}
                    itemEntrance={
                      specialList[specialOnPut].itemEntrance || {
                        entranceImg: '',
                        entranceTitle: '',
                        entranceSubTitle: ''
                      }
                    }
                    itemNum={specialList[specialOnPut].itemNum || 1}
                    alterTrigger={alterModuleTrigger}
                    alterModuleEntrance={alterModuleEntrance}
                    alterNum={alterModuleNum}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 支付宝劵组件 */}
                {specialList[specialOnPut].itemType === 'alipay_mkt' && (
                  <AlterAlipayMkt alterDel={alterModuleDel} />
                )}
                {/* 安心充 */}
                {specialList[specialOnPut].itemType === 'anXinChong' && (
                  <AlterAnXinChong
                    itemData={specialList[specialOnPut].itemData}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 购物车组件 */}
                {specialList[specialOnPut].itemType === 'shop_cart' && (
                  <AlterShopCart
                    itemData={specialList[specialOnPut].itemData}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 促销商品组件 */}
                {specialList[specialOnPut].itemType === 'promotion_goods' && (
                  <AlterPromotionGoods
                    itemType={itemType}
                    itemData={specialList[specialOnPut].itemData}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 订阅组件 */}
                {specialList[specialOnPut].itemType === 'subscribe' && (
                  <AlterSubscribe
                    itemData={specialList[specialOnPut].itemData}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 会员 */}
                {specialList[specialOnPut].itemType === 'vipcard' && (
                  <AlterVipCard
                    itemData={specialList[specialOnPut].itemData}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 会员信息 */}
                {specialList[specialOnPut].itemType === 'vipinfo' && (
                  <AlterVipInfo
                    itemData={specialList[specialOnPut].itemData}
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    // alterBackgroundSet={alterBackgroundSet}
                    alterTrigger={alterModuleTrigger}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 芝麻go */}
                {specialList[specialOnPut].itemType === 'zmGo' && (
                  <AlterZmGo
                    itemData={specialList[specialOnPut].itemData}
                    alterDel={alterModuleDel}
                    alterTrigger={alterModuleTrigger}
                  />
                )}
                {/* 签到 */}
                {specialList[specialOnPut].itemType === 'signIn' && (
                  <AlterSignIn
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterDel={alterModuleDel}
                  />
                )}
                {/* 任务列表 */}
                {specialList[specialOnPut].itemType === 'memberTask' && (
                  <AlterMemberTask
                    propertiesArr={specialList[specialOnPut].propertiesArr}
                    alterPropertiesArr={alterModulePropertiesArr}
                    alterDel={alterModuleDel}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Spin>
    )
  }
)
