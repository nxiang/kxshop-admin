import React, { PureComponent } from 'react';
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { List, Card, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import numeral from 'numeral';
import { connect } from 'dva';
import { formatWan } from '@/utils/utils';
import stylesApplications from './Applications.less';

@connect(({ list }) => ({
  list,
}))
class Center extends PureComponent {
  render() {
    const {
      list: { list },
    } = this.props;
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    const CardInfo = ({ activeUser, newUser }) => (
      <div className={stylesApplications.cardInfo}>
        <div>
          <p>活跃用户</p>
          <p>{activeUser}</p>
        </div>
        <div>
          <p>新增用户</p>
          <p>{newUser}</p>
        </div>
      </div>
    );
    return (
      <List
        rowKey="id"
        className={stylesApplications.filterCardList}
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{ paddingBottom: 20 }}
              actions={[
                <Tooltip title="下载">
                  <DownloadOutlined />
                </Tooltip>,
                <Tooltip title="修改">
                  <EditOutlined />
                </Tooltip>,
                <Tooltip title="分享">
                  <ShareAltOutlined />
                </Tooltip>,
                <Dropdown overlay={itemMenu}>
                  <EllipsisOutlined />
                </Dropdown>,
              ]}
            >
              <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.title} />
              <div className={stylesApplications.cardItemContent}>
                <CardInfo
                  activeUser={formatWan(item.activeUser)}
                  newUser={numeral(item.newUser).format('0,0')}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default Center;
