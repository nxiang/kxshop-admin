import react, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import Panel from '@/components/Panel';
import {
  Row,
  Col,
  PageHeader,
  Form,
  Button,
  Modal,
  Input,
  DatePicker,
  Upload,
  Space,
  InputNumber,
  Radio,
  Checkbox,
  message,
  Select,
  Table,
} from 'antd';
import { LoadingOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import moment from 'moment';
import Css from './AddInvitation.module.scss';
import ActivityAdd from '../ActivityAdd/ActivityAdd';

import { idGenerate, inviteActivitySave } from '@/services/activity';
import { scPick } from '@/services/activity';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;

// 上传文件限制
function beforeUpload(file) {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('仅支持jpg、png、jpeg格式');
    return false;
  }
  const isLt40M = file.size / 1024 / 1024 < 2;
  if (!isLt40M) {
    message.error('文件不能大于2M');
    return false;
  }
  return file;
}

export default connect(({ activitys }) => ({
  activitys,
}))(props => {
  const { dispatch, activitys } = props;
  const [form] = Form.useForm();
  // 活动信息
  const [activityInfo, setActivityInfo] = useState({
    activityId: undefined,
    activityName: undefined,
    beginTime: undefined,
    endTime: undefined,
    backgroundImage: 'https://img.kxll.com/kxshop_uniapp/yqyl/yqyl-modal_bg.jpg',
    backgroundLoading: false,
    buttonImage: 'https://img.kxll.com/kxshop_uniapp/yqyl/yqyl-btn.png',
    buttonLoading: false,
    ruleDesc: undefined,
    availableClientIds: undefined,
  });
  // 优惠券相关
  const [shareCoupon, setShareCoupon] = useState(false);
  const [checkVal, setcheckVal] = useState([]); //已选择渠道
  const [checkTime, setcheckTime] = useState([]); //已选择时间
  const [couponShow, setcouponShow] = useState(false); //选择优惠券显示隐藏
  const [tableData, settableData] = useState({ rows: [] }); //选择优惠券数据列表

  useEffect(() => {
    idGenerateApi();
  }, []);

  // 获取活动id
  const idGenerateApi = () => {
    idGenerate().then(res => {
      if (res.success) {
        dispatch({
          type: 'activitys/phone data',
          payload: {
            activityType: 1,
            backgroundImage: 'https://img.kxll.com/zhuangchen_wap/bgnew.png',
            id: 1,
            templateName: '大转盘',
            sampleImage: 'https://img.kxll.com/admin_manage/draw-corona.png',
            titleImage: 'https://img.kxll.com/zhuangchen_wap/titlenew.png',
          },
        });
        setActivityInfo({
          ...activityInfo,
          activityId: res.data,
        });
        dispatch({
          type: 'activitys/activity id',
          payload: res.data,
        });
      }
    });
  };

  // 上传文件为空dom
  const UploadButton = props => {
    const { loading } = props;
    return (
      <div className={Css['upload-button-box']}>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
  };

  // 上传文件
  const UploadProps = {
    name: 'file',
    action: '/proxy/cloud/oss/upload?type=marketing',
    beforeUpload: beforeUpload,
    showUploadList: false,
    response: '{"status": "success"}',
  };

  // 上传文件过程
  const uploadChange = (info, uploadName, uploading) => {
    if (info.file.status === 'uploading') {
      setActivityInfo({
        ...activityInfo,
        [uploading]: true,
      });
    } else if (info.file.status === 'done') {
      if (info.file.response) {
        if (info.file.response.errorCode === '0') {
          message.success(`${info.file.name} 上传成功`);
          setActivityInfo({
            ...activityInfo,
            [uploading]: false,
            [uploadName]: info.file.response.data.url,
          });
        } else {
          message.error(`${info.file.name} 上传失败`);
          setActivityInfo({
            ...activityInfo,
            [uploading]: false,
          });
        }
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
      setActivityInfo({
        ...activityInfo,
        [uploading]: false,
      });
    }
  };

  //如果已选择优惠券，需提示修改会清空选择状态
  const confirmFn = (e, text) => {
    console.log(e);
    if (shareCoupon) {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `调整${
          text == 'time' ? '活动时间' : '活动渠道'
        }后请重新选择对应渠道的优惠券，是否确定调整?`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if (text == 'checkbox') {
            setcheckVal(e);
            setShareCoupon(false);
          } else if (text == 'time') {
            setcheckTime(e);
            setShareCoupon(false);
          }
        },
        onCancel() {
          if (text == 'checkbox') {
            form.setFieldsValue({ availableClientIds: checkVal });
          } else if (text == 'time') {
            form.setFieldsValue({ activityTime: checkTime });
          }
        },
      });
    } else {
      if (text == 'checkbox') {
        setcheckVal(e);
      } else if (text == 'time') {
        setcheckTime(e);
      }
    }
  };

  const modalShow = type => {
    console.log(form.getFieldValue('availableClientIds'), form.getFieldValue('activityTime'));
    if (!form.getFieldValue('availableClientIds') || !form.getFieldValue('activityTime')) {
      message.error('请先选择活动结束时间与活动渠道');
      return;
    }
    if (!couponShow) {
      initTableData();
    } else {
      setcouponShow(false);
    }
  };

  const initTableData = async (page = 1) => {
    const info = await scPick({
      clientIds: form.getFieldValue('availableClientIds').join(),
      page: page ? page : 1,
      activityBeginTime: moment(form.getFieldValue('activityTime')[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      activityEndTime: moment(form.getFieldValue('activityTime')[1]).format('YYYY-MM-DD HH:mm:ss'),
    });
    if (info) {
      settableData(info.data);
      setcouponShow(true);
    }
  };

  const changePage = e => {
    initTableData(e);
  };

  const pickCoupon = e => {
    setShareCoupon(e);
    setcouponShow(false);
  };

  // 保存活动
  const handleSearch = newValue => {
    console.log(newValue);
    console.log(activityInfo);
    console.log(shareCoupon);
    if (!activityInfo.backgroundImage) {
      message.warning('请设置页面背景图');
      return;
    }
    if (!activityInfo.buttonImage) {
      message.warning('请设置分享按钮图');
      return;
    }
    if (newValue.inviteeAward == '1' && !shareCoupon) {
      message.warning('请设置被邀请人优惠券奖励');
      return;
    }
    if (activitys.losingLotteryName == '') {
      message.warning('请设置未中奖设置-名称');
      return;
    }
    if (activitys.losingLotteryImage == '') {
      message.warning('请设置未中奖设置-图片');
      return;
    }
    if (activitys.losingLotteryHint == '') {
      message.warning('请设置未中奖设置-提示语');
      return;
    }
    let data = {
      activityInfo: {
        activityId: activityInfo.activityId,
        activityName: newValue.activityName,
        beginTime: moment(newValue.activityTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(newValue.activityTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        backgroundImage: activityInfo.backgroundImage,
        buttonImage: activityInfo.buttonImage,
        ruleDesc: newValue.ruleDesc,
        availableClientIds: newValue.availableClientIds,
      },
      activityRule: {
        inviterAwardThreshold: newValue.assistNumber,
        inviterAward: {
          type: 5,
          value: newValue.inviterAwardValue,
          lotteryActivityConfig: {
            titleImage: activitys.phoneData.titleImage,
            backgroundImage: activitys.phoneData.backgroundImage,
            losingLotteryName: activitys.losingLotteryName,
            losingLotteryImage: activitys.losingLotteryImage,
            losingLotteryHint: activitys.losingLotteryHint,
          },
        },
        inviteeAward: {
          type: newValue.inviteeAward,
          value: shareCoupon ? shareCoupon.stockId : undefined,
        },
      },
    };
    inviteActivitySave(data).then(res => {
      if (res.success) {
        message.success('创建活动成功');
        history.go(-1)
      }
    });
  };

  return (
    <Panel title="邀请有礼" content="邀请好友注册成功获得对应奖励">
      <Form
        form={form}
        initialValues={{
          inviteeAward: '1',
          availableClientIds: ['2'],
        }}
        onFinish={handleSearch}
      >
        <PageHeader style={{ background: '#fff' }} title="活动配置">
          <Row>
            <Col offset={2} span={12}>
              <Form.Item
                label="活动名称"
                name="activityName"
                rules={[{ required: true, message: '请输入活动名称!' }]}
              >
                <Input placeholder="请输入活动名称" max={32} />
              </Form.Item>
            </Col>
            <Col offset={2} span={12}>
              <Form.Item
                label="活动时间"
                name="activityTime"
                rules={[{ required: true, message: '请输入活动时间!' }]}
              >
                <RangePicker showTime onChange={e => confirmFn(e, 'time')} />
              </Form.Item>
            </Col>
            <Col offset={2} span={12}>
              <Form.Item label="页面背景" required>
                <Upload
                  {...UploadProps}
                  onChange={info => uploadChange(info, 'backgroundImage', 'backgroundLoading')}
                >
                  {activityInfo.backgroundImage ? (
                    <img
                      style={{ width: 187, cursor: 'pointer' }}
                      src={activityInfo.backgroundImage}
                    />
                  ) : (
                    <UploadButton loading={activityInfo.backgroundLoading} />
                  )}
                </Upload>
                <div
                  className={Css['set-default']}
                  onClick={() =>
                    setActivityInfo({
                      ...activityInfo,
                      backgroundImage: 'https://img.kxll.com/kxshop_uniapp/yqyl/yqyl-modal_bg.jpg',
                      backgroundLoading: false,
                    })
                  }
                >
                  恢复默认
                </div>
                <p>只支持.jpg、.png格式，图片尺寸750*2000，大小不超过2M</p>
              </Form.Item>
            </Col>
            <Col offset={2} span={12}>
              <Form.Item label="分享按钮" required>
                <Upload {...UploadProps} onChange={info => uploadChange(info, 'buttonImage')}>
                  {activityInfo.buttonImage ? (
                    <img style={{ width: 187, cursor: 'pointer' }} src={activityInfo.buttonImage} />
                  ) : (
                    <UploadButton loading={activityInfo.buttonImage} />
                  )}
                </Upload>
                <div
                  className={Css['set-default']}
                  onClick={() =>
                    setActivityInfo({
                      ...activityInfo,
                      buttonImage: 'https://img.kxll.com/kxshop_uniapp/yqyl/yqyl-btn.png',
                      buttonLoading: false,
                    })
                  }
                >
                  恢复默认
                </div>
                <p>只支持.jpg、.png格式，图片尺寸411*107，大小不超过2M</p>
              </Form.Item>
            </Col>
            <Col offset={2} span={12}>
              <Form.Item label="活动说明" shouldUpdate rules={[{ required: true }]}>
                {({ getFieldValue }) => {
                  return (
                    <>
                      <Form.Item
                        name="ruleDesc"
                        noStyle
                        rules={[{ required: true, message: '请输入活动说明!' }]}
                      >
                        <TextArea placeholder="请输入活动说明" maxLength={300} />
                      </Form.Item>
                      <div style={{ textAlign: 'right' }}>
                        {getFieldValue('ruleDesc')?.length
                          ? `${getFieldValue('ruleDesc').length}/300`
                          : '0/300'}
                      </div>
                    </>
                  );
                }}
              </Form.Item>
            </Col>
            <Col offset={2} span={12}>
              <Form.Item
                label="活动渠道"
                name="availableClientIds"
                rules={[{ required: true, message: '请选择活动渠道!' }]}
              >
                <Checkbox.Group onChange={e => confirmFn(e, 'checkbox')}>
                  <Checkbox disabled value="1">
                    支付宝小程序
                  </Checkbox>
                  <Checkbox value="2">微信小程序</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </PageHeader>
        <PageHeader style={{ background: '#fff' }} title="活动规则">
          <Row>
            <Col offset={1} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <p style={{ fontWeight: 600 }}>邀请人获奖励门槛</p>
            </Col>
            <Col offset={2} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <Form.Item label="每邀请" required>
                <Space>
                  <Form.Item
                    name="assistNumber"
                    noStyle
                    rules={[{ required: true, message: '请输入门槛人数!' }]}
                  >
                    <InputNumber max={99} min={1} placeholder="1-99整数" />
                  </Form.Item>
                  人，获取奖励
                </Space>
              </Form.Item>
            </Col>
            <Col offset={1} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <p style={{ fontWeight: 600 }}>邀请人奖励</p>
            </Col>
            <Col offset={2} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <Radio.Group defaultValue="1">
                <Radio value="1">抽奖机会</Radio>
                <Radio value="2" disabled>
                  优惠券
                </Radio>
              </Radio.Group>
            </Col>
            <Col>{activitys.activityId && <ActivityAdd addType="component" />}</Col>
            <Col offset={2} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <Form.Item
                label="达标可获得抽奖次数"
                name="inviterAwardValue"
                rules={[{ required: true, message: '请输入达标可获得抽奖次数!' }]}
              >
                <InputNumber max={99} min={1} placeholder="1-99整数" />
              </Form.Item>
            </Col>
            <Col offset={1} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <p style={{ fontWeight: 600 }}>被邀请人注册奖励</p>
            </Col>
            <Col offset={2} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <Form.Item name="inviteeAward">
                <Radio.Group
                  onChange={() => {
                    setShareCoupon(false);
                  }}
                >
                  <Radio value="1">优惠券</Radio>
                  <Radio value="0">无奖励</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.inviteeAward !== currentValues.inviteeAward
              }
              noStyle
            >
              {({ getFieldValue }) =>
                getFieldValue('inviteeAward') === '1' ? (
                  <Col
                    offset={2}
                    span={12}
                    style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}
                  >
                    {shareCoupon ? (
                      <span style={{ display: 'block' }}>
                        <span>{shareCoupon.couponName} &nbsp;</span>
                        <Button
                          className={Css.couponBtn}
                          type="primary"
                          onClick={() => modalShow(0)}
                        >
                          修改
                        </Button>
                      </span>
                    ) : (
                      <Button className={Css.couponBtn} type="primary" onClick={() => modalShow(0)}>
                        选择优惠券
                      </Button>
                    )}
                  </Col>
                ) : null
              }
            </Form.Item>

            <Col offset={2} span={12} style={{ height: 32, marginBottom: 24, lineHeight: '32px' }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Col>
          </Row>
        </PageHeader>
      </Form>
      <Modal
        title="选择优惠券"
        width={800}
        visible={couponShow}
        onOk={modalShow}
        onCancel={modalShow}
      >
        <p className={Css.btnMsg}>
          仅展示派券方式为<span style={{ color: '#F72A37' }}>活动领取的生效中</span>
          的优惠券，优惠券可用渠道需和活动渠道一致
        </p>
        <p style={{ color: '#F72A37' }}>优惠券可领取时间需大于或等于邀请有礼活动时间</p>
        <Table
          rowKey="stockId"
          dataSource={tableData.rows}
          pagination={{
            current: tableData.current,
            pageSize: tableData.pageSize,
            total: tableData.total,
            showSizeChanger: false,
            onChange: changePage,
          }}
        >
          <Column align="left" title="券名称" dataIndex="couponName" key="couponName" />
          <Column align="left" title="券备注" dataIndex="comment" key="comment" />
          <Column
            align="left"
            title="可用渠道"
            key="clientIdList"
            render={e => {
              return e.clientIdList.map(val => {
                return <span>{val.clientName} </span>;
              });
            }}
          />
          <Column
            align="left"
            title="操作"
            key="action"
            render={e => {
              return <a onClick={pickCoupon.bind(this, e)}>选择</a>;
            }}
          />
        </Table>
      </Modal>
    </Panel>
  );
});
