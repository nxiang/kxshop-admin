import React, { PureComponent } from 'react'
// import { Icon as LegacyIcon } from '@ant-design/compatible';
import * as Icons from '@ant-design/icons'
import { List, Tag } from 'antd'
import { connect } from 'dva'
import ArticleListContent from '@/components/ArticleListContent'
import styles from './Articles.less'
import { getIconName } from '@/utils/tools'

@connect(({ list }) => ({
  list
}))
class Center extends PureComponent {
  render() {
    const {
      list: { list }
    } = this.props
    const IconText = ({ type, text }) => {
      const Icon = Icons[getIconName(type)]
      return (
        <span>
          {Icon ? <Icon style={{ marginRight: 8 }} /> : null}
          {/* <LegacyIcon type={type} style={{ marginRight: 8 }} /> */}
          {text}
        </span>
      )
    }
    return (
      <List
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <IconText type="star-o" text={item.star} />,
              <IconText type="like-o" text={item.like} />,
              <IconText type="message" text={item.message} />
            ]}
          >
            <List.Item.Meta
              title={
                <a className={styles.listItemMetaTitle} href={item.href}>
                  {item.title}
                </a>
              }
              description={
                <span>
                  <Tag>Ant Design</Tag>
                  <Tag>设计语言</Tag>
                  <Tag>蚂蚁金服</Tag>
                </span>
              }
            />
            <ArticleListContent data={item} />
          </List.Item>
        )}
      />
    )
  }
}

export default Center
