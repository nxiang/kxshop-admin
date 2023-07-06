import React from 'react'
// import { Icon as LegacyIcon } from '@ant-design/compatible';
import * as Icons from '@ant-design/icons'
import classNames from 'classnames'
import styles from './index.less'
import { getIconName } from '@/utils/tools'

const Trend = ({
  colorful = true,
  reverseColor = false,
  flag,
  children,
  className,
  ...rest
}) => {
  const classString = classNames(
    styles.trendItem,
    {
      [styles.trendItemGrey]: !colorful,
      [styles.reverseColor]: reverseColor && colorful
    },
    className
  )
  const Icon = Icons[getIconName(`caret-${flag}`)]
  return (
    <div
      {...rest}
      className={classString}
      title={typeof children === 'string' ? children : ''}
    >
      <span>{children}</span>
      {flag && (
        <span className={styles[flag]}>
          {/* <LegacyIcon type={`caret-${flag}`} /> */}
          {Icon ? <Icon /> : null}
        </span>
      )}
    </div>
  )
}

export default Trend
