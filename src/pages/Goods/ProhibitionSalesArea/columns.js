import { Divider } from 'antd'

const columns = ({ handleSpecModal, searchForm }) => {
  const btnDisplay = ({ areaId }) => {
    return (
      <>
        <span 
          className="g__delete"
          onClick={() => handleSpecModal('delete', areaId)}
        >
          删除禁售配置
        </span>
        <Divider type="vertical" />
        <span 
          className="g__link" 
          onClick={() => handleSpecModal('edit', areaId)}
        >
          编辑规格编码
        </span>
      </>
    )
  }

  const skuDisplay = (skuCodeListStr) => {
    const skuCodeListArr = skuCodeListStr.split(',')
    const formData = { ...searchForm.getFieldsValue() }
    const skuCodeArr = formData.skuCode ? formData.skuCode.split(',') : []
    return (
      <>
        {
          skuCodeListArr.map((item, index) => (
            <>
              <span
                style={{
                  color: skuCodeArr.indexOf(item) >= 0 ? 'red' : '',
                  fontWeight: skuCodeArr.indexOf(item) >= 0 ? 'bold' : ''
                }}
              >
                {item}
              </span>
              {skuCodeListArr.length - 1 > index ? ',' : ''}
            </>
          ))
        }
      </>
    )
  }

  return [
    { title: '城市', dataIndex: 'areaName', fixed: 'left', width: 150 },
    { 
      title: '规格编码', 
      dataIndex: 'skuCodeListStr', 
      render: skuDisplay
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 250,
      render: btnDisplay,
    },
  ]
}

export default columns
