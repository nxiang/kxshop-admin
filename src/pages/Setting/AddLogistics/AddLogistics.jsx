import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from './AddLogistics.module.scss';
import {
  Input,
  Spin,
  Steps,
  Form,
  Radio,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Table,
  message,
  Modal,
} from 'antd';
import Panel from '@/components/Panel';
import moment from 'moment';
import { CopyOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { freightList, newFreight, detailFreight, editFreight } from '@/services/freight';
import AddAreaModal from './modules/AddAreaModal/AddAreaModal';
import oneLocation from '@/assets/images/one-location.jpg'

const { confirm } = Modal;

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 16 },
};

class AddLogistics extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      freeFlag: 0,
      calcType: 'number',
      freightAreaList: [],
      areaShow: false,
      loading: false,
    };
  }
  componentDidMount() {
    let freightId = this.props.match.params.freightId;
    if (freightId !== 'add') {
      this.setState(
        {
          freightId,
        },
        () => {
          this.detailFreight();
        }
      );
    }
  }
  detailFreight() {
    const { freightId } = this.state;
    const p = {
      freightId,
    };
    detailFreight(p).then(res => {
      if (res) {
        res.data.freightAreaList.map(item => {
          item.firstPrice = item.firstPrice / 100;
          item.nextPrice = item.nextPrice / 100;
          if (res.data.calcType === 'volume') {
            item.firstItem = item.firstItem / 1000000;
            item.nextItem = item.nextItem / 1000000;
          }
          if (res.data.calcType === 'weight') {
            item.firstItem = item.firstItem / 1000;
            item.nextItem = item.nextItem / 1000;
          }
        });
        this.formRef.current.setFieldsValue({
          freightName: res.data.freightName,
        });
        this.setState({
          freeFlag: res.data.freeFlag ? 1 : 0,
          calcType: res.data.calcType,
          editInfo: res.data,
          freightAreaList: res.data.freightAreaList,
        });
      }
    });
  }
  submitFn(values) {
    // 提交
    const { freightAreaList, calcType, freeFlag } = this.state;
    let freightId = this.props.match.params.freightId;
    let errorType = 0;
    if (!freightAreaList.length) {
      message.warning('请指定地区城市');
    }
    if (freightAreaList.length) {
      freightAreaList.map(item => {
        if (!item.areaIds) {
          errorType = 1;
        }
        if ((!item.firstItem && item.firstItem != 0) || (!item.nextItem && item.nextItem != 0)) {
          errorType = 2;
        }
        if (
          (!item.firstPrice && item.firstPrice != 0) ||
          (!item.nextPrice && item.nextPrice != 0)
        ) {
          errorType = 3;
        }
      });
      if (errorType === 1) {
        message.warning('请指定地区城市');
        return;
      }
      if (errorType === 2) {
        message.warning('请填写计价单位');
        return;
      }
      if (errorType === 3) {
        message.warning('请填写物流价格');
        return;
      }
    }

    let areaIds = [];
    let freightAreaArr = JSON.parse(JSON.stringify(freightAreaList));
    freightAreaArr.map(item => {
      if (freeFlag) {
        //包邮
        item.firstPrice = 0;
        item.nextPrice = 0;
      } else {
        item.firstPrice = item.firstPrice * 100;
        item.nextPrice = item.nextPrice * 100;
      }

      if (calcType === 'volume') {
        item.firstItem = item.firstItem * 1000000;
        item.nextItem = item.nextItem * 1000000;
      }
      if (calcType === 'weight') {
        item.firstItem = item.firstItem * 1000;
        item.nextItem = item.nextItem * 1000;
      }
      areaIds.push(item.AllareaIds);
    });
    areaIds = '_' + areaIds.join('_');
    const p = {
      ...values,
      freeFlag,
      calcType,
      freightAreaList: freightAreaArr,
    };
    console.log('传参', p);
    this.setState({
      loading: true,
    });
    if (freightId === 'add') {
      p.areaIds = areaIds;
      this.newFreight(p);
    } else {
      p.areaIds = 'edit';
      p.freightId = freightId;
      this.editFreight(p);
    }
  }
  editFreight(p) {
    editFreight(p).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.success) {
        message.success('编辑成功');
        history.push('/setting/logistics');
      }
    });
  }
  newFreight(p) {
    //新增模板
    newFreight(p).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.success) {
        message.success('操作成功');
        history.push('/setting/logistics');
      }
    });
  }
  addAreaFn() {
    // 添加地区
    const { freightAreaList } = this.state;
    freightAreaList.push({
      areaIds: null,
      areaNames: null,
      firstItem: 1,
      firstPrice: null,
      nextItem: 1,
      nextPrice: null,
    });
    this.setState({
      freightAreaList,
    });
  }
  itemChangeFn(name, index, value) {
    const { freightAreaList } = this.state;
    freightAreaList[index][name] = value;
    this.setState({
      freightAreaList,
    });
  }
  deleteRow(index) {
    const { freightAreaList } = this.state;
    const me = this;
    confirm({
      title: '提示信息',
      content: '确定删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        freightAreaList.splice(index, 1);
        me.setState({
          freightAreaList,
        });
      },
    });
  }
  editRow(index) {
    this.setState({
      editIndex: index,
      areaShow: true,
    });
  }
  onCancel() {
    this.setState({
      areaShow: false,
    });
  }
  areaOkFn(areaObj) {
    const { editIndex, freightAreaList } = this.state;
    freightAreaList[editIndex].areaIds = areaObj.areaIds;
    freightAreaList[editIndex].areaNames = areaObj.areaNames;
    freightAreaList[editIndex].AllareaIds = areaObj.AllareaIds;
    this.setState({
      areaShow: false,
      freightAreaList,
    });
  }
  calcTypeChange(e) {
    const me = this;
    const value = e.target.value;
    confirm({
      title: '提示信息',
      content: '切换计价方式后，所设置当前的运费信息将被清空，确定继续吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        me.setState({
          freightAreaList: [],
          calcType: value,
        });
      },
    });
  }
  freeFlagChange(e) {
    const me = this;
    const value = e.target.value;
    if (value == 1) {
      confirm({
        title: '提示信息',
        content: '卖家承担运费后，详细设置中的价格信息会失效，仅地区有效，确定继续吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          me.setState({
            freeFlag: Number(value),
          });
        },
      });
    } else {
      me.setState({
        freeFlag: Number(value),
      });
    }
  }
  
  render() {
    const { freightAreaList, areaShow, calcType, editIndex, editInfo, freeFlag } = this.state;
    return (
      <Panel title="运费模板">
        <div className={Css.addContent}>
          <Form ref={this.formRef} {...layout} onFinish={this.submitFn.bind(this)}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
                {
                  max: 20,
                  message: '最长不超过20个字符',
                },
              ]}
              label="运费模板名称"
              name="freightName"
            >
              <Input placeholder="请输入运费模板名称" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="是否包邮" onChange={this.freeFlagChange.bind(this)}>
              <Radio.Group value={freeFlag}>
                <Radio value={0}>自定义运费</Radio>
                <Radio value={1}>卖家承担运费</Radio>
              </Radio.Group>
            </Form.Item>

            {/* {editInfo ? (
              <Form.Item label="计价方式" name="calcType">
                <span>
                  {calcType === 'number' ? '按件数' : calcType === 'weight' ? '	按重量' : '按体积'}
                </span>
              </Form.Item>
            ) : (
              <Form.Item label="计价方式" onChange={this.calcTypeChange.bind(this)}>
                <Radio.Group value={calcType}>
                  <Radio value="number">按件数</Radio>
                  <Radio value="weight">按重量</Radio>
                  <Radio value="volume">按体积</Radio>
                </Radio.Group>
              </Form.Item>
            )} */}

            <Form.Item label="计价方式" onChange={this.calcTypeChange.bind(this)}>
              <Radio.Group value={calcType}>
                <Radio value="number">按件数</Radio>
                <Radio value="weight">按重量</Radio>
                <Radio value="volume">按体积</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="详细设置">
              <div className={Css.detailConent}>
                <div className={Css.detailTitleBox}>
                  <Row>
                    <Col span={8}>运送到</Col>
                    <Col span={3}>
                      {calcType === 'number' ? (
                        '首件(件)'
                      ) : calcType === 'weight' ? (
                        '	首重(kg)'
                      ) : (
                        <div>
                          首体积(m<sup>3</sup>)
                        </div>
                      )}
                    </Col>
                    <Col span={3}>首费(元)</Col>
                    <Col span={3}>
                      {calcType === 'number' ? (
                        '续件(件)'
                      ) : calcType === 'weight' ? (
                        '	续重(kg)'
                      ) : (
                        <div>
                          续体积(m<sup>3</sup>)
                        </div>
                      )}
                    </Col>
                    <Col span={3}>续费(元)</Col>
                    <Col span={4}>操作</Col>
                  </Row>
                </div>
                <div className={Css.bottomContent}>
                  {freightAreaList.map((item, index) => {
                    return (
                      <div key={index} className={Css.areaBox}>
                        <Row>
                          <Col span={8}>{item.areaNames}</Col>
                          <Col span={3}>
                            <InputNumber
                              min={0}
                              max={999.99}
                              precision={calcType === 'number' ? 0 : 2}
                              value={item.firstItem}
                              onChange={this.itemChangeFn.bind(this, 'firstItem', index)}
                              style={{ width: 70 }}
                            />
                          </Col>
                          <Col span={3}>
                            <InputNumber
                              min={0}
                              max={999.99}
                              precision={2}
                              value={item.firstPrice}
                              onChange={this.itemChangeFn.bind(this, 'firstPrice', index)}
                              style={{ width: 100 }}
                              suffix="元"
                            />
                          </Col>
                          <Col span={3}>
                            <InputNumber
                              precision={calcType === 'number' ? 0 : 2}
                              min={0}
                              max={999.99}
                              value={item.nextItem}
                              onChange={this.itemChangeFn.bind(this, 'nextItem', index)}
                              style={{ width: 70 }}
                            />
                          </Col>
                          <Col span={3}>
                            <InputNumber
                              min={0}
                              max={999.99}
                              value={item.nextPrice}
                              precision={2}
                              onChange={this.itemChangeFn.bind(this, 'nextPrice', index)}
                              style={{ width: 100 }}
                              suffix="元"
                            />
                          </Col>
                          <Col span={4}>
                            <Button
                              onClick={this.editRow.bind(this, index)}
                              size="small"
                              style={{ marginRight: 5 }}
                              type="primary"
                            >
                              <FormOutlined />
                              编辑
                            </Button>
                            <Button
                              onClick={this.deleteRow.bind(this, index)}
                              size="small"
                              type="primary"
                              danger
                            >
                              <DeleteOutlined />
                              删除
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

                  <div className={Css.bottomBtn}>
                    <span onClick={this.addAreaFn.bind(this)} className={Css.setMoney}>
                      <img
                        className={Css.lotIcon}
                        alt="logo"
                        src={oneLocation}
                      />
                      为指定地区城市设置运费
                    </span>
                  </div>
                </div>
              </div>
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }} {...tailLayout}>
              <Button loading={this.state.loading} htmlType="submit" type="primary">
                确认提交
              </Button>
            </Form.Item>
          </Form>
          {/* {areaShow ? ( */}
            <AddAreaModal
              freightAreaList={freightAreaList}
              editIndex={editIndex}
              areaOkFn={this.areaOkFn.bind(this)}
              visible={areaShow}
              onCancel={this.onCancel.bind(this)}
            />
          {/* ) : null} */}
        </div>
      </Panel>
    );
  }
}
export default withRouter(AddLogistics);
