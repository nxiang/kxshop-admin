import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import Panel from '@/components/Panel';
import {
  Form,
  PageHeader,
  Input,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Button,
  Table,
  Space,
  message,
  Spin,
  Modal,
  Radio,
  Dropdown,
  Menu,
} from 'antd';
import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import Css from './LevelAdd.module.scss';
import Columns from './columns';
import SetCouponsModal from './SetCouponsModal';
import { ColorPink } from '@/utils/colorPink';
import { memberGradeDetail, memberGradeAdd, memberGradeEdit } from '@/services/member';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible';

const { TextArea } = Input;
const { confirm } = Modal;
const operationIs = true;

export default withRouter(props => {
  const [form] = Form.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [checkList, setCheckList] = useState({});
  const [couponsList, setCouponsList] = useState([]);
  // 修改用模板id
  const [gradeId, setGradeId] = useState(-1);
  const [memberType, setMemberType] = useState(1);
  // 修改加载状态开启
  const [editLoading, setEditLoading] = useState(false);
  // 默认颜色
  const [defaultColor, setDefaultColor] = useState('#fff');
  const { location } = props
  useEffect(() => {
    if (location?.query?.gradeId) {
      // console.log('bcColor=', bcColor);
      setEditLoading(true);
      setGradeId(location.query.gradeId);
      memberGradeDetail({
        gradeId: location.query.gradeId,
      })
        .then(res => {
          if (res.success) {
            if (res.data.cardDecorateInfo != '') {
              res.data.cardDecorateInfo = JSON.parse(res.data.cardDecorateInfo);
            }
            form.setFieldsValue({
              gradeName: res.data.gradeName,
              gradeDesc: res.data.gradeDesc,
              exp: res.data.exp,
              pointsRate: res.data.pointsRate,
              pointsRateIsEnable: res.data.pointsRateIsEnable,
              presentCouponIsEnable: res.data.presentCouponIsEnable,
              presentCoupons: res.data.presentCoupons,
              presentPoints: res.data.presentPoints,
              presentPointsIsEnable: res.data.presentPointsIsEnable,
              background:
                res.data.cardDecorateInfo != '' ? res.data.cardDecorateInfo.background : undefined,
              showRule: res.data.cardDecorateInfo != '' ? res.data.cardDecorateInfo.showRule : 1,
              showignel: res.data.cardDecorateInfo != '' ? res.data.cardDecorateInfo.showignel : 1,
              showlevel: res.data.cardDecorateInfo != '' ? res.data.cardDecorateInfo.showlevel : 1,
            });
            if (res.data.cardDecorateInfo != '') {
              setDefaultColor(res.data.cardDecorateInfo?.background?.backColor);
            }
            setMemberType(res.data.type);
            setCouponsList(res.data.presentCoupons);
          }
          setEditLoading(false);
        })
        .catch(() => {
          setEditLoading(false);
        });
    }
  }, []);

  const delCoupons = stockId => {
    confirm({
      title: '删除优惠券',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '确定删除该优惠券吗？',
      okType: 'danger',
      onOk() {
        console.log(stockId);
        let alterIndex = -1;
        couponsList.forEach((item, index) => {
          if (item.stockId == stockId) {
            console.log;
            alterIndex = index;
          }
        });
        couponsList.splice(alterIndex, 1);
        setCouponsList([...couponsList]);
        message.success('优惠券删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const AddCoupon = () => {
    setAddVisible(true);
  };

  const setCoupons = list => {
    setAddVisible(false);
    setCouponsList([...couponsList, ...list]);
  };

  const onFinish = newValue => {
    if (newValue.pointsRateIsEnable && newValue.pointsRate == undefined)
      return message.warning('积分回馈倍率不能为空');
    if (newValue.presentPointsIsEnable && newValue.presentPoints == undefined)
      return message.warning('赠送积分不能为空');
    if (newValue.presentCouponIsEnable && JSON.stringify(couponsList) == '[]')
      return message.warning('优惠券不能为空');
    const temp = {
      background: newValue.background,
      showRule: newValue.showRule != undefined ? newValue.showRule : 1,
      showignel: newValue.showignel != undefined ? newValue.showignel : 1,
      showlevel: newValue.showlevel != undefined ? newValue.showlevel : 1,
    };
    console.log('background=',newValue.background);
    const data = {
      ...newValue,
      presentCouponIds: couponsList.map(i => i.stockId),
      background: undefined,
      showRule: undefined,
      showignel: undefined,
      showlevel: undefined,
      cardDecorateInfo: JSON.stringify(temp),
    };
    console.log('data=', data);
    if (memberType == 0) data.exp = 0;
    if (gradeId > -1) {
      data.gradeId = gradeId;
      memberGradeEdit(data)
        .then(res => {
          if (res.success) {
            message.success('修改成功');
            history.push('/users/levelList');
          }
        })
        .catch(() => {});
    } else {
      memberGradeAdd(data)
        .then(res => {
          if (res.success) {
            message.success('新增成功');
            history.push('/users/levelList');
          }
        })
        .catch(() => {});
    }
  };
  const handleMenuClick = e => {
    const temp = ColorPink()[e.key];
    console.log(temp.backColor);

    setDefaultColor(temp.backColor);
    form.setFieldsValue({
      background: temp,
    });
  };
  const itemMenu = (
    <Menu onClick={handleMenuClick}>
      {ColorPink().map((item, index) => {
        return (
          <Menu.Item key={index}>
            <div
              style={{
                width: '100%',
                height: '30px',
                background: item.backColor,
              }}
            />
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <Panel title="新增会员等级" content="会员等级的配置与设定">
      <Spin spinning={editLoading}>
        <Form
          form={form}
          labelCol={{ span: 4, offset: 1 }}
          wrapperCol={{ span: 8 }}
          initialValues={{
            pointsRate: 1,
            presentPoints: 0,
            pointsRateIsEnable: false,
            presentPointsIsEnable: false,
            presentCouponIsEnable: false,
          }}
          onFinish={onFinish}
        >
          <PageHeader title="基础信息" style={{ backgroundColor: '#fff' }}>
            <Form.Item label="等级名称" name="gradeName" rules={[{ required: true }]}>
              <Input placeholder="等级名称，12个字以内" />
            </Form.Item>
            <Form.Item label="等级说明" name="gradeDesc">
              <TextArea placeholder="请输入，36个字以内" />
            </Form.Item>
            {memberType == 1 && (
              <Form.Item label="所需成长值" required>
                <Form.Item
                  name="exp"
                  rules={[{ required: true, message: '请输入所需成长值' }]}
                  noStyle
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入"
                    min={0}
                    max={9999999}
                    precision={0}
                  />
                </Form.Item>
                <p style={{ marginTop: 12 }}>当前成长值默认为消费1元获得1成长值</p>
              </Form.Item>
            )}
          </PageHeader>
          <PageHeader title="权益礼包" style={{ backgroundColor: '#fff' }}>
            <Row gutter={[4, 4]}>
              <Col offset={2} span={2} className={Css['left-checkbox-box']}>
                <Form.Item noStyle name="pointsRateIsEnable" valuePropName="checked">
                  <Checkbox className={Css['left-checkbox']} />
                </Form.Item>
              </Col>
              <Col span={20}>
                {'积分回馈倍率 '}
                <Form.Item noStyle name="pointsRate">
                  <InputNumber min={1.0} max={99999.99} precision={2} />
                </Form.Item>
                {' 倍'}
              </Col>
              <Col offset={4} span={20}>
                积分 = 消费获取积分 * 积分回馈倍率
              </Col>
            </Row>
          </PageHeader>
          <PageHeader title="会员卡面" style={{ backgroundColor: '#fff' }}>
            <Row gutter={[4, 4]}>
              <Col offset={1} span={17}>
                <Form.Item label="背景" name="background" rules={[{ required: true }]}>
                  <Dropdown overlay={itemMenu}>
                    <a onClick={e => e.preventDefault()}>
                      <Space>
                        <div
                          style={{
                            width: '100px',
                            height: '40px',
                            border: '1px solid #eee',
                            borderRadius: '5px',
                            background: defaultColor,
                          }}
                        />
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </Form.Item>
                <Form.Item label="显示会员等级" name="showlevel" required>
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="显示会员积分" name="showignel" required>
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="显示会员升级规则" name="showRule" required>
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <div
                  style={{
                    backgroundImage:`${defaultColor}`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: '100% 100%',
                    border: '1px solid #eee',
                    height: '130px',
                    borderRadius: '5px',
                    padding: '15px',
                    color: '#fff',
                  }}
                >
                  <div style={{ lineHeight: '30px' }}>白银会员</div>
                  <div style={{ lineHeight: '30px' }}>0积分</div>
                  <div style={{ lineHeight: '30px' }}>再获得266成长值可升级</div>
                </div>
              </Col>
            </Row>
          </PageHeader>
          <PageHeader title="等级礼包" style={{ backgroundColor: '#fff' }}>
            <Row gutter={[4, 4]}>
              <Col offset={2} span={2} className={Css['left-checkbox-box']}>
                <Form.Item noStyle name="presentPointsIsEnable" valuePropName="checked">
                  <Checkbox className={Css['left-checkbox']} />
                </Form.Item>
              </Col>{' '}
              <Col span={20}>
                {'赠送积分，赠送 '}
                <Form.Item noStyle name="presentPoints">
                  <InputNumber min={0} max={99999} precision={0} />
                </Form.Item>
                {' 积分'}
              </Col>
              <Col offset={2} span={2} className={Css['left-checkbox-box']}>
                <Form.Item noStyle name="presentCouponIsEnable" valuePropName="checked">
                  <Checkbox className={Css['left-checkbox']} />
                </Form.Item>
              </Col>
              <Col span={20}>赠送优惠券</Col>
              <Col offset={4} span={20}>
                <Button type="primary" onClick={AddCoupon}>
                  添加优惠券
                </Button>
              </Col>
              <Col offset={4} span={16}>
                <Table
                  dataSource={couponsList}
                  rowKey="stockId"
                  columns={Columns.CouponsScope({ delCoupons, operationIs })}
                />
              </Col>
              <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Space>
                  <Link to="/users/levelList">
                    <Button>取消</Button>
                  </Link>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Space>
              </Col>
            </Row>
          </PageHeader>
          <SetCouponsModal
            visible={addVisible}
            selectedList={couponsList.map(i => i.stockId)}
            setVisible={setAddVisible}
            setCoupons={setCoupons}
          />
        </Form>
      </Spin>
    </Panel>
  );
});
