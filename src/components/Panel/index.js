import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { FormattedMessage, history } from '@umijs/max';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default class Panel extends PureComponent {
  back = () => {
    const { back } = this.props;
    history.push(back);
  };

  render() {
    const { title, content, back, action, children } = this.props;

    const actionGroup = back ? (
      <div>
        {action}
        <Button
          type="default"
          style={{ color: '#189dff', border: '1px solid #189dff' }}
          onClick={this.back}
        >
          <FormattedMessage id="button.back.name" />
        </Button>
      </div>
    ) : (
      action
    );

    return (
      <PageHeaderWrapper title={title} content={content} action={actionGroup}>
        {children}
      </PageHeaderWrapper>
    );
  }
}
