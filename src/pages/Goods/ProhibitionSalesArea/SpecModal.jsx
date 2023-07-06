import { useState, useEffect, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Button, Modal } from 'antd';
import RegionSelect from '@/bizComponents/RegionSelect';
import { connect } from '@umijs/max';
import './style.scss';

const { TextArea } = Input;

const skuCodeRule = [
  { required: true, message: '' },
  () => ({
    validator: (_, value) => {
      const reg = new RegExp(/^([0-9]*(,|，))*([0-9]+)$/);
      if (!value) {
        return Promise.reject(new Error('该项为必选项'));
      }
      if (value.replace(reg, '')) {
        return Promise.reject(new Error('规格编码仅包含数字并以","分隔'));
      }
      if (value.split(',').length > 100) {
        return Promise.reject(new Error('最多可添加100个规格编码'));
      }
      return Promise.resolve();
    },
  }),
];

export default connect(state => ({
  regionSelect: state.global.regionSelect,
}))(({ specModalRef, formRef, type, visible, specAreaId, onHandle, regionSelect }) => {
  const [selectValue, setSelectValue] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectValue(specAreaId);
    } else {
      setLoading(false);
    }
  }, [visible]);

  useImperativeHandle(specModalRef, () => ({
    setLoading,
  }));

  useEffect(() => {
    console.log('type==', type);
  }, [type]);

  const regionSelectChange = e => {
    // const ruleOut = [1, 2, 9, 22, 35]
    // if (
    //     e.filter(p => p.length <= 1 && ruleOut.indexOf(p[0]) == -1).length > 0
    //   ) return
    // e.forEach(i => {
    //   if (i.length == 1) {
    //     i = i.push(regionSelect.filter(p => p.id == i[0])[0].children[0].id)
    //   }
    // })
    setSelectValue(e.length === 0 ? [] : e.reduce((t, i) => [...t, i], []));
  };

  const submit = () => {
    setLoading(true);
    onHandle('ok');
  };

  return (
    <Modal
      title={{ create: '新增商品编码', edit: '编辑商品编码' }[type]}
      visible={visible}
      confirmLoading={loading}
      onOk={submit}
      onCancel={() => onHandle('cancel')}
    >
      <Form form={formRef}>
        <Form.Item
          label="禁售区域"
          name="areaId"
          rules={[{ required: type === 'create', message: '该项为必选项' }]}
        >
          <RegionSelect
            visible
            placeholder="请选择"
            multiple
            areaType="region"
            changeOnSelect={false}
            selectValue={selectValue}
            onChange={regionSelectChange}
            noRegion
            className="regionSelect"
            fieldNames={{ label: 'label', value: 'id', children: 'children' }}
            disabled={type !== 'create'}
          />
        </Form.Item>
        <Form.Item label="规格编码" name="skuCodeListStr" rules={skuCodeRule}>
          <TextArea style={{ minHeight: 100 }} allowClear placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
