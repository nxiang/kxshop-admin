import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import styles from './SwordPage.less';

export default class SearchBox extends PureComponent {
  render() {
    const { onSubmit, children } = this.props;
    return (
      <div className={styles.form}>
        <Form onSubmit={onSubmit} layout="inline">
          {children}
        </Form>
      </div>
    );
  }
}
