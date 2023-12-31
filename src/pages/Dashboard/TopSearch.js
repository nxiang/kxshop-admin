import React, { memo } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Col, Table, Tooltip, Card } from 'antd';
import { FormattedMessage } from '@umijs/max';
import numeral from 'numeral';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import { MiniArea } from '@/components/Charts';
import styles from './Analysis.less';

const columns = [
  {
    title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: (
      <FormattedMessage id="app.analysis.table.search-keyword" defaultMessage="Search keyword" />
    ),
    dataIndex: 'keyword',
    key: 'keyword',
    render: text => <a href="/">{text}</a>,
  },
  {
    title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />,
    dataIndex: 'range',
    key: 'range',
    sorter: (a, b) => a.range - b.range,
    render: (text, record) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{text}%</span>
      </Trend>
    ),
    align: 'right',
  },
];

const TopSearch = memo(({ loading, visitData2, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage id="app.analysis.online-top-search" defaultMessage="Online Top Search" />
    }
    extra={dropdownGroup}
    style={{ marginTop: 24 }}
  >
    <Row gutter={68}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage id="app.analysis.search-users" defaultMessage="search users" />
              <Tooltip
                title={<FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />}
              >
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          gap={8}
          total={numeral(12321).format('0,0')}
          status="up"
          subTotal={17.1}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage
                id="app.analysis.per-capita-search"
                defaultMessage="Per Capita Search"
              />
              <Tooltip
                title={<FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />}
              >
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          total={2.7}
          status="down"
          subTotal={26.2}
          gap={8}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
    </Row>
    <Table
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
));

export default TopSearch;
