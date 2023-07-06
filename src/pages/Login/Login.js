import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from '@umijs/max';
import { Checkbox, Alert,message } from 'antd';
import Validator from 'kx-validator'
import Login from '../../components/Login';
import styles from './Login.less';
import { tenantMode, captchaMode } from '../../defaultSettings';

const validator = new Validator({
  mode: 'cache',
  timeout: 200
})

const { Tab, TenantId, UserName, Password, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    if (values.account === values.password) {
      message.warning('账号或密码错误');
      return
    }
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            {/* {tenantMode ? (
              <TenantId
                name="tenantId"
                defaultValue="000000"
                placeholder={`${formatMessage({ id: 'app.login.tenantId' })}: 000000`}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.tenantId.required' }),
                  },
                ]}
              />
            ) : null} */}
            <UserName
              name="account"
              placeholder="请输入账号"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
                {
                  validator: async (_, value) => {
                    return await validator.xss(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error('请输入正确格式'))
                  }
                }
              ]}
            />
            <Password
              name="password"
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                }
              ]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            {captchaMode ? <Captcha name="code" mode="image" /> : null}
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            {/* <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a> */}
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
