import { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, Form, Button, Table, message, Modal } from 'antd'
import { connect } from '@umijs/max'
import Panel from '@/components/Panel'
import AdvanceSearch from './AdvanceSearch'
import columns from './columns'
import SpecModal from './SpecModal'
import ImportFile from '@/bizComponents/ImportFile'
import { flattenDeep } from 'lodash-es';
import { prohibitionAreaAddOrUpdate, prohibitionAreaLists, prohibitionAreaDelete, prohibitionAreaDownLoad, prohibitionAreaUpload } from '@/services/item'

export default connect(state => ({
  regionSelect: state.global.regionSelect,
}))((props) => {
  // 表格相关
  const [searchForm] = Form.useForm()
  const [listData, setListData] = useState(undefined)
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [listLoading, setListLoading] = useState(false)

  // 商品编码相关
  const [specForm] = Form.useForm()
  const [specModalType, setSpecModalType] = useState('create')
  const [specModalVisible, setSpecModalVisible] = useState(false)
  const [specAreaId, setSpecAreaId] = useState([])

  // 导入相关
  const [importVisible, setImportVisible] = useState(false)

  const specModalRef = useRef()
  const importFileRef = useRef()
  const advanceSearchRef = useRef()

  useEffect(() => {
    handleSearch(1)
  }, [])

  // 搜索
  const handleSearch = (newPage) => {
    setListLoading(true)
    let formData = { ...searchForm.getFieldsValue() }
    formData = filterAreaId(formData)
    console.log('formData=', formData)
    prohibitionAreaLists({
      pageNo: newPage,
      pageSize,
      ...formData
    }).then(res => {
      if (res.success) {
        setListData(res.data)
        setCurrentPage(newPage)
        setListLoading(false)
      }
    })
  }

  // 搜索重置
  const resetSearch = () => {
    advanceSearchRef.current.setSelectValue([])
    searchForm.resetFields()
    setCurrentPage(1)
    handleSearch(1)
  }

  // 新增&编辑&删除
  const handleSpecModal = async (type, id) => {
    switch(type) {
      case 'create': 
        setSpecModalType('create')
        setSpecModalVisible(true)
        break;
      case 'edit': 
        const curItem = listData.rows.filter(i => i.areaId == id)
        let curItemProvinceId
        try {
          // 原有逻辑
          // 最多选中到二级
          // 需要获取到对应的一级然后配置对应的值 [一级， 二级， 三级]
          // props.regionSelect.forEach(p => {
          //   if (p.children.filter(c => c.id == curItem[0].areaId).length > 0) {
          //     curItemProvinceId = p.id
          //     throw 'success'
          //   }
          // })
          curItemProvinceId = getAreaIdsArr(props.regionSelect, id)?.reverse() || []
        } catch(info) {
          console.log(info)
        }
        setSpecAreaId(curItemProvinceId)
        specForm.setFieldsValue({
          skuCodeListStr: curItem[0].skuCodeListStr
        })
        setSpecModalType('edit')
        setSpecModalVisible(true)
        break;
      case 'delete': 
        Modal.confirm({
          title: '删除禁售配置提示',
          content: '是否取消该区域商品禁售设置？',
          onOk: () => {
            prohibitionAreaDelete({areaId: id})
              .then(res => {
                if (res.success) {
                  message.success('删除成功')
                  handleSearch(currentPage > 1 && listData.rows.length == 1 ? currentPage - 1 : currentPage)
                }
              })
          }
        })
      break;
      case 'ok': 
        specForm.validateFields()
          .then(res => {
            res = filterAreaId(res)
            if (!res.areaId) {
              // res.areaId = [specAreaId[0][1]]
              res.areaId = [specAreaId[specAreaId.length-1]]
            }
            prohibitionAreaAddOrUpdate({ 
              ...res, 
              areaType: 'region', 
              isSave: specModalType === 'create' 
            })
              .then(apiRes => {
                if (apiRes.success) {
                  setCurrentPage(1)
                  handleSearch(1)
                  setSpecModalVisible(false)
                  setSpecAreaId([])
                  specForm.resetFields()
                } else {
                  specModalRef.current.setLoading(false)
                }
              })
          })
          .catch(() => {
            specModalRef.current.setLoading(false)
          })
        break;
      case 'cancel': 
        setSpecModalVisible(false)
        setSpecAreaId([])
        specForm.resetFields()
        break;
    }
  }
  const getAreaIdsArr = (data, id, arr = []) => {
    data.find((item) => {
      if (item.id === id) {
        arr.push(item.id);
        return true;
      } if (item.children.length) {
        arr = getAreaIdsArr(item.children, id, arr);
        if (arr.length) {
          arr.push(item.id);
          return true;
        } 
          return false;
        
      }
      return false;
    });
    return arr;
  }
  // 获取对应ids的所有具体项
  const getAllAreaIdItem = (data, id, arr = []) => {
    data.find((item) => {
      if (item.id === id) {
        arr.push(item);
        return true;
      } if (item.children.length) {
        arr = getAllAreaIdItem(item.children, id, arr);
        if (arr.length) {
          arr.push(item);
          return true;
        } 
          return false;
        
      }
      return false;
    });
    return arr
  }
  // 通过具体信息获取详细区域ids
  const getItemChildrenIds = (itemData, index) => {
    let ids = []
    if(index == 1) {
      ids = itemData.children.map(item => item.children.map(e => e.id))
    } else if(index == 2) {
      ids = itemData.children.map(item => item.id)
    } else if(index == 3) {
      ids = [itemData.id]
    } else {
      return false
    }
    return ids
  }
  // 根据选择的ids, 获取所有区域id
  const getAllAreaId = (data, baseIds) => {
    const allItem = []
    let ids = []
    baseIds.forEach(item => {
      const tmp = getAllAreaIdItem(data, item)
      if (tmp.length) allItem.push({ data: tmp[0], index: tmp.length })
    })
    allItem.forEach(item => {
      const tmp = getItemChildrenIds(item.data, item.index)
      if (tmp) ids = [...ids, ...tmp]
    })
    return ids
  }

  // 导入
  const handleImport = (type, refresh) => {
    switch(type) {
      case 'close': 
        setImportVisible(false)
        if (
          (typeof refresh == 'boolean' && refresh) || 
          importFileRef.current.status === 'fail'
        ) {
          resetSearch()
        }
        break;
      case 'open': 
        setImportVisible(true)
        break;
    }
  }

  // 导出
  const handleDownLoad = () => {
    let formData = { ...searchForm.getFieldsValue() }
    formData = filterAreaId(formData)
    prohibitionAreaDownLoad(formData)
      .then(res => {
        if (res.success) {
          window.open(res.data)
        }
      })
  }

  // 过滤
  const filterAreaId = (data) => {
    if (Array.isArray(data.areaId)) {
      data.areaId = data.areaId.reduce((t, i) => [
        ...t, 
        i[i.length - 1]
      ], [])
      if (data.areaId.length == 0) {
        data.areaId = undefined
      } else {
        const tmp = getAllAreaId(props.regionSelect, data.areaId)
        data.areaId = flattenDeep(tmp)
      }
    }
    if (data.skuCodeListStr) {
      data.skuCodeListStr = data.skuCodeListStr.replace(/，/ig, ',')
    } else {
      data.skuCodeListStr = undefined
    }
    if (data.skuCode) {
      data.skuCode = data.skuCode.replace(/，/ig, ',')
    } else {
      data.skuCode = undefined
    }
    return data
  }

  return (
    <Panel title="禁售区域管理">
      <Card>
        <AdvanceSearch 
          advanceSearchRef={advanceSearchRef}
          formRef={searchForm} 
          regionSelect={props?.regionSelect}
          handleSearch={handleSearch} 
          resetSearch={resetSearch}
        />
        <Row justify="space-between" style={{marginBottom: 24}}>
          <Col>
            <Button type="primary" onClick={() => handleSpecModal('create')}>新增</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => handleImport('open')}>导入</Button>
            <Button style={{marginLeft: 10}} onClick={handleDownLoad}>导出</Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          bordered
          loading={listLoading}
          scroll={{ x: 1280 }}
          columns={columns({ handleSpecModal, searchForm })}
          dataSource={listData?.rows}
          pagination={{
            current: currentPage,
            pageSize,
            total: listData?.total,
            showTotal: total => `共${total}条数据`,
            showSizeChanger: false,
          }}
          onChange={pagination => {
            setCurrentPage(pagination.current)
            handleSearch(pagination.current)
          }}
        />
      </Card>
      <SpecModal 
        specModalRef={specModalRef}
        formRef={specForm}
        type={specModalType} 
        visible={specModalVisible} 
        specAreaId={specAreaId}
        onHandle={handleSpecModal} 
      />
      <ImportFile 
        importFileRef={importFileRef}
        visible={importVisible} 
        tips={['说明：请保证输入的规格编码在系统中存在，规格编码之间以逗号分隔，如“,”']} 
        api={prohibitionAreaUpload}
        onClose={(refresh = false) => handleImport('close', refresh)}
      />
    </Panel>
  )
})