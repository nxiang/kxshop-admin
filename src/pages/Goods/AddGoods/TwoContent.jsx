import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather'
import {
  dealAdAndImagesAdData,
  validateConfigItem
} from '@/bizComponents/EditorTemplate/publicFun'
import OssUpload from '@/components/OssUpload'
import { genDefaultPicConfig } from '@/consts'
import { storeInfo } from '@/services/shop'
import {
  labelOptionList,
  templateDetail,
  templateList
} from '@/services/storeLabel.js'
import { withRouter } from '@/utils/compatible'
import { isLetterNumberLineThroughUnderlineReg } from '@/utils/tools'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Link } from '@umijs/max'
import {
  Button,
  Cascader,
  Checkbox,
  Input,
  InputNumber,
  Radio,
  Select,
  Typography,
  message
} from 'antd'
import { Component } from 'react'
import Css from './AddGoods.module.scss'
import {
  activityOutSerialErrorTip,
  activityOutSerialMaxLength
} from './const.ts'
import { setExtConfig } from './utils.ts'

const { SHOW_CHILD } = Cascader

const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 18 } }
const FormItem = Form.Item
const { Option } = Select
const { Text } = Typography

class TwoContent extends Component {
  constructor(props) {
    super(props)
    const twoParam = props.twoParam || { bannerData: genDefaultPicConfig() }
    console.log('twoParamxx', twoParam)
    const { bannerData } = twoParam
    this.state = {
      // 切换展示支付宝积分兑换
      togglealipayIntegralExchangeOpen:
        !!twoParam?.extConfig?.alipayIntegralExchange?.open,
      classId: null,
      freightInfo: [],
      weight: 1,
      volume: 0.01,
      dayList: [0, 1, 2, 3, 4, 5, 6],
      aheadDayList: [0, 1, 2, 3, 4, 5, 6, 7],
      hourList: [
        0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23
      ],
      storeData: [],
      storeShow: false,
      storeLabelIds: [],
      bannerData
    }
  }

  componentDidMount() {
    const { oneParam, twoParam } = this.props
    if (oneParam) {
      this.setState({
        classId: oneParam.classId,
        deliveryTypes: oneParam.deliveryTypes[0]
      })
      if (oneParam.deliveryTypes[0] == 1) {
        this.templateList()
      }
    }
    if (twoParam && twoParam.delivery) {
      this.setState({
        day: parseInt(twoParam.delivery.deliveryAfterHours / 24, 0),
        hour: twoParam.delivery.deliveryAfterHours % 24,
        deliveryBetweenDays: twoParam.delivery.deliveryBetweenDays,
        weight: twoParam.delivery.weight / 1000,
        volume: twoParam.delivery.volume / 1000000
      })

      if (twoParam.delivery.freightId) {
        this.freightChange(twoParam.delivery.freightId)
      }
    }
    this.storeInfo()
    this.labelOptionList()
  }

  freightChange = (value) => {
    const p = {
      freightId: value
    }
    this.templateDetail(p)
  }

  // 提交
  twoStepOkFn = (publishFlag) => {
    this.twoSubmitFn('next', publishFlag)
  }

  // 上一步
  upStepFn = () => {
    this.twoSubmitFn('up')
  }

  // 查询店铺信息
  async storeInfo() {
    const info = await storeInfo()
    if (info) {
      this.setState({
        storeAddress: `${info.data.companyArea}${info.data.storeAddress}${info.data.doorplate}`
      })
    }
  }

  templateList() {
    const { twoParam } = this.props
    templateList().then((res) => {
      if (res) {
        const freightId =
          twoParam && twoParam.delivery && twoParam.delivery.freightId
        const isFreightId = freightId
          ? res.data.find((i) => i.freightId == freightId)
          : false
        if (freightId && !isFreightId) {
          message.warning('该快递模板已被删除,请重新选择')
        }
        this.setState({
          isFreightId,
          freightInfo: res.data
        })
      }
    })
  }

  labelOptionList() {
    // 商品类目列表
    const { twoParam } = this.props
    labelOptionList({ isLazy: false }).then((res) => {
      if (res?.success) {
        const storeData = res.data

        this.setState(
          {
            storeData
          },
          () => {
            if (
              twoParam &&
              twoParam.storeLabelIds &&
              twoParam.storeLabelIds.length
            ) {
              this.twoLabelFn(twoParam.storeLabelIds)
            } else {
              this.setState({
                storeShow: true
              })
            }
          }
        )
      }
    })
  }

