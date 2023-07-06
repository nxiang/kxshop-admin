import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import Css from './StroedConfig.module.scss';
import { Breadcrumb, Button, Tabs, Modal, DatePicker, Select, Table, message } from 'antd';
import Panel from '@/components/Panel';
import moment from 'moment';
// import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { showBut } from '@/utils/utils'

import { cardList, delisting, listing, renew } from '@/services/stored';

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 18 } };
const FormItem = Form.Item;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

class StroedConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tableData: {},
      searchForm: {
        state: null,
        minExpiredTime: null,
        maxExpiredTime: null,
        pageSize: 10,
        page: 1,
      },
    };
  }
  componentDidMount() {
    this.cardList();
  }
  cardList() {
    cardList(this.state.searchForm).then(res => {
      if (res) {
        this.setState({
          loading: false,
          tableData: res.data,
        });
      }
    });
  }
  searchUserInfo() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.minExpiredTime =
        values.visitDate && values.visitDate.length
          ? values.visitDate[0].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.maxExpiredTime =
        values.visitDate && values.visitDate.length
          ? values.visitDate[1].format('YYYY-MM-DD HH:mm:ss')
          : null;
      values.state = values.state === '-1' ? null : values.state;
      delete values.visitDate;
      this.setState(
        {
          loading: true,
          searchForm: {
            ...values,
            page: 1,
            pageSize: 10,
          },
        },
        () => {
          this.cardList();
        }
      );
    });
  }
  PaginationChange(e) {
    this.setState(
      {
        searchForm: {
          loading: true,
          ...this.state.searchForm,
          page: e,
        },
      },
      () => {
        this.cardList();
      }
    );
  }
  pushCardFn(cardId) {
    // 顶部立即发布
    const me = this;
    confirm({
      title: '提示',
      content: '确定发布该储值产品么？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        listing({ cardId }).then(res => {
          if (res) {
            message.success('商品已发布');
            me.searchUserInfo();
          }
        });
      },
    });
  }
  stopCardFn(cardId) {
    // 停售
    const me = this;
    confirm({
      // icon: <LegacyIcon type="close-circle" style={{ color: '#F72633' }} />,
      icon: <CloseCircleOutlined />,
      title: '提示',
      content: '停售后用户将无法购买此储值卡，确定停售么？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        delisting({ cardId }).then(res => {
          if (res) {
            message.success('商品已停售');
            me.searchUserInfo();
          }
        });
      },
    });
  }
  goOnDateFn(record) {
    // 续期
    this.setState({
      cardId: record.cardId,
      dateShow: true,
    });
  }
  onUpdateTimeChange(value, dateString) {
    this.setState({
      expiredTime: `${dateString}:00`,
    });
  }
  okUpdateTimeFn() {
    //确定续期
    const { expiredTime, cardId } = this.state;
    const p = {
      expiredTime,
      cardId,
    };
    renew(p).then(res => {
      if (res) {
        message.success('续期成功');
        this.setState(
          {
            dateShow: false,
          },
          () => {
            this.searchUserInfo();
          }
        );
      }
    });
  }
  disabledDate(current) {
    const today = moment(moment().format('YYYY-MM-DD'));
    return moment(current).isBefore(today);
  }
  disabledDateTime(current) {
    const HH = moment().format('HH');
    const mm = moment()
      .add(1, 'm')
      .format('mm');
    const today = moment().format('YYYY-MM-DD');
    const currentDate = current ? moment(current).format('YYYY-MM-DD') : null;
    if (current && (today === currentDate || !currentDate)) {
      // 只限今天判断HHMM
      const nowHH = moment().format('HH');
      if (nowHH == moment(current).format('HH')) {
        return {
          disabledHours: () => range(0, HH),
          disabledMinutes: () => range(0, mm),
        };
      } else {
        return {
          disabledHours: () => range(0, HH),
        };
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tableData } = this.state;
    const columns = [
      {
        title: '储值名称',
        dataIndex: 'cardName',
      },
      {
        title: '面额',
        dataIndex: 'denomination',
        render: (text, record) => {
          return <div>{record.denomination / 100}</div>;
        },
      },
      {
        title: '有效期至',
        dataIndex: 'expiredTime',
        render: (text, record) => {
          return <div>{record.neverExpired ? '永久有效' : record.expiredTime}</div>;
        },
      },
      {
        title: '销量',
        dataIndex: 'saleVolume',
      },
      {
        title: '新增时间',
        dataIndex: 'gmtCreated',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => {
          const stateArr = ['', '已发布', '已停售', '已过期'];
          return <div>{stateArr[text]}</div>;
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.state === 1) {
            return (
              <div>
              {
                showBut('stroedConfig', 'stroed_config_stop') && (
                   <span
                    className={`${Css.findDetail} ' ' ${Css.stopShop}`}
                    onClick={this.stopCardFn.bind(this, record.cardId)}
                  >
                    停售
                  </span>
                )
              }
               {showBut('stroedConfig', 'stroed_config_view') && ( <Link
                  className={Css.findDetail}
                  to={`/operation/stroedConfig/addStroed/${record.cardId}`}
                >
                  查看
                </Link> ) }
              </div>
            );
          }
          if (record.state === 2) {
            return (
              <div>
               {showBut('stroedConfig', 'stroed_config_release') && (<span
                  className={`${Css.findDetail}`}
                  onClick={this.pushCardFn.bind(this, record.cardId)}
                >
                  发布
                </span>)}
               {showBut('stroedConfig', 'stroed_config_view') && (<Link
                  className={Css.findDetail}
                  to={`/operation/stroedConfig/addStroed/${record.cardId}`}
                >
                  查看
                </Link>)}
              </div>
            );
          }
          if (record.state === 3) {
            return (
              <div>
               {showBut('stroedConfig', 'stroed_config_renewal') && (<span className={`${Css.findDetail}`} onClick={this.goOnDateFn.bind(this, record)}>
                  续期
                </span>)}
               {showBut('stroedConfig', 'stroed_config_view') &&(<Link
                  className={Css.findDetail}
                  to={`/operation/stroedConfig/addStroed/${record.cardId}`}
                >
                  查看
                </Link>)}
              </div>
            );
          }
        },
      },
    ];
    return (
      <Panel title="储值配置" content="储值产品的发布与管理">
        <div className={Css.storedConfigBox}>
          <div className={Css.storedContent}>
            <div className={Css.topBox}>
              <span className={Css.topTitle}>储值配置</span>
              {
                showBut('stroedConfig', 'stroed_config_add') && (
                  <Link to="/operation/stroedConfig/addStroed/add">
                    <Button className={Css.topBtn} type="primary">
                      <PlusOutlined />
                      {/* <LegacyIcon type="plus" /> */}
                      新增
                    </Button>
                  </Link>
                )
              }
            </div>
            <div className={Css.tableContent}>
              <Form layout="inline">
                <FormItem>
                  {getFieldDecorator('state', {
                    initialValue: '-1',
                  })(
                    <Select style={{ width: 150 }} placeholder="储值状态">
                      <Option value="-1">全部</Option>
                      <Option value="1">已发布</Option>
                      <Option value="2">已停售</Option>
                      <Option value="3">已过期</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem>
                  <span style={{ padding: '0 8px' }}>有效期:</span>
                  {getFieldDecorator('visitDate')(
                    <RangePicker
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                      style={{ width: 350 }}
                      placeholder={['有效期开始', '有效期结束']}
                    />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.searchUserInfo.bind(this)}>
                    搜索
                  </Button>
                </FormItem>
              </Form>
              <div style={{ marginTop: '16px' }}>
                <Table
                  loading={this.state.loading}
                  rowKey="cardId"
                  dataSource={tableData && tableData.rows}
                  columns={columns}
                  pagination={{
                    current: tableData.current,
                    pageSize: tableData.pageSize,
                    total: tableData.total,
                    onChange: this.PaginationChange.bind(this),
                  }}
                />
              </div>
            </div>
          </div>
          {this.state.dateShow ? (
            <Modal
              width={450}
              title="提示"
              visible={this.state.dateShow}
              onOk={this.okUpdateTimeFn.bind(this)}
              onCancel={() => this.setState({ dateShow: false })}
              okText="确认"
              cancelText="取消"
            >
              <div style={{ paddingBottom: '8px' }}>请设置新的到期时间</div>
              <DatePicker
                showToday={false}
                format="YYYY-MM-DD HH:mm"
                disabledDate={this.disabledDate.bind(this)}
                disabledTime={this.disabledDateTime.bind(this)}
                showTime={{ format: 'HH:mm' }}
                onChange={this.onUpdateTimeChange.bind(this)}
                placeholder="请选择时间"
              />
            </Modal>
          ) : null}
        </div>
      </Panel>
    );
  }
}

export default withRouter(Form.create()(StroedConfig));
