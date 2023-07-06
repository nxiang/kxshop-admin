import { ColumnsType } from 'antd/lib/table'
// /** api 正常响应 */
// export interface INormalResponse<T> {
//   config: {
//     adapter: Function;
//     baseURL: string;
//     data: any;
//     headers: {
//       Accept: string;
//       appId: string;
//       clientId: number;
//       tId: number;
//       token: string;
//       userId: string;
//     };
//     maxContentLength: number;
//     method: string;
//     params: {
//       isLazy: boolean;
//     };
//     startTime: number;
//     timeout: number;
//     transformRequest: Array<Function>;
//     transformResponse: Array<Function>;
//     url: string;
//     validateStatus: Function;
//     xsrfCookieName: string;
//     xsrfHeaderName: string;
//   };
//   data: {
//     data: T;
//     /** 错误码 */
//     errorCode: string;
//     /** 错误码信息 */
//     errorMsg: string;
//     /** 标识请求成功/失败 */
//     success: boolean;
//   };
//   headers: {
//     ['access-control-allow-origin']: string;
//     ['cache-control']: string;
//     connection: string;
//     ['content-length']: string;
//     ['content-type']: string;
//     date: string;
//     server: string;
//     vary: string;
//     ['x-powered-by']: string;
//     ['x-real-url']: string;
//   };
//   request: XMLHttpRequest;
//   status: number;
//   statusText: string;
// }

/** 自定义表格列定义 */
export type ISelfColumnsType = ColumnsType<any> & {
  isShow?: () => boolean
}
/** api 正常响应 */
export interface INormalResponse<T> {
  data: T
  /** 错误码 */
  errorCode: string
  /** 错误码信息 */
  errorMsg: string
  /** 标识请求成功/失败 */
  success: boolean
}

/** api 响应 */
export type IResponse<T> = Promise<INormalResponse<T>>

export interface IAnyObject {
  [key: string]: any
}
