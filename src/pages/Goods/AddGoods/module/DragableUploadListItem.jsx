import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Css from '../AddGoods.module.scss';
const type = 'DragableUploadList';

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
  // console.log('originNode', originNode)
  // console.log('file', file)
  // console.log('fileList', fileList)
  const ref = useRef(null);
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};

      if (dragIndex === index) {
        return {};
      }

      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <div
      ref={ref}
      className={`${Css['list-item-drag']} ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}
      style={{
        cursor: 'move',
      }}
    >
      {originNode}
    </div>
  );
};

export default DragableUploadListItem