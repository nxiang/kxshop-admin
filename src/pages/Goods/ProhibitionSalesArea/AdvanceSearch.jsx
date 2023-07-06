import React, { useEffect, useState, useImperativeHandle } from 'react'
import { Row, Col, Form, Input, Button, Select } from 'antd'
import RegionSelect from '@/bizComponents/RegionSelect'

const { Option } = Select;

const AdvanceSearch = ({ advanceSearchRef, formRef, regionSelect, handleSearch, resetSearch }) => {

  const [selectValue, setSelectValue] = useState([])

  useImperativeHandle(advanceSearchRef, () => ({
    setSelectValue: setSelectValue,
  }))

  const regionSelectChange = e => {
    console.log('e', e)
    // const ruleOut = [1, 2, 9, 22, 35]
    // if (
    //     e.filter(p => p.length <= 1 && ruleOut.indexOf(p[0]) == -1).length > 0
    //   ) return
    // e.forEach(i => {
    //   if (i.length == 1) {
    //     i = i.push(regionSelect.filter(p => p.id == i[0])[0].children[0].id)
    //   }
    // })
    console.log('reduce',
    e.length === 0 
    ? [] 
    : e.reduce((t, i) => [...t, i], []))
    setSelectValue(
      e.length === 0 
      ? [] 
      : e.reduce((t, i) => [...t, i], [])
    )
  }
  
  return (
    <Form form={formRef} onFinish={() => handleSearch(1)}>
      <Row gutter={[16, 16]}>
        {/*搜索项*/}
        <Col span={6}>
          <Form.Item label="规格编码" name="skuCode">
            <Input allowClear placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="禁售区域" name="areaId">
            <RegionSelect 
              placeholder="请选择" 
              multiple={true}
              areaType="region"
              changeOnSelect={false} 
              selectValue={selectValue}
              onChange={regionSelectChange}
              noRegion={true}
              fieldNames={{ label: 'label', value: 'id', children: 'children' }}
            />
          </Form.Item>
        </Col>
        {/*搜索按钮*/}
        <Col span={6}>
          <Button type="primary" htmlType="submit" >查询</Button>
          <Button style={{marginLeft: 10}} onClick={resetSearch}>重置</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AdvanceSearch;
