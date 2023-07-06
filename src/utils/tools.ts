import { letterNumberLineThroughUnderlineReg } from '@/consts'
import { IAnyObject } from '@/types'

/** 延时 */
export function awaitTime(duration = 200) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, duration)
  })
}

/**
 * 调用table columns的isShow方法
 * @param {*} columns 表格列定义
 * @returns
 */
export const tableColumnsIsShow = (columns) => {
  if (!Array.isArray(columns))
    throw new TypeError(`columns不是数组类型，columns：${columns}`)
  return columns.filter((item) => {
    const isShow = item?.isShow?.()
    if (typeof isShow === 'boolean') {
      return isShow
    }
    return true
  })
}

/**
 * 分转换为元
 * @param {string,number} val
 */
export const centBecomeDollar = (val = undefined) => {
  if (!val) return ''
  const num = parseInt(val, 10) / 100
  return Number.isNaN(num) ? '' : num
}

/**
 * 格式化小数，保留两位小数(四舍五入)
 * @param {*} val
 */
export const formatDecimalPoint = (val) => {
  const valNumber = Number(val)
  return Number.isNaN(valNumber) ? '0.00' : valNumber.toFixed(2)
}

/**
 * 同步数据，配合ahooks的useReactive使用
 * @param source useReactive返回的对象
 * @param target 目标对象
 * @param ignoreKeys 忽略的key
 */
export const syncObject = (
  source: IAnyObject,
  target: IAnyObject,
  ignoreKeys: Array<string> = []
) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in target) {
    if (ignoreKeys?.includes?.(key)) continue
    const value = target[key]
    const oldValue = source[key]
    if (value !== oldValue) {
      source[key] = value
    }
  }
}

/**
 * 中划线转大驼峰
 * left-circle => LeftCircle
 */
export const lineLhroughToGreatHump = (str: string) => {
  if (typeof str !== 'string') return str
  const strs = str.split('')
  const results = []
  // 标识遇到了中划线(-)
  let flag = false
  for (let i = 0; i < strs.length; i++) {
    const cur = strs[i]
    let s: string
    if (i === 0) {
      s = cur.toLocaleUpperCase()
    } else if (flag) {
      flag = false
      s = cur.toLocaleUpperCase()
    } else if (cur === '-') {
      flag = true
      continue
    } else {
      s = cur
    }
    results.push(s)
  }
  return results.join('')
}

/** antd v3升级v4的兼容方式 */
export const getIconName = (name: string) => {
  if (typeof name !== 'string') return name
  return `${lineLhroughToGreatHump(name)}Outlined`
}

export const isUndef = (val: any) => {
  return val === undefined
}

/**
 * 判断，正则：只允许大小写字母，数字，下划线
 * true：通过
 * false: 不通过
 */
export const isLetterNumberLineThroughUnderlineReg = (str: string) => {
  const value = String(str || '')
  // const flag = letterNumberLineThroughUnderlineReg.test(value)
  const flag = new RegExp(letterNumberLineThroughUnderlineReg, 'g').test(value)
  console.log('isLetterNumberLineThroughUnderlineReg', value, flag)
  return flag
}

/** 判空 */
export const isEmpty = (target: unknown) => {
  return ['', 'undefined', 'null'].includes(String(target))
}

/** 解析接口金额(分) */
export const parseInterfacePrice = (price: string | number | null) => {
  if (isEmpty(price)) return 0
  const priceNumber = Number(price)
  if (Number.isNaN(priceNumber)) return 0
  return Number((priceNumber / 100).toFixed(2))
}
