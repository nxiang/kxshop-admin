import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from '@umijs/max';
import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import { List } from 'antd';

class BindingView extends Component {
  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.binding.taobao' }, {}),
      description: formatMessage({ id: 'app.settings.binding.taobao-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <TaobaoOutlined className="taobao" />,
    },
    {
      title: formatMessage({ id: 'app.settings.binding.alipay' }, {}),
      description: formatMessage({ id: 'app.settings.binding.alipay-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <AlipayOutlined className="alipay" />,
    },
    {
      title: formatMessage({ id: 'app.settings.binding.dingding' }, {}),
      description: formatMessage({ id: 'app.settings.binding.dingding-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <DingdingOutlined className="dingding" />,
    },
  ];

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default BindingView;
