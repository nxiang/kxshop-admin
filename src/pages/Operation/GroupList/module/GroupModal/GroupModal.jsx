import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import {
  Table,
  Switch,
  Radio,
  Row,
  Col,
  Button,
  Input,
  message,
  Upload,
  Icon,
  Modal,
  Form,
  DatePicker,
  Drawer,
  InputNumber,
  Spin,
} from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;
import Css from './GroupModal.module.scss';
import GoodsModal from '../GoodsModal/GoodsModal';
import { selectItem, publish, detail, edit } from '@/services/groupon';

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  const today = moment(moment().format('YYYY-MM-DD'));
  return moment(current).isBefore(today);
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};
const { TextArea } = Input;

class GroupModal extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      editLoading: false,
      grouponItemArr: null, // 商品数据
      grouponSkuList: null, // 规格数据
      goodsShow: false,
      loading: false,
      buyNumPerUser: 0,
    };
  }
  componentDidMount() {
    if (this.props.type === 'edit') {
      this.setState(
        {
          editLoading: true,
        },
        () => {
          this.grouponDetail();
        }
      );
    }
  }
  grouponDetail() {
    const grouponId = this.props.grouponId;

    detail({ grouponId }).then(res => {
      this.setState({
        editLoading: false,
      });
      if (res) {
        const editList = res.data;
        this.formRef.current.setFieldsValue({
          grouponName: editList.grouponName,
          userNumOpening: editList.userNumOpening,
          autoOpen: editList.autoOpen,
          buyNumPerUser: editList.buyNumPerUser ? 1 : 0,
          rule: editList.rule.replace(/<br\/>/g, '\n'),
          groupTime: [
            moment(editList.beginTime, 'YYYY-MM-DD HH:mm'),
            moment(editList.endTime, 'YYYY-MM-DD HH:mm'),
          ],
        });

        if (editList.grouponItem.grouponSkuList && editList.grouponItem.grouponSkuList.length) {
          editList.grouponItem.grouponSkuList.map(item => {
            this.setState({
              [`${item.skuId}&&grouponPrice`]: (item.grouponPrice / 100).toFixed(2),
            });
          });
        }

        this.setState({
          grouponItemArr: [editList.grouponItem],
          grouponSkuList: editList.grouponItem.grouponSkuList,
          buyNumPerUser: editList.buyNumPerUser ? 1 : 0,
          userNumSuccess: editList.buyNumPerUser ? editList.buyNumPerUser : null,
        });
      }
    });
  }
  submitFn() {
    const { grouponSkuList, grouponItemArr, userNumSuccess } = this.state;
    let isgrouponPrice = false;
    let isGroup = false;
    this.formRef.current.validateFields().then(values => {
      values.beginTime = values.groupTime
        ? values.groupTime[0].format('YYYY-MM-DD HH:mm:ss')
        : null;
      values.endTime = values.groupTime ? values.groupTime[1].format('YYYY-MM-DD HH:mm:ss') : null;
      delete values.groupTime;
      delete values.groupGoods;
      delete values.groupMoney;
      if (grouponSkuList && grouponSkuList.length) {
        grouponSkuList.map(item => {
          if (!item.grouponPrice) {
            isgrouponPrice = true;
          }
        });
      }
      if (!grouponItemArr || !grouponItemArr.length) {
        isGroup = true;
      }
      if (isGroup) {
        message.warning('请选择拼团商品');
        return;
      }
      if (isgrouponPrice) {
        message.warning('请输入拼团价');
        return;
      }
      grouponItemArr[0].grouponSkuList = grouponSkuList;
      values.grouponItem = grouponItemArr[0];
      values.buyNumPerUser = values.buyNumPerUser ? userNumSuccess : 0;

      values.rule = values.rule.replace(/\n/g, '<br/>');
      this.setState({
        loading: true,
      });
      if (this.props.type === 'add') {
        this.publish(values);
      } else {
        values.grouponId = this.props.grouponId;
        this.edit(values);
      }
    });
  }
  edit(values) {
    edit(values).then(res => {
      this.setState({
        loading: false,
      });
      if (res) {
        message.success('编辑成功');
        this.props.submitModal();
      }
    });
  }
  publish(values) {
    publish(values).then(res => {
      this.setState({
        loading: false,
      });
      if (res) {
        message.success('发布成功');
        this.props.submitModal();
      }
    });
  }
  userNumSuccessChange(userNumSuccess) {
    // 成功参团人数
    this.setState({
      userNumSuccess,
    });
  }
  radioChange(e) {
    // 参团限制
    const buyNumPerUser = e.target.value;
    this.setState({
      buyNumPerUser,
    });
  }
  selectGoods() {
    //选择商品
    this.setState({
      goodsShow: true,
    });
  }
  closeModal() {
    this.setState({
      goodsShow: false,
    });
  }
  checkedItem(itemId) {
    const { grouponId, type } = this.props;
    const p = {
      itemId,
    };
    this.setState({
      goodsShow: false,
    });
    if (type === 'edit') {
      p.grouponId = grouponId;
    }
    selectItem(p).then(res => {
      if (res) {
        const grouponItem = res.data;
        this.setState({
          grouponItemArr: [grouponItem],
          grouponSkuList: grouponItem.grouponSkuList,
        });
      }
    });
  }
  deleteItem() {
    this.setState({
      grouponItemArr: [],
    });
  }
  commonChange(key, value) {
    const { grouponSkuList } = this.state;
    const skuId = key.split('&&')[0];
    grouponSkuList.map(item => {
      if (skuId == item.skuId) {
        item.grouponPrice = value * 100;
      }
    });
    this.setState({
      grouponSkuList,
      [key]: value,
    });
  }
  render() {
    const {
      editLoading,
      loading,
      userNumSuccess,
      buyNumPerUser,
      goodsShow,
      grouponItemArr,
      grouponSkuList,
    } = this.state;
    const skuColumns = [
      {
        title: '规格',
        dataIndex: 'specDesc',
        render: (text, record) => {
          return <div>{record.specDesc || '默认'}</div>;
        },
      },
      {
        title: '原价(元)',
        dataIndex: 'salePrice',
        render: (text, record) => {
          return <div>{(text / 100).toFixed(2)}</div>;
        },
      },
      {
        title: '拼团价(元)',
        dataIndex: 'grouponPrice',
        render: (text, record) => {
          return (
            <InputNumber
              precision={2}
              onChange={this.commonChange.bind(this, `${record.skuId}&&grouponPrice`)}
              value={this.state[`${record.skuId}&&grouponPrice`]}
              min={0.01}
            />
          );
        },
      },
      {
        title: '库存',
        dataIndex: 'storage',
      },
    ];
    const itemColumns = [
      {
        title: '商品名称',
        dataIndex: 'itemName',
        render: (text, record) => {
          return (
            <div className={Css['table-name-box']}>
              <div>
                <img className={Css['table-name-img']} src={record.imageSrc} />
              </div>
              <div style={{ marginLeft: 12 }}>{record.itemName}</div>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'itemActive',
        width: '20%',
        render: (text, record) => {
          return <a onClick={this.deleteItem.bind(this)}>删除</a>;
        },
      },
    ];
    return (
      <Drawer
        maskClosable={false}
        title="新建拼团"
        width={700}
        visible={this.props.visible}
        onClose={this.props.closeModal}
        key={12}
        className={Css.groupModal}
      >
        {editLoading ? (
          <div className={Css.editLoadingBox}>
            <Spin spinning={editLoading} size="large" />
          </div>
        ) : (
          <div className={Css.formBox}>
            <Form
              ref={this.formRef}
              {...layout}
              initialValues={{
                // date: moment('2019-02-02')
                autoOpen: false,
                buyNumPerUser: 0,
                groupGoods: 'goods',
                groupMoney: 'money',
                rule:
                  '每个商品都有单独购买价格和拼团价格，选择拼团购买进行商品下单，开团支付成功后获取转发链接，邀请好友参团，参团成员也可以将该团分享出去邀约更多的团员参团，在规定时间内邀请到相应人数支付购买则拼团成功，等待收货;未达到人数则团购失败，系统会自动退款到付款账户。',
              }}
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入活动名称',
                  },
                  {
                    max: 20,
                    message: '最多20个字',
                  },
                ]}
                label="活动名称"
                name="grouponName"
              >
                <Input style={{ width: 350 }} placeholder="请输入活动名称" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: '请选择拼团时间' }]}
                label="拼团时间"
                name="groupTime"
                extra="在所选时间范围内，商品可拼团购买"
              >
                <RangePicker
                  style={{ width: 350 }}
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  placeholder={['拼团开始', '拼团结束']}
                />
              </Form.Item>
              <Form.Item name="groupGoods" rules={[{ required: true }]} label="拼团商品">
                {grouponItemArr && grouponItemArr.length ? (
                  <div>
                    <Table
                      rowKey="itemId"
                      bordered
                      dataSource={grouponItemArr}
                      columns={itemColumns}
                      pagination={false}
                    />
                  </div>
                ) : (
                  <a onClick={this.selectGoods.bind(this)}>选择商品</a>
                )}

                <Input type="hidden" />
              </Form.Item>
              {grouponItemArr && grouponItemArr.length ? (
                <Form.Item name="groupMoney" rules={[{ required: true }]} label="拼团价格">
                  <Table
                    rowKey="skuId"
                    bordered
                    dataSource={grouponSkuList}
                    columns={skuColumns}
                    pagination={false}
                  />
                  <Input type="hidden" />
                </Form.Item>
              ) : null}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入参团人数',
                  },
                ]}
                label="参团人数"
                name="userNumOpening"
                extra="在拼团限时范围内需要达成的拼团人数"
              >
                <InputNumber
                  style={{ width: 200 }}
                  max={99999}
                  min={2}
                  precision={0}
                  placeholder="至少2人"
                />
              </Form.Item>
              <Form.Item label="参团限制" name="buyNumPerUser">
                <Radio.Group onChange={this.radioChange.bind(this)}>
                  <Radio value={0}>不限制</Radio>
                  <br />
                  <Radio value={1}>
                    每人可成功参团{' '}
                    <InputNumber
                      disabled={!buyNumPerUser}
                      min={0}
                      max={99999}
                      placeholder="请输入"
                      value={userNumSuccess}
                      onChange={this.userNumSuccessChange.bind(this)}
                      precision={0}
                    />{' '}
                    次
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="虚拟成团"
                extra="若在规定时间内未完成拼团，系统自动以匿名用户成团"
                name="autoOpen"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="拼团规则"
                rules={[
                  {
                    required: true,
                    message: '请输入拼团规则',
                  },
                ]}
                name="rule"
              >
                <TextArea style={{ height: 150 }} />
              </Form.Item>
            </Form>
          </div>
        )}

        <div className={Css.btnBox}>
          <Button key="1" className={Css.cancelBtn} onClick={this.props.closeModal}>
            取消
          </Button>
          <Button
            loading={loading}
            key="2"
            type="primary"
            htmlType="submit"
            onClick={this.submitFn.bind(this)}
          >
            确认
          </Button>
        </div>
        {goodsShow ? (
          <GoodsModal
            checkedItem={this.checkedItem.bind(this)}
            closeModal={this.closeModal.bind(this)}
            visible={goodsShow}
          />
        ) : null}
      </Drawer>
    );
  }
}

export default withRouter(GroupModal);
