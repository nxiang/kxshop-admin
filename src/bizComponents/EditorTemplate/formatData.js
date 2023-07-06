import { cloneDeep } from 'lodash-es';

// 新增图片类属性Arr
export const picPropertiesArr = [
  {
    id: 1,
    label: '页面边距',
    value: 1,
    radioList: [
      {
        id: 1,
        label: '左右留白',
        value: 1,
      },
      {
        id: 2,
        label: '通栏',
        value: 2,
      },
    ],
  },
  {
    id: 2,
    label: '组件样式',
    value: 1,
    radioList: [
      {
        id: 1,
        label: '上下留高',
        value: 1,
      },
      {
        id: 2,
        label: '常规',
        value: 2,
      },
    ],
  },
  {
    id: 3,
    label: '倒角',
    value: 2,
    radioList: [
      {
        id: 1,
        label: '直角',
        value: 2,
      },
      {
        id: 2,
        label: '圆角',
        value: 1,
      },
    ],
  },
];
// 个人信息
export const picUserInfo = [
  {
    id: 1,
    label: '页面边距',
    value: 1,
    radioList: [
      {
        id: 1,
        label: '左右留白',
        value: 1,
      },
      {
        id: 2,
        label: '通栏',
        value: 2,
      },
    ],
  },
  {
    id: 2,
    label: '组件样式',
    value: 1,
    radioList: [
      {
        id: 1,
        label: '上下留高',
        value: 1,
      },
      {
        id: 2,
        label: '常规',
        value: 2,
      },
    ],
  },
  {
    id: 3,
    label: '倒角',
    value: 2,
    radioList: [
      {
        id: 1,
        label: '直角',
        value: 2,
      },
      {
        id: 2,
        label: '圆角',
        value: 1,
      },
    ],
  },
  {
    id: 4,
    label: '积分',
    value: 4,
    radioList: [
      {
        id: 1,
        label: '显示',
        value: 1,
      },
      {
        id: 2,
        label: '不显示',
        value: 2,
      },
    ],
  },
  {
    id: 5,
    label: '余额',
    value: 5,
    radioList: [
      {
        id: 1,
        label: '显示',
        value: 1,
      },
      {
        id: 2,
        label: '不显示',
        value: 2,
      },
    ],
  },
  {
    id: 6,
    label: '优惠券',
    value: 6,
    radioList: [
      {
        id: 1,
        label: '显示',
        value: 1,
      },
      {
        id: 2,
        label: '不显示',
        value: 2,
      },
    ],
  },
];
// 商品推荐默认title颜色配置
export const recommondItemTitleColor = [
  {
    id: 1,
    text: '主标题颜色-默认状态',
    color: {
      r: '51',
      g: '51',
      b: '51',
      a: '1',
    },
    resetValue: {
      r: '51',
      g: '51',
      b: '51',
      a: '1',
    },
  },
  {
    id: 2,
    text: '主标题颜色-选中状态',
    color: {
      r: '17',
      g: '17',
      b: '17',
      a: '1',
    },
    resetValue: {
      r: '17',
      g: '17',
      b: '17',
      a: '1',
    },
  },
  {
    id: 3,
    text: '副标题颜色-默认状态',
    color: {
      r: '102',
      g: '102',
      b: '102',
      a: '1',
    },
    resetValue: {
      r: '102',
      g: '102',
      b: '102',
      a: '1',
    },
  },
  {
    id: 4,
    text: '副标题颜色-选中状态',
    color: {
      r: '255',
      g: '255',
      b: '255',
      a: '1',
    },
    resetValue: {
      r: '255',
      g: '255',
      b: '255',
      a: '1',
    },
  },
  {
    id: 5,
    text: '下划线颜色',
    color: {
      r: '17',
      g: '17',
      b: '17',
      a: '1',
    },
    resetValue: {
      r: '17',
      g: '17',
      b: '17',
      a: '1',
    },
  },
  {
    id: 6,
    text: '副标题背景色',
    color: {
      r: '17',
      g: '17',
      b: '17',
      a: '1',
    },
    resetValue: {
      r: '17',
      g: '17',
      b: '17',
      a: '1',
    },
  },
];

