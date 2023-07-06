// import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {history} from '@umijs/max'
import {Modal} from 'antd';
import { getFakeCaptcha } from '../services/api';
import { accountLogin, adminPassword } from '../services/user';
import { dynamicRoutes, dynamicButtons } from '../services/menu';
import { setAuthority, setCurrentUser, setRoutes, setButtons, removeAll } from '../utils/authority';
import { getPageQuery, formatRoutes, formatButtons } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.success) {
        const { success, data } = response;
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: success,
            type: 'login',
            data: { ...data },
          },
        });
        const res = yield call(adminPassword)
        if (res.data) {
          Modal.confirm({
            okText: '立即修改',
            content: '密码长时间未修改，请及时修改密码',
            onOk() {
              window.location.href = '/tenantManager/Frame/AlterPassword'
            },
            onCancel() {}
          });
        }
        const responseRoutes = yield call(dynamicRoutes);
        const responseButtons = yield call(dynamicButtons);
        yield put({
          type: 'saveMenuData',
          payload: {
            routes: responseRoutes.data,
            buttons: responseButtons.data,
          },
        });
        reloadAuthorized();
        if (window.location.origin.indexOf('localhost') <= -1) {
          const url = '/tenantManager/Frame/HomePage';
          window.location.href = url;
          return;
        }
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length + 6);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // console.log('routerRedux123',routerRedux)
        // redirect = '/dashboard/workplace';
        // yield put(routerRedux.replace(redirect || '/'));
        history.replace('/dashboard/workplace')
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          type: 'logout',
          data: {
            authority: 'guest',
            logout: true,
          },
        },
      });
      reloadAuthorized();
      history.push(`/user/login?redirect=${stringify(window.location.href)}`)
      // yield put(
      //   routerRedux.push({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   })
      // );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { status, type } = payload;

      if (status) {
        const {
          data: {
            tokenType,
            accessToken,
            userId,
            authority,
            account,
            userName,
            avatar,
            tenantAccountId,
          },
        } = payload;
        const token = `${tokenType} ${accessToken}`;
        localStorage.setItem('sword-token', token);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tenantAccountId', tenantAccountId);
        setAuthority(authority);
        setCurrentUser({ avatar, account, name: userName, authority });
      } else {
        removeAll();
      }
      return {
        ...state,
        status: type === 'login' ? (status ? 'ok' : 'error') : '',
        type: payload.type,
      };
    },
    saveMenuData(state, { payload }) {
      const { routes, buttons } = payload;
      setRoutes(formatRoutes(routes));
      setButtons(formatButtons(buttons));
      return {
        ...state,
      };
    },
  },
};
