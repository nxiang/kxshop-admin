import React from 'react'
import { tableColumnsIsShow } from '@/utils/tools'
import { ISelfColumnsType } from '@/types'
import { HotSaleRecord } from '@/types/item'

/** 表格列定义 */
export const generateColumns = () => {
  const columns: ISelfColumnsType = [
    {
      title: '商品图片',
      dataIndex: 'imageSrc',
      render: (text: string, record: HotSaleRecord, index: number) => {
        return <img className="h-6" src={record.imageSrc} />
      }
    },
    {
      title: '商品名称',
      dataIndex: 'itemName'
    }
  ]

  return tableColumnsIsShow(columns)
}
