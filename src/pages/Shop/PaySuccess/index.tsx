import React from 'react'
import { Button, Spin, Switch, Typography, Popconfirm, message } from 'antd'
import { useAsyncEffect, useReactive } from 'ahooks'
import { customConfig, customQuery } from '@/services/store'
import { EConfigType } from '@/types/store'
import { extendsConfig, extendsQuery } from '@/services/app'
import { genDefaultPicConfig } from '@/consts'
import OssUpload from '@/components/OssUpload'
import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather'
import Panel from '@/components/Panel'
import {
  dealAdAndImagesAdData,
  parseSingleDataSearchResponse,
  validateConfigItem
} from '@/bizComponents/EditorTemplate/publicFun'

const { Text } = Typography

const switchKey = 'PAY_SUCCESS_BANNER_SWITCH'
const positionStyle = {
  width: 274,
  marginLeft: 7,
  marginTop: 185,
  borderRadius: 8
}
export default () => {
  const state = useReactive({
    /** 开关：支付成功页广告 */
    open: false,
    /** 广告配置 */
    advert: genDefaultPicConfig(),
    /** 保存配置的pop */
    popShow: false
  })

  const loading = useReactive({
    init: false,
    switch: false
  })

  /** 查询支付成功页广告开关 */
  const getExtendsQuery = async () => {
    const res = await extendsQuery({
      extendKey: switchKey
    })
    if (res?.success) {
      state.open = res?.data?.[switchKey] === 'true'
    }
  }

  /** 页面配置查询 */
  const getCustomQuery = async () => {
    const res = await customQuery({ configType: EConfigType.PaySuccess })
    if (!res?.success) throw new Error('customQuery请求出错')
    const configDataRes = res.data?.configData
    const configData = await parseSingleDataSearchResponse(configDataRes)
    state.advert.image = configData.image
    state.advert.type = configData.type
    state.advert.data = configData.data
  }

  /** 初始化 */
  const init = async () => {
    try {
      loading.init = true
      await Promise.all([getExtendsQuery(), getCustomQuery()])
    } finally {
      loading.init = false
    }
  }

  /** 页面初始化 */
  useAsyncEffect(async () => {
    await init()
  }, [])

  return (
    <Panel title="支付成功页配置">
      <div className="bg-white p-8">
        <Spin spinning={loading.init}>
          <div className="flex">
            {/* 左侧配置 */}
            <div>
              <div className="flex items-center">
                <div className="text-xl font-bold">支付成功页广告</div>
                <Switch
                  className="ml-4 mt-1"
                  checked={state.open}
                  loading={loading.switch}
                  onChange={async (checked) => {
                    try {
                      loading.switch = true
                      const res = await extendsConfig({
                        extendKey: switchKey,
                        extendValue: String(checked)
                      })
                      if (res.success) {
                        await getExtendsQuery()
                      }
                    } finally {
                      loading.switch = false
                    }
                  }}
                />
              </div>
              <div className="mt-4">
                <div className="mt-2 text-xl font-bold">
                  <span>广告配置：</span>
                </div>
                <div className="mt-2">
                  <OssUpload
                    value={state.advert.image}
                    widthPx="355px"
                    heightPx="180px"
                    limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
                    onChange={(url) => {
                      state.advert.image = url
                    }}
                  />
                  <Text type="secondary" className="block">
                    推荐图片尺寸710*360，大小不超过2M
                  </Text>
                  <SelectGather
                    type={state.advert.type}
                    data={state.advert.data}
                    alterType={(type) => {
                      state.advert.data = genDefaultPicConfig().data
                      state.advert.type = type
                    }}
                    alterData={(data) => {
                      console.log('alterData1', data)
                      state.advert.data = data
                    }}
                  />
                </div>
                <Popconfirm
                  title="确定保存广告配置吗？"
                  okText="保存"
                  cancelText="取消"
                  onConfirm={async () => {
                    const advert = state.advert
                    const { msg, flag } = validateConfigItem(advert)
                    if (!flag) {
                      message.warning(msg)
                      return
                    }
                    const res = await customConfig({
                      configType: EConfigType.PaySuccess,
                      configData: JSON.stringify(dealAdAndImagesAdData(advert))
                    })
                    if (res.data) {
                      message.success('保存成功')
                      init()
                    }
                  }}
                >
                  <Button className="block mt-3" type="primary">
                    保存配置
                  </Button>
                </Popconfirm>
              </div>
            </div>
            {/* 右侧预览 */}
            <div
              className="w-72 ml-36 bg-pay-success bg-cover bg-no-repeat overflow-y-auto"
              style={{ height: 625 }}
            >
              {state.open && state.advert.image && (
                <img src={state.advert.image} style={positionStyle} />
              )}
              {!state.open && (
                <div
                  style={{
                    ...positionStyle,
                    background: '#F6F6F6',
                    height: 90
                  }}
                />
              )}
            </div>
          </div>
        </Spin>
      </div>
    </Panel>
  )
}