  twoLabelFn(storeLabelIds) {
    const { storeData } = this.state
    const {
      form: { setFieldsValue }
    } = this.props
    const allIds = []
    console.log('twoLabelFn', allIds, storeData, storeLabelIds)
    storeLabelIds.forEach((id) => {
      const tmp = this.getAreaIdsArr(storeData, id)
      if (tmp.length) allIds.push(tmp.reverse())
    })
    console.log('allIds', allIds)
    setFieldsValue({ storeLabelIds: allIds })
    this.setState({
      storeLabelIds: allIds,
      storeShow: true
    })
  }

  getAreaIdsArr(data, id, arr = []) {
    data.find((item) => {
      if (item.storeLabelId == id) {
        arr.push(item.storeLabelId)
        return true
      }
      if (item.childFlag && item.childStoreLabels.length) {
        arr = this.getAreaIdsArr(item.childStoreLabels, id, arr)
        if (arr.length) {
          arr.push(item.storeLabelId)
          return true
        }
        return false
      }
      return false
    })
    return arr
  }

  twoSubmitFn(type, publishFlag) {
    console.log('twoSubmitFn', type, publishFlag)
    const { classId, deliveryTypes, storeData, bannerData } = this.state
    const {
      form: { validateFieldsAndScroll },
      upStepFn,
      twoStepOkFn
    } = this.props
    validateFieldsAndScroll((err, values) => {
      console.log('validateFieldsAndScroll', values)
      const displayWindow = !!values.displayWindow
      const displayBanner = !!values.displayBanner
      // 勾选显示广告，则进行广告的配置校验
      if (displayBanner) {
        const { msg, flag } = validateConfigItem(bannerData)
        if (!flag) {
          message.warning(msg)
          return
        }
      }
      // const bannerDataStr = JSON.stringify(dealAdAndImagesAdData(bannerData))
      if (!values.volume && classId != 3) {
        message.warning('请输入体积')
        return
      }
      if (err) {
        return
      }
      // 公共部分
      const common = {
        displayWindow,
        displayBanner,
        bannerData,
        storeLabelIds:
          values.storeLabelIds?.map?.((item) => item[item.length - 1]) || [],
        couponHide: values.couponHide,
        extConfig: values.extConfig
      }
      let p = null
      if (classId == 3) {
        p = {
          ...common,
          delivery: {
            type: deliveryTypes
          }
        }
      } else {
        p = {
          ...common,
          delivery: {
            type: values.deliveryTypes,
            weight: values.weight * 1000,
            volume: values.volume * 1000000,
            freightId: values.freightId
          },
          hide: values?.hide ? 1 : 0
        }
        p.delivery.deliveryBetweenDays = values.deliveryBetweenDays
        const deliveryAfterHours = values.day * 24 + values.hour
        p.delivery.deliveryAfterHours = deliveryAfterHours
      }
      let isOne = false
      if (values.storeLabelIds && values.storeLabelIds.length) {
        storeData.forEach((item) => {
          if (item.value == values.storeLabelIds[0]) {
            if (values.storeLabelIds.length === 1 && !item.isLeaf) {
              isOne = true
            }
          }
        })
      }
      if (isOne) {
        message.warning('请选择子类目')
        return
      }
      console.log('第二部传参', p)
      if (type === 'up') {
        upStepFn(p)
      } else {
        p.publishFlag = publishFlag
        p.bannerData = JSON.stringify(dealAdAndImagesAdData(bannerData))
        p.extConfig = setExtConfig(p.extConfig)
        twoStepOkFn(p)
      }
    })
  }

