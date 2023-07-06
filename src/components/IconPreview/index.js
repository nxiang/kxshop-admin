import { connect } from 'dva'
import * as Icons from '@ant-design/icons'

import { Card, Col, Row, Tabs } from 'antd'
import React, { PureComponent } from 'react'
import styles from '@/layouts/Sword.less'
import { iconData } from './IconData'
import { MENU_SELECT_ICON } from '@/actions/menu'
import { getIconName } from '@/utils/tools'

const { TabPane } = Tabs

@connect(({ menu }) => ({
  menu
}))
class IconPreview extends PureComponent {
  handelClick = (type) => {
    const { onCancel, dispatch } = this.props
    dispatch(MENU_SELECT_ICON(type.icon))
    onCancel()
  }

  render() {
    return (
      <Tabs defaultActiveKey="direction">
        {iconData.map((data) => (
          <TabPane tab={data.description} key={data.category}>
            <Card className={styles.card} bordered={false}>
              <Row gutter={24} className={styles.iconPreview}>
                {data.icons
                  .map((ele) => {
                    return {
                      icon: ele,
                      Comp: Icons[getIconName(ele)]
                    }
                  })
                  .map((ele) => (
                    <Col span={4} key={ele.icon}>
                      {ele.Comp ? (
                        <ele.Comp
                          onClick={() => {
                            this.handelClick({ icon: ele.icon })
                          }}
                        />
                      ) : null}
                    </Col>
                  ))}
              </Row>
            </Card>
          </TabPane>
        ))}
      </Tabs>
    )
  }
}
export default IconPreview
