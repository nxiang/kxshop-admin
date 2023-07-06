import React from 'react'
// import { Icon as LegacyIcon } from '@ant-design/compatible';
import * as Icons from '@ant-design/icons'
import classNames from 'classnames'
import styles from './index.less'
import { getIconName } from '@/utils/tools'

const NumberInfo = ({
  theme,
  title,
  subTitle,
  total,
  subTotal,
  status,
  suffix,
  gap,
  ...rest
}) => {
  const Icon = Icons[getIconName(`caret-${status}`)]
  return (
    <div
      className={classNames(styles.numberInfo, {
        [styles[`numberInfo${theme}`]]: theme
      })}
      {...rest}
    >
      {title && (
        <div
          className={styles.numberInfoTitle}
          title={typeof title === 'string' ? title : ''}
        >
          {title}
        </div>
      )}
      {subTitle && (
        <div
          className={styles.numberInfoSubTitle}
          title={typeof subTitle === 'string' ? subTitle : ''}
        >
          {subTitle}
        </div>
      )}
      <div
        className={styles.numberInfoValue}
        style={gap ? { marginTop: gap } : null}
      >
        <span>
          {total}
          {suffix && <em className={styles.suffix}>{suffix}</em>}
        </span>
        {(status || subTotal) && (
          <span className={styles.subTotal}>
            {subTotal}
            {status &&  Icon && <Icon />}
          </span>
        )}
      </div>
    </div>
  )
}

export default NumberInfo
