import { withRouter } from '@/utils/compatible'
import { http } from '@/utils/http'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {
  PlusOutlined,
  QuestionCircleFilled,
  StarFilled
} from '@ant-design/icons'
import { history } from '@umijs/max'
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Popover,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
  message
} from 'antd'
import update from 'immutability-helper'
import moment from 'moment'
import { Component } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Link } from 'react-router-dom'
import Css from './AddGoods.module.scss'
import DragableUploadListItem from './module/DragableUploadListItem'
import GoodsDetail from './module/GoodsDetail'

import { classOption, sellerAttrs } from '@/services/itemClass'
import {
  addSpec,
  addSpecValue,
  specOptionList,
  specValueOptionList
} from '@/services/spec'
import { kxllUpload } from '@/services/upload'
import { isLetterNumberLineThroughUnderlineReg } from '@/utils/tools'
import { activityOutSerialErrorTip } from './const'
import { activityOutSerialMaxLength, outSerialMaxLength } from './const.ts'

const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } }
const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select
const { Text } = Typography

const beforeSpecImg = (file) => {
  const size = file.size / 1024 < 500
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg'
  if (!isJpgOrPng) {
    message.warning('仅支持jpg、png、jpeg格式')
  }
  if (!size) {
    message.warning('文件不能大于500k')
  }
  return size && isJpgOrPng
}

class OneContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showBtn: true, // 是否限制底部按钮
      moreShow: false, // 显示更多商品信息
      detailShow: false, // 显示底部详情
      specValuesInfo: [], // 规格值列表
      specNameInfo: [], // 规格值列表
      classInfo: [],
      specList: [], // 规格列表
      fileListOne: [],
      fileListTwo: [],
      cbShow: false
    }
  }

  componentDidMount() {
    const { editInfo, match } = this.props
    const classId = editInfo && editInfo.classId
    this.specOptionList() // 规格列表
    this.classOption(classId) // 查询商品分类选项
    if (this.props.location.query?.type === 'add') {
      if (editInfo && editInfo.specList) {
        // 存在第一步信息
        this.setState(
          {
            detailShow: editInfo.detailShow,
            moreShow: editInfo.moreShow,
            classId: editInfo.classId,
            editList: {
              deliveryTypes: editInfo.deliveryTypes
            }
          },
          () => {
            this.setEditFn(editInfo)
          }
        )
      } else {
        // 只存在默认规格值
        this.initSpecData()
      }
      // 编辑
    } else if (editInfo) {
      let detailShow = false
      if (editInfo?.detail?.detailContentList?.length || editInfo?.detailShow)
        detailShow = true
      this.setState(
        {
          detailShow,
          classId: editInfo.classId,
          editList: {
            deliveryTypes: editInfo.deliveryTypes
          }
        },
        () => {
          this.setEditFn(editInfo)
        }
      )
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {}
  }

  setImgFn(editInfo) {
    const goodsImgList = []
    editInfo.imageList.forEach((item) => {
      if (!item.type) {
        goodsImgList.push(item.imageSrc)
        this.setGoodsImgFn(goodsImgList, 'fileListOne')
      } else {
        this.setVideo(item.imageSrc)
      }
    })
  }

  setGoodsImgFn(imgList, name) {
    const fileListOne = []
    imgList.forEach((src, index) => {
      const imgInit = {
        uid: index,
        name: src.substring(src.lastIndexOf('/') + 1),
        status: 'done',
        url: `${src}`,
        response: {
          data: {
            url: src
          },
          imageUrl: src
        }
      }
      fileListOne.push(imgInit)
    })
    this.setState({
      [name]: fileListOne
    })
  }

  setVideo(videoUrl) {
    const fileListTwo = []
    const videoInit = {
      uid: 1,
      name: videoUrl.substring(videoUrl.lastIndexOf('/') + 1),
      status: 'done',
      url: `${videoUrl}`,
      response: {
        data: {
          url: videoUrl
        },
        imageUrl: videoUrl
      }
    }
    fileListTwo.push(videoInit)
    this.setState({
      loading: false,
      fileListTwo
    })
  }

  specImageFn = (index, item, sonIndex) => {
    const { specList } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">选择图片</div>
      </div>
    )
    const newImageSrc = specList[index].imageSrcArr[sonIndex].imageSrc
    return (
      <Upload
        // className={Css.specImgBox}
        // key={sonIndex}
        fileList={newImageSrc}
        name="file"
        action="/proxy/cloud/oss/upload?type=goods"
        listType="picture-card"
        beforeUpload={beforeSpecImg}
        onChange={this.uploadSpecImg.bind(this, index, item.specValueId)}
      >
        {newImageSrc && newImageSrc.length === 1 ? null : uploadButton}
      </Upload>
    )
  }

  classOption(classId) {
    // 查询商品分类选项
    classOption().then((res) => {
      if (res) {
        let classInfo = res.data
        if (classId) {
          classInfo = [res.data.find((i) => i.classId == classId)]
        }
        classInfo.forEach((item) => {
          if (item) {
            if (item.classId == 1) {
              // eslint-disable-next-line no-param-reassign
              item.desc = '需进行商品配送'
            }
            if (item.classId == 2) {
              // eslint-disable-next-line no-param-reassign
              item.desc = '支持预约配送'
            }
            if (item.classId == 3) {
              // eslint-disable-next-line no-param-reassign
              item.desc = '支持预约到店'
            }
            if (item.classId == 4) {
              // eslint-disable-next-line no-param-reassign
              item.desc = '虚拟商品类目'
            }
          }
        })
        this.setState(
          {
            classInfo
          },
          () => {
            this.classItemFn(classId || res.data[0].classId)
          }
        )
      }
    })
  }

  classItemFn(classId) {
    // 点击商品分类 获取卖家属性
    const p = {
      classId
    }
    const { classInfo } = this.state
    classInfo.map((item) => {
      if (item.classId == classId) {
        item.active = true
      } else {
        item.active = false
      }
    })
    this.setState({
      classId,
      classInfo
    })
    this.sellerAttrs(p)
  }

  sellerAttrs(p) {
    //  获取卖家属性
    sellerAttrs(p).then((res) => {
      if (res) {
        // console.log('商品属性', res.data);
        this.setState({
          editList: res.data,
          payTypes: res.data.payTypes,
          attributeList: res.data.attributeList
        })
      }
    })
  }

  setEditFn(editInfo) {
    // 重新组装sku spec list
    this.editSpecListFn(editInfo.specList) // 设置规格模块
    this.setImgFn(editInfo) // 设置默认图片和视频
  }

  editSpecListFn(data) {
    // 初始化规格块
    if (!data.length) {
      // 不存在规格块
      this.initSpecData()
      return
    }
    const specList = []
    const imageSrcArr = []
    data.forEach((item) => {
      const specValues = []
      item.specValueList.forEach((i) => {
        // eslint-disable-next-line no-param-reassign
        i.specValueId = i.specValueId.toString()
        // eslint-disable-next-line no-param-reassign
        item.specValueId = i.specValueId.toString()
        specValues.push(item.specValueId)
        if (i.imageSrc) {
          const fileListOne = []
          const imgInit = {
            uid: 1,
            name: i.imageSrc.substring(i.imageSrc.lastIndexOf('/') + 1),
            status: 'done',
            url: `${i.imageSrc}`,
            response: {
              data: {
                url: i.imageSrc
              },
              imageUrl: i.imageSrc
            }
          }
          fileListOne.push(imgInit)
          imageSrcArr.push({
            specValueId: i.specValueId,
            specValue: i.specValue,
            imageSrc: fileListOne
          })
        }
      })
      specList.push({
        specId: item.specId,
        specName: item.specName,
        classSpecFlag: item.classSpecFlag,
        specValues,
        specValuesInfo: null
      })
    })
    specList[0].isCheckImg = !!imageSrcArr.length
    specList[0].imageSrcArr = imageSrcArr
    this.setState(
      {
        specList
      },
      () => {
        specList.map((item, index) => {
          // 重新赋值规格列表
          const p = {
            specId: item.specId,
            classSpecFlag: false
          }
          this.specValueOptionList(p, index)
        })
      }
    )
  }

  setNewTable(editSwitch) {
    // 重新封装规格表格数据结构
    const { specList } = this.state
    const { editInfo } = this.props
    const isEmptySpec = editInfo
      ? !editInfo.specList.length && editInfo.skuList.length
      : false // 存在默认规格
    let dataSource = []
    const specData = []
    if (specList && specList.length) {
      specList.forEach((item) => {
        // debugger
        if (item.specValues && item.specValuesInfo) {
          const arr = []
          item.specValues.forEach((i, index) => {
            let specValue = null
            if (
              item.specValuesInfo &&
              item.specValuesInfo.find((j) => j.specValueId == i)
            ) {
              // eslint-disable-next-line prefer-destructuring
              specValue = item.specValuesInfo.find(
                (j) => j.specValueId == i
              ).specValue
            }
            const specValueId = i
            const classSpecFlag = item.classSpecFlag ? 1 : 0
            arr[
              index
            ] = `${item.specId}#${item.specName}#${specValue}#${specValueId}#${classSpecFlag}`
          })
          // eslint-disable-next-line no-param-reassign
          item.specList = arr
          dataSource.push(item.specList)
        }
      })
    }

    const _dataSource = this.cartesianProductOf(...dataSource)
    _dataSource.forEach((i) => {
      const specIdArr = []
      const specNameArr = []
      const specValueArr = []
      const specValueIdArr = []
      const classSpecFlagArr = []
      i.forEach((item) => {
        specIdArr.push(item.split('#')[0])
        specNameArr.push(item.split('#')[1])
        specValueArr.push(item.split('#')[2])
        specValueIdArr.push(item.split('#')[3])
        classSpecFlagArr.push(item.split('#')[4])
      })
      if (i.length) {
        const specList = `${specIdArr.join(',')}#${specNameArr.join(
          ','
        )}#${classSpecFlagArr.join(',')}-${specValueIdArr.join(
          ','
        )}#${specValueArr.join(',')}`
        specData.push({
          specList,
          specId: specIdArr.join(','),
          specName: specNameArr.join('-'),
          specValue: specValueArr.join('&&'),
          specValueId: specValueIdArr.join(','),
          classSpecFlag: classSpecFlagArr.join(',')
        })
      }
    })
    // console.log(
    //   'dataSource',
    //   dataSource,
    //   _dataSource,
    //   editSwitch,
    //   specData,
    //   JSON.parse(JSON.stringify(editInfo?.skuList))
    // )
    if (editSwitch && editInfo && editInfo.skuList) {
      // editInfo.skuList.map((item, sonindex) => {
      //   // eslint-disable-next-line no-param-reassign
      //   item.specList = [specData[sonindex]]
      // })
      // 按specValueId匹配
      editInfo.skuList.map((item) => {
        const specValueId = item?.specList
          ?.map?.((e) => e?.specValueId)
          // 降序，确保顺序一致
          ?.sort((a, b) => b - a)
          ?.join?.(',')
        // debugger
        const index = specData?.findIndex?.(
          (ele) =>
            ele.specValueId
              ?.split?.(',')
              ?.map?.(Number)
              // 降序，确保顺序一致
              ?.sort((a, b) => b - a)
              ?.join(',') === specValueId
        )
        if (index > -1) {
          item.specList = [specData[index]]
        }
      })
      this.setState(
        {
          editInfo
        },
        () => {
          this.setMoneyFn()
        }
      )
    }
    if (specData && specData.length) {
      specData.push({
        // specList: '批量设置',
        specValue: '批量设置',
        totalSet: '1'
      })
    }
    this.setState({
      specData
    })
  }

  initSpecData() {
    // 只存在默认规格值
    const { editInfo } = this.props
    console.log(editInfo)
    const specData = []
    specData.push({
      specList: 'defaultSpec',
      specId: null,
      specName: null,
      specValue: '默认',
      specValueId: null,
      // skuId: editInfo?.skuList?[0]?.skuId || null,
      classSpecFlag: null
    })
    this.setState(
      {
        editInfo,
        specData
      },
      () => {
        if (editInfo && editInfo.skuList) {
          this.setMoneyFn(true)
        }
      }
    )
  }

  setMoneyFn(isEmptySpec) {
    // 设置编辑金额
    const { editInfo } = this.state
    if (editInfo.skuList && editInfo.skuList.length) {
      editInfo.skuList.map((item) => {
        if (isEmptySpec) {
          const specList = 'defaultSpec'
          const salePrice = `${specList}&&salePrice`
          const storage = `${specList}&&storage`
          const linePrice = `${specList}&&linePrice`
          const outSerial = `${specList}&&outSerial`
          const activityOutSerial = `${specList}&&activityOutSerial`
          const productDate = `${specList}&&productDate`
          const guaranteeDay = `${specList}&&guaranteeDay`
          this.setState({
            [salePrice]: item.salePrice / 100,
            [storage]: item.storage,
            [linePrice]: item.linePrice / 100,
            [outSerial]: item.outSerial,
            [activityOutSerial]: item.activityOutSerial,
            [productDate]: item.productDate ? moment(item.productDate) : null,
            [guaranteeDay]: item.guaranteeDay
          })
        } else {
          // eslint-disable-next-line no-unused-expressions
          item?.specList?.forEach?.((son) => {
            if (son && son.specList) {
              const { specList } = son
              const salePrice = `${specList}&&salePrice`
              const storage = `${specList}&&storage`
              const linePrice = `${specList}&&linePrice`
              const outSerial = `${specList}&&outSerial`
              const activityOutSerial = `${specList}&&activityOutSerial`
              const productDate = `${specList}&&productDate`
              const guaranteeDay = `${specList}&&guaranteeDay`
              this.setState({
                [salePrice]: item.salePrice / 100,
                [storage]: item.storage,
                [linePrice]: item.linePrice / 100,
                [outSerial]: item.outSerial,
                [activityOutSerial]: item.activityOutSerial,
                [productDate]: item.productDate
                  ? moment(item.productDate)
                  : null,
                [guaranteeDay]: item.guaranteeDay
              })
            }
          })
        }
      })
    }
  }

  specOptionList() {
    // 获得规格列表
    const { editInfo } = this.props
    const { classId } = this.state
    const p = {
      classId,
      classSpecFlag: false
    }
    specOptionList(p).then((res) => {
      if (res) {
        let specNameInfo = null
        if (editInfo && editInfo.specList) {
          // 如果存在已删除规格信息
          editInfo.specList.map((item) => {
            if (!res.data.find((i) => i.specId == item.specId)) {
              // 已删除规格,重新添加到列表里
              res.data.push({
                specId: item.specId.toString(),
                specName: item.specName,
                classSpecFlag: item.classSpecFlag
              })
            }
          })
        }
        specNameInfo = res.data

        this.setState({
          specNameInfo
        })
      }
    })
  }

  cartesianProductOf() {
    // sku 算法
    return Array.prototype.reduce.call(
      // eslint-disable-next-line prefer-rest-params
      arguments,
      function (a, b) {
        const ret = []
        a.forEach(function (a) {
          b.forEach(function (b) {
            ret.push(a.concat([b]))
          })
        })
        return ret
      },
      [[]]
    )
  }

  nextFn() {
    // 下一步
    const {
      attributeList,
      fileListOne,
      fileListTwo,
      detail,
      specData,
      specList,
      editList,
      classId,
      detailShow,
      moreShow
    } = this.state
    const {
      editInfo,
      form: { validateFieldsAndScroll }
    } = this.props
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      console.log(specData)
      const param = {}
      const imageList = []
      let isError = false
      const stateObj = this.state
      fileListOne.forEach((item) => {
        if (!item.response || !item.status) {
          isError = true
        }
      })
      if (isError) {
        message.warning('请替换上传失败图片')
        return
      }
      const goodsPicture = fileListOne.map((file) => {
        // 商品图片
        return (file.response && file.response.imageUrl) || file.url
      })
      const goodsVideo = fileListTwo.map((file) => {
        // 商品视频
        return (file.response && file.response.imageUrl) || file.url
      })
      if (!goodsPicture.length) {
        message.warning('请选择商品图片')
        return
      }
      if (!specData || !specData.length) {
        message.warning('请选择商品规格')
        return
      }
      if (goodsVideo && goodsVideo.length) {
        imageList.push({
          type: 1,
          mainFlag: false,
          imageSrc: goodsVideo[0]
        })
      }
      goodsPicture.map((item, index) =>
        imageList.push({
          type: 0,
          mainFlag: index === 0,
          imageSrc: item
        })
      )
      const skuList = []
      const specListArr = []
      const skuValueObj = {}
      Object.keys(stateObj).forEach((key) => {
        if (key.indexOf('&&') > -1) {
          const specName = key.split('&&')[0]
          specData.forEach((item) => {
            if (item.specList === specName) {
              skuValueObj[key] = stateObj[key] // 拿到所有有规格值的数据
            }
          })
        }
      })
      let isSpecImg = false // 规格图片是否选择
      let isSpecEmpty = false // 规格值是否为空
      specList.forEach((item) => {
        const specValueList = []
        if (item.isCheckImg) {
          item.imageSrcArr.forEach((son) => {
            if (!son.imageSrc) {
              isSpecImg = true
            } else {
              const imageSrc = son.imageSrc.map((file) => {
                // 商品图片
                return (file.response && file.response.imageUrl) || file.url
              })
              specValueList.push({
                specValueId: son.specValueId,
                specValue: son.specValue,
                imageSrc: imageSrc[0]
              })
            }
          })
        } else if (!item.specValues) {
          isSpecEmpty = true
          return
        } else if (item.specValues && item.specValues.length) {
          item.specValues.forEach((son) => {
            const arr = item.specValuesInfo.find((i) => i.specValueId == son)
            specValueList.push({
              specValueId: arr.specValueId,
              specValue: arr.specValue,
              imageSrc: null
            })
          })
        }
        specListArr.push({
          specId: item.specId,
          specName: item.specName,
          classSpecFlag: item.classSpecFlag,
          specValueList
        })
      })
      if (isSpecEmpty) {
        message.warning('请完善规格值')
        return
      }
      if (isSpecImg) {
        message.warning('请选择规格值图片')
        return
      }
      let isSkuValue = false // 是否没填库存和售价
      let allGuaranteeDayFlag = false // 是否正确填写保质期和生产日期
      // 规格编码校验
      // let isOutSerial = false
      // 活动商品编码
      let isActivityOutSerial = false
      specData.forEach((item) => {
        let guaranteeDayFlag = false
        if (item.specList === 'defaultSpec') {
          // 存在默认规格
          let salePrice = null
          let linePrice = null
          let storage = null
          let outSerial = null
          let activityOutSerial = null
          let productDate = null
          let guaranteeDay = null
          Object.keys(skuValueObj).forEach((key) => {
            const newKey = key.split('&&')[0]
            if (item.specList == newKey) {
              if (key.indexOf('salePrice') > -1) {
                salePrice = skuValueObj[key]
              }
              if (key.indexOf('linePrice') > -1) {
                linePrice = skuValueObj[key]
              }
              if (key.indexOf('storage') > -1) {
                storage = skuValueObj[key]
              }
              if (key.indexOf('outSerial') > -1) {
                outSerial = skuValueObj[key]
              }
              if (key.indexOf('activityOutSerial') > -1) {
                activityOutSerial = skuValueObj[key]
              }
              if (key.indexOf('productDate') > -1 && classId == 1) {
                productDate = skuValueObj[key]
                  ? moment(skuValueObj[key]).format('YYYY-MM-DD HH:mm:ss')
                  : null
                guaranteeDayFlag = !!productDate
              }
              if (key.indexOf('guaranteeDay') > -1 && classId == 1) {
                guaranteeDay = skuValueObj[key] || null
                guaranteeDayFlag = guaranteeDayFlag && !guaranteeDay
              }
            }
          })
          if (salePrice) {
            salePrice = Math.round(salePrice * 100)
          }
          if (linePrice) {
            linePrice = Math.round(linePrice * 100)
          }
          if (!salePrice || !storage) {
            isSkuValue = true
          }
          // if (outSerial && !isLetterNumberLineThroughUnderlineReg(outSerial)) {
          //   isOutSerial = true
          // }
          if (
            activityOutSerial &&
            !isLetterNumberLineThroughUnderlineReg(activityOutSerial)
          ) {
            isActivityOutSerial = true
          }
          skuList.push({
            specList,
            salePrice,
            outSerial,
            activityOutSerial,
            storage,
            linePrice,
            productDate,
            guaranteeDay,
            // 兼容默认规格编辑后传参
            skuId: editInfo?.skuList[0]?.skuId || null
          })
        } else if (!item.totalSet) {
          const specList = []
          const specName = item.specName.split('-')
          const specValue = item.specValue.split('&&')
          const specValueId = item.specValueId.split(',')
          const specId = item.specId.split(',')
          const classSpecFlag = item.classSpecFlag.split(',')
          specId.forEach((son, index) => {
            specList.push({
              specList: item.specList,
              specId: specId[index],
              specName: specName[index],
              specValue: specValue[index],
              specValueId: specValueId[index],
              classSpecFlag: classSpecFlag[index] == 1
            })
          })
          let salePrice = null
          let linePrice = null
          let storage = null
          let outSerial = null
          let activityOutSerial = null
          let productDate = null
          let skuId = null
          let guaranteeDay = null
          Object.keys(skuValueObj).forEach((key) => {
            const newKey = key.split('&&')[0]
            if (item.specList == newKey) {
              if (key.indexOf('salePrice') > -1) {
                salePrice = skuValueObj[key]
              }
              if (key.indexOf('linePrice') > -1) {
                linePrice = skuValueObj[key]
              }
              if (key.indexOf('storage') > -1) {
                storage = skuValueObj[key]
              }
              if (key.indexOf('outSerial') > -1) {
                outSerial = skuValueObj[key]
              }
              if (key.indexOf('activityOutSerial') > -1) {
                activityOutSerial = skuValueObj[key]
              }
              if (key.indexOf('productDate') > -1) {
                productDate = skuValueObj[key]
                  ? moment(skuValueObj[key]).format('YYYY-MM-DD HH:mm:ss')
                  : null
                // eslint-disable-next-line no-unused-expressions
                productDate
                  ? (guaranteeDayFlag = true)
                  : (guaranteeDayFlag = false)
              }
              if (key.indexOf('guaranteeDay') > -1) {
                guaranteeDay = skuValueObj[key] || null
                // eslint-disable-next-line no-unused-expressions
                guaranteeDayFlag && !guaranteeDay
                  ? (guaranteeDayFlag = true)
                  : (guaranteeDayFlag = false)
              }
            }
          })
          if (salePrice) {
            salePrice = Math.round(salePrice * 100)
          }
          if (linePrice) {
            linePrice = Math.round(linePrice * 100)
          }
          if (!salePrice || !storage) {
            isSkuValue = true
          }
          // if (outSerial && !isLetterNumberLineThroughUnderlineReg(outSerial)) {
          //   isOutSerial = true
          // }
          if (
            activityOutSerial &&
            !isLetterNumberLineThroughUnderlineReg(activityOutSerial)
          ) {
            isActivityOutSerial = true
          }
          if (
            Array.isArray(editInfo?.skuList) &&
            editInfo?.skuList?.length > 0
          ) {
            editInfo.skuList.forEach((i) => {
              if (Array.isArray(i.specList) && i.specList.length > 0) {
                i.specList.forEach((c) => {
                  // eslint-disable-next-line prefer-destructuring
                  if (c && item.specValueId === c.specValueId) skuId = i.skuId
                })
              }
            })
          }
          skuList.push({
            specList,
            salePrice,
            outSerial,
            activityOutSerial,
            storage,
            linePrice,
            skuId,
            productDate,
            guaranteeDay
          })
        }
        if (guaranteeDayFlag) allGuaranteeDayFlag = true
      })
      if (isSkuValue) return message.warning('请输入售价和库存')
      // if (isOutSerial) {
      //   return message.warning(
      //     '规格编码仅允许输入大小写字母、数字、下划线'
      //   )
      // }
      if (isActivityOutSerial) {
        return message.warning(activityOutSerialErrorTip)
      }
      if (allGuaranteeDayFlag) return message.warning('请输入保质期')
      param.detailShow = detailShow
      param.moreShow = moreShow
      param.specList = specListArr
      param.skuList = skuList
      param.imageList = imageList
      let detailObj = null
      if (detail?.detailContentList?.length) {
        detailObj = detail
      }
      if (editInfo?.detail?.detailContentList?.length) {
        detailObj = editInfo.detail
      }
      param.detail = detailObj
      param.itemName = values.itemName
      param.jingle = values.jingle
      param.itemCode = values.itemCode
      param.deliveryTypes =
        (editInfo && editInfo.deliveryTypes) || editList.deliveryTypes
      param.classId = classId
      const attrList = []
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in values) {
        attributeList.forEach((item) => {
          if (item.attrId == key) {
            attrList.push({
              attrKey: item.attrKey,
              attrValue: values[key],
              attrId: item.attrId
            })
          }
        })
      }
      param.attributeList = attrList
      param.payType = values.payType
      console.log('第一步参数', param)
      this.props.oneStepOkFn(param)
    })
  }

  beforeUpload(imgMax, fileListOne, file, fileList) {
    const imgNumner = !(fileListOne.length + fileList.length > imgMax) // 大于5张
    const size = file.size / 1024 < 500
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg'
    if (!imgNumner) {
      message.warning('最多上传五张图片')
    }
    if (!isJpgOrPng) {
      message.warning('仅支持jpg、png、jpeg格式')
    }
    if (!size) {
      message.warning('文件不能大于500k')
    }
    return size && isJpgOrPng && imgNumner
  }

  beforeVideo(file) {
    const isMp4 = file.type === 'video/mp4' || file.type === 'video/MP4'
    const size = file.size / 1024 / 1024 < 20
    if (!isMp4) {
      message.warning('仅支持mp4格式')
      this.setState({
        loading: false
      })
      return
    }
    if (!size) {
      message.warning('视频大小不能大于20MB')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.uploadImage(file) // 使用OSS直传,不默认上传
    }

    return false
  }

  uploadImage(file) {
    kxllUpload({ type: 'item' }).then((res) => {
      if (res.success) {
        const formData = new FormData()
        const aliyunOssToken = res.data
        // 注意formData里append添加的键的大小写
        formData.append(
          'key',
          aliyunOssToken.dir + aliyunOssToken.filename + file.name
        ) // 存储在oss的文件路径
        formData.append('OSSAccessKeyId', aliyunOssToken.OSSAccessKeyId) // accessKeyId
        formData.append('policy', aliyunOssToken.policy) // policy
        formData.append('Signature', aliyunOssToken.signature) // 签名
        // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
        formData.append('file', file)
        formData.append('success_action_status', 200) // 成功后返回的操作码
        return this.uploadOssVideo(aliyunOssToken.host, formData).then(
          (res) => {
            const videoUrl = `${aliyunOssToken.host}/${aliyunOssToken.dir}${aliyunOssToken.filename}${file.name}`
            this.setState(
              {
                videoUrl
              },
              () => {
                this.setVideo(videoUrl)
              }
            )
          }
        )
      }
    })
  }

  uploadOssVideo = (uploadUrl, formData) => {
    return http('post', uploadUrl, formData)
  }

  uploadTwo(info) {
    const isMp4 =
      info.file.type === 'video/mp4' || info.file.type === 'video/MP4'
    let loading = false
    if (!isMp4) {
      loading = false
    }
    if (isMp4) {
      loading = !!info.fileList.length
    }
    this.setState({
      loading
    })
  }

  uploadOne(info) {
    let fileListOne = info.fileList
    fileListOne = fileListOne.map((file) => {
      if (file.response && file.response.data) {
        file.url = file.response.data.url
      }
      return file
    })
    fileListOne = fileListOne.filter((file, index) => {
      if (file.response) {
        return file.response.success || file.status === 'done'
      }
      return true
    })
    fileListOne.map((item) => {
      if (!item.status) {
        item.status = 'error'
      }
      if (item.size / 1024 > 500) {
        item.status = 'error'
      }
    })
    this.setState({ fileListOne })
  }

  uploadSpecImg(index, specValueId, info) {
    const { specList } = this.state
    let fileListOne = info.fileList
    fileListOne = fileListOne.map((file) => {
      if (file.response) {
        // eslint-disable-next-line no-param-reassign
        file.url = file.response.data.url
      }
      return file
    })
    fileListOne = fileListOne.filter((file, index) => {
      if (file.response) {
        return file.response.success || file.status === 'done'
      }
      return true
    })
    fileListOne.forEach((item) => {
      if (item.size / 1024 > 500) {
        // eslint-disable-next-line no-param-reassign
        item.status = 'error'
      }
    })
    specList[index].imageSrcArr.forEach((item) => {
      if (item.specValueId == specValueId) {
        // eslint-disable-next-line no-param-reassign
        item.imageSrc = fileListOne
      }
    })
    this.setState({ specList })
  }

  editMoreFn() {
    const { moreShow } = this.state
    this.setState({
      moreShow: !moreShow
    })
  }

  addSizeFn = () => {
    // 添加新规格盒子
    const { specList } = this.state
    if (specList.length === 3) {
      message.warning('最多添加三个规格')
      return
    }
    specList.push({
      specId: null,
      specName: null,
      newspecName: null,
      specNameShow: false
    })
    this.setState(
      {
        specList
      },
      () => {
        this.setNewTable()
      }
    )
  }

  deleteBox = (index) => {
    // 删除规格盒子
    const { specList } = this.state
    specList.splice(index, 1)
    this.setState(
      {
        specList
      },
      () => {
        this.setNewTable()
        if (!specList || !specList.length) {
          this.initSpecData()
        }
      }
    )
  }

  specNameChange = (index, value, option) => {
    // 规格名搜索栏变化
    const { specList, specNameInfo } = this.state
    const isName = specList.find((i) => i.specId == value)
    if (isName) {
      message.warning('该规格名已存在')
      return
    }
    specList[index].specName = option.props.children
    specList[index].specId = value
    specList[index].classSpecFlag = specNameInfo.find(
      (i) => i.specId == value
    ).classSpecFlag
    specList[index].specValues = undefined
    specList[index].specValuesInfo = undefined // 清空默认规格值
    specList[index].imageSrcArr = null
    const p = {
      specId: value,
      classSpecFlag: false
    }
    this.specValueOptionList(p, index, true)
  }

  specValueOptionList(p, index, isClearEdit) {
    // 获取规格值列表
    const { specList } = this.state
    const { editInfo } = this.props
    specValueOptionList(p).then((res) => {
      if (res) {
        if (editInfo && editInfo.specList && !isClearEdit) {
          // 如果存在编辑信息
          editInfo.specList.forEach((item) => {
            if (item.specId == p.specId) {
              item.specValueList.forEach((son) => {
                if (!res.data.find((i) => i.specValueId == son.specValueId)) {
                  // 已删除规格值,重新添加到列表里
                  res.data.push(son)
                }
              })
            }
          })
        }
        specList[index].specValuesInfo = res.data
        this.setState(
          {
            specList
          },
          () => {
            this.setNewTable(true)
          }
        )
      }
    })
  }

  handleVisibleChange(index, show) {
    // 控制气泡显示变化
    const { specList } = this.state
    specList[index].specNameShow = show
    specList[index].newspecName = null
    this.setState({
      specList
    })
  }

  totalSetChange(key, clearName, show) {
    console.log('totalSetChange', key, clearName, show)
    if (show) {
      this.setState({
        [clearName]: null
      })
    }
    this.setState({
      [key]: show
    })
  }

  saveNewspecName(index) {
    // 点击保存新规格名
    const { specList, specNameInfo } = this.state
    const isspecName = specNameInfo.find(
      (i) => i.specName == specList[index].newspecName
    )
    if (isspecName) {
      message.warning('该规格名已存在')
      return
    }
    if (specList[index].newspecName.length > 10) {
      message.warning('规格名最长十个字')
      return
    }
    this.setState({
      addLoading: true
    })
    const p = {
      specName: specList[index].newspecName
    }
    this.addSpec(p, index) // 新增规格名
  }

  addSpec(p, index) {
    // 新增规格
    const { specNameInfo, specList } = this.state
    addSpec(p).then((res) => {
      if (res) {
        specNameInfo.push({
          specId: res.data.specId,
          specName: res.data.specName,
          classSpecFlag: false
        })
        specList[index].specId = res.data.specId
        specList[index].specName = res.data.specName
        specList[index].specNameShow = false
        specList[index].specValues = undefined
        specList[index].specValuesInfo = undefined
        specList[index].classSpecFlag = false
        this.setState(
          {
            addLoading: false,
            specNameInfo,
            specList
          },
          () => {
            this.setNewTable()
          }
        )
      }
    })
  }

  closePop(index) {
    // 点击气泡取消
    const { specList } = this.state
    specList[index].specNameShow = false
    this.setState({
      specList
    })
  }

  setNewspecName = (index, e) => {
    // 输入新规格名称时
    const { specList } = this.state
    specList[index].newspecName = e.target.value
    this.setState(
      {
        specList
      },
      () => {
        this.setNewTable()
      }
    )
  }

  imgSrcChange(index) {
    // 规格值图片时时变化
    const { specList } = this.state
    if (!specList[index].isCheckImg) {
      return
    }
    if (!specList[index].specValues) {
      specList[index].imageSrcArr = []
      return
    }
    specList[index].imageSrcArr = []
    specList[index].specValues.map((item, sonIndex) => {
      const { specValue } = specList[index].specValuesInfo.find(
        (i) => i.specValueId == item
      )
      specList[index].imageSrcArr.push({
        specValue,
        specValueId: item,
        imageSrc: null
      })
    })
    this.setState({
      specList
    })
  }

  addSizeImgFn = (index, e) => {
    // 勾选添加规格图片
    const { specList } = this.state
    specList[index].isCheckImg = e.target.checked
    if (e.target.checked && specList[index].specValues instanceof Array) {
      this.imgSrcChange(index)
    } else {
      specList[index].imageSrcArr = null
      this.setState({
        specList
      })
    }
  }

  getspecValuesFn(index, value, option) {
    console.log(index, value, option)
    // 获得规格值
    if (value && value.length > 20) return message.warning('最多添加20个规格值')
    if (value && value.length && value[value.length - 1].length > 15)
      return message.warning('规格值最长15个字')

    const { specList } = this.state
    const specValue = option.length
      ? option[option.length - 1].props.children
      : null
    const isValue = specList[index].specValuesInfo
      ? specList[index].specValuesInfo.find((i) => i.specValue == specValue)
      : false
    if (!isValue) {
      // 选中规格值不存在,新增操作
      const lastValue = value[value.length - 1]
      if (!value.length) {
        // 已删除所有规格
        specList[index].specValues = undefined
        this.setState({
          specList
        })
        return
      }
      const p = {
        specId: specList[index].specId,
        specValues: [lastValue]
      }
      // 新增规格值
      this.addSpecValue(p, value, index)
    } else {
      // 选中已存在
      specList[index].specValues = value // 规格值ID赋值
    }
    this.setState(
      {
        specList
      },
      () => {
        this.imgSrcChange(index)
        this.setNewTable()
      }
    )
  }

  addSpecValue(p, value, index) {
    // 添加规格值
    const { specList } = this.state
    addSpecValue(p).then((res) => {
      if (res) {
        if (!specList[index].specValuesInfo) {
          specList[index].specValuesInfo = []
        }
        specList[index].specValuesInfo.push({
          specValueId: res.data[0].specValueId,
          specValue: res.data[0].specValue
        })
        value[value.length - 1] = res.data[0].specValueId
        specList[index].specValues = value
        this.setState(
          {
            specList
          },
          () => {
            this.imgSrcChange(index)
            this.setNewTable()
          }
        )
      }
    })
  }

  cbShowChange = (show) => {
    this.setState({
      cbShow: show
    })
  }

  cbContent = () => {
    const popDom = (
      <div style={{ width: '200px' }}>
        取消后已编辑的信息都将丢失,确认取消吗?
        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <Button
            size="small"
            style={{ marginRight: '5px' }}
            onClick={() =>
              this.setState({
                cbShow: false
              })
            }
          >
            点错了
          </Button>
          <Button
            type="primary"
            onClick={() => history.push('/goods/manageList')}
            size="small"
          >
            确认
          </Button>
        </div>
      </div>
    )
    return popDom
  }

  popContent = (index) => {
    // 气泡内容
    const { specList } = this.state
    const popDom = (
      <div>
        <Input
          value={specList[index].newspecName}
          onChange={(e) => this.setNewspecName(index, e)}
          placeholder="新增规格"
        />
        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <Button
            size="small"
            onClick={this.closePop.bind(this, index)}
            style={{ marginRight: '5px' }}
          >
            取消
          </Button>
          <Button
            type="primary"
            loading={this.state.addLoading}
            onClick={this.saveNewspecName.bind(this, index)}
            size="small"
          >
            确定
          </Button>
        </div>
      </div>
    )
    return popDom
  }

  closeTotal(showName) {
    // 关闭批量设置
    this.setState({
      [showName]: false
    })
  }

  setTotalValFn(setName, value, showName) {
    // 点击确定批量设置
    const { specData } = this.state
    // setName, `total-${setName}`, showName
    specData.map((item) => {
      if (item.specList) {
        if (
          setName === 'guaranteeDay' &&
          !this.state[`${item.specList}&&productDate`]
        )
          return

        const key = `${item.specList}&&${setName}`
        const setStateTmp = {
          [key]: this.state[value]
        }
        // 当统一设置日期不存在时，移除所有保质期
        if (setName === 'productDate' && !this.state[value]) {
          setStateTmp[`${item.specList}&&guaranteeDay`] = null
        }
        this.setState(setStateTmp)
      }
    })
    this.setState({
      [showName]: false,
      specData
    })
  }

  commonChange(key, value) {
    console.log('commonChange', key, value)
    // 价格库存输入框
    if (
      key.indexOf('&&outSerial') > -1 ||
      key.indexOf('&&activityOutSerial') > -1
    ) {
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      value = value.target.value
    }
    const setStateTmp = {
      [key]: value
    }
    if (key.includes('productDate') && !value) {
      setStateTmp[key.replace('productDate', 'guaranteeDay')] = null
    }
    this.setState(setStateTmp)
  }

  totalInputChange(key, value) {
    // 批量输入框
    if (
      key.indexOf('outSerial') > -1 ||
      key.indexOf('activityOutSerial') > -1
    ) {
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      value = value.target.value
    }
    this.setState({
      [key]: value
    })
  }

  setValuePop = (setName, showName) => {
    const InputNumberWidth =
      setName === 'guaranteeDay' ? { width: '100px' } : { width: '150px' }
    const InputNumberPrecision = setName === 'guaranteeDay' ? 0 : 2
    const InputNumberMax =
      setName === 'guaranteeDay' ? 9999 : Number.MAX_SAFE_INTEGER
    // 最大长度限制
    let maxLength
    if (setName === 'outSerial') maxLength = outSerialMaxLength
    else if (setName === 'activityOutSerial')
      maxLength = activityOutSerialMaxLength
    const popDom = (
      <div>
        {setName === 'outSerial' || setName === 'activityOutSerial' ? (
          <Input
            style={{ width: '150px' }}
            maxLength={maxLength}
            value={this.state[`total-${setName}`]}
            onChange={this.totalInputChange.bind(this, `total-${setName}`)}
          />
        ) : setName === 'productDate' ? (
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{
              defaultValue: moment('00:00:00', 'HH:mm:ss')
            }}
            style={{ width: '200px' }}
            value={this.state[`total-${setName}`]}
            onChange={this.totalInputChange.bind(this, `total-${setName}`)}
          />
        ) : (
          <InputNumber
            style={InputNumberWidth}
            min={0}
            max={InputNumberMax}
            precision={InputNumberPrecision}
            value={this.state[`total-${setName}`]}
            onChange={this.totalInputChange.bind(this, `total-${setName}`)}
          />
        )}

        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Button
            size="small"
            style={{ marginRight: '5px' }}
            onClick={this.closeTotal.bind(this, showName)}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={this.setTotalValFn.bind(
              this,
              setName,
              `total-${setName}`,
              showName
            )}
            size="small"
          >
            确定
          </Button>
        </div>
      </div>
    )
    return popDom
  }

  goodsDetailFn = (e) => {
    this.setState({
      detailShow: e.target.checked
    })
  }

  detailContentList = (detailContentList) => {
    this.setState({
      detail: {
        detailContentList
      }
    })
  }

  showDetailFn = (showBtn) => {
    console.log('showBtn=', showBtn)
    // 是否显示下一步
    this.setState({
      showBtn
    })
  }

  removeVideoFn(file) {
    this.setState({
      fileListTwo: [],
      loading: false
    })
  }

  // 移动修改fileListOne
  moveRow = (dragIndex, hoverIndex) => {
    const { fileListOne } = this.state
    const dragRow = fileListOne[dragIndex]
    const newFileListOne = update(fileListOne, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    })
    this.setState({
      fileListOne: newFileListOne
    })
  }

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props
    const { editInfo } = this.props
    const {
      payTypes,
      attributeList,
      classId,
      loading,
      showBtn,
      classInfo,
      detailShow,
      fileListOne,
      fileListTwo,
      moreShow,
      specNameInfo,
      specList,
      specValuesInfo,
      specData,
      cbShow
    } = this.state

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">选择图片</div>
      </div>
    )

    const uploadVideoButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        {/* <LegacyIcon type={loading ? 'loading' : 'plus'} /> */}
        <div className="ant-upload-text">{loading ? '上传中' : '上传视频'}</div>
      </div>
    )

    const specNameList = specNameInfo.map((item) => {
      return (
        <Option key={item.specId} value={item.specId}>
          {item.specName}
        </Option>
      )
    })

    const specValuesList = specValuesInfo.map((item) => {
      return (
        <Option key={item.specValueId} value={item.specValueId}>
          {item.specValue}
        </Option>
      )
    })

    let columns = [
      {
        title: '规格值',
        dataIndex: 'specValue',
        fixed: 'left',
        render: (text, record) => {
          return <div style={{ width: '80px' }}>{text}</div>
        }
      },
      {
        title: '*售价',
        dataIndex: 'salePrice',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑售价"
                content={this.setValuePop('salePrice', 'salePriceShow')}
                visible={this.state['salePriceShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'salePriceShow',
                  'total-salePrice'
                )}
                trigger="click"
              >
                <a>售价</a>
              </Popover>
            )
          }
          return (
            <InputNumber
              precision={2}
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&salePrice`
              )}
              value={this.state[`${record.specList}&&salePrice`]}
              min={0}
            />
          )
        }
      },
      {
        title: '*库存',
        dataIndex: 'storage',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑库存"
                precision={0}
                content={this.setValuePop('storage', 'storageShow')}
                visible={this.state['storageShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'storageShow',
                  'total-storage'
                )}
                trigger="click"
              >
                <a>库存</a>
              </Popover>
            )
          }
          return (
            <InputNumber
              precision={0}
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&storage`
              )}
              value={this.state[`${record.specList}&&storage`]}
              min={0}
            />
          )
        }
      },
      {
        title: '划线价',
        dataIndex: 'linePrice',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑划线价"
                precision={2}
                content={this.setValuePop('linePrice', 'linePriceShow')}
                visible={this.state['linePriceShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'linePriceShow',
                  'total-linePrice'
                )}
                trigger="click"
              >
                <a>划线价</a>
              </Popover>
            )
          }
          return (
            <InputNumber
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&linePrice`
              )}
              value={this.state[`${record.specList}&&linePrice`]}
              min={0}
            />
          )
        }
      },
      {
        title: (
          <Space>
            <Text>规格编码</Text>
            <Tooltip
              placement="top"
              title="用于商品发货、外部系统对接、支付宝订单中心等，可输入ERP编码、UPC码。"
            >
              <QuestionCircleFilled style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        ),
        dataIndex: 'outSerial',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑规格编码"
                content={this.setValuePop('outSerial', 'outSerialShow')}
                visible={this.state['outSerialShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'outSerialShow',
                  'total-outSerial'
                )}
                trigger="click"
              >
                <a>规格编码</a>
              </Popover>
            )
          }
          const value = this.state[`${record.specList}&&outSerial`]
          // debugger
          return (
            <Input
              style={{ width: '150px' }}
              maxLength={outSerialMaxLength}
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&outSerial`
              )}
              value={value}
            />
          )
        }
      },
      {
        title: (
          <Space>
            <Text>活动商品编码</Text>
            <Tooltip
              placement="top"
              title="用于支付宝/微信支付券、蚂蚁森林绿色能量、支付宝支付券优惠前置等活动对接"
            >
              <QuestionCircleFilled style={{ color: '#999' }} />
            </Tooltip>
          </Space>
        ),
        dataIndex: 'activityOutSerial',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑活动商品编码"
                content={this.setValuePop(
                  'activityOutSerial',
                  'activityOutSerialShow'
                )}
                visible={this.state['activityOutSerialShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'activityOutSerialShow',
                  'total-activityOutSerial'
                )}
                trigger="click"
              >
                <a>活动商品编码</a>
              </Popover>
            )
          }
          return (
            <Input
              style={{ width: '150px' }}
              maxLength={activityOutSerialMaxLength}
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&activityOutSerial`
              )}
              value={this.state[`${record.specList}&&activityOutSerial`]}
            />
          )
        }
      }
    ]

    const columnsAddtion = [
      {
        title: '生产日期',
        dataIndex: 'productDate',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑生产日期"
                content={this.setValuePop('productDate', 'productDateShow')}
                visible={this.state['productDateShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'productDateShow',
                  'total-productDate'
                )}
                trigger="click"
              >
                <a>生产日期</a>
              </Popover>
            )
          }
          return (
            <DatePicker
              style={{ width: '200px' }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: moment('00:00:00', 'HH:mm:ss')
              }}
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&productDate`
              )}
              value={this.state[`${record.specList}&&productDate`]}
            />
          )
        }
      },
      {
        title: '保质期',
        dataIndex: 'guaranteeDay',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑保质期"
                content={this.setValuePop('guaranteeDay', 'guaranteeDayShow')}
                visible={this.state['guaranteeDayShow']}
                onVisibleChange={this.totalSetChange.bind(
                  this,
                  'guaranteeDayShow',
                  'total-guaranteeDay'
                )}
                trigger="click"
              >
                <a>保质期</a>
              </Popover>
            )
          }
          return (
            <InputNumber
              disabled={!this.state[`${record.specList}&&productDate`]}
              onChange={this.commonChange.bind(
                this,
                `${record.specList}&&guaranteeDay`
              )}
              value={this.state[`${record.specList}&&guaranteeDay`]}
              min={1}
              precision={0}
              max={9999}
            />
          )
        }
      }
    ]

    if (classId == 1) columns = [...columns, ...columnsAddtion]

    return (
      <div className={Css.oneContent}>
        <div className={Css.commonTitle}>商品分类</div>
        <div className={Css.commonTitleRowBox}>
          <ul className={Css.goodsTypeList}>
            {classInfo && classInfo.length
              ? classInfo.map((item, index) => {
                  return (
                    <li
                      className={item && item.active ? Css['active-item'] : ''}
                      key={index}
                      onClick={this.classItemFn.bind(this, item.classId)}
                    >
                      {item.className}
                      <div>{item.desc}</div>
                    </li>
                  )
                })
              : null}
          </ul>
        </div>
        <div className={Css.commonTitle}>商品基础信息</div>

        <div className={Css.commonRowBox}>
          <Form {...formItemLayout}>
            <FormItem label="商品名称">
              {getFieldDecorator('itemName', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称'
                  },
                  { min: 3, message: '至少3个字!' },
                  { max: 50, message: '不超过50个字!' }
                ],
                initialValue: editInfo && editInfo.itemName
              })(
                <Input
                  style={{ width: '300px' }}
                  placeholder="请输入商品名称"
                />
              )}
            </FormItem>
            <FormItem label="商品图片">
              {getFieldDecorator('goodsphotoTest', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品图片'
                  }
                ],
                initialValue: '1'
              })(<Input type="hidden" />)}
              <div className={Css.goodsBox}>
                <DndProvider backend={HTML5Backend}>
                  <Upload
                    fileList={fileListOne}
                    name="file"
                    action="/proxy/cloud/oss/upload?type=goods"
                    listType="picture-card"
                    beforeUpload={this.beforeUpload.bind(this, 5, fileListOne)}
                    onChange={this.uploadOne.bind(this)}
                    itemRender={(originNode, file, currFileList) => (
                      <DragableUploadListItem
                        originNode={originNode}
                        file={file}
                        fileList={currFileList}
                        moveRow={this.moveRow.bind(this)}
                      />
                    )}
                  >
                    {fileListOne.length >= 5 ? null : uploadButton}
                  </Upload>
                  {fileListOne &&
                    fileListOne.map((item, index) => {
                      if (index === 0) {
                        return (
                          <div key={index} className={Css.TopImg}>
                            <StarFilled className={Css.starIcon} />
                            主图
                          </div>
                        )
                      }
                    })}
                </DndProvider>
                <div className={Css.imgText}>
                  主图大小500K以内,可上传5张支持jpg.jpeg.png图片
                </div>
              </div>
            </FormItem>
            <div style={{ display: moreShow ? 'block' : 'none' }}>
              <FormItem label="商品卖点">
                {getFieldDecorator('jingle', {
                  rules: [{ max: 140, message: '不超过140个字!' }],
                  initialValue: editInfo && editInfo.jingle
                })(
                  <TextArea
                    maxLength={140}
                    style={{ width: 400, height: 120, resize: 'none' }}
                    placeholder="商品卖点可填写商品的简介或特点,最长不超过140个汉字"
                  />
                )}
              </FormItem>
              <FormItem label="商品视频">
                {getFieldDecorator('goodsVideoTest')(<Input type="hidden" />)}
                <div>
                  <Upload
                    fileList={fileListTwo}
                    onRemove={this.removeVideoFn.bind(this)}
                    name="file"
                    action="/proxy/cloud/oss/upload?type=goods"
                    listType="picture-card"
                    beforeUpload={this.beforeVideo.bind(this)}
                    onChange={this.uploadTwo.bind(this)}
                  >
                    {fileListTwo.length >= 1 ? null : uploadVideoButton}
                  </Upload>
                  <div className={Css.imgText}>
                    视频大小20MB以内,仅支持mp4格式
                  </div>
                </div>
              </FormItem>
              <FormItem label="商品编码">
                {getFieldDecorator('itemCode', {
                  rules: [
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格'
                    }
                  ],
                  initialValue: editInfo && editInfo.itemCode
                })(
                  <Input
                    style={{ width: '300px' }}
                    placeholder="请输入商品编码"
                  />
                )}
              </FormItem>
            </div>
            <FormItem>
              <a onClick={this.editMoreFn.bind(this)}>
                {moreShow ? '隐藏更多信息' : '编辑更多信息'}
              </a>
            </FormItem>

            <div className={Css.commonTitle}>商品销售信息</div>
            <FormItem label="商品规格">
              {getFieldDecorator('goodsAddTest', {
                initialValue: '1'
              })(<Input type="hidden" />)}
              <div
                className={Css.SizeBox}
                style={{ display: specList.length ? 'block' : 'none' }}
              >
                <ul className={Css.sizeUl}>
                  {specList.map((item, index) => {
                    return (
                      <li key={index}>
                        <div className={Css.specNameBox}>
                          <span>规格名称: </span>
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: 240 }}
                            placeholder="请输入规格名称"
                            onChange={(value, option) =>
                              this.specNameChange(index, value, option)
                            }
                            value={item.specId ? item.specId.toString() : null}
                          >
                            {specNameList}
                          </Select>
                          <Popover
                            onVisibleChange={(show) =>
                              this.handleVisibleChange(index, show)
                            }
                            content={this.popContent(index)}
                            visible={item.specNameShow}
                            trigger="click"
                          >
                            <a style={{ margin: '0 10px' }}>新增</a>
                          </Popover>
                          {index === 0 ? (
                            <Checkbox
                              checked={specList[index].isCheckImg}
                              onChange={(e) => this.addSizeImgFn(index, e)}
                            >
                              添加规格图片
                            </Checkbox>
                          ) : null}

                          <span
                            onClick={() => this.deleteBox(index)}
                            className={Css.deleteSize}
                          >
                            删除
                          </span>
                        </div>
                        <div className={Css.sizeValueBox}>
                          <span>规格值: </span>
                          <Select
                            disabled={!item.specId}
                            mode="tags"
                            style={{ width: '300px' }}
                            value={item.specValues}
                            onChange={(value, option) =>
                              this.getspecValuesFn(index, value, option)
                            }
                            placeholder="请选择规格值,最多20个"
                          >
                            {item.specValuesInfo
                              ? item.specValuesInfo.map((i) => {
                                  return (
                                    <Option
                                      key={i.specValueId}
                                      value={i.specValueId}
                                    >
                                      {i.specValue}
                                    </Option>
                                  )
                                })
                              : specValuesList}
                          </Select>
                        </div>
                        {/* 规格图片 */}
                        {item.isCheckImg ? (
                          <div style={{ marginLeft: '7px' }}>
                            {item.imageSrcArr &&
                              item.imageSrcArr.map((sonItem, sonIndex) => {
                                return (
                                  <div
                                    key={sonItem.specValueId}
                                    className={Css.specVaueImgBox}
                                  >
                                    {this.specImageFn(index, sonItem, sonIndex)}
                                    <div className={Css.specVaueTextBox}>
                                      {sonItem.specValue}
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <Button onClick={() => this.addSizeFn()}> + 添加规格</Button>
              <Link
                target="_blank"
                to="/goods/specList"
                style={{ marginLeft: '15px' }}
              >
                规格管理
              </Link>
            </FormItem>
            <FormItem label="价格库存">
              {getFieldDecorator('tableTest')(<Input type="hidden" />)}
              <Table
                rowKey={(record) => record.specList}
                bordered
                scroll={{ x: true }}
                pagination={false}
                columns={columns}
                dataSource={specData}
              />
            </FormItem>
            {attributeList?.length > 0 &&
              attributeList.map((item) => {
                return (
                  <FormItem label={item.attrKey}>
                    {getFieldDecorator(item.attrId.toString(), {
                      rules: [
                        {
                          required: true,
                          message: `请输入${item.attrKey}`
                        }
                      ],
                      initialValue:
                        editInfo &&
                        editInfo.attributeList &&
                        editInfo.attributeList.length
                          ? editInfo.attributeList.find(
                              (i) => i.attrId == item.attrId
                            ).attrValue
                          : 0
                    })(
                      <InputNumber
                        precision={2}
                        min={0}
                        style={{ width: '150px' }}
                        placeholder={`请输${item.attrKey}`}
                      />
                    )}
                    {item.attrKey === '服务时长' ? ' 小时' : null}
                  </FormItem>
                )
              })}
            {classId == 3 && payTypes && (
              <FormItem label="线上预约">
                {getFieldDecorator('payType', {
                  initialValue:
                    editInfo && editInfo.payType
                      ? editInfo.payType
                      : payTypes && payTypes.length && payTypes[0]
                })(
                  <Radio.Group>
                    {payTypes && payTypes.length
                      ? payTypes.map((item) => {
                          return (
                            <Radio value={item}>
                              {item === 'ONLINE' ? '在线支付' : '线下支付'}
                            </Radio>
                          )
                        })
                      : null}
                  </Radio.Group>
                )}
              </FormItem>
            )}
            <FormItem>
              <Checkbox
                checked={detailShow}
                onChange={(e) => this.goodsDetailFn(e)}
              >
                添加商品详情
              </Checkbox>
            </FormItem>
            {detailShow ? (
              <div style={{ marginBottom: '30px' }}>
                <GoodsDetail
                  detailEditList={
                    editInfo && editInfo.detail
                      ? editInfo.detail.detailContentList
                      : null
                  }
                  showDetailFn={(btn) => this.showDetailFn(btn)}
                  detailContentList={(detailContentList) =>
                    this.detailContentList(detailContentList)
                  }
                />
              </div>
            ) : null}
          </Form>
        </div>
        {showBtn && (
          <div className={Css.StepBottomBtn}>
            <div className={Css.StepBottomBox}>
              <Button onClick={() => this.nextFn()} type="primary">
                下一步
              </Button>
              <Popover
                content={this.cbContent()}
                visible={cbShow}
                onVisibleChange={(show) => this.cbShowChange(show)}
                trigger="click"
              >
                <Button style={{ marginLeft: '30px' }}>取消</Button>
              </Popover>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Form.create()(OneContent))
