import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Button, message, Form, Divider, InputNumber, Radio, Select, Cascader } from 'antd';
import TemplateList from './templateList';
import { templateDetail, labelOptionList } from '@/services/storeLabel';
import { floatObj } from '@/utils/utils';
const { Option } = Select;

const StepTwo = ({ productInfo, templateListData, onNext, onSubmit }) => {
  const [form] = Form.useForm();
  const [deliveryTypeVal, setDeliveryTypeVal] = useState(1);
  const [templateInfo, setTemplateInfo] = useState(undefined);
  const [weightData, setWeightData] = useState(1);
  const [volumeData, setVolumeData] = useState(0.01);
  const [labelOptionListData, setLabelOptionListData] = useState([]);
  const [storeLabelIds, setStoreLabelIds] = useState([]);

  useEffect(() => {
    getLabelOptionList();
    form.setFieldsValue({
      deliveryType: 1
    })
    console.log('templateListData=', templateListData)
    if (productInfo) {
      form.setFieldsValue({
        freightId: templateListData.filter(i => i.freightId == productInfo.itemFreight.freightId)[0].freightName
      });
      setWeightData(productInfo.itemFreight.freightWeight);
      setVolumeData(floatObj.divide(productInfo.itemFreight.freightVolume, 1000000));
      templateListChange(productInfo.itemFreight.freightId);
    }
  }, [])

  const handleDeliveryType = (e) => {
    setDeliveryTypeVal(e.target.value);
  }

  const listenSpec = (e, type) => {
    if (type === 'weight') {
      setWeightData(e);
    } else {
      setVolumeData(e);
    }
  }

  const templateListChange = (val) => {
    templateDetail({ freightId: val })
      .then((res) => {
        if (res.errorCode == '0') {
          setTemplateInfo(res.data);
        }
      })
  }

  const getLabelOptionList = () => {
    labelOptionList().then((res) => {
      if (res.errorCode == '0') {
        setLabelOptionListData(res.data.map(i => ({
          value: i.storeLabelId,
          label: i.storeLabelName,
          isLeaf: i.childFlag ? false : true,
        })))
      }
    });
  }

  const loadLabelChild = (e) => {
    const _labelOptionListData = [...labelOptionListData];
    labelOptionList({ storeLabelId: e[0].value })
      .then((res) => {
        if (res.errorCode == '0') {
          _labelOptionListData.forEach(i => {
            if (i.value == e[0].value) {
              i.children = res.data.map(c => ({
                label: c.storeLabelName,
                value: c.storeLabelId,
              }))
            }
          })
          setLabelOptionListData(_labelOptionListData);
        }
      })
  }

  const listenLabelOption = (e) => {
    setStoreLabelIds(e);
  }

  const submit = () => {
    const params = {
      delivery: { type: deliveryTypeVal }
    };
    if (deliveryTypeVal == 1) {
      if (!weightData || !volumeData) return message.error('请填写物流参数')
      form.validateFields()
        .then((values) => {
          const freightId_arr = templateListData.filter(i => i.freightName == values.freightId);
          params.delivery.freightId = freightId_arr.length > 0 ? freightId_arr[0].freightId : values.freightId;
          params.delivery.weight = weightData;
          params.delivery.volume = volumeData * 1000000;
          params.storeLabelIds = storeLabelIds;
          params.publishFlag = true;
          onSubmit(params)
        })
    } else {
      onSubmit(params)
    }
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 2 }} wrapperCol={{ span: 14 }} labelAlign="left">
        <Form.Item 
          label="配送方式" 
          name="deliveryType"
        >
          <Radio.Group onChange={handleDeliveryType}>
            <Radio value={1}>物流配送</Radio>
            {/* <Radio value={0}>无需物流</Radio> */}
          </Radio.Group>
        </Form.Item>
        {
          deliveryTypeVal == 1 && 
          <>
            <Form.Item 
              label="快递模版" 
              name="freightId"
              rules={[
                { required: true, message: '请选择快递模版' },
              ]}
            >
              <Select 
                onChange={templateListChange}
                style={{ width: 300 }} 
                placeholder="请选择快递模版" 
              >
                {templateListData.map((item, index) => (
                  <Option value={item.freightId} key={`templateListData-${index}`}>
                    {item.freightName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div>
              {
                templateInfo && 
                <TemplateList templateInfo={templateInfo} />
              }
            </div>
            <Form.Item 
              label={<div className="g__will_choose">物流参数</div>}
            >
              <Row justify="start" align="middle">
                <Col>
                  重量　
                  <InputNumber value={weightData} min={0} precision={2} onChange={(e) => { listenSpec(e, 'weight') }} />　
                  kg,　
                  体积　
                  <InputNumber value={volumeData} min={0} precision={2} onChange={(e) => { listenSpec(e, 'volume') }} />　
                  m³
                </Col>
              </Row>
            </Form.Item>
          </>
        }
        {/* <Form.Item label="商品类目">
          <Cascader
            allowClear
            style={{ width: 300 }}
            options={labelOptionListData}
            loadData={loadLabelChild}
            changeOnSelect
            placeholder="请选择商品类目"
            onChange={listenLabelOption}
          />
        </Form.Item> */}
      </Form>
      <Divider />
      <Row justify="center" align="middle">
        <Col style={{marginRight: 24}}>
          <Button type="primary" onClick={submit}>立即发布</Button>
        </Col>
        <Col>
          <Button onClick={() => { onNext(0) }}>上一步</Button>
        </Col>
      </Row>
    </>
  )
}

export default StepTwo;