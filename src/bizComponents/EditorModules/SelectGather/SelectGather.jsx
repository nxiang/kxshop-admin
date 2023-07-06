import React, { Fragment, useMemo } from 'react'
import { Select } from 'antd'
import Css from './SelectGather.module.scss'
import { connect } from 'dva'

import SpecialSelect from '../selects/SpecialSelect.jsx'
import TabBarSelect from '../selects/TabBarSelect'
import CouponSelect from '../selects/CouponSelect.jsx'
import KeywordSelect from '../selects/KeywordSelect.jsx'
import LabelSelect from '../selects/LabelSelect.jsx'
import GoodsIdSelect from '../selects/GoodsIdSelect.jsx'
import MarketingSelect from '../selects/MarketingSelect.jsx'
import ShareCouponSelect from '../selects/ShareCouponSelect.jsx'
import SkipInvitationModal from '../selects/SkipInvitationModal.jsx'
import LiveModal from '../selects/LiveModal.jsx'
import PageSkip from '../selects/PageSkip.jsx'
import AliappSelect from '../selects/AliappSelect'
import AlipayCouponSelect from '../selects/AlipayCouponSelect.jsx'
import AlipayMembersSelect from '../selects/AlipayMembersSelect.jsx'
import AlipaySkipSelect from '../selects/AlipaySkipSelect'
import H5UrlSelect from '../selects/H5UrlSelect'
import WxappSelect from '../selects/WxappSelect'
import GetCoupon from '../selects/GetCoupon'

const { Option } = Select
const mapStateToProps = (state) => {
  return {
    channelType: state.shop.channelType
  }
}

export default connect(mapStateToProps)((props) => {
  const {
    type = '',
    data = [],
    leftWidht = '',
    rightWidht = '',
    alterType = () => {},
    alterFocus = () => {},
    alterData = () => {},
    // 商品类型
    itemType = 0,
    platformFunction = 'zfb',
    /**
     * custom 首页
     * community 社团团购
     */
    storeType = 'custom',
    allChoose = false,
    disabled = false,
    isHas = false,
    channelType,
    getCoupon = false,
    noMargin = false
  } = props
  const typeFun = {
    itemType,
    itemData: data,
    disabled: disabled,
    width: rightWidht || '',
    channelType,
    alterData: (data) => alterData(data),
  }

  const TypeOptions = () =>
    useMemo(() => {
      let listData = []
      switch (storeType) {
        case 'custom':
          listData = [
            { label: '不跳转', value: 'none' },
            { label: '专题页', value: 'special' },
            { label: '优惠券', value: 'coupon' },
            { label: '商品关键字', value: 'keyword' },
            { label: '商品分类', value: 'label' },
            { label: '商品详情', value: 'goodsDetail' },
            { label: '营销活动', value: 'marketing' },
            { label: '分享领券', value: 'shareCoupon' },
            { label: '邀请有礼入口', value: 'skipInvitation' },
            { label: '网页链接', value: 'h5Url' },
            { label: '页面跳转', value: 'pageSkip' },
            // { label: '社区团购', value: 'community' },
            { label: '积分商城', value: 'integralMall' },
            { label: '会员中心', value: 'memberCenter' },
            { label: '签到有礼', value: 'dailyAttendance' }
          ]
          if (channelType == 'wechat' || !channelType || allChoose)
            listData = [
              ...listData,
              { label: '微信小程序', value: 'wxapp' },
              { label: '微信直播', value: 'live' }
            ]
          if (channelType == 'alipay' || !channelType || allChoose)
            listData = [
              ...listData,
              { label: '支付宝小程序', value: 'aliapp' },
              { label: '支付宝跳转', value: 'alipaySkip' },
              { label: '支付宝劵', value: 'alipayCoupon' },
              { label: '支付宝会员卡', value: 'alipayMembers' }
            ]
          break
        case 'community':
          listData = [
            { label: '不跳转', value: 'none' },
            { label: '商品详情', value: 'goodsDetail' }
          ]
          break
        case 'tabBar':
          listData = [
            ...listData,
            { label: '功能页面', value: 'tabBar', disabled: false },
            { label: '专题页', value: 'special', disabled: isHas },
            { label: '会员中心', value: 'memberCenter', disabled: isHas },
            { label: '签到有礼', value: 'dailyAttendance', disabled: isHas },
            { label: '网页链接', value: 'h5Url', disabled: false },
            { label: '支付宝跳转', value: 'alipaySkip', disabled: false },
            { label: '支付宝小程序', value: 'aliapp', disabled: false }
          ]
          break
        case 'activity':
          listData = [
            ...listData,
            { label: '不跳转', value: 'none' },
            { label: '专题页', value: 'special' }
          ]
          break
        case 'alipayForest':
          listData = [
            ...listData,
            { label: '首页', value: 'home' },
            { label: '专题页', value: 'special' },
            { label: '页面跳转', value: 'pageSkip' },
            { label: '积分商城', value: 'integralMall' },
            { label: '会员中心', value: 'memberCenter' }
          ]
          break
        default:
      }
      console.log('channelType123', channelType, allChoose, getCoupon)
      if (
        (['alipay', 'wechat'].includes(channelType) ||
          !channelType ||
          allChoose) &&
        getCoupon
      ) {
        listData = [...listData, { label: '一键领券', value: 'getCoupon' }]
      }
      return (
        <Select
          className={Css['item-type-select']}
          value={type}
          disabled={disabled}
          placeholder="选择类型"
          style={{ width: leftWidht || 120 }}
          onChange={(e) => alterType(e)}
          onFocus={(e) => alterFocus(e)}
        >
          {listData?.length > 0 &&
            listData.map((item) => {
              return (
                <Option
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </Option>
              )
            })}
        </Select>
      )
    }, [storeType])

  return (
    <div className={`${Css['item-type-box']} ${noMargin && Css['noMargin']}`}>
      <TypeOptions />
      {
        {
          none: <div>请选择类型</div>,
          tabBar: <TabBarSelect {...typeFun} />,
          special: <SpecialSelect {...typeFun} />,
          coupon: <CouponSelect {...typeFun} />,
          keyword: <KeywordSelect {...typeFun} />,
          label: <LabelSelect {...typeFun} />,
          goodsDetail: <GoodsIdSelect {...typeFun} />,
          marketing: <MarketingSelect {...typeFun} />,
          shareCoupon: <ShareCouponSelect {...typeFun} />,
          skipInvitation: <SkipInvitationModal {...typeFun} />,
          h5Url: <H5UrlSelect {...typeFun} />,
          live: <LiveModal {...typeFun} />,
          pageSkip: <PageSkip {...typeFun} />,
          alipayCoupon: <AlipayCouponSelect {...typeFun} />,
          alipayMembers: <AlipayMembersSelect {...typeFun} />,
          alipaySkip: <AlipaySkipSelect {...typeFun} />,
          aliapp: <AliappSelect {...typeFun} />,
          wxapp: <WxappSelect {...typeFun} />,
          getCoupon: <GetCoupon {...typeFun} />,
          community: <div />,
          integralMall: <div />,
          memberCenter: <div />,
          dailyAttendance: <div />,
          home: <div />
        }[type]
      }
    </div>
  )
})
