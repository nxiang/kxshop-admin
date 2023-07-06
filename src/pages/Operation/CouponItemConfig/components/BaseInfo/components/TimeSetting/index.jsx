import React from 'react'
import Css from './index.module.scss'
import { Form, Input, Space, Radio, InputNumber, DatePicker } from 'antd'
import {
  jugdeTimeDisabledGet,
  jugdeTimeDisabledCanUse
} from '../../dateDisabled'
import judgeDisabled from '@/pages/Operation/CouponItemConfig/judgeDisabled'

export default (props) => {
  const {
    isWxSingle,
    couponUseRule,
    availableBeginTime,
    availableEndTime,
    couponTimeType,
    notDisabled
  } = props

  // 券领取开始时间限制
  const disabledAvailableBeginTime = (current) => {
    let tmpStartTime = couponUseRule?.couponAvailableTime?.availableBeginTime
    let tmpEndTime = couponUseRule?.couponAvailableTime?.availableEndTime
    return jugdeTimeDisabledGet(
      current,
      availableEndTime,
      [tmpStartTime, tmpEndTime],
      1
    )
  }

  // 券领取结束时间限制
  const disabledAvailableEndTime = (current) => {
    let tmpStartTime = couponUseRule?.couponAvailableTime?.availableBeginTime
    let tmpEndTime = couponUseRule?.couponAvailableTime?.availableEndTime
    return jugdeTimeDisabledGet(
      current,
      availableBeginTime,
      [tmpStartTime, tmpEndTime],
      2,
      notDisabled?.getAvailableEndTimeMoment
    )
  }

  // 券可用开始时间限制
  const disabledGetAvailableBeginTime = (current) => {
    let tmpTime = couponUseRule?.couponAvailableTime?.availableEndTime
    return jugdeTimeDisabledCanUse(
      current,
      tmpTime,
      [availableBeginTime, availableEndTime],
      1
    )
  }

  // 券可用结束时间限制
  const disabledGetAvailableEndTime = (current) => {
    let tmpTime = couponUseRule?.couponAvailableTime?.availableBeginTime
    return jugdeTimeDisabledCanUse(
      current,
      tmpTime,
      [availableBeginTime, availableEndTime],
      2,
      notDisabled?.useAvailableEndTimeMoment
    )
  }

  // 每人领取张数限制的张数Form
  const couponValidTimeForm = (type, show, index) => {
    // type标识当前选中的单选
    // show用于是否需要返回值判断
    // inde用于索引
    const obj = {
      1: {
        name: ['couponUseRule', 'couponAvailableTime', 'availableBeginTime'],
        rules: [{ required: true, message: '请输入券可用开始时间' }]
      },
      5: {
        name: ['couponUseRule', 'couponAvailableTime', 'availableEndTime'],
        rules: [{ required: true, message: '请输入券可用结束时间' }]
      },
      2: {
        name: ['couponUseRule', 'couponAvailableTime', 'availableDays'],
        rules: [{ required: true, message: '请输入券有效期天数' }]
      },
      3: {
        name: [
          'couponUseRule',
          'couponAvailableTime',
          'daysAvailableAfterReceive'
        ],
        rules: [{ required: true, message: '请输入领券多少天后生效' }]
      },
      4: {
        name: ['couponUseRule', 'couponAvailableTime', 'availableDays'],
        rules: [{ required: true, message: '请输入券有效期天数' }]
      }
    }
    return type === show ? obj[index] : ''
  }

  return (
    <>
      <h2>时间设置</h2>
      <div>
        <Form.Item label="券领取时间" required>
          <Space>
            <Form.Item
              label="券领取时间"
              name="availableBeginTime"
              noStyle
              rules={[{ required: true, message: '请输入券领取开始时间' }]}
            >
              <DatePicker
                disabledDate={disabledAvailableBeginTime}
                disabled={judgeDisabled(notDisabled, 'availableBeginTime')}
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
            至
            <Form.Item
              label="券领取时间"
              name="availableEndTime"
              noStyle
              rules={[{ required: true, message: '请输入券领取结束时间' }]}
            >
              <DatePicker
                disabledDate={disabledAvailableEndTime}
                disabled={judgeDisabled(notDisabled, 'availableEndTime')}
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="券可用时间" name="couponTimeType" required>
          <Radio.Group disabled={judgeDisabled(notDisabled, 'couponTimeType')}>
            <Space direction="vertical">
              <Radio value={1}>
                <Space>
                  <Form.Item
                    {...couponValidTimeForm(couponTimeType, 1, 1)}
                    noStyle
                  >
                    <DatePicker
                      disabledDate={disabledGetAvailableBeginTime}
                      disabled={
                        !couponValidTimeForm(couponTimeType, 1, 1) ||
                        judgeDisabled(notDisabled, 'availableBeginTime')
                      }
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </Form.Item>
                  至
                  <Form.Item
                    {...couponValidTimeForm(couponTimeType, 1, 5)}
                    noStyle
                  >
                    <DatePicker
                      disabledDate={disabledGetAvailableEndTime}
                      disabled={
                        !couponValidTimeForm(couponTimeType, 1, 5) ||
                        judgeDisabled(notDisabled, 'availableEndTime')
                      }
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </Form.Item>
                </Space>
              </Radio>
              {/* disabled={isWxSingle} */}
              <Radio value={2}>
                <Space align="center">
                  领券后立即生效，有效期
                  <Form.Item
                    {...couponValidTimeForm(couponTimeType, 2, 2)}
                    noStyle
                  >
                    {/* isWxSingle ||  */}
                    <InputNumber
                      disabled={
                        !couponValidTimeForm(couponTimeType, 2, 2) ||
                        judgeDisabled(notDisabled, 'availableDays')
                      }
                      min={notDisabled?.oldAvailableDays || 1}
                      precision={0}
                      className={Css['inputNumberW']}
                      addonAfter="天"
                    />
                  </Form.Item>
                </Space>
              </Radio>
              <Radio value={3}>
                <Space align="center">
                  领券
                  <Form.Item
                    {...couponValidTimeForm(couponTimeType, 3, 3)}
                    noStyle
                  >
                    <InputNumber
                      min={1}
                      precision={0}
                      disabled={
                        !couponValidTimeForm(couponTimeType, 3, 3) ||
                        judgeDisabled(notDisabled, 'daysAvailableAfterReceive')
                      }
                      className={Css['inputNumberW']}
                      addonAfter="天"
                    />
                  </Form.Item>
                  后生效，有效期
                  <Form.Item
                    {...couponValidTimeForm(couponTimeType, 3, 4)}
                    noStyle
                  >
                    <InputNumber
                      min={notDisabled?.oldAvailableDays || 1}
                      precision={0}
                      disabled={
                        !couponValidTimeForm(couponTimeType, 3, 4) ||
                        judgeDisabled(notDisabled, 'availableDays')
                      }
                      className={Css['inputNumberW']}
                      addonAfter="天"
                    />
                  </Form.Item>
                </Space>
              </Radio>
              <div className={Css['couponTips']}>
                若设置固定用券时间，编辑保存后对已领取及后续领取的券均生效。若设置动态用券时间，编辑保存后进队后续领取的券生效
              </div>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="时间段限制" required>
          <Radio.Group defaultValue={1}>
            <Radio value={1}>券可用时间内，任意时段可用</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
    </>
  )
}