  templateDetail(p) {
    templateDetail(p).then((res) => {
      if (res) {
        this.setState({
          templateInfo: res.data
        })
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { itemId }
      },
      oneParam,
      twoParam,
      pushLoading
    } = this.props
    const {
      storeAddress,
      classId,
      isFreightId,
      deliveryBetweenDays,
      day,
      hour,
      aheadDayList,
      hourList,
      dayList,
      storeData,
      freightInfo,
      weight,
      volume,
      templateInfo,
      deliveryTypes,
      storeShow,
      storeLabelIds,
      bannerData
    } = this.state
    // let itemId = this.props.match.params.itemId;
    // onValuesChange={(props, changedValues, allValues) => {
    //   console.log('onValuesChange', props, changedValues, allValues)
    // }}
    return (
      <div className={Css.twoContent}>
        <div className={Css.commonTitle}>物流信息</div>
        <Form>
          {classId == 3 ? (
            <div className={Css.subscribeDesc}>
              <div>
                <Radio defaultChecked>预约到店核销</Radio>
                <p>将核销码打印在店内由顾客扫码核销,核销码可在预约管理中下载</p>
              </div>
              <div style={{ paddingTop: '10px' }}>
                <span>门店地址: </span>
                <span>{storeAddress}</span>
              </div>
            </div>
          ) : (
            <div>
              <FormItem {...formItemLayout} label="配送方式">
                {getFieldDecorator('deliveryTypes', {
                  initialValue: deliveryTypes || 1
                })(
                  <Radio.Group>
                    {oneParam &&
                      oneParam.deliveryTypes.map((item) => {
                        if (item == 2) {
                          return (
                            <Radio key={item} value={item}>
                              即时配送
                              <Link
                                to="/setting/deilvery"
                                target="_blank"
                                style={{ paddingLeft: '15px' }}
                              >
                                配送设置
                              </Link>
                            </Radio>
                          )
                        }
                        return (
                          <Radio key={item} value={item}>
                            快递物流
                          </Radio>
                        )
                      })}
                  </Radio.Group>
                )}
                {deliveryTypes == 2 ? (
                  <div style={{ color: '#666' }}>
                    配送规则未设置,商品将无法配送,保存后请即时设置配送规则
                  </div>
                ) : null}
              </FormItem>
              {deliveryTypes == 1 ? (
                <div>
                  <FormItem {...formItemLayout} label="快递模板">
                    {getFieldDecorator('freightId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择快递模板'
                        }
                      ],
                      initialValue:
                        twoParam &&
                        twoParam.delivery &&
                        twoParam.delivery.freightId &&
                        isFreightId
                          ? twoParam.delivery.freightId.toString()
                          : null
                    })(
                      <Select
                        onChange={this.freightChange}
                        style={{ width: '300px' }}
                        placeholder="请选择模板"
                      >
                        {freightInfo && freightInfo.length
                          ? freightInfo.map((item) => {
                              return (
                                <Option
                                  key={item.freightId}
                                  value={item.freightId}
                                >
                                  {item.freightName}
                                </Option>
                              )
                            })
                          : null}
                      </Select>
                    )}
                    {templateInfo &&
                      templateInfo.freightAreaList &&
                      templateInfo.freightAreaList.map((item, index) => {
                        return (
                          <div
                            key={item.freightAreaId}
                            className={Css.freightBox}
                          >
                            <div className={Css.freightTitle}>
                              <span>模板规则:</span>
                              {index === 0 ? (
                                <Link
                                  to={`/setting/addlogistics/${templateInfo.freightId}`}
                                  target="_blank"
                                >
                                  查看详情
                                </Link>
                              ) : null}
                            </div>
                            <div>配送区域: {item.areaNames}</div>
                            {templateInfo.freeFlag ? (
                              <div>
                                <br />
                                包邮
                              </div>
                            ) : (
                              <div>
                                续重规则:
                                {templateInfo.calcType === 'number' ? (
                                  <span>
                                    {item.firstItem}件内{item.firstPrice / 100}
                                    元,每增加
                                    {item.nextItem}件,加{item.nextPrice / 100}元
                                  </span>
                                ) : null}
                                {templateInfo.calcType === 'weight' ? (
                                  <span>
                                    {item.firstItem / 1000}kg内
                                    {item.firstPrice / 100}元,每增加
                                    {item.nextItem / 1000}kg,加
                                    {item.nextPrice / 100}元
                                  </span>
                                ) : null}
                                {templateInfo.calcType === 'volume' ? (
                                  <span>
                                    {item.firstItem / 1000000}m<sup>3</sup>内
                                    {item.firstPrice / 100}
                                    元,每增加{item.nextItem / 1000000}m
                                    <sup>3</sup>,加
                                    {item.nextPrice / 100}元
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </FormItem>
                </div>
              ) : null}
              <FormItem {...formItemLayout} label="物流参数">
                重量{' '}
                {getFieldDecorator('weight', {
                  rules: [
                    {
                      required: true,
                      message: '请输入物流参数'
                    }
                  ],
                  initialValue: weight
                })(<InputNumber max={100000} min={0} precision={2} />)}{' '}
                kg, 体积{' '}
                {getFieldDecorator('volume', {
                  rules: [
                    {
                      required: true,
                      message: '请输入体积'
                    }
                  ],
                  initialValue: volume
                })(<InputNumber max={100000} min={0} precision={2} />)}{' '}
                m³
              </FormItem>
            </div>
          )}

          {classId == 2 ? (
            <FormItem {...formItemLayout} label="预约配送">
              商品下单后，需备货 &nbsp;
              {getFieldDecorator('day', {
                rules: [
                  {
                    required: true,
                    message: '请选择配送时间'
                  }
                ],
                initialValue: day || 0
              })(
                <Select style={{ width: 100 }}>
                  {dayList.map((item) => {
                    return <Option value={item}>{item}</Option>
                  })}
                </Select>
              )}
              &nbsp; 天 &nbsp;
              {getFieldDecorator('hour', {
                initialValue: hour || 0.5
              })(
                <Select style={{ width: 100 }}>
                  {hourList.map((item) => {
                    return <Option value={item}>{item}</Option>
                  })}
                </Select>
              )}
              &nbsp;小时后开始配送，最多可预约&nbsp;
              {getFieldDecorator('deliveryBetweenDays', {
                initialValue: deliveryBetweenDays || 0
              })(
                <Select style={{ width: 100 }}>
                  {aheadDayList.map((item) => {
                    return <Option value={item}>{item}</Option>
                  })}
                </Select>
              )}{' '}
              天内配送。
            </FormItem>
          ) : null}

          <div className={Css.commonTitle}>其他</div>
          <FormItem label="店铺商品类目" {...formItemLayout}>
            {storeShow &&
              getFieldDecorator('storeLabelIds', {
                rules: [
                  {
                    required: false,
                    message: '请选择商品类目'
                  }
                ],
                initialValue: twoParam?.storeLabelIds ? storeLabelIds : null
                // initialValue: twoParam?.storeLabelIds
              })(
                <Cascader
                  allowClear
                  style={{ width: '220px' }}
                  options={storeData}
                  multiple
                  changeOnSelect
                  maxTagCount="responsive"
                  showCheckedStrategy={SHOW_CHILD}
                  placeholder="请选择商品类目"
                  fieldNames={{
                    label: 'storeLabelName',
                    value: 'storeLabelId',
                    children: 'childStoreLabels'
                  }}
                  onChange={(value, selectedOptions) => {
                    // eslint-disable-next-line no-param-reassign
                    if (value.length > 5) value.length = 5
                  }}
                />
              )}
          </FormItem>
          <FormItem label="优惠券隐藏" {...formItemLayout}>
            {getFieldDecorator('couponHide', {
              initialValue: twoParam?.couponHide
            })(
              <Checkbox.Group
                options={[
                  { label: '微信', value: 'weixin' },
                  { label: '支付宝', value: 'alipay' }
                ]}
              />
            )}
          </FormItem>
          <FormItem label="分类页隐藏" {...formItemLayout}>
            {getFieldDecorator('hide', {
              valuePropName: 'checked',
              initialValue: twoParam?.hide
            })(<Checkbox>商品隐藏</Checkbox>)}
            <Text type="secondary">设置后商品将不会展示在店铺内</Text>
          </FormItem>
          <FormItem label="热销商品橱窗" {...formItemLayout}>
            <div
              style={{
                lineHeight: 'normal',
                display: 'flex',
                paddingTop: '8px'
              }}
            >
              {getFieldDecorator('displayWindow', {
                valuePropName: 'checked',
                initialValue: twoParam?.displayWindow
              })(<Checkbox>显示橱窗</Checkbox>)}
              <div>
                <Text type="secondary">
                  设为显示后，将在该商品的详情页上方显示热门推荐商品，展示的商品
                </Text>
                <Link
                  target="_blank"
                  to="/goods/hotSaleManageList"
                  className="ml-4"
                >
                  热销商品管理
                </Link>
                <br />
                <Text type="secondary">
                  列表，在“商品——热销商品管理”中统一设置
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="广告banner" {...formItemLayout}>
            {getFieldDecorator('displayBanner', {
              valuePropName: 'checked',
              initialValue: twoParam?.displayBanner
            })(<Checkbox>显示广告</Checkbox>)}
            <Text type="secondary">
              设为显示后，将在该商品的详情页上方显示图片广告，点击可跳转
            </Text>
            <div style={{ lineHeight: 'normal' }}>
              <OssUpload
                value={bannerData.image}
                widthPx="355px"
                heightPx="180px"
                limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
                onChange={(url) => {
                  this.setState({
                    bannerData: {
                      ...bannerData,
                      image: url
                    }
                  })
                }}
              />
              <Text type="secondary" style={{ display: 'block' }}>
                推荐图片尺寸710*360，大小不超过2M
              </Text>
              <SelectGather
                type={bannerData.type}
                data={bannerData.data}
                alterType={(type) => {
                  this.setState({
                    bannerData: {
                      ...bannerData,
                      type,
                      data: genDefaultPicConfig().data
                    }
                  })
                }}
                alterData={(data) => {
                  this.setState({
                    bannerData: {
                      ...bannerData,
                      data
                    }
                  })
                }}
              />
            </div>
          </FormItem>
          <FormItem label="支付宝积分兑换展示" {...formItemLayout}>
            {getFieldDecorator('extConfig.alipayIntegralExchange.open', {
              valuePropName: 'checked',
              initialValue: twoParam?.extConfig?.alipayIntegralExchange?.open
            })(
              <Checkbox
                onChange={(e) => {
                  this.setState({
                    togglealipayIntegralExchangeOpen: e.target.checked
                  })
                  // set
                }}
              >
                开启
              </Checkbox>
            )}
            <Text type="secondary">
              用于在商品详情页 展示 支付宝会员频道的私域兑换组件
            </Text>
            {this.state.togglealipayIntegralExchangeOpen && (
              <>
                <FormItem
                  label="积分兑换券模板ID"
                  labelCol={{ span: formItemLayout.labelCol.span + 1 }}
                >
                  {getFieldDecorator(
                    'extConfig.alipayIntegralExchange.voucherTemplateId',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写积分兑换券模板ID'
                        }
                      ],
                      initialValue:
                        twoParam?.extConfig?.alipayIntegralExchange
                          ?.voucherTemplateId
                    }
                  )(
                    <Input
                      maxLength={100}
                      className="w-48"
                      placeholder="请输入积分兑换券模板ID"
                    />
                  )}
                  <Text className="ml-2" type="secondary">
                    请填写支付宝后台活动配券中的券模板ID
                  </Text>
                </FormItem>
                <FormItem
                  label="商品编码"
                  labelCol={{ span: formItemLayout.labelCol.span + 1 }}
                >
                  {getFieldDecorator(
                    'extConfig.alipayIntegralExchange.goodsId',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写商品编码'
                        },
                        {
                          validator: (rule, value, callback) => {
                            if (!isLetterNumberLineThroughUnderlineReg(value)) {
                              callback(new Error(activityOutSerialErrorTip))
                              return
                            }
                            callback()
                          }
                        }
                      ],
                      initialValue:
                        twoParam?.extConfig?.alipayIntegralExchange?.goodsId
                    }
                  )(
                    <Input
                      maxLength={activityOutSerialMaxLength}
                      className="w-48"
                      placeholder="请输入商品编码"
                    />
                  )}
                  <Text className="ml-2" type="secondary">
                    请填写该商品 活动编码
                  </Text>
                </FormItem>
              </>
            )}
          </FormItem>
        </Form>
        <div className={Css.StepBottomBtn}>
          <div className={Css.StepBottomBox}>
            <Button
              loading={pushLoading}
              onClick={() => this.twoStepOkFn(true)}
              type="primary"
            >
              {itemId === 'add' ? '立即发布' : '保存'}
            </Button>
            {itemId === 'add' ? (
              <Button
                loading={pushLoading}
                onClick={() => this.twoStepOkFn(false)}
                style={{ marginLeft: '30px' }}
              >
                发布但不上架
              </Button>
            ) : null}

            <Button onClick={this.upStepFn} style={{ marginLeft: '30px' }}>
              上一步
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(
  Form.create({
    // onValuesChange(props, changedValues, allValues) {
    //   console.log('onValuesChange', props, changedValues, allValues, this)
    // }
  })(TwoContent)
)
