import React, { Suspense } from 'react';
import {
  // history,
  formatMessage,Outlet } from '@umijs/max';
import { Layout, notification, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import DocumentTitle from 'react-document-title';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { cloneDeep, isEqual } from 'lodash-es';
import { Permission } from '@/utils/utils';
// import Authorized from '@/utils/Authorized';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';
import logo from '../assets/logo.svg';
// import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';

import { menu, title } from '../defaultSettings';
import styles from './BasicLayout.less';

import { messageList } from '@/services/order';
import { isDev } from '@/consts';
import { withRouter } from '@/utils/compatible'

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const screenQuery = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.state = {
      playList: [],
      messageTime: null,
      messageListTime: null,
    };
  }

  componentWillMount() {
    const {
      location: { query },
    } = this.props;
    if (query?.appId) {
      localStorage.setItem('appId', query.appId);
    }
    if (query?.tId) {
      localStorage.setItem('tId', query.tId);
    }
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/fetchMenuData',
      payload: { routes, authority },
    });
    if (this.state.messageListTime == null) {
      this.state.messageListTime = setInterval(() => {
        if (this.state.playList.length > 0) {
          const newPlayList = cloneDeep(this.state.playList);
          if (newPlayList[0].type == 'ORDER') {
            notification.open({
              message: `您有新的订单  ${this.dateConvert(newPlayList[0].createTime)}`,
              description: `请您及时处理`,
              onClick: () => {
                notification.destroy();
                window.location.href = `/admin/order/orderList/OrderDetail/${newPlayList[0].id}`;
              },
              placement: 'bottomRight',
            });
            const sound = new Audio('https://img.kxll.com/admin_manage/hint.mp3');
            sound.play();
          }
          if (newPlayList[0].type == 'IM') {
            notification.open({
              message: `您有新的客户消息  ${this.dateConvert(newPlayList[0].createTime)}`,
              description: `请您及时处理`,
              onClick: () => {
                notification.destroy();
                // history.push(`/order/orderList/OrderDetail/${newPlayList[0].bizOrderId}`);
                window.location.href = `/admin/service/online`;
              },
              placement: 'bottomRight',
            });
          }
          this.state.playList.shift();
        }
      }, 1500);
    }
    if (this.state.messageTime == null) {
      // 开发环境关闭，因为轮询频繁影响调试
      if (isDev) return
      this.state.messageTime = setInterval(() => {
        this.getOrderList();
      }, 10000);
    }
  }

  async getOrderList() {
    if (
      !localStorage.getItem('token') ||
      localStorage.getItem('token') === 'null' ||
      location.pathname === '/admin/user/login'
      // ||
      // location.hostname === 'localhost'
    ) {
      clearInterval(this.state.messageTime);
      return; // 未登录停止轮询
    }
    const data = await messageList({
      second: 10,
    });
    if (data.data && data.data.list && data.data.list instanceof Array) {
      const list = this.state.playList || [];
      data.data.list.forEach(element => {
        list.push(element);
      });
      this.setState({
        playList: list,
      });
    }
  }

  // 时间戳转化为日期
  dateConvert(timestamp) {
    const date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
    const h = date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}:` : `${date.getMinutes()}:`;
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouteAuthority = (pathname, routeData) => {
    console.log('getRouteAuthority',routeData)
    const routes = routeData.slice(); // clone
    // console.log(JSON.stringify(routes))
    let authorities;

    while (routes.length > 0) {
      const route = routes.shift();
      // check partial route
      if (pathToRegexp(`${route.path}(.*)`).test(pathname)) {
        if (route.authority) {
          authorities = route.authority;
        }
        // is exact route?
        if (pathToRegexp(route.path).test(pathname)) {
          break;
        }

        if (route.routes) {
          route.routes.forEach(r => routes.push(r));
        }
      }
    }
    return authorities;
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return title;
    }

    const pageName = menu.disableLocal
      ? currRouterData.name
      : formatMessage({
          id: currRouterData.locale || currRouterData.name,
          defaultMessage: currRouterData.name,
        });

    return `${pageName} - ${title}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && process.env.APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouteAuthority(pathname, routes);
    console.log(routerConfig);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <ConfigProvider locale={zhCN}>
        <Layout>
          {isTop && !isMobile ? null : (
            <SiderMenu
              logo={logo}
              theme={navTheme}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              isMobile={isMobile}
              {...this.props}
            />
          )}
          <Layout
            style={{
              ...this.getLayoutStyle(),
              minHeight: '100vh',
              overflow: 'visible',
            }}
          >
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
            />
            <Content className={styles.content} style={contentStyle}>
              {Permission() ? <Outlet />  : <Exception403 />}
              {/* <Outlet /> */}
            </Content>
            {/* <Footer /> */}
          </Layout>
        </Layout>
      </ConfigProvider>
    );
    return (
      <ConfigProvider locale={zhCN}>
        <React.Fragment>
          <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
            <ContainerQuery query={screenQuery}>
              {params => (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              )}
            </ContainerQuery>
          </DocumentTitle>
          <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense>
        </React.Fragment>
      </ConfigProvider>
    );
  }
}

export default withRouter(connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
)));
