import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function formatRoutes(routes) {
  function format(arr) {
    arr.forEach(node => {
      const item = node;
      if (item.children && Array.isArray(item.children)) {
        item.routes = item.children;
        format(item.routes);
      }
      if (item.isOpen === 2) {
        item.target = '_blank';
      }
      // item.name = item.code;
      if (item.source) {
        item.icon = item.source;
      }
      delete item.id;
      delete item.parentId;
      delete item.sort;
      delete item.code;
      delete item.source;
      delete item.children;
    });
    return arr;
  }
  return format(routes);
}

export function formatButtons(buttons) {
  return buttons.map(item => {
    return {
      code: item.code,
      buttons: item.children,
    };
  });
}

/**
 * 去除浮点计算
 */
export const floatObj = (function() {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
    return Math.floor(obj) === obj;
  }

  /**
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum) {
    const ret = { times: 1, num: 0 };
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    const strfi = `${floatNum}`;
    const dotPos = strfi.indexOf('.');
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    const intNum = parseInt(floatNum * times + 0.5, 10);
    ret.times = times;
    ret.num = intNum;
    return ret;
  }

  /**
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a, b, op) {
    const o1 = toInteger(a);
    const o2 = toInteger(b);
    const n1 = o1.num;
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result = null;
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2;
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2);
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result;
      default:
    }
  }

  // 加减乘除的四个接口
  function add(a, b) {
    return operation(a, b, 'add');
  }

  function subtract(a, b) {
    return operation(a, b, 'subtract');
  }

  function multiply(a, b) {
    return operation(a, b, 'multiply');
  }

  function divide(a, b) {
    return operation(a, b, 'divide');
  }

  return {
    add,
    subtract,
    multiply,
    divide,
  };
})();

/**
 * 路由权限
 */
export const Permission = () => {
  if (!localStorage.tenantAccountId) return;
  const UrlList = [
    ...JSON.parse(localStorage.getItem('sword-routes')),
    ...JSON.parse(localStorage.getItem('sword-buttons')),
  ];
  const { pathname } = window.location;
  const routerList = [];
  const list = array => {
    array.forEach(item => {
      routerList.push(item);
      if (item.routes || item.buttons) {
        list(item.routes || item.buttons);
      }
    });
  };
  list(UrlList);
  // eslint-disable-next-line consistent-return
  return routerList.some(item => {
    if (item.code) {
      return pathname.indexOf(`/admin${item.path}`) != -1;
    }
    return pathname === `/admin${item.path}`;
  });
};

/**
 * 按钮显示隐藏
 */
export const showBut = (code, alias) => {
  if (!localStorage.tenantAccountId) return;
  const buttons = JSON.parse(localStorage.getItem('sword-buttons'));
  if (buttons.filter(item => item.code === code).length) {
    // eslint-disable-next-line consistent-return
    return buttons.filter(item => item.code === code)[0].buttons.some(item => item.code === alias);
  }
  // eslint-disable-next-line consistent-return
  return false;
};

// 随机数
export const randomString = (length) => {
  let res = '';
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  for (let i = 0; i < length; i += 1) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

// 删除空值
export const removeEmptyField = (obj) => {
  let newObj = {}
  if (typeof obj === 'string') {
    obj = JSON.parse(obj)
  }
  if (obj instanceof Array) {
    newObj = [];
  }
  if (obj instanceof Object) {
    for (const attr in obj) {
      // 属性值不为'',null,undefined才加入新对象里面(去掉'',null,undefined)
      if (obj.hasOwnProperty(attr) && obj[attr] !== '' && obj[attr] !== null && obj[attr] !== undefined) {
        if (obj[attr] instanceof Object) {
          // 空数组或空对象不加入新对象(去掉[],{})
          if(JSON.stringify(obj[attr]) === '{}' || JSON.stringify(obj[attr]) === '[]') {
              continue
          }
          // 属性值为对象,则递归执行去除方法
          newObj[attr] = removeEmptyField(obj[attr])
        } else if (
          typeof obj[attr] === 'string' &&
          ((obj[attr].indexOf('{') > -1 && obj[attr].indexOf('}') > -1) ||
            (obj[attr].indexOf('[') > -1 && obj[attr].indexOf(']') > -1))
        ) {
          // 属性值为JSON时
          try {
            const attrObj = JSON.parse(obj[attr])
            if (attrObj instanceof Object) {
              newObj[attr] = removeEmptyField(attrObj)
            }
          } catch (e) {
            newObj[attr] = obj[attr]
          }
        } else {
          newObj[attr] = obj[attr]
        }
      }
    }
  }
  return newObj
}