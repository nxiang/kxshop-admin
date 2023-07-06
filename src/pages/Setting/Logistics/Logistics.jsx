import React, { Component } from 'react';
import { history } from '@umijs/max';
import { Spin, Button, Row, Col, Table, message, Pagination, Modal, Space, Typography } from 'antd';
import { CopyOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Panel from '@/components/Panel';
import { showBut } from '@/utils/utils';
import Css from './Logistics.module.scss';
import GoodsListModal from './GoodsListModal';

import { freightList, deleteFreight, copyFreight } from '@/services/freight';

const { confirm } = Modal;
const { Title, Text, Link } = Typography;

class Logistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      freightInfo: null,
      page: 1,
      total: 1,
      freightId: 0,
      goodsListVisible: false,
    };
  }

  componentDidMount() {
    this.freightList();
  }

  freightList() {
    const p = {
      page: this.state.page,
      pageSize: 10,
    };
    freightList(p).then(res => {
      this.setState({
        loading: false,
      });
      if (res) {
        res.data.rows.map(item => {
          item.freightAreaList.map(son => {
            son.calcType = item.calcType;
          });
        });
        this.setState({
          freightInfo: res.data.rows,
          total: res.data.total,
        });
      }
    });
  }

  addTemplate() {
    // 新增模板
    history.push('/setting/addlogistics/add');
  }

  onPageChange(page) {
    this.setState(
      {
        loading: true,
        page,
      },
      () => {
        this.freightList();
      }
    );
  }

  copyRowFn(freightId) {
    this.setState({
      loading: true,
    });
    copyFreight({ freightId: Number(freightId) }).then(res => {
      this.setState({
        loading: false,
      });
      if (res) {
        message.success('复制成功');
        this.freightList();
      }
    });
  }

  editRowFn(freightId) {
    history.push(`/setting/addlogistics/${freightId}`);
  }

  deleteRowFn(freightId) {
    const me = this;
    confirm({
      title: '提示信息',
      content: '删除将影响所有使用该运费模板的商品的运费计算，确定继续删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        me.setState({
          page: 1,
          loading: true,
        });
        deleteFreight({ freightId: Number(freightId) }).then(res => {
          me.setState({
            loading: false,
          });
          if (res) {
            message.success('删除成功');
            me.freightList();
          }
        });
      },
    });
  }

  goodsListShow = freightId => {
    this.setState({
      freightId,
      goodsListVisible: true,
    });
  };

  render() {
    const { freightInfo, page, total, loading } = this.state;
    const columns = [
      {
        title: '运送到',
        dataIndex: 'areaNames',
        width: '50%',
      },
      {
        title: '首件(件)',
        dataIndex: 'firstItem',
        width: '12.5%',
        render: (text, record) => {
          const calcType = record.calcType;
          if (calcType === 'volume') {
            text = text / 1000000;
          }
          if (calcType === 'weight') {
            text = text / 1000;
          }
          return <div>{text}</div>;
        },
      },
      {
        title: '运费',
        dataIndex: 'firstPrice',
        width: '12.5%',
        render: (text, record) => {
          return <div>￥ {(Number(text) / 100).toFixed(2)}</div>;
        },
      },
      {
        title: '续件(件)',
        dataIndex: 'nextItem',
        width: '12.5%',
        render: (text, record) => {
          const calcType = record.calcType;
          if (calcType === 'volume') {
            text = text / 1000000;
          }
          if (calcType === 'weight') {
            text = text / 1000;
          }
          return <div>{text}</div>;
        },
      },
      {
        title: '运费',
        dataIndex: 'nextPrice',
        width: '12.5%',
        render: (text, record) => {
          return <div>￥ {(Number(text) / 100).toFixed(2)}</div>;
        },
      },
    ];
    return (
      <Panel title="运费模板">
        <div className={Css.LogisticsContent}>
          <div className={Css.topAlter}>
            <strong className={Css.alterTitle}>操作提示：</strong>
            <ul>
              <li>
                1.
                如果商品选择使用了配送规则，则该商品只售卖配送规则中指定的地区，运费为指定地区的运费。
              </li>
              <li>2. 正在被商品使用的配送规则不允许删除</li>
            </ul>
          </div>
          <div className={Css.tableContent}>
            {showBut('logistics', 'logistics_add') && (
              <Button
                onClick={this.addTemplate.bind(this)}
                style={{ float: 'right' }}
                type="primary"
              >
                新增模板
              </Button>
            )}
            {freightInfo && freightInfo.length && !loading ? (
              freightInfo.map((item, index) => {
                return (
                  <div key={index} className={Css.tableBox}>
                    <div className={Css.temTitle}>
                      <Title level={5} style={{ lineHeight: "58px" }}>
                        {item.freightName}
                      </Title>
                      <Space>
                        <Text>使用该模版的商品：{item.itemCount}个</Text>
                        {item.itemCount > 0 && (
                          <Link onClick={() => this.goodsListShow(item.freightId)}>查看商品</Link>
                        )}
                      </Space>
                      <Space>
                        <Text>最后编辑时间：{item.gmtModified}</Text>
                        {showBut('logistics', 'logistics_copy') && (
                          <Button
                            type="primary"
                            onClick={this.copyRowFn.bind(this, item.freightId)}
                          >
                            <CopyOutlined />
                            复制
                          </Button>
                        )}
                        {showBut('logistics', 'logistics_edit') && (
                          <Button
                            type="primary"
                            onClick={this.editRowFn.bind(this, item.freightId)}
                          >
                            <EditOutlined />
                            修改
                          </Button>
                        )}
                        {showBut('logistics', 'logistics_del') && (
                          <Button
                            type="primary"
                            onClick={this.deleteRowFn.bind(this, item.freightId)}
                            danger
                          >
                            <DeleteOutlined />
                            删除
                          </Button>
                        )}
                      </Space>
                    </div>
                    <Row className={Css.twoRow}>
                      <Col span={12}>运送到</Col>
                      <Col span={3}>
                        {item.calcType === 'number' ? (
                          '首件(件)'
                        ) : item.calcType === 'weight' ? (
                          '	首重(kg)'
                        ) : (
                          <div>
                            首体积(m<sup>3</sup>)
                          </div>
                        )}
                      </Col>
                      <Col span={3}>运费(元)</Col>
                      <Col span={3}>
                        {item.calcType === 'number' ? (
                          '续件(件)'
                        ) : item.calcType === 'weight' ? (
                          '	续重(kg)'
                        ) : (
                          <div>
                            续体积(m<sup>3</sup>)
                          </div>
                        )}
                      </Col>
                      <Col span={3}>运费(元)</Col>
                    </Row>
                    <Table
                      showHeader={false}
                      rowKey="freightAreaId"
                      dataSource={item.freightAreaList}
                      columns={columns}
                      pagination={false}
                    />
                  </div>
                );
              })
            ) : (
              <Spin spinning={loading} className={Css.loadingBox} size="large" />
            )}
            {freightInfo && freightInfo.length ? (
              <div className={Css.pageBox}>
                <Pagination current={page} total={total} onChange={this.onPageChange.bind(this)} />
              </div>
            ) : null}
          </div>
        </div>
        <GoodsListModal
          visible={this.state.goodsListVisible}
          freightId={this.state.freightId}
          onCancel={() =>
            this.setState({
              goodsListVisible: false,
            })
          }
        />
      </Panel>
    );
  }
}
export default Logistics;
