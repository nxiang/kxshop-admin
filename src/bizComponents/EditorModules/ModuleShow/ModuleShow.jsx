import React from 'react';
import Css from './ModuleShow.modules.scss';
// 引入设定数据
import { basisControl } from '@/bizComponents/EditorTemplate/formatData';

export default function moduleShow(props) {
  const { basisNum, importBasisNum } = props;
  // 拖拽开始事件
  const configDragStart = (index, max, e) => {
    const event = e || window.event;
    if (props.basisNum[index] < max) {
      event.dataTransfer.setData('type', 'chunk');
      event.dataTransfer.setData('configChunk', index);
    } else {
      event.dataTransfer.setData('type', 'shop');
      event.dataTransfer.setData('configChunk', index);
    }
  };
  return (
    <div className={Css['config-left']}>
      <div className={Css['config-left-header']}>基础组件</div>
      <div className={Css['config-left-content']}>
        {basisControl.map(item =>
          importBasisNum?.length > 0 && importBasisNum.indexOf(item.name) > -1 ? (
            <div
              className={Css['content-item']}
              name={item.name}
              key={item.name}
              draggable={basisNum[item.name] < item.max}
              onDragStart={e => configDragStart(item.name, item.max, e)}
            >
              <img src={item.icon} alt="" draggable="false" />
              <p>{item.text}</p>
              <p>
                {basisNum[item.name]}/{item.max}
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
