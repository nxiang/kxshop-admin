export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        component: './Login/Login',
      },
      {
        path: '/user/register',
        component: './Login/Register',
      },
      {
        path: '/user/register-result',
        component: './Login/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    // authority: ['administrator', 'admin', 'user', 'test', 's2'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/dashboard/workplace',
      },
      {
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            component: './Result/Success',
          },
          {
            path: '/result/fail',
            component: './Result/Error',
          },
        ],
      },
      {
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        path: '/account',
        routes: [
          {
            path: '/account/center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            //component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/password',
                component: './Account/Settings/PasswordView',
              },
              //{ path: '/account/settings/security', component: './Account/Settings/SecurityView' },
              //{ path: '/account/settings/binding', component: './Account/Settings/BindingView' },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        path: '/dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        path: '/desk',
        routes: [
          {
            path: '/desk/notice',
            routes: [
              {
                path: '/desk/notice',
                redirect: '/desk/notice/list',
              },
              {
                path: '/desk/notice/list',
                component: './Desk/Notice/Notice',
              },
              {
                path: '/desk/notice/add',
                component: './Desk/Notice/NoticeAdd',
              },
              {
                path: '/desk/notice/edit/:id',
                component: './Desk/Notice/NoticeEdit',
              },
              {
                path: '/desk/notice/view/:id',
                component: './Desk/Notice/NoticeView',
              },
            ],
          },
        ],
      },
      {
        path: '/system',
        routes: [
          {
            path: '/system/user',
            routes: [
              {
                path: '/system/user',
                redirect: '/system/user/list',
              },
              {
                path: '/system/user/list',
                component: './System/User/User',
              },
              {
                path: '/system/user/add',
                component: './System/User/UserAdd',
              },
              {
                path: '/system/user/edit/:id',
                component: './System/User/UserEdit',
              },
              {
                path: '/system/user/view/:id',
                component: './System/User/UserView',
              },
            ],
          },
          {
            path: '/system/dict',
            routes: [
              {
                path: '/system/dict',
                redirect: '/system/dict/list',
              },
              {
                path: '/system/dict/list',
                component: './System/Dict/Dict',
              },
              {
                path: '/system/dict/add',
                component: './System/Dict/DictAdd',
              },
              {
                path: '/system/dict/add/:id',
                component: './System/Dict/DictAdd',
              },
              {
                path: '/system/dict/edit/:id',
                component: './System/Dict/DictEdit',
              },
              {
                path: '/system/dict/view/:id',
                component: './System/Dict/DictView',
              },
            ],
          },
          {
            path: '/system/dept',
            routes: [
              {
                path: '/system/dept',
                redirect: '/system/dept/list',
              },
              {
                path: '/system/dept/list',
                component: './System/Dept/Dept',
              },
              {
                path: '/system/dept/add',
                component: './System/Dept/DeptAdd',
              },
              {
                path: '/system/dept/add/:id',
                component: './System/Dept/DeptAdd',
              },
              {
                path: '/system/dept/edit/:id',
                component: './System/Dept/DeptEdit',
              },
              {
                path: '/system/dept/view/:id',
                component: './System/Dept/DeptView',
              },
            ],
          },
          {
            path: '/system/role',
            routes: [
              {
                path: '/system/role',
                redirect: '/system/role/list',
              },
              {
                path: '/system/role/list',
                component: './System/Role/Role',
              },
              {
                path: '/system/role/add',
                component: './System/Role/RoleAdd',
              },
              {
                path: '/system/role/add/:id',
                component: './System/Role/RoleAdd',
              },
              {
                path: '/system/role/edit/:id',
                component: './System/Role/RoleEdit',
              },
              {
                path: '/system/role/view/:id',
                component: './System/Role/RoleView',
              },
            ],
          },
          {
            path: '/system/menu',
            routes: [
              {
                path: '/system/menu',
                redirect: '/system/menu/list',
              },
              {
                path: '/system/menu/list',
                component: './System/Menu/Menu',
              },
              {
                path: '/system/menu/add',
                component: './System/Menu/MenuAdd',
              },
              {
                path: '/system/menu/add/:id',
                component: './System/Menu/MenuAdd',
              },
              {
                path: '/system/menu/edit/:id',
                component: './System/Menu/MenuEdit',
              },
              {
                path: '/system/menu/view/:id',
                component: './System/Menu/MenuView',
              },
            ],
          },
          {
            path: '/system/param',
            routes: [
              {
                path: '/system/param',
                redirect: '/system/param/list',
              },
              {
                path: '/system/param/list',
                component: './System/Param/Param',
              },
              {
                path: '/system/param/add',
                component: './System/Param/ParamAdd',
              },
              {
                path: '/system/param/edit/:id',
                component: './System/Param/ParamEdit',
              },
              {
                path: '/system/param/view/:id',
                component: './System/Param/ParamView',
              },
            ],
          },
          {
            path: '/system/tenant',
            routes: [
              {
                path: '/system/tenant',
                redirect: '/system/tenant/list',
              },
              {
                path: '/system/tenant/list',
                component: './System/Tenant/Tenant',
              },
              {
                path: '/system/tenant/add',
                component: './System/Tenant/TenantAdd',
              },
              {
                path: '/system/tenant/edit/:id',
                component: './System/Tenant/TenantEdit',
              },
              {
                path: '/system/tenant/view/:id',
                component: './System/Tenant/TenantView',
              },
            ],
          },
          {
            path: '/system/client',
            routes: [
              {
                path: '/system/client',
                redirect: '/system/client/list',
              },
              {
                path: '/system/client/list',
                component: './System/Client/Client',
              },
              {
                path: '/system/client/add',
                component: './System/Client/ClientAdd',
              },
              {
                path: '/system/client/edit/:id',
                component: './System/Client/ClientEdit',
              },
              {
                path: '/system/client/view/:id',
                component: './System/Client/ClientView',
              },
            ],
          },
          {
            path: '/system/msgpush',
            routes: [
              {
                path: '/system/msgpush/list',
                component: './System/MsgPush/MsgPush',
              },
            ],
          },
        ],
      },
      {
        path: '/monitor',
        routes: [
          {
            path: '/monitor/log',
            routes: [
              {
                path: '/monitor/log/usual',
                routes: [
                  {
                    path: '/monitor/log/usual',
                    redirect: '/monitor/log/usual/list',
                  },
                  {
                    path: '/monitor/log/usual/list',
                    component: './Monitor/Log/LogUsual',
                  },
                  {
                    path: '/monitor/log/usual/view/:id',
                    component: './Monitor/Log/LogUsualView',
                  },
                ],
              },
              {
                path: '/monitor/log/api',
                routes: [
                  {
                    path: '/monitor/log/api',
                    redirect: '/monitor/log/api/list',
                  },
                  {
                    path: '/monitor/log/api/list',
                    component: './Monitor/Log/LogApi',
                  },
                  {
                    path: '/monitor/log/api/view/:id',
                    component: './Monitor/Log/LogApiView',
                  },
                ],
              },
              {
                path: '/monitor/log/error',
                routes: [
                  {
                    path: '/monitor/log/error',
                    redirect: '/monitor/log/error/list',
                  },
                  {
                    path: '/monitor/log/error/list',
                    component: './Monitor/Log/LogError',
                  },
                  {
                    path: '/monitor/log/error/view/:id',
                    component: './Monitor/Log/LogErrorView',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/tool',
        routes: [
          {
            path: '/tool/code',
            routes: [
              {
                path: '/tool/code',
                redirect: '/tool/code/list',
              },
              {
                path: '/tool/code/list',
                component: './System/Code/Code',
              },
              {
                path: '/tool/code/add',
                component: './System/Code/CodeAdd',
              },
              {
                path: '/tool/code/add/:id',
                component: './System/Code/CodeAdd',
              },
              {
                path: '/tool/code/edit/:id',
                component: './System/Code/CodeEdit',
              },
              {
                path: '/tool/code/view/:id',
                component: './System/Code/CodeView',
              },
            ],
          },
          {
            path: '/tool/datasource',
            routes: [
              {
                path: '/tool/datasource',
                redirect: '/tool/datasource/list',
              },
              {
                path: '/tool/datasource/list',
                component: './System/DataSource/DataSource',
              },
              {
                path: '/tool/datasource/add',
                component: './System/DataSource/DataSourceAdd',
              },
              {
                path: '/tool/datasource/add/:id',
                component: './System/DataSource/DataSourceAdd',
              },
              {
                path: '/tool/datasource/edit/:id',
                component: './System/DataSource/DataSourceEdit',
              },
              {
                path: '/tool/datasource/view/:id',
                component: './System/DataSource/DataSourceView',
              },
            ],
          },
        ],
      },
      {
        path: '/shop', // 店铺
        routes: [
          {
            path: '/shop/home',
            component: './Shop/ShopHome/ShopHome', // 店铺首页
          },
          {
            path: '/shop/setShop',
            component: './Shop/SetShop/SetShop', // 店铺信息
          },
          {
            path: '/shop/decoration',
            component: './Shop/ShopDecoration/ShopDecoration', // 店铺装修
          },
          {
            path: '/shop/special',
            component: './Shop/SetSpecial/SetSpecial', // 专题页配置
          },
          {
            path: '/shop/setbusiness',
            component: './Shop/SetBusiness/SetBusiness', // 经营设置
          },
          {
            path: '/shop/special/config/:storeSpecialId',
            component: './Shop/SetSpecialConfig/SetSpecialConfig', // 专题页配置编辑页
          },
          {
            path: '/shop/paySuccess',
            component: './Shop/PaySuccess', // 支付成功页
          },
          {
            path: '/shop/popupAd',
            component: './Shop/SetPopUpAd/SetPopUpAd', // 弹窗广告
          },
          {
            path: '/shop/popupAd/config/:popupId',
            component: './Shop/SetPopupAdConfig/SetPopupAdConfig', // 弹窗广告配置
          },
          {
            path:'/shop/setNavigation',
            component:"./Shop/SetNavigation/SetNavigation" // 导航配置
          },
          {
            path:'/shop/centre',//会员中心
            component:"./Shop/Centre/Centre"
          },
          {
            path:'/shop/shopAddressLibrary', //商家地址库
            component:"./Shop/ShopAddressLibrary/ShopAddressLibrary"
          },
          {
            path:'/shop/shopAddressLibrary/config', //配置商家地址库
            component:"./Shop/ShopAddressLibrary/ShopAddressLibraryConfig/ShopAddressLibraryConfig"
          }
        ],
      },
      {
        path: '/goods', // 商品
        routes: [
          {
            path: '/goods/hotSaleManageList',
            component: './Goods/HotSaleManage/List', // 商品管理列表
          },
          {
            path: '/goods/manageList',
            component: './Goods/GoodsManage/GoodsManage', // 商品管理列表
          },
          {
            path: '/goods/manageList/goodsimport',
            component: './Goods/GoodsImport/GoodsImport', // 商品导入
          },
          {
            path: '/goods/manageList/addGoods',
            component: './Goods/AddGoods/AddGoods', // 商品管理列表
          },
          {
            path: '/goods/specList',
            component: './Goods/GoodsSpec/GoodsSpec', // 规格管理列表
          },
          {
            path: '/goods/classifyList',
            component: './Goods/GoodsClassify/GoodsClassify', // 类目管理列表
          },
          {
            path: '/goods/pointManageList',
            component: './Goods/PointManageList/PointManageList', // 积分商品管理
          },
          {
            path: '/goods/PointManageList/pointManageEdit',
            component: './Goods/PointManageEdit/PointManageEdit', // 积分商品（新增/更新）
          },
          {
            path: '/goods/prohibitionSalesArea',
            component: './Goods/ProhibitionSalesArea/ProhibitionSalesArea' // 禁售区域管理
          },
          {
            path:"/goods/tag",
            component:'./Goods/Tag/Tag' //商品标签
          },
          {
            path:"/goods/goodsSet",
            component:"./Goods/GoodsSet/GoodsSet" // 商品设置
          }
        ],
      },
      {
        path: '/community', // 社区团购
        routes: [
          {
            path: '/community/decorate',
            component: './Community/Decorate/Decorate', // 社区团购首页装修
          },
          {
            path: '/community/goodsManage',
            component: './Community/GoodsManage/GoodsManage', // 社区团购商品管理
          },
          {
            path: '/community/goodsManage/addGoods',
            component: './Community/AddGoods/AddGoods', // 社区团购商品新增/修改
          },
          {
            path: '/community/order',
            routes: [
              {
                path: '/community/order/orderList',
                component: './Community/OrderList/OrderList', // 社区团购订单管理
              },
              {
                path: '/community/order/orderList/detail',
                component: './Community/OrderDetail/OrderDetail', // 社区团购订单详情
              },
            ],
          },
          {
            path: '/community/location',
            routes: [
              {
                path: '/community/location/locationManage',
                component: './Community/LocationManage/LocationManage', // 社区团购自提点管理
              },
            ]
          }
        ],
      },
      {
        path: '/order', // 订单
        routes: [
          {
            path: '/order/orderList',
            component: './Order/OrderList/OrderList', // 订单列表
          },
          {
            path: '/order/orderList/OrderDetail/:bizOrderId',
            component: './Order/OrderDetail/OrderDetail', // 订单详情
          },
          {
            path: '/order/orderList/orderExportRecord',
            component: './Order/OrderExportRecord/OrderExportRecord', // 导出订单列表
          },
          {
            path: '/order/orderList/orderImportRecord',
            component: './Order/OrderImportRecord/OrderImportRecord', // 导入订单列表
          },
          {
            path: '/order/printList',
            component: './Order/PrintList/PrintList', // 小票打印
          },
          {
            path: '/order/afterSaleList',
            component: './Order/AfterSaleList/AfterSaleList', // 售后订单列表
          },
          {
            path: '/order/afterSaleList/exportRecord',
            component: './Order/AfterSaleExportRecord/AfterSaleExportRecord', // 售后订单导出列表
          },
          {
            path: '/order/afterSaleList/afterSaleDetail',
            component: './Order/AfterSaleDetail/AfterSaleDetail', // 售后订单详情
          },
          {
            path: '/order/EvaluationManage',
            component: './Order/EvaluationManage/EvaluationManage', // 评价管理
          },
          {
            path: '/order/pointOrderList',
            component: './Order/PointOrderList/PointOrderList', // 积分订单列表
          },
          {
            path: '/order/pointOrderList/PointOrderRecord',
            component: './Order/PointOrderRecord/PointOrderRecord', // 积分订单导出列表
          },
        ],
      },
      {
        path: '/bookingmanage', // 预约管理
        routes: [
          {
            path: '/bookingmanage/bookingorder',
            component: './BookingManage/BookingOrder/BookingOrder', // 订单列表
          },
          {
            path: '/bookingmanage/bookingdetail/:orderId',
            component: './BookingManage/BookingDetail/BookingDetail', // 订单详情
          },
        ],
      },
      {
        path: '/operation', // 运营
        routes: [
          {
            path: '/operation/addCoupon',
            component: './Operation/AddCoupon/AddCoupon', // 新建优惠券
          },
          {
            path: '/operation/couponManage',
            component: './Operation/CouponManage/CouponManage', // 优惠券管理
          },
          {
            path: '/operation/couponManage/receivingDegail',
            component: './Operation/CouponManage/ReceivingDetails/index', // 领券明细
          },
          {
            path: '/operation/couponDetail',
            component: './Operation/CouponDetail/CouponDetail', // 优惠券详情
          },
          {
            path: '/operation/addCoupon/addMallCoupon',
            component: './Operation/AddMallCoupon/AddMallCoupon', // 创建商城优惠券
          },
          {
            path: '/operation/addCoupon/editMallCoupon',
            component: './Operation/EditMallCoupon/EditMallCoupon', // 编辑商城优惠券
          },
          {
            path: '/operation/addCoupon/couponItemConfig',
            component: './Operation/CouponItemConfig', // 单品优惠券管理（新增、编辑）
          },
          {
            path: '/operation/activitys/list',
            component: './Operation/ActivityList/ActivityList', //营销列表（互动营销）
          },
          {
            path: '/operation/group/list',
            component: './Operation/GroupList/GroupList', //拼团
          },
          {
            path: '/operation/activitys/add',
            component: './Operation/ActivityAdd/ActivityAdd', //营销新建活动
          },
          {
            path: '/operation/activitys/list/detail',
            component: './Operation/ActivityDetail/ActivityDetail', //营销详情
          },
          {
            path: '/operation/stroedConfig',
            component: './Operation/StroedConfig/StroedConfig', // 储值配置列表
          },
          {
            path: '/operation/stroedQuery',
            component: './Operation/StroedQuery/StroedQuery', // 储值配置列表
          },
          {
            path: '/operation/stroedConfig/addStroed/:cardId',
            component: './Operation/AddStroed/AddStroed',
          },
          {
            path: '/operation/stroedQuery/stroedDetail/:balanceDetailId',
            component: './Operation/StroedDetail/StroedDetail',
          },
          {
            path: '/operation/activitys/shareCoupon',
            redirect: '/Operation/activitys/shareCoupon/list', // 分享领券
          },
          {
            path: '/operation/activitys/shareCoupon/list',
            component: './Operation/ShareCoupon/ShareCouponList/ShareCouponList', // 分享领券列表
          },
          {
            path: '/operation/activitys/shareCoupon/detail/:id',
            component: './Operation/ShareCoupon/ShareCouponDetail/ShareCouponDetail', //分享领券详情
          },
          {
            path: '/operation/activitys/shareCoupon/new',
            component: './Operation/ShareCoupon/NewShareCoupon/NewShareCoupon', //新建分享领券
          },
          {
            path: '/operation/shareRebateList',
            component: './Operation/ShareRebateList/ShareRebateList', // 分享返佣（商品分销）
          },
          {
            path: '/operation/invitationList',
            component: './Operation/InvitationList/InvitationList', // 邀请有礼列表页
          },
          {
            path: '/operation/addInvitation',
            component: './Operation/AddInvitation/AddInvitation', // 新建邀请有礼活动
          },
          {
            path: '/operation/invitationDetail',
            component: './Operation/InvitationDetail/InvitationDetail', // 新建邀请有礼详情
          },
          {
            path: '/operation/signIn',
            component: './Operation/SignIn/SignIn', // 签到规则
          },
          {
            path: '/operation/alipayMarketingConfig',
            component: './Operation/AlipayMarketingConfig/AlipayMarketingConfig', // 营销活动规则
          },
        ],
      },
      {
        path: '/users', // 会员
        routes: [
          {
            path: '/users',
            redirect: '/users/list',
          },
          {
            path: '/users/list',
            component: './UsersManage/QueryModule/QueryList/QueryList', // 会员查询列表
          },
          {
            path: '/users/list/detail',
            component: './UsersManage/QueryModule/QueryDetail/QueryDetail', //  会员详情页
          },
          {
            path: '/users/tagList',
            component: './UsersManage/TagList/TagList', // 标签管理
          },
          {
            path: '/users/analysis', // 会员分析
            component: './UsersManage/Analysis/Analysis',
          },
          {
            path: '/users/levelList', // 会员等级
            component: './UsersManage/LevelList/LevelList',
          },
          {
            path: '/users/levelList/add', // 会员等级编辑
            component: './UsersManage/LevelAdd/LevelAdd',
          },
          {
            path: '/users/integralRights', // 积分权益
            component: './UsersManage/IntegralRights/IntegralRights',
          },
          {
            path: '/users/memberTasks', // 会员任务
            component: './UsersManage/MemberTasks/MemberTasksLay/MemberTasksLay',
          },
          {
            path: '/users/memberTasks/edit/:id', // 会员任务编辑
            component: './UsersManage/MemberTasks/MemberTasksEdit/MemberTasksEdit',
          }
        ],
      },
      {
        path: '/service', // 客服
        routes: [
          {
            path: '/service/online',
            component: './Service/Online/Online',
          },
          {
            path: '/service/setService',
            component: './Service/SetService/SetService', // 客服设置
          },
        ],
      },
      {
        path: '/setting', // 设置
        routes: [
          {
            path: '/setting/printReceipt',
            component: './Setting/PrintReceipt/PrintReceipt', // 打印小票
          },
          {
            path: '/setting/choiceExpress',
            component: './Setting/ChoiceExpress/ChoiceExpress', // 快递公司
          },
          {
            path: '/setting/deilvery',
            component: './Setting/Delivery/Delivery', // 即时配送
          },
          {
            path: '/setting/logistics',
            component: './Setting/Logistics/Logistics', // 快递物流
          },
          {
            path: '/setting/addlogistics/:freightId',
            component: './Setting/AddLogistics/AddLogistics', // 添加物流模板
          },
          {
            path: '/setting/freeDeliverySet', // 包邮设置
            component: './Setting/FreeDeliverySet/FreeDeliverySet',
          },
          {
            path: '/setting/freeDeliverySet/add', // 包邮设置
            component: './Setting/AddFreeDelivery/AddFreeDelivery',
          },
        ],
      },
      {
        path: '/message',
        routes: [
          {
            path: '/message/messageCenter',
            component: './Message/MessageCenter/MessageCenter', // 通知中心
          },
        ],
      },
      // {
      //   path: '/demo',
      //   routes: [
      //     {
      //       path: '/demo/uploaddemo',
      //       component: './Demo/UploadDemo/UploadDemo',
      //     },
      //     {
      //       path: '/demo/ossdemo',
      //       component: './Demo/OssDemo/OssDemo',
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
