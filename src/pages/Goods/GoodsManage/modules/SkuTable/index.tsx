import React, { useImperativeHandle } from 'react'
import { Button, message, Modal, Table } from "antd"
import { useReactive } from 'ahooks'
import { itemDetail } from '@/services/item'
import { SkuList } from '@/types/item'

interface Props {
  // /** 商品ID */
  // itemId: string
}
interface State {
  loading: boolean
  visible: boolean
  skuList: SkuList
  columns: Array<any>
}
export default React.forwardRef((props: Props, ref) => {
  // const { itemId } = props
  const state = useReactive<State>({
    // loading...
    loading: false,
    /** 弹框控制 */
    visible: false,
    /** 商品sku信息 */
    skuList: [],
    columns: [
      {
        title: 'SKUID',
        dataIndex: 'skuId',
      },
      {
        title: '规格值',
        render: (record) => {
          const specList = record?.specList || []
          return <span>{specList.map(item => item.specValue).filter(Boolean).join('&')}</span>
        }
      },
      {
        title: '售价',
        dataIndex: 'salePrice',
        render: (text) => {
          return <span>{(text / 100).toFixed(2)}</span>
        }
      },
      {
        title: '划线价',
        dataIndex: 'linePrice',
        render: (text) => {
          return <span>{(text / 100).toFixed(2)}</span>
        }
      },
      {
        title: '库存',
        dataIndex: 'storage',
      },
      {
        title: '规格编码',
        dataIndex: 'outSerial',
      },
      {
        title: '活动商品编码',
        dataIndex: 'activityOutSerial',
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
      },
      {
        title: '保质期',
        dataIndex: 'guaranteeDay',
      },
    ]
  })

  useImperativeHandle(ref, () => ({
    open: async (itemId: string) => {
      try {
        state.visible = true
        state.loading = true
        state.skuList = []
        const res = await itemDetail({ itemId })
        if (!res?.success) {
          const msg = res.errorMsg
          msg && message.error(msg)
        }
        state.skuList = res.data.skuList
      } catch (error) {
        console.error('error', error)
      } finally {
        state.loading = false
      }
    }
  }))

  return (
    <Modal
      width={1000}
      okText="确认"
      title="商品SKU信息"
      visible={state.visible}
      onCancel={() => {
        state.visible = false
      }}
      onOk={() => {
        state.visible = false
      }}
    >
      <Table loading={state.loading} dataSource={state.skuList} columns={state.columns} pagination={false} />
    </Modal>
  )
})
