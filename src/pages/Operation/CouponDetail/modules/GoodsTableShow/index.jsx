import { itemListByIds } from '@/services/item'
import { floatObj } from '@/utils/utils'
import { useReactive } from 'ahooks'
import { Button, Image, Modal, Table } from 'antd'
import { useEffect, useState } from 'react'
import Css from './index.module.scss'

export default (props) => {
  const { title = '参与优惠商品', itemIds = [], show, setShow } = props
  const loading = useReactive({ talbe: false })
  const [dataSource, setDataSource] = useState([])

  const getData = async () => {
    try {
      if (itemIds?.length) {
        loading.talbe = true
        const res = await itemListByIds({ itemIds: itemIds.join(',') })
        if (res.success) setDataSource(res?.data || [])
      }
    } finally {
      loading.talbe = false
    }
  }

  useEffect(() => {
    show && getData()
  }, [show, itemIds])

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (_, { itemName, imageSrc, itemId }) => (
        <div className={Css['goodsItem']}>
          <div className={Css['goodsItemImg']}>
            <Image width={50} height={50} src={imageSrc} />
          </div>
          <div className={Css['goodsItemInfo']}>
            <div>{itemName}</div>
            <div>id：{itemId}</div>
          </div>
        </div>
      )
    },
    {
      title: '售价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (_, { salePrice }) => (
        <div>
          {salePrice ? floatObj.divide(salePrice, 100).toFixed(2) : salePrice}
        </div>
      )
    },
    {
      title: '库存',
      dataIndex: 'storage',
      key: 'storage'
    }
  ]

  return (
    <Modal
      width="60%"
      title={title}
      visible={show}
      footer={
        <Button
          onClick={() => {
            setShow(false)
          }}
        >
          取消
        </Button>
      }
      onCancel={() => setShow(false)}
    >
      <Table
        loading={loading.talbe}
        scroll={{ y: 520 }}
        dataSource={dataSource}
        rowKey={(record) => record.itemId}
        columns={columns}
        pagination={false}
      />
    </Modal>
  )
}
