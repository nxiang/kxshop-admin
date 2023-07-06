import React, { useEffect, useState } from 'react';
import { Row, Col, Radio, Select, DatePicker, Button } from 'antd';
import moment from 'moment';

const AdvanceSearch = ({ 
  typeData,
  eventTypeData, 
  onSearch 
}) => {
  const [type, setType] = useState(0);
  const [eventType, setEventType] = useState('');
  const [time, setTime] = useState(undefined);

  const typeChange = (e) => {
    setType(e.target.value);
    doSearch(e.target.value);
  }

  const eventTypeChange = (val) => {
    setEventType(val);
  }

  const timeChange = (data) => {
    setTime([
      moment(data[0]).format('YYYY-MM-DD'),
      moment(data[1]).format('YYYY-MM-DD'),
    ])
  }

  const doSearch = (val) => {
    onSearch(
      1, 
      {
        type: (typeof val == 'string' || typeof val == 'number') ? val : type,
        eventType, 
        time
      }
    );
  }

  return (
    <Row gutter={[16, 16]} wrap style={{ marginBottom: 24 }}>
      <Col>
        <Radio.Group value={type} onChange={typeChange}>
          <Radio.Button value={0}>全部</Radio.Button>
          {
            typeData.map((item, index) => (
              <Radio.Button value={item.value} key={`type-${index}`}>{item.label}</Radio.Button>
            ))
          }
        </Radio.Group>
      </Col>
      <Col span={6}>
        <Select value={eventType} onChange={eventTypeChange} style={{ width: '100%' }}>
          <Select.Option value="">全部</Select.Option>
          {
            eventTypeData.map((item, index) => (
              <Select.Option value={item.value} key={`eventType-${index}`}>{item.label}</Select.Option>
            ))
          }
        </Select>
      </Col>
      <Col span={6}>
        <DatePicker.RangePicker 
          value={time ? [moment(time[0]), moment(time[1])] : time} 
          onChange={timeChange} 
          style={{ width: '100%' }} 
        />
      </Col>
      <Col>
        <Button type="primary" onClick={doSearch}>筛选</Button>
      </Col>
    </Row>
  )
}

export default AdvanceSearch;