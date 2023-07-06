import { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import Css from './NewShareCoupon.module.scss';
import {
  Input,
  Button,
  DatePicker,
  InputNumber,
  Checkbox,
  Table,
  message,
  Modal,
  Form,
  Switch,
  Popover,
} from 'antd';
import {
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import KxUpload from '@/components/KxUpload/KxUpload';
import moment from 'moment';
import Panel from '@/components/Panel';
import { newCoupon, detail, clientList } from '@/services/coupon';
import { scAdd, scPick } from '@/services/activity';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Column } = Table;
const { confirm } = Modal;

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}

export default function NewShareCoupon(props) {
  const [visible, setvisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [couponShow, setcouponShow] = useState(false); //选择优惠券显示隐藏
  const [tableData, settableData] = useState({ rows: [] }); //选择优惠券数据列表
  const [tablePage, settablePage] = useState(1); //选择优惠券数据列表页数
  const [tableType, settableType] = useState(0); //选择优惠券列表状态：0:发起人；1助力人
  const [shareCouponStock, setshareCouponStock] = useState(false); //已选择优惠券数据-发起人
  const [assistCouponStock, setassistCouponStock] = useState(0); //已选择优惠券数据-助力人
  const [helpShow, sethelpShow] = useState(true); //助理人优惠券按钮显示隐藏
  const [couponAvailableClients, setcouponAvailableClients] = useState([
    { label: '支付宝', value: 1 },
    { label: '微信', value: 2 },
  ]); //默认活动渠道
  const [checkVal, setcheckVal] = useState([]); //已选择渠道
  const [shareImage, setshareImage] = useState(
    'https://img.kxll.com/kxshop_uniapp/shareCoupon/we.jpg'
  ); //转发图片
  const [bannerImage, setbannerImage] = useState(
    'https://img.kxll.com/admin_manage/nisimg_1_2020522.jpg'
  ); //活动banner图
  const [form] = Form.useForm();

  const modalShow = type => {
    settableType(type);
    console.log(form.getFieldValue('clientIds'), form.getFieldValue('beginTime'));
    if (!form.getFieldValue('clientIds') || !form.getFieldValue('beginTime')) {
      message.error('请先选择活动结束时间与活动渠道');
      return;
    }
    settablePage(1);
    if (!couponShow) {
      initTableData();
    } else {
      setcouponShow(false);
    }
  };
  //提交表单
  const onFinish = async values => {
    if (!shareCouponStock) {
      message.error('请选择活动优惠券');
      return;
    }
    if (helpShow && !assistCouponStock) {
      message.error('请选择活动优惠券');
      return;
    }
    const opt = {};
    opt.activityInfo = {
      activityName: values.activityName,
      beginTime: moment(values.beginTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(values.beginTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      shareTitle: values.shareTitle,
      shareImage,
      bannerImage,
      ruleDesc: values.ruleDesc,
    };
    opt.activityRule = {
      availableClientIds: values.clientIds,
      shareCouponStockId: shareCouponStock.stockId,
      assistCouponStockId: assistCouponStock.stockId ? assistCouponStock.stockId : 0,
      assistNumber: values.assistNumber,
      timeLimit: values.timeLimit,
    };
    setloading(true);
    console.log('form:', opt);
    const info = await scAdd(opt);
    if (info) {
      message.success('发布成功');
      history.push(`/operation/activitys/shareCoupon/list`);
    }
    setloading(false);
  };

  //初始化可用渠道
  const init = async () => {
    const info = await clientList();
    if (info && info.data.length > 0) {
      const newlist = [];
      const deafaultCheck = [];
      info.data.filter(val => {
        const { clientName: label, clientId: value } = val;
        newlist.push({ label, value });
        deafaultCheck.push(value);
      });
      setcouponAvailableClients(newlist);
      setcheckVal(deafaultCheck);
    } else {
      setvisible(true);
    }
  };
  const goback = () => {
    history.push(`/operation/activitys/shareCoupon/list`);
  };
  useEffect(() => {
    init();
  }, []);
  const beforeUpload = file => {
    const isImg =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const size = file.size / 1024 / 1024 < 0.5;
    if (!isImg) {
      message.warning('仅支持jpg、png图片格式');
      return false;
    }
    if (!size) {
      message.warning('视频大小不能大于500k');
      return false;
    }
    return file;
  };
  //如果已选择优惠券，需提示修改会清空选择状态
  const confirmFn = e => {
    if (shareCouponStock || assistCouponStock) {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '调整活动渠道后请重新选择对应渠道的优惠券，是否确定调整?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          setcheckVal(e);
          setshareCouponStock(false);
          setassistCouponStock(0);
        },
        onCancel() {
          form.setFieldsValue({ clientIds: checkVal });
        },
      });
    } else {
      setcheckVal(e);
    }
  };
  useEffect(() => {
    form.setFieldsValue({ clientIds: checkVal });
  }, [checkVal]);
  const initTableData = async () => {
    const info = await scPick({
      clientIds: form.getFieldValue('clientIds').join(),
      page: tablePage,
      activityBeginTime: moment(form.getFieldValue('beginTime')[0]).format('YYYY-MM-DD HH:mm:ss'),
      activityEndTime: moment(form.getFieldValue('beginTime')[1]).format('YYYY-MM-DD HH:mm:ss'),
    });
    if (info) {
      settableData(info.data);
      setcouponShow(true);
    }
  };
  const changePage = e => {
    settablePage(e);
    initTableData();
  };
  const pickCoupon = e => {
    if (tableType) {
      setassistCouponStock(e);
    } else {
      setshareCouponStock(e);
    }
    setcouponShow(false);
  };
  return (
    <Panel title="分享领券" content="裂变式的营销派券方式，帮助商家快速派券拓客">
      <Modal title="提示" visible={visible} okText="知道了" onOk={goback} onCancel={goback}>
        <p>暂无可用渠道，无法创建优惠券</p>
      </Modal>
      <div className={Css['AddCoupon']}>
        <Form labelCol={{ span: 3, offset: 0 }} form={form} onFinish={onFinish}>
          <div className={Css['CouponBase']}>
            <div className={Css['title']}>活动信息</div>
            <Form.Item
              label="活动名称"
              name="activityName"
              rules={[{ required: true, message: '活动名称3-20个字以内', max: 20, min: 3 }]}
            >
              <Input placeholder="3-20个字以内" />
            </Form.Item>
            <Form.Item
              label="活动时间"
              name="beginTime"
              className={Css.dateBox}
              rules={[{ required: true, message: '请选择时间' }]}
            >
              <RangePicker disabledDate={disabledDate} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item label="转发标题">
              <Form.Item
                name="shareTitle"
                initialValue="我在这里买好物，帮我助力领券更划算"
                rules={[{ required: true, message: '转发活动标题5-18个字', max: 18, min: 5 }]}
                noStyle
              >
                <Input placeholder="5-20个字以内" />
              </Form.Item>
              <Popover
                content={<img src="https://img.kxll.com/kxshop_uniapp/shareCoupon/me@1x.png" />}
              >
                <InfoCircleOutlined style={{ marginLeft: '5px' }} />
              </Popover>
            </Form.Item>
            <Form.Item label="转发图片">
              <KxUpload
                beforeUpload={beforeUpload.bind(this)}
                onChange={e => {
                  console.log(e);
                  setshareImage(e.url);
                }}
              >
                <div className={Css.iconBtn}>
                  <img src={shareImage} />
                  <div className={Css.iconTxt}>
                    <CloudUploadOutlined />
                    &nbsp;替换默认
                  </div>
                </div>
              </KxUpload>
              <p className={Css.btnMsg}>图片大小500K以内，支持JPG、PNG格式，建议长宽比 5:4</p>
            </Form.Item>
            <Form.Item label="活动banner图">
              <KxUpload
                beforeUpload={beforeUpload.bind(this)}
                onChange={e => {
                  setbannerImage(e.url);
                  console.log(e);
                }}
              >
                <div className={Css.iconBtn} style={{ width: '250px', height: '110px' }}>
                  <img src={bannerImage} />
                  <div className={Css.iconTxt}>
                    <CloudUploadOutlined />
                    &nbsp;替换默认
                  </div>
                </div>
              </KxUpload>
              <p className={Css.btnMsg}>图片大小500K以内，支持JPG、PNG格式，建议尺寸650*300</p>
            </Form.Item>
          </div>
          <div className={Css['CouponBase']}>
            <div className={Css['title']}>活动规则</div>
            <Form.Item
              label="活动渠道"
              name="clientIds"
              rules={[{ required: true, message: '请选择活动渠道' }]}
            >
              <Checkbox.Group
                onChange={confirmFn}
                className={Css['availableItems']}
                options={couponAvailableClients}
              />
            </Form.Item>
            <Form.Item label="活动优惠券">
              {shareCouponStock ? (
                <span style={{ display: 'block', marginTop: '8px' }}>
                  <span>{shareCouponStock.couponName} &nbsp;</span>
                  <Button
                    className={Css.couponBtn}
                    type="primary"
                    onClick={modalShow.bind(this, 0)}
                  >
                    修改
                  </Button>
                </span>
              ) : (
                <Button className={Css.couponBtn} type="primary" onClick={modalShow.bind(this, 0)}>
                  选择优惠券
                </Button>
              )}

              <p className={Css.btnMsg}>
                分享达到指定人数后赠送的优惠券，当所选优惠券领完后活动将自动结束（进行中的活动将失败）
              </p>
            </Form.Item>
            <Form.Item label="助力人优惠券">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked={helpShow}
                onClick={e => {
                  sethelpShow(e);
                }}
              />
              {helpShow && (
                <span style={{ display: 'block', marginTop: '8px' }}>
                  {assistCouponStock ? (
                    <span style={{ display: 'block', marginTop: '8px' }}>
                      <span>{assistCouponStock.couponName} &nbsp;</span>
                      <Button
                        className={Css.couponBtn}
                        type="primary"
                        onClick={modalShow.bind(this, 1)}
                      >
                        修改
                      </Button>
                    </span>
                  ) : (
                    <Button
                      className={Css.couponBtn}
                      type="primary"
                      onClick={modalShow.bind(this, 1)}
                    >
                      选择优惠券
                    </Button>
                  )}
                  <p className={Css.btnMsg}>
                    助力人助力后获得的优惠券，设置助力优惠券有利于促进好友助力，增加裂变速度
                  </p>
                </span>
              )}
            </Form.Item>
            <Form.Item label="助力人数">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入正确的助力人数',
                  },
                ]}
                noStyle
                name="assistNumber"
              >
                <InputNumber
                  min={1}
                  max={50}
                  style={{ width: '297px' }}
                  placeholder="领券需要助力的人数，1-50人，不含发起人"
                />
              </Form.Item>
              &nbsp;&nbsp;人
            </Form.Item>
            <Form.Item label="时间限制">
              <Form.Item
                noStyle
                name="timeLimit"
                rules={[
                  {
                    required: true,
                    message: '请输入正确的时间限制',
                  },
                ]}
              >
                <InputNumber min={1} max={99999} className={Css['input']} placeholder="请输入" />
              </Form.Item>
              &nbsp;&nbsp;分钟
            </Form.Item>
            <Form.Item
              label="活动规则说明"
              name="ruleDesc"
              initialValue={`1、请在指定时间内邀请好友点击后获得优惠券\n2、分享领券成功后，系统会将优惠券发送到您的账户\n3、优惠券数量有限，先完成先得\n4、活动最终解释权归商家所有\n5、发起的活动可在我的优惠券列表中查看`}
              rules={[
                {
                  required: true,
                  message: '请输入500字以内活动规则说明',
                  max: 500,
                },
              ]}
            >
              <TextArea style={{ width: '468px' }} rows={4} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 3 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                立即发布
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <Modal title="选择优惠券" visible={couponShow} onOk={modalShow} onCancel={modalShow}>
        <p className={Css.btnMsg}>
          仅展示派券方式为<span style={{ color: '#F72A37' }}>活动领取的生效中</span>
          的优惠券，优惠券可用渠道需和活动渠道一致
        </p>
        <p style={{ color: '#F72A37' }}>优惠券可领取时间需大于或等于分享领券活动时间</p>
        <Table
          rowKey={record => record.activityId}
          dataSource={tableData.rows}
          pagination={{
            current: tableData.current,
            pageSize: tableData.pageSize,
            total: tableData.total,
            onChange: changePage.bind(this),
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
}
