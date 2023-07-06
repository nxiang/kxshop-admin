import React, { useEffect, useState } from 'react';
import { connect } from '@umijs/max';
import { Cascader } from 'antd';
import { cloneDeep } from 'lodash-es';
import './style.scss';

export default connect(state => {
  return {
    regionSelect: state.global.regionSelect,
  };
})(props => {
  const { dispatch, regionSelect } = props;
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    if (JSON.stringify(regionSelect) == '[]') {
      dispatch({
        type: 'global/fetchRegionSelect',
      });
    }
  }, []);

  useEffect(() => {
    let _regionSelect = cloneDeep(regionSelect)
    if (props.noRegion && props?.areaType !== 'region') {
      _regionSelect = _regionSelect.map(p => ({
        ...p,
        children: p.children.map(c => ({
          ...c,
          children: []
        }))
      }))
    }
    setTreeData(_regionSelect)
  }, [regionSelect])

  const filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };
// showCheckedStrategy={props?.areaType === 'region'?'Cascader.SHOW_CHILD':'Cascader.SHOW_PARENT'}
  return (
    <Cascader
      value={props?.selectValue || props?.value}
      options={treeData}
      onChange={props?.onChange}
      placeholder={props?.placeholder || '请选择省市'}
      expandTrigger={props?.expandTrigger ? props?.expandTrigger : 'hover'}
      showSearch={{ filter }}
      changeOnSelect={props?.changeOnSelect === undefined ? true : props?.changeOnSelect}
      allowClear={props.allowClear}
      multiple={props?.multiple || false}
      fieldNames={
        props?.fieldNames || 
        { label: 'label', value: 'value', children: 'children' }
      }
      className="regionSelect"
      disabled={props?.disabled || false}
    />
  );
});
