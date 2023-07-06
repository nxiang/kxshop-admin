import loginLogo from '@/assets/images/login_logo.png'
import GlobalFooter from '@/components/GlobalFooter'
import SelectLang from '@/components/SelectLang'
import { CopyrightOutlined } from '@ant-design/icons'
import { Outlet } from '@umijs/max'
import { Fragment } from 'react'
import styles from './UserLayout.less'

// const links = [
//   {
//     key: 'help',
//     title: formatMessage({ id: 'layout.user.link.help' }),
//     href: ''
//   },
//   {
//     key: 'privacy',
//     title: formatMessage({ id: 'layout.user.link.privacy' }),
//     href: ''
//   },
//   {
//     key: 'terms',
//     title: formatMessage({ id: 'layout.user.link.terms' }),
//     href: ''
//   }
// ]

const copyright = (
  <Fragment>
    Copyright <CopyrightOutlined /> 2019 kxadmin{' '}
  </Fragment>
)

const UserLayout = ({ children }) => {
  console.log('UserLayout', children)
  return (
    // @TODO <DocumentTitle title={this.getPageTitle()}>
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src={loginLogo} />
          </div>
        </div>
        {children}
        <Outlet />
      </div>
      <GlobalFooter copyright={copyright} />
    </div>
  )
}

export default UserLayout