// 基础组件对应数组
export const basisControl = [
  {
    name: 'ad',
    max: 5,
    text: '轮播广告',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_ad.png',
  },
  {
    name: 'images_ad',
    max: 50,
    text: '图片广告',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_ad.png',
  },
  {
    name: 'assist_ad',
    max: 5,
    text: '辅助图片',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_assist_ad.png',
  },
  {
    name: 'coupon_ad',
    max: 5,
    text: '优惠券',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_coupon_ad.png',
  },
  {
    name: 'navi',
    max: 5,
    text: '菜单导航',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_navi.png',
  },
  {
    name: 'notice',
    max: 2,
    text: '公告',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_notice.png',
  },
  {
    name: 'recommend',
    max: 10,
    text: '商品推荐',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_recommend.png',
  },
  {
    name: 'video',
    max: 10,
    text: '视频',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_video.png',
  },
  {
    name: 'rich_text',
    max: 10,
    text: '富文本',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_rich_text.png',
  },
  {
    name: 'alipay_mkt',
    max: 1,
    text: '支付宝劵组件',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_alipay_mkt.png',
  },
  {
    name: 'shop_info',
    max: 2,
    text: '店铺信息',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_shop_info.png',
  },
  {
    name: 'community',
    max: 1,
    text: '社区团购',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_shop_info.png',
  },
  {
    name: 'shop_cart',
    max: 1,
    text: '快捷购物车',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_shopCard.png',
  },
  {
    name: 'promotion_goods',
    max: 1,
    text: '促销商品',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_shops.png',
  },
  {
    name: 'subscribe',
    max: 1,
    text: '订阅消息',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_order.png',
  },
  {
    name: 'anXinChong',
    max: 1,
    text: '安心充',
    icon: 'https://img.kxll.com/admin_manage/icon/anXc.png',
  },
  {
    name: 'integral',
    max: 10,
    text: '积分商品',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_ignel.png',
  },
  {
    name: 'vipcard',
    max: 1,
    text: '会员卡',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_vipcard.png',
  },
  {
    name: 'vipinfo',
    max: 1,
    text: '会员信息',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_vipinfo.png',
  },
  {
    name: 'zmGo',
    max: 1,
    text: '芝麻go',
    icon: 'https://img.kxll.com/admin_manage/icon/zmGo.png',
  },
  {
    name: 'signIn',
    max: 1,
    text: '签到',
    icon: 'https://img.kxll.com/admin_manage/icon/signIn.png',
  },
  {
    name: 'memberTask',
    max: 1,
    text: '任务列表',
    icon: 'https://img.kxll.com/admin_manage/icon/taskList.png',
  }
];

// 营销组件对应数组
export const marketingControl = [
  {
    name: 'shop_info',
    max: 2,
    text: '店铺信息',
    icon: 'https://img.kxll.com/admin_manage/icon/icon_shop_info.png',
  },
];

// 模块初始化用参数
export const moduleDataList = [
  {
    itemType: 'ad',
    itemStyle: 1,
    itemData: [
      {
        image: '',
        data: '',
        type: 'none',
      },
    ],
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'images_ad',
    itemStyle: 1,
    itemData: [{ image: '', data: '', type: 'none' }],
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'assist_ad',
    itemData: [{ image: '' }],
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'coupon_ad',
    itemStyle: 1,
    itemData: [
      {
        image: '',
        data: '',
        type: 'coupon',
      },
    ],
  },
  {
    itemType: 'navi',
    itemNum: 8,
    itemStyle: 1,
    itemData: [
      {
        image: '',
        data: '',
        title: '导航1',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航2',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航3',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航4',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航5',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航6',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航7',
        type: 'none',
      },
      {
        image: '',
        data: '',
        title: '导航8',
        type: 'none',
      },
    ],
  },
  {
    itemType: 'notice',
    itemData: [{ data: '这里是公告' }],
  },
  {
    itemType: 'recommend',
    itemNum: 4,
    itemStyle: 2,
    itemTitleColor: cloneDeep(recommondItemTitleColor),
    itemSubTitle: 2,
    itemData: [
      { type: 'goods', data: '', couponPrice: '', title: '主标题1', subTitle: '副标题1' },
      { type: 'goods', data: '', couponPrice: '', title: '主标题2', subTitle: '副标题2' },
      { type: 'goods', data: '', couponPrice: '', title: '主标题3', subTitle: '副标题3' },
      { type: 'goods', data: '', couponPrice: '', title: '主标题4', subTitle: '副标题4' },
    ],
  },
  {
    itemType: 'integral',
    itemNum: 4,
    itemStyle: 2,
    itemTitleColor: cloneDeep(recommondItemTitleColor),
    itemSubTitle: 2,
    itemData: [
      { type: 'integral', data: '', couponPrice: '', title: '主标题1', subTitle: '副标题1' },
      { type: 'integral', data: '', couponPrice: '', title: '主标题2', subTitle: '副标题2' },
      { type: 'integral', data: '', couponPrice: '', title: '主标题3', subTitle: '副标题3' },
      { type: 'integral', data: '', couponPrice: '', title: '主标题4', subTitle: '副标题4' },
    ],
  },
  {
    itemType: 'rich_text',
    itemData: [{ data: '<p>请编辑富文本内容</p>' }],
  },
  {
    itemType: 'video',
    propertiesArr: cloneDeep(picPropertiesArr),
    itemData: {
      videoUrl: '',
      videoCover: '',
    },
  },
  {
    itemType: 'shop_info',
    itemData: {
      shopName: '',
      shopTime: '',
      shopAddress: '',
      shopPhone: '',
    },
  },
  {
    itemType: 'alipay_mkt',
    itemData: {},
  },
  {
    itemType: 'community',
    itemNum: 4,
    itemEntrance: {
      entranceImg: '',
      entranceTitle: '',
      entranceSubTitle: '',
    },
    itemData: [],
  },
  {
    itemType: 'shop_cart',
    itemData: {
      img: 'https://img.kxll.com/admin_manage/icon/shop_cart_default.png',
    },
  },
  {
    itemType: 'promotion_goods',
    itemData: {
      data: '',
      discountedPrice: '',
    },
  },
  {
    itemType: 'subscribe',
    itemData: [{ image: '' }],
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'anXinChong',
    itemData: {
      type: 'card',
    },
  },
  {
    itemType: 'vipcard',
    itemData: [],
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'vipinfo',
    itemData: {
      backgroundType: 1,
      image: '',
      backgroundColor: {
        r: '',
        g: '',
        b: '',
        a: '',
      },
      integ: 1,
      balance: 1,
      coupon: 1,
    },
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'zmGo',
    itemData: {
      thirdAppId: ''
    }
  },
  {
    itemType: 'signIn',
    itemData: {},
    propertiesArr: cloneDeep(picPropertiesArr),
  },
  {
    itemType: 'memberTask',
    itemData: {},
    propertiesArr: cloneDeep(picPropertiesArr),
  }
];

