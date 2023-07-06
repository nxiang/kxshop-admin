import React from 'react';
import { HomeOutlined, LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';

export default {
  TenantId: {
    props: {
      size: 'large',
      id: 'tenantId',
      prefix: <HomeOutlined className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: 'Please enter tenantId!',
      },
    ],
  },
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: <UserOutlined className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockOutlined className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <MobileOutlined className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <MailOutlined className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码',
      },
    ],
  },
};
