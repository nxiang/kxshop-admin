import React from 'react'
import { Button, InputNumber, Image } from 'antd'
import TableOperations from '@/components/TableOperations'
import { formatDecimalPoint, tableColumnsIsShow } from '@/utils/tools'
import { ISelfColumnsType } from '@/types'
import { EItemState, HotSaleRecord } from '@/types/item'
import { hotShopStatusMap } from './const'
import Popconfirm from 'antd/es/popconfirm'
import { EditOutlined } from '@ant-design/icons'

interface Params {
  disSorts: Array<string>
  hotSaleDel: (
    text: string,
    record: HotSaleRecord,
    index: number
  ) => Promise<void>
  disSortEdit: (
    disSort: string,
    record: HotSaleRecord,
    index: number
  ) => Promise<void>
}
/** 表格列定义 */
export const generateColumns = (params: Params) => {
  const { disSorts, hotSaleDel, disSortEdit } = params
  const columns: ISelfColumnsType = [
    {
      title: '商品名称',
      dataIndex: 'itemName',
      render: (text: string, record: HotSaleRecord, index: number) => {
        return (
          <div className="flex">
            <Image className="w-16 h-16" src={record.imageSrc} />
            <div className="ml-4 flex flex-col justify-center">
              <div>{record.itemName}</div>
              <div>id:{record.itemId}</div>
            </div>
          </div>
        )
      }
    },
    {
      title: '售价',
      dataIndex: 'salePrice',
      render: (text: string) => <span>{formatDecimalPoint(+text / 100)}</span>
    },
    {
      title: '销量',
      dataIndex: 'salesVolume',
      render: (text: string) => <span>{text || '0'}</span>
    },
    {
      title: '库存',
      dataIndex: 'storage'
    },
    {
      title: '展示顺序',
      dataIndex: 'disSort',
      render: (text: string, record: HotSaleRecord, index) => {
        return (
          <span>
            <span>{text}</span>
            <Popconfirm
              title={
                <div>
                  <div>确定要修改吗？</div>
                  <InputNumber
                    placeholder={'请输入0-9999'}
                    min="0"
                    max="9999"
                    value={disSorts[index]}
                    onChange={(e) => {
                      disSorts[index] = e
                    }}
                  />
                </div>
              }
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await disSortEdit(disSorts[index], record, index)
              }}
            >
              <EditOutlined className="ml-1 text-blue-400 cursor-pointer" />
            </Popconfirm>
          </span>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text: EItemState) => {
        const state = hotShopStatusMap[text]
        return <span className={state?.color}>{state?.text}</span>
      }
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      render: (text, record: HotSaleRecord, index) => {
        const datas = [
          {
            render: () => {
              return (
                <Popconfirm
                  title="确定要移除吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={async () => {
                    await hotSaleDel(text, record, index)
                  }}
                >
                  <Button type="link" size="small">
                    移除
                  </Button>
                </Popconfirm>
              )
            }
          }
        ]
        return <TableOperations datas={datas} />
      }
    }
  ]

  return tableColumnsIsShow(columns)
}
