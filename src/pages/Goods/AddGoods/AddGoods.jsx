import { parseSingleDataSearchResponse } from '@/bizComponents/EditorTemplate/publicFun'
import Panel from '@/components/Panel'
import { addItem, editItem, itemDetail } from '@/services/item'
import { withRouter } from '@/utils/compatible'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { history } from '@umijs/max'
import { Spin, Steps } from 'antd'
import { Component } from 'react'
import Css from './AddGoods.module.scss'
import OneContent from './OneContent'
import ThreeContent from './ThreeContent'
import TwoContent from './TwoContent'
import { getExtConfig } from './utils.ts'

const { Step } = Steps
class AddGoods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pushLoading: false,
      loading: false,
      oneShow: true,
      current: 0
    }
  }

  componentDidMount() {
    const type = history.location.query?.type || 'add'
    const itemId = history.location.query?.itemId || 0
    if (type === 'edit' || type === 'copy') {
      this.setState({
        loading: true,
        oneShow: false
      })
      this.itemDetail(itemId)
    }
  }

  async itemDetail(itemId) {
    // 编辑获取详情
    const p = {
      itemId
    }
    const res = await itemDetail(p)

    console.log('详情返回', res)
    if (res && res.data) {
      res.data.itemFreight.deliveryTypes = res.data.itemFreight.type
      res.data.deliveryTypes = [res.data.itemFreight.type]
      res.data.delivery = res.data.itemFreight
      const storeLabelIds = (res.data.itemCategoryList || []).map(String)
      const {
        displayBanner,
        displayWindow,
        bannerData: bannerDataRes
      } = res.data
      const bannerData = await parseSingleDataSearchResponse(bannerDataRes)
      // let res1, bannerDataJson
      // if (bannerData) {
      //   bannerDataJson = JSON.parse(bannerData)
      //   const params = formatDataSearch([bannerDataJson])
      //   res1 = await dataSearch(params)
      // }
      // const item = res1?.data?.[0]
      // const defaultPicConfig = genDefaultPicConfig()
      const twoParam = {
        storeLabelIds,
        hide: res.data.hide == 1,
        delivery: {
          type: res.data.deliveryTypes,
          weight: res.data.delivery.freightWeight,
          volume: res.data.delivery.freightVolume,
          freightId: res.data.delivery.freightId,
          deliveryAfterHours: res.data.delivery.deliveryAfterHours,
          deliveryBetweenDays: res.data.delivery.deliveryBetweenDays
        },
        bannerData,
        displayBanner: !!displayBanner,
        displayWindow: !!displayWindow,
        couponHide: res.data.couponHide ? JSON.parse(res.data.couponHide) : [],
        extConfig: getExtConfig(res.data.extConfig)
      }
      console.log('twoParam111', twoParam)
      this.setState({
        twoParam,
        loading: false,
        oneShow: true,
        oneParam: res.data
      })
    }
  }

  oneStepOkFn(oneParam) {
    this.setState((preState) => ({
      current: preState.current + 1,
      oneParam
    }))
    // this.setState({
    //   current: this.state.current + 1,
    //   oneParam
    // })
  }

  twoStepOkFn(twoParam) {
    // 第二步发布
    const { oneParam } = this.state
    const type = history.location.query?.type || 'add'
    const itemId = history.location.query?.itemId || 0
    this.setState({
      pushLoading: true,
      twoParam
    })
    console.log('twoParam', twoParam)
    const param = {
      ...oneParam,
      ...twoParam
    }

    // if (param.storeLabelIds && param.storeLabelIds.length) {
    //   param.storeLabelIds = param.storeLabelIds.map(
    //     (item) => item[item.length - 1]
    //   )
    // } else {
    //   param.storeLabelIds = []
    // }
    if (type === 'add' || type === 'copy') {
      console.log('发布传参', param)
      this.addItem(param)
    } else {
      param.itemId = itemId
      delete param.publishFlag
      console.log('编辑传参', param)
      this.editItem(param)
    }
  }

  editItem(param) {
    const newParams = param
    // 该字段需序列化
    newParams.couponHide = JSON.stringify(param.couponHide)
    // 商品编辑
    newParams.itemType = 0
    editItem(newParams).then((res) => {
      this.setState({
        pushLoading: false
      })
      if (res) {
        this.setState((preState) => ({
          pushLoading: false,
          current: preState.current + 1
        }))
        // this.setState({
        //   pushLoading: false,
        //   current: this.state.current + 1
        // })
      }
    })
  }

  addItem(param) {
    const newParams = param
    // 该字段需序列化
    newParams.couponHide = JSON.stringify(param.couponHide)
    // 商品发布
    newParams.itemType = 0
    addItem(param).then((res) => {
      this.setState({
        pushLoading: false
      })
      if (res) {
        this.setState((preState) => ({
          current: preState.current + 1
        }))
        // this.setState({
        //   pushLoading: false,
        //   current: this.state.current + 1
        // })
      }
    })
  }

  upStepFn(twoParam) {
    // 上一步
    this.setState((preState) => ({
      twoParam,
      current: preState.current - 1
    }))
    // this.setState({
    //   twoParam,
    //   current: this.state.current - 1
    // })
  }

  goodsCb() {
    this.setState(
      {
        pushLoading: false,
        current: 0,
        oneParam: null,
        twoParam: null
      },
      () => {
        history.push('/goods/manageList')
      }
    )
  }

  getLastFn() {
    // 继续发布
    this.setState(
      {
        current: 0,
        oneParam: null,
        twoParam: null
      },
      () => {
        history.push('/goods/manageList/addGoods?type=add')
      }
    )
  }

  render() {
    const { current, oneParam, oneShow, twoParam, pushLoading } = this.state
    return (
      <Panel title="商品管理" content="商品信息管理">
        <div className={Css.goodsBox}>
          <div className={Css.StepBox}>
            <div className={Css.StepTitle}>
              <Steps current={current}>
                <Step title="编辑基础信息">编辑基础信息</Step>
                <Step title="编辑拓展信息" />
                <Step title="发布完成" />
              </Steps>
            </div>
            <div className={Css.content}>
              <Spin
                className={Css.SpinBox}
                size="large"
                spinning={this.state.loading}
              >
                {current === 0 && oneShow ? (
                  <OneContent
                    editInfo={oneParam}
                    oneStepOkFn={this.oneStepOkFn.bind(this)}
                  />
                ) : null}
                {current === 1 ? (
                  <TwoContent
                    pushLoading={pushLoading}
                    twoParam={twoParam}
                    twoStepOkFn={this.twoStepOkFn.bind(this)}
                    oneParam={oneParam}
                    upStepFn={this.upStepFn.bind(this)}
                  />
                ) : null}
                {current === 2 ? (
                  <ThreeContent
                    getLastFn={this.getLastFn.bind(this)}
                    goodsCb={this.goodsCb.bind(this)}
                  />
                ) : null}
              </Spin>
            </div>
          </div>
        </div>
      </Panel>
    )
  }
}
export default withRouter(Form.create()(AddGoods))
