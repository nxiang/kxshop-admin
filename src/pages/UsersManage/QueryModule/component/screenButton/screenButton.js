import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

function ScreenButton(props) {
  return (
    <div>
      <Button style={{marginRight: 8}} type="primary" onClick={() => props.screenClick()}>筛选</Button>
      {
        props.moreFlag ? (
          <Button onClick={() => props.screenMoreClick()}>
            更多条件
            <DownOutlined />
          </Button>
        ) : (
          <Button onClick={() => props.screenMoreClick()}>
            收起
            <UpOutlined />
          </Button>
          )
      }

    </div>
  );
}

export default ScreenButton;
