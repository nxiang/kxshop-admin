import { message } from 'antd'
import { history } from '@umijs/max'
import { decryptByDES } from 'kx-des'
import axios from './index'
import logger from '@/utils/logger'

function http(method, url, opts = {}, type?: string) {
  const data = {
    method,
    url,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json;charset=UTF-8',
      // appId: "20191105",   //开发服
      // tId: 2,              //开发服
      appId: localStorage.getItem('appId') || '20200239', // '20191105',
      tId: localStorage.getItem('tId') || 54, // 2,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      clientId: 10,
      ...(opts.headersConfig || {}),
    },
  };
  if (method == 'post') {
    data.data = opts
  } else if (method == 'get') {
    data.params = opts
  }
  if (type == 'form') {
    data.headers['Content-Type'] = 'application/json;charset=UTF-8'
    data.params = opts
  }
  data.startTime = Date.now()
  return new Promise((resolve, reject) => {
    axios(data)
      .then(async (res) => {
        let datas
        if (typeof res.data === 'string' && res.data?.length > 0) {
          try {
            datas = await JSON.parse(decryptByDES(res.data))
          } catch (error) {
            datas = {}
            message.error('接口请求失败')
          }
        } else {
          datas = res.data
        }
        // 日志信息收集
        const time = Date.now()
        logger().api({
          api: data.url,
          success: datas.success,
          time,
          code: datas.errorCode == '0' ? 200 : datas.errorCode,
          msg: datas.errorMsg || res.statusText,
          begin: data.startTime
        })
        if (
          !datas &&
          res.config.url == 'https://kxgshop.oss-cn-hangzhou.aliyuncs.com'
        ) {
          resolve(res) // oss图片上传兼容
        } else if (datas.success) {
          resolve(datas)
        } else {
          message.error(datas.errorMsg || datas.msg);
          // console.log('RES=', res);
          if (datas.errorCode == 401) {
            localStorage.clear()
            history.push('/user/login')
          }
          if (datas.errorCode == 200041002) {
            reject(datas);
          }
          reject(new Error(false));
        }
      })
      .catch((err) => {
        const time = Date.now()
        logger().api({
          api: data.url,
          success: false,
          time,
          code: err.response?.data.status,
          msg: err.response?.data.message || err.response?.statusText,
          begin: data.startTime,
        });
        reject(new Error(false));
      });
  })
  .catch(err => {
    if (err?.errorCode) {
      return err;
    }
    return false;
  });
}

function excel(method, url, opts = {}) {
  const data = {
    method,
    url,
    responseType: 'blob',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json;charset=UTF-8',
      appId: localStorage.getItem('appId') || '20191105',
      tId: localStorage.getItem('tId') || 2,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      clientId: 10
    }
  }
  if (method == 'post') {
    data.data = {
      ...opts
    }
  } else if (method == 'get') {
    data.params = {
      ...opts
    }
  }
  data.startTime = Date.now()
  return new Promise((resolve, reject) =>
    axios(data)
      .then((res) => {
        const r = new FileReader()
        r.onload = function () {
          const time = Date.now()
          try {
            const resData = JSON.parse(String(this.result))
            if (resData.success == false) {
              message.error(resData.errorMsg)
              logger().api({
                api: data.url,
                success: false,
                time,
                code: resData.errorCode == '0' ? 200 : resData.errorCode,
                msg: resData.errorMsg || res.statusText,
                begin: data.startTime
              })
              reject(new Error(false))
            }
          } catch (err) {
            resolve(res.data)
            logger().api({
              api: data.url,
              success: true,
              time,
              code: 200,
              msg: '上传成功',
              begin: data.startTime
            })
          }
        }
        r.readAsText(res.data)
      })
      .catch((err) => {
        const time = Date.now()
        logger().api({
          api: data.url,
          success: false,
          time,
          code: err.response.data.status,
          msg: err.response.data.message || err.response.statusText,
          begin: data.startTime
        })
        reject(new Error(false))
      })
  )
}

export { http, excel }
