import { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import Css from './EvaluationManage.module.scss';
import {
  Input,
  Form,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Table,
  Modal,
  Tooltip,
  Divider,
} from 'antd';
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import Panel from '@/components/Panel';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Image} from 'antd';
import { showBut } from '@/utils/utils';
import {
  evaluateList,
  evaluateHide,
  evaluateTop,
  evaluateNoTop,
  evaluateShow,
} from '@/services/order';

const { RangePicker } = DatePicker;
const { Column } = Table;
const { confirm } = Modal;
console.log('momentxxx',moment)

export default function EvaluationManage() {
  const [visible, setvisible] = useState(false);
  const [tableData, settableData] = useState({ rows: [] }); //数据列表
  const [rowDetail, setrowDetail] = useState({}); //选中的数据详情
  const [formData, setformData] = useState({
    page: 1,
  }); //搜索条件
  const [form] = Form.useForm();
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  async function getData() {
    const info = await evaluateList(formData);
    if (info) {
      settableData(info.data);
    }
  }

  useEffect(() => {
    getData();
  }, [formData]);

  // 筛选
  function onFinish(value) {
    let data = {
      startTime:
        value.time && value.time.length > 1 ? value.time[0].format('YYYY-MM-DD HH:mm:ss') : null,
      endTime:
        value.time && value.time.length > 1 ? value.time[1].format('YYYY-MM-DD HH:mm:ss') : null,
      scores: value.scores,
      status: value.status,
      ordersId: value.ordersId || null,
      goodsName: value.goodsName || null,
      page: 1,
    };
    data = { ...formData, ...data };
    setformData(data);
  }

  // 重置搜索参数
  function reset() {
    form.resetFields();
  }
  //隐藏评价
  function hideEval(r) {
    confirm({
      title: '是否隐藏评价?',
      icon: <ExclamationCircleOutlined />,
      content: '隐藏后的评价仅评论人自己可见，其他顾客不可见',
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        const info = await evaluateHide({ evaluateId: r.evaluateId });
        if (info) {
          getData();
        }
        return info;
      },
      onCancel() {},
    });
  }
  //显示评价
  function cencalHide(r) {
    confirm({
      title: '是否显示评价?',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        const info = await evaluateShow({ evaluateId: r.evaluateId });
        if (info) {
          getData();
        }
        return info;
      },
      onCancel() {},
    });
  }
  //置顶评价
  function topEval(r) {
    confirm({
      title: '是否置顶评价?',
      icon: <ExclamationCircleOutlined />,
      content: '小程序端商品评价列表中置顶显示该评论',
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        const info = await evaluateTop({ evaluateId: r.evaluateId });
        if (info) {
          getData();
        }
        return info;
      },
      onCancel() {},
    });
  }

  //取消置顶评价
  function cencalTop(r) {
    confirm({
      title: '是否取消置顶评价?',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        const info = await evaluateNoTop({ evaluateId: r.evaluateId });
        if (info) {
          getData();
        }
        return info;
      },
      onCancel() {},
    });
  }
  //展示详情
  function showDetail(r) {
    setvisible(true);
    setrowDetail(r);
  }
  function starFn(n) {
    const noNum = n ? 5 - n : 5;
    let box = [];
    for (let i = 0; i < n; i++) {
      box.push(<img className={Css.star} src="https://img.kxll.com/admin_manage/star1.png" />);
    }
    for (let i = 0; i < noNum; i++) {
      box.push(<img className={Css.star} src="https://img.kxll.com/admin_manage/star2.png" />);
    }
    return <span>{box}</span>;
  }
  function slideFn() {
    const n = rowDetail.images || '';
    let slides = n.split('_');
    if (n == '') {
      slides = [];
    }
    const divs = slides.map(val => {
      return (
        <div className={Css.citem}>
          <Image style={{ width: '100%', height: '100%' }} src={val} />
        </div>
      );
    });
    if (slides.length <= 5) {
      return <div className={Css.cbox}>{divs}</div>;
    }
    return <Slider {...settings}>{divs}</Slider>;
  }
  return (
    <Panel title="评价管理" content="查看订单评价">
      <div className={Css['order-list-box']}>
        <div className={Css['list-header-box']}>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={[12, 0]}>
              <Col span={8}>
                <Form.Item label="评价时间" name="time">
                  <RangePicker
                    ranges={{
                      近7天: [moment().subtract('days', 6), moment()],
                      近30天: [moment().subtract('days', 29), moment()],
                    }}
                    showTime
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="评价星级" name="scores">
                  <Select style={{ width: 170 }} placeholder="全部">
                    <Option value={null}>全部</Option>
                    <Option value="1">1星</Option>
                    <Option value="2">2星</Option>
                    <Option value="3">3星</Option>
                    <Option value="4">4星</Option>
                    <Option value="5">5星</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="评价状态" name="status">
                  <Select style={{ width: 170 }} placeholder="全部">
                    <Option value={null}>全部</Option>
                    <Option value="0">显示</Option>
                    <Option value="1">隐藏</Option>
                    <Option value="2">置顶</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[12, 0]}>
              <Col span={8}>
                <Form.Item label="订单编号" name="ordersId">
                  <Input style={{ width: 260 }} placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="商品名称" name="goodsName">
                  <Input style={{ width: 260 }} placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginBottom: 56 }}>
              <Button style={{ marginLeft: 70 }} type="primary" htmlType="submit">
                筛选
              </Button>
              <Button style={{ marginLeft: 12 }} onClick={reset.bind(this)}>
                清空条件
              </Button>
            </Row>
          </Form>
        </div>
        <div className={Css['list-table-box']}>
          <div className={Css['table-top-thread']} />
          <div>
            <Table
              className={Css['order-list-tabler-box']}
              rowKey={record => record.ordersId}
              dataSource={tableData.rows}
              pagination={{
                current: tableData.current,
                pageSize: tableData.pageSize,
                total: tableData.total,
                onChange: page => setformData({ ...formData, ...{ page: page } }),
              }}
            >
              <Column align="center" title="商品名称" dataIndex="goodsName" />
              <Column align="center" title="订单编号" dataIndex="ordersId" />
              <Column align="center" title="买家电话" dataIndex="mobile" />
              <Column align="center" title="评价时间" dataIndex="evaluateTime" />
              <Column
                align="center"
                title="评价内容"
                key="content"
                ellipsis={{
                  showTitle: false,
                }}
                render={record => (
                  <Tooltip arrowPointAtCenter placement="topLeft" title={record.content}>
                    {record.images ? '(带图) ' + record.content : record.content}
                  </Tooltip>
                )}
              />
              <Column
                align="center"
                title="评价星级"
                dataIndex="scores"
                render={record => {
                  const txt = record + '星';
                  switch (record) {
                    case 1:
                      return <span style={{ color: '#F4343F' }}>{txt}</span>;
                    case 2:
                      return <span style={{ color: '#F79226' }}>{txt}</span>;
                    case 3:
                      return <span style={{ color: '#666666' }}>{txt}</span>;
                    case 4:
                      return <span style={{ color: '#5BCB1D' }}>{txt}</span>;
                    case 5:
                      return <span style={{ color: 'green' }}>{txt}</span>;
                    default:
                      return <span style={{ color: '#333333' }}>未评价</span>;
                  }
                }}
              />
              <Column
                align="center"
                title="状态"
                dataIndex="status"
                render={record => {
                  switch (record) {
                    case 0:
                      return <span style={{ color: '#666666' }}>显示</span>;
                    case 1:
                      return <span style={{ color: '#999999' }}>隐藏</span>;
                    case 2:
                      return <span style={{ color: '#5BCB1D' }}>置顶</span>;
                  }
                }}
              />
              <Column
                title={
                  <Tooltip
                    arrowPointAtCenter
                    placement="topLeft"
                    title={
                      <p>
                        置顶：小程序端商品评价列表中置顶显示该评论;
                        <br />
                        隐藏：隐藏后的评价仅评论人自己可见，其他顾客不可见
                      </p>
                    }
                  >
                    <span>
                      操作&nbsp;
                      <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                }
                render={record => {
                  let btns;
                  switch (record.status) {
                    case 0:
                      btns = (
                        <span>
                          {showBut('EvaluationManage', 'EvaluationManage_hide') ? (
                            <a onClick={hideEval.bind(this, record)}>隐藏</a>
                          ) : null}
                          <Divider type="vertical" />
                          {showBut('EvaluationManage', 'EvaluationManage_top') ? (
                            <a onClick={topEval.bind(this, record)}>置顶</a>
                          ) : null}
                          <Divider type="vertical" />
                          {showBut('EvaluationManage', 'EvaluationManage_view') ? (
                            <a onClick={showDetail.bind(this, record)}>详情</a>
                          ) : null}
                        </span>
                      );
                      break;
                    case 1:
                      btns = (
                        <span>
                          {showBut('EvaluationManage', 'EvaluationManage_hide') ? (
                            <a onClick={cencalHide.bind(this, record)}>取消隐藏</a>
                          ) : null}
                          <Divider type="vertical" />
                          {showBut('EvaluationManage', 'EvaluationManage_view') ? (
                            <a onClick={showDetail.bind(this, record)}>详情</a>
                          ) : null}
                        </span>
                      );
                      break;
                    case 2:
                      btns = (
                        <span>
                          {showBut('EvaluationManage', 'EvaluationManage_top') ? (
                            <a onClick={cencalTop.bind(this, record)}>取消置顶</a>
                          ) : null}

                          <Divider type="vertical" />
                          {showBut('EvaluationManage', 'EvaluationManage_view') ? (
                            <a onClick={showDetail.bind(this, record)}>详情</a>
                          ) : null}
                        </span>
                      );
                      break;
                  }
                  return btns;
                }}
              />
            </Table>
            <Modal
              title="评价详情"
              width={740}
              visible={visible}
              footer={null}
              onCancel={() => {
                setvisible(false);
              }}
            >
              <p className={Css.modalMsg} style={{ width: '700px' }}>
                <span>商品名称：</span>
                {rowDetail.goodsName}
              </p>
              <p className={Css.modalMsg}>
                <span>订单编号：</span>
                {rowDetail.ordersId}
              </p>
              <p className={Css.modalMsg}>
                <span>评价时间：</span>
                {rowDetail.evaluateTime}
              </p>
              <p className={Css.modalMsg}>
                <span>买家电话：</span>
                {rowDetail.mobile}
              </p>
              <p className={Css.modalMsg}>
                <span>买家昵称：</span>
                {rowDetail.memberName}
              </p>
              <p className={Css.modalMsg}>
                <span>用户ID：</span>
                {rowDetail.memberId}
              </p>
              <p className={Css.modalMsg} style={{ width: '700px' }}>
                <p>评价内容：</p>
                {rowDetail.content}
              </p>
              <p className={Css.modalMsg}>
                <span>评价星级：</span>
                {starFn(rowDetail.scores)}
              </p>
              {slideFn()}
              <Button
                style={{ margin: '80px -20px 10px 600px' }}
                type="primary"
                onClick={() => {
                  setvisible(false);
                }}
              >
                关闭
              </Button>
            </Modal>
          </div>
        </div>
      </div>
    </Panel>
  );
}
