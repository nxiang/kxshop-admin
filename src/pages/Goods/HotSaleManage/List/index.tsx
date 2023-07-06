import { Button, Card, message, Modal, Spin, Switch, Table } from 'antd'
import React from 'react'
import { useAntdTable, useAsyncEffect, useReactive } from 'ahooks'
import { extendsConfig, extendsQuery } from '@/services/app'
import { beastEdit, beastList, beastSave } from '@/services/item'
import { HotSaleRecord } from '@/types/item'
import { generateColumns } from './columns'
import ModalShop from './ModalShop'
import Panel from '@/components/Panel'
// 橱窗开关key
const switchKey = 'BEAST_ITEM_WINDOW_SWITCH'
export default () => {
  const state = useReactive({
    open: false, // 开关
    previewOpen: false, // 展示效果开关
    table: {
      // 表格请求参数
      search: {
        page: 1,
        pageSize: 10
      },
      // 展示顺序的值
      disSorts: []
    },
    /** 商品弹框 */
    modalShop: {
      visible: false,
      confirmLoading: false
    }
  })

  const loading = useReactive({
    switch: false,
    table: false,
    init: false
  })

  /** 获取商品橱窗开关配置 */
  const getExtendsQuery = async () => {
    const res = await extendsQuery({
      extendKey: switchKey
    })
    if (res?.success) {
      state.open = res?.data?.[switchKey] === 'true'
    }
  }

  const getTableData = async ({ current, pageSize }) => {
    try {
      loading.table = true
      const result = {
        list: [],
        total: 0
      }
      state.table.search.page = current
      state.table.search.pageSize = pageSize
      const res = await beastList(state.table.search)
      if (res?.success) {
        const resData = res?.data
        const list = (result.list = resData?.rows || [])
        result.total = resData?.total
        state.table.disSorts = list.map((ele) => ele.disSort)
      }
      console.log('result', res, result)
      return result
    } finally {
      loading.table = false
    }
  }

  // ahooks table
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultParams: [
      {
        current: state.table.search.page,
        pageSize: state.table.search.pageSize
      }
    ]
  })

  // 调用表格接口
  const { submit: refreshTable } = search

  /** 初始化 */
  const init = async () => {
    try {
      loading.init = true
      await getExtendsQuery()
    } finally {
      loading.init = false
    }
  }

  // 初始化
  useAsyncEffect(async () => {
    init()
  }, [])

  return (
    <Panel>
      <div className='bg-white p-8'>
        <Spin spinning={loading.init}>
          <div className="flex ">
            <div className="flex">
              <div className="text-xl font-bold pt-1">热销商品橱窗：</div>
              <div className="pt-2">
                <Switch
                  className="ml-4"
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
            </div>
            <div className="ml-4">
              <div>
                <span>
                  开启后，在&nbsp;所有商品详情页中将展示&nbsp;热销商品橱窗，需展示的请在下方添加。
                </span>
                <Button
                  className="ml-4"
                  type="link"
                  onClick={() => (state.previewOpen = true)}
                >
                  展示效果
                </Button>
              </div>
              <div>关闭后，所有商品详情页&nbsp;将不展示该模块</div>
            </div>
          </div>
          <div className="flex mt-6">
            <div className="text-xl font-bold pt-1">热销商品管理：</div>
            <Button
              type="primary"
              className="ml-4"
              onClick={() => (state.modalShop.visible = true)}
            >
              添加商品
            </Button>
          </div>
          <Table
            loading={loading.table}
            className="mt-6"
            {...tableProps}
            rowKey="itemId"
            columns={generateColumns({
              disSorts: state.table.disSorts,
              // 移出
              hotSaleDel: async (text, record: HotSaleRecord, index) => {
                const res = await beastEdit({ itemId: record.itemId, isDel: 1 })
                if (res.success) {
                  message.success('删除成功')
                  refreshTable()
                }
              },
              // 显示顺序
              disSortEdit: async (text, record: HotSaleRecord, index) => {
                const res = await beastEdit({
                  disSort: text,
                  itemId: record.itemId
                })
                if (res.success) {
                  message.success('修改成功')
                  refreshTable()
                }
              }
            })}
          />
          {/* 弹框：展示效果 */}
          <Modal
            visible={state.previewOpen}
            footer={null}
            bodyStyle={{ padding: 0 }}
            onCancel={() => (state.previewOpen = false)}
            closable={false}
            getContainer={() => document.querySelector('#root')}
          >
            <img
              className="w-full"
              src="https://img.kxll.com/admin_manage/hotSaleShopPreview.png"
            />
          </Modal>
          {/* 商品选择 */}
          <ModalShop
            visible={state.modalShop.visible}
            confirmLoading={state.modalShop.confirmLoading}
            onOk={async (selectIds) => {
              try {
                state.modalShop.confirmLoading = true
                const res = await beastSave({
                  itemIds: selectIds
                })
                if (res?.data) {
                  state.modalShop.visible = false
                  message.success('新增成功')
                  refreshTable()
                }
              } finally {
                state.modalShop.confirmLoading = false
              }
            }}
            onCancel={() => (state.modalShop.visible = false)}
          />
        </Spin>
      </div>
    </Panel>
  )
}
