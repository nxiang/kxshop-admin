import React, { useEffect, useState } from 'react';
import { Row, Col, Radio, Input, Button, Select } from 'antd';

const { Option } = Select;

const AdvanceSearch = ({ stateData, onSearch, classInfo }) => {
  const [state, setState] = useState('');
  const [itemName, setItemName] = useState(undefined);
  const [classId, setClassId] = useState(undefined);

  const stateChange = e => {
    setState(e.target.value);
    doSearch(e.target.value);
  };

  const itemNameChange = e => {
    setItemName(e.target.value);
  };

  const doSearch = val => {
    onSearch(1, {
      state: typeof val == 'string' || typeof val == 'number' ? val : state,
      itemName,
      classId,
    });
  };

  return (
    <Row gutter={[16, 16]} wrap style={{ marginBottom: 24 }}>
      <Col>
        <Radio.Group value={state} onChange={stateChange}>
          <Radio.Button value="">全部</Radio.Button>
          {stateData.map((item, index) => (
            <Radio.Button value={item.value} key={`stateData-${index}`}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Col>
      <Col span={6}>
        <Input value={itemName} onChange={itemNameChange} placeholder="请输入商品名称" />
      </Col>
      <Col span={6}>
        <Select
          value={classId}
          style={{ width: '100%' }}
          placeholder="全部商品类型"
          onChange={e => setClassId(e)}
        >
          <Option value="" key="0">
            全部类型
          </Option>
          {classInfo?.length > 0 &&
            classInfo.map(item => {
              return (
                <Option value={item.classId} key={item.classId}>
                  {item.className}
                </Option>
              );
            })}
        </Select>
      </Col>
      <Col>
        <Button type="primary" onClick={doSearch}>
          筛选
        </Button>
      </Col>
    </Row>
  );
};

export default AdvanceSearch;
