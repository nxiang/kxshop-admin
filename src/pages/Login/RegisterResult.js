import React from 'react';
import { formatMessage, FormattedMessage , Link, useLocation } from '@umijs/max';
import { Button } from 'antd';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        <FormattedMessage id="app.register-result.view-mailbox" />
      </Button>
    </a>
    <Link to="/">
      <Button size="large">
        <FormattedMessage id="app.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = () => {
  const location = useLocation()
  return (
  
    <Result
      className={styles.registerResult}
      type="success"
      title={
        <div className={styles.title}>
          <FormattedMessage
            id="app.register-result.msg"
            values={{ email: location.state ? location.state.account : 'AntDesign@example.com' }}
          />
        </div>
      }
      description={formatMessage({ id: 'app.register-result.activation-email' })}
      actions={actions}
      style={{ marginTop: 56 }}
    />
  )
};

export default RegisterResult;
