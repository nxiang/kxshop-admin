import { search } from '@/services/coupon'
import { floatObj } from '@/utils/utils'
import { Button, Image, Modal, Space, Table } from 'antd'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import Css from './index.module.scss'

export default forwardRef((props) => {
  const {
    dialogRef,
    value = [],
    disabled = false,
    onChange,
    buttonProps = { text: '选择指定商品' },
    /** 勾选提示 */
    isCheckedTips = true,
    /** 不能选中的项 */
    unSelectedRowKeys = [],
    isConfirm = true
  } = props

  /** 禁用项 */
  const unSelectedRowKeysMap = useMemo(() => {
    return unSelectedRowKeys.reduce((pre, ele) => {
      pre[ele] = true
      return pre
    }, {})
  }, [unSelectedRowKeys])

  // 可用商品弹窗
  const [dataSource, setDataSource] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState(value)
  const [show, setShow] = useState(false)
  const [sourcePage, setSourcePage] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  // 确认按钮，显示控制
  const [confirm, setConfirm] = useState(isConfirm)

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

  useEffect(() => {
    getData(1)
  }, [])

  useEffect(() => {
    if (value.length) setSelectedRowKeys(value)
  }, [value])

  const triggerChange = (ids, valueAll) => {
    setSelectedRowKeys(ids)
  }

  const onOk = () => {
    onChange?.(selectedRowKeys)
    setShow(false)
  }

  const onCancel = () => {
    setSelectedRowKeys(value)
    setShow(false)
    setConfirm(isConfirm)
  }

  const getData = async (page) => {
    const params = {
      page: page || 1,
      pageSize: sourcePage.pageSize
    }
    try {
      const info = await search(params)
      if (info.success) {
        const { current, pageSize, total } = info.data
        const dataSource = info.data.rows.map((item) => {
          item.itemId = parseInt(item.itemId, 10)
          return item
        })
        setDataSource(dataSource)
        setSourcePage({
          current,
          pageSize,
          total
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 弹框，仅查看
  const lookup = () => {
    setShow(true)
    setConfirm(false)
  }

  useImperativeHandle(dialogRef, () => ({
    lookup
  }))

  return (
    <>
      <Space direction="vertical" align="center">
        <Button
          disabled={disabled}
          onClick={() => setShow(true)}
          {...buttonProps}
        >
          {buttonProps.text}
        </Button>
        {isCheckedTips && value.length ? (
          <div
            onClick={() => {
              lookup()
            }}
            className="mb-2 text-blue-400 cursor-pointer"
          >
            已选{value.length}件商品
          </div>
        ) : (
          ''
        )}
      </Space>
      <Modal
        width="60%"
        title="可用商品"
        visible={show}
        getContainer={() => document.querySelector('#root')}
        footer={[
          <span key="1">
            {selectedRowKeys.length ? (
              <span className="mb-2 text-blue-400 mr-4">
                已选{selectedRowKeys.length}件商品
              </span>
            ) : (
              ''
            )}
          </span>,
          <Button key="back" onClick={() => onCancel()}>
            取消
          </Button>,
          confirm && (
            <Button key="submit" type="primary" onClick={() => onOk()}>
              确定
            </Button>
          )
        ]}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        destroyOnClose={onCancel}
      >
        <Table
          scroll={{ y: 420 }}
          dataSource={dataSource}
          columns={columns}
          rowKey={(record) => record.itemId}
          rowSelection={{
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            showSizeChanger: false,
            onChange: triggerChange,
            getCheckboxProps: (record) => {
              return {
                disabled: unSelectedRowKeysMap[record.itemId]
              }
            }
          }}
          pagination={{
            current: sourcePage.current,
            pageSize: sourcePage.pageSize,
            total: sourcePage.total,
            onChange: (page) => getData(page)
          }}
        />
      </Modal>
    </>
  )
})