// 主题色对应设置参数
export const appColor = [
  {
    colorName: 'red', // 珊瑚红
    titleColor: '#D33F3D',
    btnColor: '#F2982D',
    priceColor: '#F43142',
    textColor: '#834700',
    btnBack: 'linear-gradient(135deg,rgba(242,152,45,1) 0%,rgba(255,181,94,1) 100%)',
    btnShadow: '0px 8px 16px -6px rgba(242,152,45,0.75)',
    btnTextColor: '#FFFFFF',
    specialBtnColor: '#D33F3D',
    specialTextColor: '#D33F3D',
    homeIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/home.png',
    homeHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/home_hover.png',
    classIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/class.png',
    classHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/class_hover.png',
    shopIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/shop.png',
    shopHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/shop_hover.png',
    myIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/my.png',
    myHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/red/my_hover.png',
    noGoods: 'https://img.kxll.com/kxshop_uniapp/template/red/noGoods.png',
    noDelivery: 'https://img.kxll.com/kxshop_uniapp/template/red/noDelivery.png',
    noPayment: 'https://img.kxll.com/kxshop_uniapp/template/red/noPayment.png',
    evaluation: 'https://img.kxll.com/kxshop_uniapp/template/red/evaluation.png',
    afterSales: 'https://img.kxll.com/kxshop_uniapp/template/red/afterSales.png',
    bookOrder: 'https://img.kxll.com/kxshop_uniapp/template/red/bookOrder.png',
  },
  {
    colorName: 'gre', // 有机绿
    titleColor: '#019A48',
    btnColor: '#F2C42E',
    priceColor: '#F43142',
    textColor: '#AC5E0B',
    btnBack: 'linear-gradient(132deg,rgba(243,169,44,1) 0%,rgba(242,201,47,1) 100%)',
    btnShadow: '0px 4px 10px 0px rgba(242,158,46,0.46)',
    btnTextColor: '#FFFFFF',
    specialBtnColor: '#019A48',
    specialTextColor: '#00602C',
    homeIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/home.png',
    homeHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/home_hover.png',
    classIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/class.png',
    classHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/class_hover.png',
    shopIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/shop.png',
    shopHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/shop_hover.png',
    myIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/my.png',
    myHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/gre/my_hover.png',
    noGoods: 'https://img.kxll.com/kxshop_uniapp/template/gre/noGoods.png',
    noDelivery: 'https://img.kxll.com/kxshop_uniapp/template/gre/noDelivery.png',
    noPayment: 'https://img.kxll.com/kxshop_uniapp/template/gre/noPayment.png',
    evaluation: 'https://img.kxll.com/kxshop_uniapp/template/gre/evaluation.png',
    afterSales: 'https://img.kxll.com/kxshop_uniapp/template/gre/afterSales.png',
    bookOrder: 'https://img.kxll.com/kxshop_uniapp/template/gre/bookOrder.png',
  },
  {
    colorName: 'olive', // 橄榄绿
    titleColor: '#214237',
    btnColor: '#DDBA6E',
    priceColor: '#F43142',
    textColor: '#8B572A',
    btnBack: 'linear-gradient(136deg,rgba(221,184,108,1) 0%,rgba(223,205,127,1) 100%)',
    btnShadow: '0px 8px 16px -6px rgba(221,184,108,1)',
    btnTextColor: '#8B572A',
    specialBtnColor: '#DDBA6E',
    specialTextColor: '#8B572A',
    homeIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/home.png',
    homeHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/home_hover.png',
    classIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/class.png',
    classHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/class_hover.png',
    shopIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/shop.png',
    shopHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/shop_hover.png',
    myIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/my.png',
    myHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/olive/my_hover.png',
    noGoods: 'https://img.kxll.com/kxshop_uniapp/template/olive/noGoods.png',
    noDelivery: 'https://img.kxll.com/kxshop_uniapp/template/olive/noDelivery.png',
    noPayment: 'https://img.kxll.com/kxshop_uniapp/template/olive/noPayment.png',
    evaluation: 'https://img.kxll.com/kxshop_uniapp/template/olive/evaluation.png',
    afterSales: 'https://img.kxll.com/kxshop_uniapp/template/olive/afterSales.png',
    bookOrder: 'https://img.kxll.com/kxshop_uniapp/template/olive/bookOrder.png',
  },
  {
    colorName: 'bla', // 静夜黑
    titleColor: '#010101',
    btnColor: '#FD6009',
    priceColor: '#F43142',
    textColor: '#FFFFFF',
    btnBack: 'linear-gradient(135deg,rgba(253,96,9,1) 0%,rgba(253,160,9,1) 100%)',
    btnShadow: '0px 8px 16px -6px rgba(253,149,9,0.75)',
    btnTextColor: '#FFFFFF',
    specialBtnColor: '#FD6009',
    specialTextColor: '#FD6009',
    homeIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/home.png',
    homeHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/home_hover.png',
    classIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/class.png',
    classHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/class_hover.png',
    shopIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/shop.png',
    shopHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/shop_hover.png',
    myIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/my.png',
    myHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/bla/my_hover.png',
    noGoods: 'https://img.kxll.com/kxshop_uniapp/template/bla/noGoods.png',
    noDelivery: 'https://img.kxll.com/kxshop_uniapp/template/bla/noDelivery.png',
    noPayment: 'https://img.kxll.com/kxshop_uniapp/template/bla/noPayment.png',
    evaluation: 'https://img.kxll.com/kxshop_uniapp/template/bla/evaluation.png',
    afterSales: 'https://img.kxll.com/kxshop_uniapp/template/bla/afterSales.png',
    bookOrder: 'https://img.kxll.com/kxshop_uniapp/template/bla/bookOrder.png',
  },
  {
    colorName: 'blaWhite', // 银曜灰
    tabBarColor: '#0A0A0A',
    tabSelectedBarColor: '#98BDCA',
    titleColor: '#000000',
    btnColor: '#000000',
    priceColor: '#F43142',
    textColor: '#FFFFFF',
    btnBack: 'linear-gradient(135deg,rgba(0,0,0,1) 0%,rgba(0,0,0,1) 100%)',
    btnShadow: '0px 8px 16px -6px rgba(0,0,0,0.75)',
    btnTextColor: '#FFFFFF',
    leftBtnColor: '#98BDCA',
    specialBtnColor: '#000000',
    specialTextColor: '#000000',
    homeIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/home_hover.png',
    homeHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/home.png',
    classIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/class_hover.png',
    classHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/class.png',
    shopIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/shop_hover.png',
    shopHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/shop.png',
    myIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/my_hover.png',
    myHoverIcon: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/my.png',
    noGoods: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/noGoods.png',
    noDelivery: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/noDelivery.png',
    noPayment: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/noPayment.png',
    evaluation: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/evaluation.png',
    afterSales: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/afterSales.png',
    bookOrder: 'https://img.kxll.com/kxshop_uniapp/template/blaWhite/bookOrder.png',
  },
];

// 不需要排序的固定组件
export const fixedCom = ['shop_cart'];
