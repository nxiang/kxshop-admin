import React, { PureComponent } from 'react'
// import { Icon as LegacyIcon } from '@ant-design/compatible';
import * as Icons from '@ant-design/icons'
import { Button } from 'antd'
import { FormattedMessage } from '@umijs/max'
import styles from './SwordPage.less'
import { getIconName } from '@/utils/tools'

export default class ToolBar extends PureComponent {
  render() {
    const { buttons, renderLeftButton, renderRightButton, onClick } = this.props
    // console.log('ToolBarxx',buttons, renderLeftButton, renderRightButton, onClick)
    return (
      <div className={styles.operator}>
        <div>
          {buttons
            .filter((button) => button.action === 1 || button.action === 3)
            .map((button) => {
              const Icon = Icons[getIconName(button.source)]
              return (
                <Button
                  key={button.code}
                  // icon={<LegacyIcon type={button.source} />}
                  icon={ Icon ? <Icon /> : null }
                  type={
                    button.alias === 'delete'
                      ? 'danger'
                      : button.alias === 'add'
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => {
                    onClick(button)
                  }}
                >
                  <FormattedMessage id={`button.${button.alias}.name`} />
                </Button>
              )
            })}
          {renderLeftButton ? renderLeftButton() : null}
          {renderRightButton ? (
            <div style={{ float: 'right', marginRight: '20px' }}>
              {renderRightButton()}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
