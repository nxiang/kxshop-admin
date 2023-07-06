import React, { useEffect, useState, Fragment } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Form,
  Divider,
  Checkbox,
  Input,
  InputNumber,
  Upload,
  Space,
  Table,
  Modal,
  Typography
} from 'antd';
import { PlusOutlined, SettingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Css from './style.module.scss';
import Columns from './columns';
import SetCouponsModal from './SetCouponsModal';
import GoodsDetail from '../AddGoods/module/GoodsDetail';
import { history } from '@umijs/max';
import { classOption } from '@/services/itemClass';
import { useLocation } from '@/utils/compatible';

const { confirm } = Modal;
const { Text } = Typography;

const StepOne = props => {
  // const query = props.location.query;
  const {query} = useLocation();
  const operationIs = true;
  const {
    productInfo,
    onNext,
    stepOneParams,
    setStepOneParams,
    alterStockIds,
    // history,
    onSubmit,
  } = props;
  const [form] = Form.useForm();
  // 选择商品类型id
  const [classId, setClassId] = useState(1);
  // 选择商品类型列表
  const [classInfo, setClassInfo] = useState([]);

  useEffect(() => {
    if (productInfo) {
      if (productInfo.classId == 4) {
        setCouponsList([productInfo.couponStock]);
      }
      classOptionApi(productInfo.classId);
      fillForm(productInfo);
    }
  }, [productInfo]);

  useEffect(() => {
    if (query.type == 'add') {
      classOptionApi('');
      fillForm(stepOneParams);
    }
  }, []);

  const classOptionApi = classId => {
    classOption({
      itemType: 1,
    }).then(res => {
      if (res.success) {
        let classInfo = res.data;
        if (classId) {
          classInfo = [res.data.find(i => i.classId == classId)];
        }
        classInfo.map(item => {
          if (item) {
            if (item.classId == 1) {
              item.desc = '需进行商品配送';
            }
            if (item.classId == 2) {
              item.desc = '支持预约配送';
            }
            if (item.classId == 3) {
              item.desc = '支持预约到店';
            }
            if (item.classId == 4) {
              item.desc = '无需物流配送';
            }
            if (item.classId == 5) {
              item.desc = '无需物流配送';
            }
          }
        });
        classItemFn(classId || 1, classInfo);
      }
    });
  };

  const classItemFn = (classId, classInfo) => {
    // 点击商品分类 获取卖家属性
    // const p = {
    //   classId,
    // };
    // const { classInfo } = this.state;
    classInfo.map(item => {
      if (item.classId == classId) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    setClassId(Number(classId));
    setClassInfo(classInfo);
    // this.sellerAttrs(p);
  };

  const fillForm = data => {
    const newData = {
      itemName: data?.itemName,
      expendPoint: data?.skuList[0].expendPoint,
      linePrice: data?.skuList[0]?.linePrice
        ? query.type == 'add'
          ? data?.skuList[0].linePrice
          : (data?.skuList[0].linePrice / 100).toFixed(2)
        : '',
      storage: data?.skuList[0].storage,
      itemCode: data?.itemCode,
    };
    if (data?.classId == 5) {
      newData.alipayActivityId = data?.alipayActivityId;
    }
    form.setFieldsValue(newData);
    if (Array.isArray(data?.imageList)) {
      setImgList(
        data?.imageList.map((item, index) => ({
          uid: `img-${index}`,
          name: `name-${index}`,
          status: 'done',
          url: item.imageSrc,
        }))
      );
    }
    if (Array.isArray(data?.detail?.detailContentList)) {
      setRichTextDisplay(true);
      console.log('detail=', data?.detail?.detailContentList);
      setEditInfo(data?.detail?.detailContentList);
      const temp = [...data?.detail?.detailContentList];
      setDetailContentList(temp);
    }
  };

  // 图片上传相关
  const [imgList, setImgList] = useState([]);
  const listenImgUpload = file => {
    setImgList([...file.fileList]);
  };
  const beforeImgUpload = file => {
    const fileSize = file.size / 1024;
    if (fileSize > 500) {
      message.error('图片不能大于500KB！');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 富文本相关
  const [richTextDisplay, setRichTextDisplay] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [detailContentList, setDetailContentList] = useState([]);
  const [editInfo, setEditInfo] = useState([]);

  const handeleRichTextDisplay = e => {
    setRichTextDisplay(e.target.checked);
  };

  const detailContentListFn = e => {
    setDetailContentList(e);
  };

  const showDetailFn = e => {
    setShowBtn(e);
  };

  // 下一步
  const submit = () => {
    if (classId == 4 && couponsList?.length == 0) {
      return message.error('优惠券不能为空');
    }
    if (imgList.length <= 0) {
      return message.error('请上传图片!');
    }
    form.validateFields().then(values => {
      if (!values.expendPoint) return message.error('请填写兑换价格!');
      if (!values.linePrice) return message.error('请填写划线价!');
      console.log(imgList);
      console.log('detailContentList=', detailContentList);
      // let temp = [...detailContentList, ...editInfo];
      // console.log(temp);
      let params = {
        itemType: 1,
        couponStockId: classId == 4 ? couponsList[0].stockId : undefined,
        classId,
        itemName: classId == 4 ? couponsList[0].couponName : values.itemName,
        imageList: imgList.map((item, index) => ({
          type: 0,
          mainFlag: index === 0,
          imageSrc: item?.response ? item.response.data.url : item.url,
        })),
        skuList: [{ ...values, salePrice: 0 }],
        detail: {
          detailContentList:
            richTextDisplay && query.type == 'add'
              ? detailContentList
              : richTextDisplay && query.type == 'update'
              ? editInfo
              : [],
        },
        attributeList: [],
        itemCode: values.itemCode,
      };

      if (classId == 5) {
        params = {
          ...params,
          alipayActivityId: values.alipayActivityId,
        };
      }

      console.log('richTextDisplay=', richTextDisplay);
      console.log('detailContentList=', detailContentList);
      console.log('setEditInfo=', editInfo);
      // setStepOneParams(params);
      onSubmit(params);
      // onNext(1);
      // onNext(2);
    });
  };

  // 优惠券相关
  // 新增优惠券弹框阀门
  const [addVisible, setAddVisible] = useState(false);
  // 选中优惠券列表
  const [couponsList, setCouponsList] = useState([]);

  const setCoupons = list => {
    setAddVisible(false);
    setCouponsList(list);
  };

  // 删除优惠券
  const delCoupons = stockId => {
    confirm({
      title: '删除优惠券',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '确定删除该优惠券吗？',
      okType: 'danger',
      onOk() {
        setCouponsList([]);
        message.success('优惠券删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <>
      <Form form={form} labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} labelAlign="left">
        <div className={Css.commonTitle}>商品分类</div>
        <div className={Css.commonTitleRowBox}>
          <ul className={Css.goodsTypeList}>
            {classInfo && classInfo.length
              ? classInfo.map((item, index) => {
                  return (
                    <li
                      className={item && item.active ? Css['activeItem'] : ''}
                      key={index}
                      onClick={() => classItemFn(item.classId, classInfo)}
                    >
                      {item.className}
                      <div>{item.desc}</div>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
        <div className={Css.commonTitle}>商品基础信息</div>
        {classId == 1 && (
          <Form.Item
            label="商品名称"
            name="itemName"
            rules={[
              { required: true, message: '请输入商品名称' },
              { min: 3, message: '至少3个字!' },
              { max: 50, message: '不超过50个字!' },
            ]}
          >
            <Input style={{ width: 300 }} placeholder="请输入商品名称" />
          </Form.Item>
        )}
        {classId == 4 && (
          <Form.Item label="商品名称" required>
            {couponsList?.length > 0 ? (
              <Fragment>
                <p style={{ marginTop: 6, marginBottom: 12 }}>{couponsList[0].couponName}</p>
                <Table
                  dataSource={couponsList}
                  rowKey="stockId"
                  columns={Columns.CouponsScope({ delCoupons, operationIs })}
                  pagination={false}
                />
              </Fragment>
            ) : (
              <Fragment>
                <p style={{ marginTop: 6, marginBottom: 12, color: 'rgb(153, 153, 153)' }}>
                  展示选择的优惠券名称
                </p>
                <Button type="primary" onClick={setAddVisible}>
                  选择优惠券
                </Button>
              </Fragment>
            )}
          </Form.Item>
        )}
        {classId == 5 && (
          <Fragment>
            <Form.Item
              label="活动ID"
              name="alipayActivityId"
              rules={[{ required: true, message: '请输入支付宝券的活动ID' }]}
            >
              <Input style={{ width: 300 }} placeholder="请输入支付宝券的活动ID" />
            </Form.Item>
            <Form.Item
              label="商品名称"
              name="itemName"
              rules={[
                { required: true, message: '请输入商品名称' },
                { min: 3, message: '至少3个字!' },
                { max: 12, message: '不超过12个字!' },
              ]}
            >
              <Input style={{ width: 300 }} placeholder="请输入商品名称" />
            </Form.Item>
          </Fragment>
        )}
        <Form.Item label={<div className="g__will_choose">商品图片</div>}>
          <Upload
            accept=".jpg,.jpeg,.png"
            fileList={imgList}
            name="file"
            action="/proxy/cloud/oss/upload?type=goods"
            listType="picture-card"
            onChange={listenImgUpload}
            beforeUpload={beforeImgUpload}
          >
            {imgList.length < 5 ? (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>选择图片</div>
              </div>
            ) : null}
          </Upload>
          <div style={{ color: '#999' }}>主图大小500K以内,可上传5张支持jpg.jpeg.png图片</div>
        </Form.Item>
        <Form.Item
          label={<div className="g__will_choose">兑换价格</div>}
          rules={[{ required: true, message: '请输入兑换价格' }]}
          style={{ marginBottom: 0 }}
        >
          <Space>
            <Form.Item name="expendPoint">
              <InputNumber
                precision={0}
                style={{ width: 300 }}
                placeholder="请输入兑换价格"
                controls={false}
                addonAfter="积分"
                min={0}
                max={10000000}
              />
            </Form.Item>
            <div style={{ marginTop: '-22px' }}>积分</div>
          </Space>
        </Form.Item>
        <Form.Item
          label={<div className="g__will_choose">划线价</div>}
          rules={[{ required: true, message: '请输入划线价' }]}
          style={{ marginBottom: 0 }}
        >
          <Space>
            <Form.Item name="linePrice">
              <InputNumber
                precision={2}
                style={{ width: 300 }}
                placeholder="请输入划线价"
                controls={false}
                min={0}
                max={10000000}
              />
            </Form.Item>
            <div style={{ marginTop: '-22px' }}>元</div>
          </Space>
        </Form.Item>
        <Form.Item label="库存" required>
          <Space>
            <Form.Item name="storage" noStyle rules={[{ required: true, message: '请输入库存' }]}>
              <InputNumber
                style={{ width: 300 }}
                placeholder="请输入库存"
                controls={false}
                min={0}
                max={99999}
              />
            </Form.Item>
            {
              classId === 5 && <Text type="secondary">注意：库存数不超过制券数量</Text>
            }
          </Space>
        </Form.Item>
        <Form.Item label="商品编码" name="itemCode">
          <Input style={{ width: 300 }} placeholder="请输入商品编码" />
        </Form.Item>
        <Form.Item label="物流方式">包邮</Form.Item>
      </Form>
      <Divider />
      <Checkbox
        checked={richTextDisplay}
        onChange={handeleRichTextDisplay}
        style={{ marginBottom: 24 }}
      >
        添加商品详情
      </Checkbox>
      {richTextDisplay && (
        <GoodsDetail
          detailEditList={editInfo || []}
          showDetailFn={showDetailFn}
          detailContentList={detailContentListFn}
        />
      )}
      <Divider />
      <Row justify="center" align="middle">
        <Col style={{ marginRight: 24 }}>
          {/* <Button type="primary" onClick={submit}>下一步</Button> */}
          <Button type="primary" onClick={submit}>
            发布
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => {
              history.go(-1)
            }}
          >
            取消
          </Button>
        </Col>
      </Row>
      <SetCouponsModal
        visible={addVisible}
        selectedList={[alterStockIds]}
        setVisible={setAddVisible}
        setCoupons={setCoupons}
      />
    </>
  );
};

export default StepOne;
