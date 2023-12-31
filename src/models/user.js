import { message } from 'antd';
import { history } from '@umijs/max';
import { USER_NAMESPACE } from '../actions/user';
import { query as queryUsers, list, submit, update, detail, remove, grant } from '../services/user';
import { select as tenants } from '../services/tenant';
import { tree as roles } from '../services/role';
import { tree as depts } from '../services/dept';
import { getCurrentUser } from '../utils/authority';

export default {
  namespace: USER_NAMESPACE,

  state: {
    list: [],
    currentUser: {},
    data: {
      list: [],
      pagination: {},
    },
    init: {
      roleTree: [],
      deptTree: [],
      tenantList: [],
    },
    detail: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { put }) {
      const currentUser = getCurrentUser();
      yield put({
        type: 'saveCurrentUser',
        payload: currentUser,
      });
    },
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data.records,
            pagination: {
              total: response.data.total,
              current: response.data.current,
              pageSize: response.data.size,
            },
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      const responseRole = yield call(roles, payload);
      const responseDept = yield call(depts, payload);
      const responseTenant = yield call(tenants, payload);
      if (responseRole.success && responseDept.success && responseTenant.success) {
        yield put({
          type: 'saveInit',
          payload: {
            roleTree: responseRole.data,
            deptTree: responseDept.data,
            tenantList: responseTenant.data,
          },
        });
      }
    },
    *fetchChangeInit({ payload }, { call, put }) {
      const responseRole = yield call(roles, payload);
      const responseDept = yield call(depts, payload);
      if (responseRole.success && responseDept.success) {
        yield put({
          type: 'saveChangeInit',
          payload: {
            roleTree: responseRole.data,
            deptTree: responseDept.data,
          },
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      if (response.success) {
        yield put({
          type: 'saveDetail',
          payload: {
            detail: response.data,
          },
        });
      }else{
        message.error(response.msg);
      }
    },
    *clearDetail({ payload }, { put }) {
      yield put({
        type: 'removeDetail',
        payload: { payload },
      });
    },
    *grant({ payload, callback }, { call }) {
      const response = yield call(grant, payload);
      if (response.success) {
        if (callback) {
          callback();
        }
      }else{
        message.error(response.msg);
      }
    },
    *submit({ payload }, { call }) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        history.push('/system/user');
      }else{
        message.error(response.msg);
      }
    },
    *update({ payload }, { call }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('提交成功');
        history.push('/system/user');
      }else{
        message.error(response.msg);
      }
    },
    *remove({ payload }, { call }) {
      const {
        data: { keys },
        success,
      } = payload;
      const response = yield call(remove, { ids: keys });
      if (response.success) {
        success();
      }else{
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    saveList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
    saveChangeInit(state, action) {
      const newState = state;
      newState.init.roleTree = action.payload.roleTree;
      newState.init.deptTree = action.payload.deptTree;
      return {
        ...newState,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
    removeDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
