import React, { useEffect, useState } from 'react';
import { connect } from '@umijs/max';
import { Modal, Checkbox, Row, Col, Descriptions, Space, Typography, message, Button } from 'antd';
import { cloneDeep } from 'lodash-es';

const { Text } = Typography;

const ProvincesConfig = {
  style: {
    width: 180,
    maxHeight: 400,
    overflowY: 'auto',
    cursor: 'pointer',
  },
  gutter: [0, 8],
};

export default connect(state => {
  return {
    regionSelect: state.global.regionSelect,
  };
})(({ visible, onCancel, freightAreaList, editIndex, areaOkFn, regionSelect, dispatch }) => {
  // 渲染展示省市区数组
  const [areaArray, setAreaArray] = useState([]);
  const [provinceIndex, setProvinceIndex] = useState(0);
  const [cityIndex, setCityIndex] = useState(0);
  // 全选按钮状态
  const [allCheckedType, setAllCheckedType] = useState({
    checked: false,
    indeterminate: false,
    disabled: false,
    num: 0,
  });

  useEffect(() => {
    if (JSON.stringify(regionSelect) == '[]') {
      dispatch({
        type: 'global/fetchRegionSelect',
      });
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    if (visible && regionSelect) {
      initAreaData();
    }
  }, [visible, regionSelect]);

  // 初始化 给组件内省市区数组赋值
  const initAreaData = () => {
    // 已选中数组
    let areaIds = freightAreaList[editIndex]?.areaIds?.split('_') || [];
    if (freightAreaList[editIndex]?.areaIds?.length > 0) {
      areaIds =
        freightAreaList[editIndex].areaIds[0] == '_'
          ? freightAreaList[editIndex].areaIds
              .slice(1, freightAreaList[editIndex].areaIds.length - 1)
              .split('_')
          : freightAreaList[editIndex].areaIds.split('_');
    } else {
      areaIds = [];
    }
    // 禁选数组
    const disabledIds = [];
    freightAreaList.forEach((item, index) => {
      if (index != editIndex) {
        if (item.areaIds) {
          let newAreaIds = [];
          if (item.areaIds?.length > 0) {
            newAreaIds =
              item.areaIds[0] == '_'
                ? item.areaIds.slice(1, item.areaIds.length - 1)
                : item.areaIds;
          } else {
            newAreaIds = [];
          }
          disabledIds.push(...(newAreaIds.split('_') || []));
        }
      }
    });
    // 遍历数据创建新数据
    const newAreaArray = areaDataCycle({
      data: cloneDeep(regionSelect),
      areaIds,
      disabledIds,
    });
    allCheckedUpdate(newAreaArray);
    setAreaArray([...newAreaArray]);
  };

  // 初始化省市区数组数据递归
  const areaDataCycle = ({
    data,
    index = 1,
    areaIds = [],
    disabledIds = [],
    setArea = false,
    setDisabled = false,
  }) => {
    return data.map(item => {
      const newData = {
        index,
        checked: false,
        indeterminate: false,
        disabled: false,
        selectNum: 0,
        ...item,
      };
      // 判断是否为禁用省市区
      if (disabledIds?.indexOf(String(item.id)) > -1 || setDisabled) {
        newData.disabled = true;
        // 判断是否选中
      } else if (areaIds?.indexOf(String(item.id)) > -1 || setArea) {
        newData.checked = true;
      }
      let children = null;
      if (item.children?.length > 0) {
        children = areaDataCycle({
          data: item.children,
          index: index + 1,
          areaIds,
          disabledIds,
          setArea: newData.checked,
          setDisabled: newData.disabled,
        });
      }
      // 模糊展示控制
      if (children) {
        newData.children = children;
        // 判断子项是否禁用
        let disabledNum = 0;
        children.forEach(subItem => {
          if (subItem.disabled) disabledNum += 1;
        });
        // 如子项都禁用，则禁用本对象
        if (disabledNum == children.length) newData.disabled = true;
        if (!newData.disabled) {
          let indeterminate = false;
          let checked = false;
          let count = 0;
          let selectNum = 0;
          children.forEach(childItem => {
            if (childItem.checked || childItem.indeterminate) indeterminate = true;
            if (childItem.checked || childItem.disabled) count += 1;
            if (childItem.checked || index == 1) selectNum += index == 1 ? childItem.selectNum : 1;
          });
          if (count == children.length) {
            indeterminate = false;
            checked = true;
          }
          newData.selectNum = selectNum;
          newData.checked = checked;
          newData.indeterminate = indeterminate;
        }
      }
      return { ...newData };
    });
  };

  // 省市选择
  const areaSelect = (item, index) => {
    if (item.index == 1) {
      setProvinceIndex(index);
      setCityIndex(0);
    }
    if (item.index == 2) {
      setCityIndex(index);
    }
  };

  // 省市区赋值
  const setAreaChecked = (data, setChildren) => {
    const newData = { ...data };
    let children = null;
    if (!newData.disabled) {
      newData.checked = setChildren;
      newData.indeterminate = false;
    }
    if (newData.children) {
      children = newData.children.map(item => {
        return setAreaChecked(item, setChildren);
      });
    }
    if (children) newData.children = children;
    return newData;
  };

  // 省市区勾选
  const areaChecked = (e, data, index) => {
    let newAreaArray = cloneDeep(areaArray);
    if (data.index == 1) {
      newAreaArray[index] = setAreaChecked(newAreaArray[index], e.target.checked);
    }
    if (data.index == 2) {
      newAreaArray[provinceIndex].children[index] = setAreaChecked(
        newAreaArray[provinceIndex].children[index],
        e.target.checked
      );
    }
    if (data.index == 3) {
      newAreaArray[provinceIndex].children[cityIndex].children[index] = setAreaChecked(
        newAreaArray[provinceIndex].children[cityIndex].children[index],
        e.target.checked
      );
    }
    newAreaArray = areaDataUpdate({ data: newAreaArray });
    allCheckedUpdate(newAreaArray);
    setAreaArray(newAreaArray);
  };

  // 省市区数据更新
  const areaDataUpdate = ({ data }) => {
    return data.map(item => {
      const newData = { ...item };
      let children = null;
      if (item.children?.length > 0) {
        children = areaDataUpdate({
          data: item.children,
        });
      }
      if (children) {
        newData.children = children;
        if (!newData.disabled) {
          let indeterminate = false;
          let checked = false;
          let count = 0;
          let selectNum = 0;
          children.forEach(childItem => {
            if (childItem.checked || childItem.indeterminate) indeterminate = true;
            if (childItem.checked || childItem.disabled) count += 1;
            if (childItem.checked || newData.index == 1)
              selectNum += newData.index == 1 ? childItem.selectNum : 1;
          });
          if (count == children.length) {
            indeterminate = false;
            checked = true;
          }
          newData.selectNum = selectNum;
          newData.checked = checked;
          newData.indeterminate = indeterminate;
        }
      }
      return newData;
    });
  };

  // 全选数据更新
  const allCheckedUpdate = listData => {
    // 全选禁用判断
    let disabledNum = 0;
    // 全选判断
    let checkedNum = 0;
    let allIndeterminate = false;
    let allNum = 0;
    listData.forEach(item => {
      if (item.disabled) disabledNum += 1;
      if (item.checked || item.disabled) checkedNum += 1;
      if (item.indeterminate || item.checked) allIndeterminate = true;
      if (item?.selectNum > 0) allNum += item.selectNum;
    });
    if (disabledNum == listData.length) {
      setAllCheckedType({
        disabled: true,
        checked: false,
        indeterminate: false,
        num: 0,
      });
    } else {
      setAllCheckedType({
        checked: checkedNum == listData.length,
        indeterminate: checkedNum == listData.length ? false : allIndeterminate,
        disabled: false,
        num: allNum,
      });
    }
  };

  // 全选
  const allAreaChecked = e => {
    let newAreaArray = cloneDeep(areaArray);
    newAreaArray = allAreaDataUpdate({ data: newAreaArray, checked: e.target.checked });
    newAreaArray = areaDataUpdate({ data: newAreaArray });
    allCheckedUpdate(newAreaArray);
    setAreaArray(newAreaArray);
  };

  // 全选赋值
  const allAreaDataUpdate = ({ data, checked }) => {
    return data.map(item => {
      const newData = { ...item };
      if (newData.disabled) {
        return newData;
      }
      let children = null;
      if (newData.children?.length > 0) {
        children = allAreaDataUpdate({
          data: newData.children,
          checked,
        });
      }
      if (children) newData.children = children;
      newData.checked = checked;
      return newData;
    });
  };

  // 提交数据
  const onSubmit = () => {
    let newAreaArray = cloneDeep(areaArray);
    newAreaArray = submitDataUpdate({
      data: newAreaArray,
    });
    let areaIds = [];
    let areaNames = [];
    newAreaArray.forEach(item => {
      if (item.aggregationIds) {
        areaIds.push(...item.aggregationIds);
        areaNames.push(item.aggregationNames);
      }
    });
    if (areaIds.length == 0) return message.warning('请选择省市区');
    areaIds = areaIds.join('_');
    areaIds = `_${areaIds}_`;
    areaNames = areaNames.join('、');
    const areaObj = {
      areaIds,
      areaNames,
    };
    areaOkFn(areaObj);
  };

  const submitDataUpdate = ({ data }) => {
    return data.map(item => {
      const newData = { ...item };
      let children = null;
      if (item.children?.length > 0) {
        children = submitDataUpdate({
          data: item.children,
        });
      }
      if (children?.length > 0) {
        newData.children = children;
        let allSelected = true;
        const ids = [];
        const names = [];
        children.forEach(subItem => {
          if (!subItem.disabled && (subItem.checked || subItem.indeterminate)) {
            ids.push(...subItem.aggregationIds);
            names.push(subItem.label);
          }
          if (subItem.disabled || !subItem.checked || subItem.indeterminate) {
            allSelected = false;
          }
        });
        // 判断是否全选
        if (allSelected) {
          newData.aggregationIds = [item.id];
          newData.aggregationNames = `${item.label}[全部]`;
        } else if (names.length > 0) {
          newData.aggregationIds = ids;
          newData.aggregationNames = `${item.label}[${names.join('、')}]`;
          newData.checked = false;
          newData.indeterminate = true;
        }
      } else {
        newData.aggregationIds = [item.id];
      }

      return newData;
    });
  };

  return (
    <Modal
      maskClosable={false}
      width={700}
      title="选择区域"
      okText="确认"
      visible={visible}
      onCancel={() => onCancel()}
      footer={[
        <Row key={1} align="middle" justify="space-between">
          <Col>
            <Space>
              <Checkbox
                checked={allCheckedType.checked}
                indeterminate={allCheckedType.indeterminate}
                disabled={allCheckedType.disabled}
                onChange={e => allAreaChecked(e)}
              />
              <Text>全选</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              {allCheckedType?.num > 0 && <Text>已选择{allCheckedType.num}个区域</Text>}
              <Button onClick={() => onCancel()}>取消</Button>
              <Button type="primary" onClick={() => onSubmit()}>
                确认
              </Button>
            </Space>
          </Col>
        </Row>,
      ]}
    >
      <Descriptions layout="vertical" size="small" bordered>
        <Descriptions.Item label="省/直辖市/其他地区">
          <div style={{ height: 400 }}>
            <Row {...ProvincesConfig}>
              {areaArray?.length > 0 &&
                areaArray.map((item, index) => {
                  return (
                    <Col
                      key={item.id}
                      span={24}
                      style={{
                        background: index == provinceIndex && '#fafafa',
                      }}
                      onClick={() => areaSelect(item, index)}
                    >
                      <Space>
                        <Text />
                        <Checkbox
                          checked={item.checked}
                          indeterminate={item.indeterminate}
                          disabled={item.disabled}
                          onClick={e => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                          }}
                          onChange={e => areaChecked(e, item, index)}
                        />
                        <Text>
                          {item.label}
                          {item?.selectNum > 0 && `(${item.selectNum})`}
                        </Text>
                      </Space>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="市">
          <div style={{ height: 400 }}>
            <Row {...ProvincesConfig}>
              {areaArray[provinceIndex]?.children?.length > 0 &&
                areaArray[provinceIndex].children.map((item, index) => {
                  return (
                    <Col
                      key={item.id}
                      span={24}
                      style={{
                        background: index == cityIndex && '#fafafa',
                      }}
                      onClick={() => areaSelect(item, index)}
                    >
                      <Space>
                        <Text />
                        <Checkbox
                          checked={item.checked}
                          indeterminate={item.indeterminate}
                          disabled={item.disabled}
                          onClick={e => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                          }}
                          onChange={e => areaChecked(e, item, index)}
                        />
                        <Text>
                          {item.label}
                          {item?.selectNum > 0 && `(${item.selectNum})`}
                        </Text>
                      </Space>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="区/县">
          <div style={{ height: 400 }}>
            <Row {...ProvincesConfig}>
              {areaArray[provinceIndex]?.children[cityIndex]?.children?.length > 0 &&
                areaArray[provinceIndex].children[cityIndex].children.map((item, index) => {
                  return (
                    <Col key={item.id} span={24}>
                      <Space>
                        <Text />
                        <Checkbox
                          checked={item.checked}
                          disabled={item.disabled}
                          onChange={e => areaChecked(e, item, index)}
                        />
                        {item.label}
                      </Space>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
});
