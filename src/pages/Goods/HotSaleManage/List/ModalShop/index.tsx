import React, { useEffect } from 'react'
import { Modal, Table } from 'antd'
import { useAntdTable, useReactive } from 'ahooks'
import { itemList } from '@/services/item'
import { generateColumns } from './columns'
import { syncObject } from '@/utils/tools'
import { EItemState } from '@/types/item'

interface Props {
  visible: boolean
  confirmLoading: boolean
  onOk: (selectIds: Array<string>) => Promise<void>
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

/** 生成初始化状态 */
const genrateState = () => {
  return {
    table: {
      selectIds: [],
      // 表格请求参数
      search: {
        page: 1,
        pageSize: 10,
        state: EItemState.onSale
      }
    }
  }
}

export default (props: Props) => {
  const { visible, onCancel, onOk, confirmLoading } = props
  const loading = useReactive({
    table: false
  })
  const state = useReactive(genrateState())

  const getTableData = async ({ current, pageSize }) => {
    try {
      loading.table = true
      const result = {
        list: [],
        total: 0
      }
      state.table.search.page = current
      state.table.search.pageSize = pageSize
      const res = await itemList(state.table.search)
      if (res?.success) {
        const resData = res?.data
        result.list = resData?.rows || []
        result.total = resData?.total
      }
      console.log('result', res, result)
      return result
    } finally {
      loading.table = false
    }
  }

  // ahooks table
  const { tableProps, search } = useAntdTable(getTableData, {
    manual: true,
    defaultParams: [
      {
        current: state.table.search.page,
        pageSize: state.table.search.pageSize
      }
    ]
  })

  // 调用表格接口
  const { submit: refreshTable } = search

  // 监听弹窗打开
  useEffect(() => {
    if (visible) {
      syncObject(state, genrateState())
      refreshTable()
    }
  }, [visible])

  return (
    <Modal
      width={800}
      title="商品选择"
      closable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={() => onOk(state.table.selectIds)}
      maskClosable={false}
      confirmLoading={confirmLoading}
      getContainer={() => document.querySelector('#root')}
    >
      <Table
        {...tableProps}
        rowSelection={{
          selectedRowKeys: state.table.selectIds,
          onChange: (selectIds) => {
            state.table.selectIds = selectIds
          }
        }}
        rowKey="itemId"
        loading={loading.table}
        columns={generateColumns()}
      />
    </Modal>
  )
}
