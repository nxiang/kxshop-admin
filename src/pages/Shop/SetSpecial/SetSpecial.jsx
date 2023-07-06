import Panel from '@/components/Panel'
import { withRouter } from '@/utils/compatible'
import { showBut } from '@/utils/utils'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import { Button, Form, Input, Modal, Table, message } from 'antd'
import html2canvas from 'html2canvas'
import Validator from 'kx-validator'
import moment from 'moment'
import React, { Component } from 'react'
import Css from './SetSpecial.module.scss'

import {
  addDecorateSpecial,
  choseTheme,
  decorateSpecialUrl,
  deleteDecorateSpecial,
  selectDecorateSpecial,
  updateDecorateSpecial
} from '@/services/shop'

const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 11 } }

/** 专题页名称校验 */
const addTextRules = [
  {
    required: true,
    message: '请填写专题名称'
  },
  {
    validator: async (_, value = '') => {
      return value.length <= 12
        ? Promise.resolve()
        : Promise.reject(new Error('长度限制12位以内'))
    }
  },
  {
    validator: async (_, value) => {
      return (await validator.xss(value))
        ? Promise.resolve()
        : Promise.reject(new Error('格式有误'))
    }
  }
]

/** 描述校验规则 */
const addDescribeRules = [
  {
    validator: async (_, value = '') => {
      return value.length <= 24
        ? Promise.resolve()
        : Promise.reject(new Error('长度限制24位以内'))
    }
  },
  {
    validator: async (_, value) => {
      return (await validator.xss(value))
        ? Promise.resolve()
        : Promise.reject(new Error('格式有误'))
    }
  }
]

const { Column } = Table
const { confirm } = Modal
const validator = new Validator({
  mode: 'cache',
  timeout: 200
})
class SetSpecial extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 新增相关
      addVisible: false,
      addText: '',
      addDescribe: '',
      /**
       * 对应专题模板
       * 0 空模板
       * 1 店铺信息模板
       */
      decorateData: 0,
      // 编辑相关
      editorVisible: false,
      editorId: '',
      editorText: '',
      editorDescribe: '',
      // 列表展示数组
      listData: [],
      // 链接框的显隐藏
      imgModalShow: false,
      // 链接数据
      imgList: [],
      imgSpecialName: '',
      // 分页数据
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // clientId: null,
      qrCodeUrl: null
    }
    console.log('formxx', this.form)
  }

  addFormRef = React.createRef(null)
  editFormRef = React.createRef(null)
  codeImgId = React.createRef()

  componentDidMount() {
    this.choseThemeApi()
  }

  choseThemeApi(page) {
    const {
      sourcePage: { pageSize }
    } = this.state
    const data = {
      page: page || 1,
      pageSize
    }
    choseTheme(data).then((res) => {
      if (res.success) {
        // loadingCopy
        const listData = res.data.rows.map((item) => {
          item.loadingCopy = false
          item.loadingDel = false
          item.loadingLink = false
          return item
        })
        this.setState({
          listData,
          sourcePage: {
            current: res.data.current,
            pageSize: res.data.pageSize,
            total: res.data.total
          }
        })
      }
    })
  }

  // 输入change事件
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value.trim()
    })
  }

  delSpecial = async (storeSpecialId, index) => {
    const {
      sourcePage: { current }
    } = this.state
    confirm({
      title: '删除',
      content: '删除专题会影响店铺装修，确定要删除么？',
      onOk: async () => {
        const listData = this.state.listData || []
        try {
          const data = {
            storeSpecialId
          }
          listData[index].loadingDel = true
          this.setState({ listData })
          const res = await deleteDecorateSpecial(data)
          if (res.errorCode === '0') {
            message.success('删除成功')
            this.choseThemeApi(current)
          }
        } catch (error) {
          console.error('error', error)
        } finally {
          listData[index].loadingDel = false
          this.setState({ listData })
        }
      },
      onCancel() {}
    })
  }

  addShowModal = () => {
    this.setState({
      addVisible: true
    })
  }

  // 新建专题确认
  addHandleOk = async () => {
    const values = await this.addFormRef?.current?.validateFields()
    console.log('addHandleOk values', values)
    const {
      addText,
      addDescribe,
      decorateData,
      sourcePage: { current }
    } = this.state
    // if (addText === '') {
    //   message.warning('专题名称不能为空')
    //   return
    // }
    let decorateDataModule = []
    if (decorateData == 1) {
      decorateDataModule = [
        {
          itemType: 'images_ad',
          itemData: [
            {
              image: '',
              type: 'none',
              data: ''
            }
          ],
          itemIndex: 1
        },
        {
          itemType: 'shop_info',
          itemData: {
            shopName: '默认店铺',
            shopTime: '8:00至22:00',
            shopAddress: '杭州市拱墅浙江省杭州市拱墅区祥园路\n区武林门码头',
            shopPhone: '8848-88488848'
          },
          itemIndex: 2
        },
        {
          itemType: 'rich_text',
          itemData: [
            {
              data: '请在右侧编辑文本内容<p><br></p>'
            }
          ],
          itemIndex: 3
        }
      ]
    }
    const data = {
      specialName: addText,
      description: addDescribe,
      decorateData: JSON.stringify(decorateDataModule)
    }
    addDecorateSpecial(data).then((res) => {
      if (res.success) {
        this.choseThemeApi(current)
        this.addHandleCancel()
        history.push(`/shop/special/config/${res.data}`)
      }
    })
  }

  // 新建专题取消
  addHandleCancel = () => {
    this.setState({
      addVisible: false,
      addText: '',
      addDescribe: ''
    })
  }

  editorShowModal = (record) => {
    console.log('editorShowModal', record, this.editFormRef)
    this.setState(
      {
        editorId: record.storeSpecialId,
        editorText: record.specialName,
        editorDescribe: record.description,
        editorVisible: true
      },
      () => {
        // eslint-disable-next-line no-unused-expressions
        this.editFormRef?.current?.setFieldsValue?.({
          editorText: record.specialName,
          editorDescribe: record.description
        })
      }
    )
  }

  imgType = (t) => {
    const type = t.toLowerCase().replace(/jpg/i, 'jpeg')
    const r = type.match(/png|jpeg|bmp|gif/)[0]
    return `image/${r}`
  }

  downloadImg(clientId, qrCodeUrl) {
    const { imgSpecialName } = this.state
    // const currentTop = this.codeImgId.current.offsetTop;
    // const currentLeft = this.codeImgId.current.offsetLeft;
    // console.log('html2canvas=========', this.codeImgId.current, currentTop, currentLeft);
    this.setState(
      {
        // clientId,
        qrCodeUrl
      },
      () => {
        html2canvas(this.codeImgId.current, {
          x: 0,
          y: 0,
          allowTaint: false,
          useCORS: true // 允许加载跨域的图片
        }).then((canvas) => {
          const imgPngSrc = canvas.toDataURL('image/png') // 将canvas保存为图片
          const imgData = imgPngSrc.replace(
            this.imgType('png'),
            'image/octet-stream'
          )
          const typeStr = imgSpecialName
          const filename = `${typeStr}.png`
          this.saveFile(imgData, filename)
        })
      }
    )
  }

  saveFile = (data, fileName) => {
    const saveLink = document.createElement('a')
    saveLink.href = data
    saveLink.download = fileName
    const event = document.createEvent('MouseEvents')
    event.initEvent('click', true, false)
    saveLink.dispatchEvent(event)
  }

  imgShowModal = async (record, index) => {
    const listData = this.state.listData || []
    try {
      listData[index].loadingLink = true
      this.setState({ listData })
      const { storeSpecialId, specialName } = record
      const data = {
        storeSpecialId
      }
      const res = await decorateSpecialUrl(data)
      if (res.success) {
        const { data = [] } = res
        if (data.length === 0) {
          message.error('暂无链接可下载')
          return
        }
        console.log('res================', res)
        this.setState({
          imgModalShow: true,
          imgList: data,
          imgSpecialName: specialName
        })
      }
    } finally {
      listData[index].loadingLink = false
      this.setState({ listData })
    }
  }

  specialCopy = async (record, index) => {
    const listData = this.state.listData || []
    try {
      listData[index].loadingCopy = true
      this.setState({
        listData
      })
      const res = await selectDecorateSpecial({
        storeSpecialId: record?.storeSpecialId
      })
      if (!res?.success) throw new Error('请求专题页详情出错')
      const { data } = res
      const { description, decorateData, setting, specialName } = data
      // 专题页名称，重新命名
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      // 尝试替换掉旧的专题页名称中的时间部分
      const prefix = specialName.replace(
        /-\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g,
        ''
      )
      // 拼接新的专题页名称
      const name = [prefix, now].join('-')
      const params = {
        description,
        decorateData,
        setting,
        specialName: name
      }
      const res1 = await addDecorateSpecial(params)
      if (!res1.success) throw new Error('复制时，创建新的专题页出错')
      message.success('复制成功')
      // 跳转对应的专题页
      this.configPageSkip({ storeSpecialId: res1.data })
      // console.log('specialCopy', params)
    } finally {
      listData[index].loadingCopy = false
      this.setState({
        listData
      })
    }
  }

  editorHandleOk = async () => {
    const values = await this.editFormRef?.current?.validateFields()
    console.log('addHandleOk values', values)
    const {
      // specialName,
      editorId,
      editorText,
      editorDescribe,
      sourcePage: { current }
    } = this.state
    // if (specialName === '') {
    //   message.warning('专题名称不能为空')
    //   return
    // }
    const data = {
      storeSpecialId: editorId,
      specialName: editorText,
      description: editorDescribe
    }
    await updateDecorateSpecial(data)
    this.choseThemeApi(current)
    this.setState({
      editorVisible: false
    })
  }

  editorHandleCancel = () => {
    this.setState({
      editorVisible: false
    })
  }

  configPageSkip = (record) => {
    history.push(`/shop/special/config/${record.storeSpecialId}`)
  }

  render() {
    const {
      listData,
      sourcePage: { current, pageSize, total },
      imgModalShow,
      imgList,
      imgSpecialName,
      qrCodeUrl,
      addVisible,
      addText,
      addDescribe,
      decorateData,
      editorVisible,
      editorText,
      editorDescribe
    } = this.state
    return (
      <Panel title="专题页配置" content="配置制定页面内容">
        <div className={Css['set-special-box']}>
          <div className={Css['content-box']}>
            <div>
              {showBut('special', 'special_add') ? (
                <Button
                  className={Css['content-header-add-buttom']}
                  type="primary"
                  onClick={this.addShowModal}
                >
                  <PlusOutlined
                    style={{
                      width: '18px',
                      height: '18px',
                      marginRight: '8px',
                      fontSize: '18px'
                    }}
                  />
                  <p>新增专题页</p>
                </Button>
              ) : null}
            </div>
            <Table
              ellipsis
              rowKey={(record) => record.storeSpecialId}
              dataSource={listData}
              pagination={{
                current,
                pageSize,
                total,
                onChange: (page) => this.choseThemeApi(page)
              }}
            >
              <Column
                align="center"
                title="专题ID"
                dataIndex="storeSpecialId"
              />
              <Column align="center" title="名称" dataIndex="specialName" />
              <Column align="center" title="描述" dataIndex="description" />
              <Column
                align="center"
                title="操作"
                render={(text, record, index) => (
                  <div className={Css['bule-text-box']}>
                    {showBut('special', 'special_configure') ? (
                      <Button
                        size="small"
                        type="link"
                        onClick={() => this.configPageSkip(record)}
                      >
                        配置
                      </Button>
                    ) : null}
                    {showBut('special', 'special_edit') ? (
                      <Button
                        size="small"
                        type="link"
                        onClick={this.editorShowModal.bind(this, record)}
                      >
                        编辑
                      </Button>
                    ) : null}
                    {showBut('special', 'special_links') ? (
                      <Button
                        size="small"
                        type="link"
                        loading={this.state.listData[index].loadingLink}
                        onClick={this.imgShowModal.bind(this, record, index)}
                      >
                        链接
                      </Button>
                    ) : null}
                    {showBut('special', 'special_copy') ? (
                      <Button
                        loading={this.state.listData[index].loadingCopy}
                        size="small"
                        type="link"
                        onClick={this.specialCopy.bind(this, record, index)}
                      >
                        复制
                      </Button>
                    ) : null}
                    {showBut('special', 'special_delete') ? (
                      <Button
                        size="small"
                        type="link"
                        loading={this.state.listData[index].loadingDel}
                        onClick={this.delSpecial.bind(
                          this,
                          record.storeSpecialId,
                          index
                        )}
                      >
                        删除
                      </Button>
                    ) : null}
                  </div>
                )}
              />
            </Table>
          </div>
          <Modal
            title="专题页链接"
            width={474}
            visible={imgModalShow}
            onOk={() => {
              this.setState({ imgModalShow: false })
            }}
            onCancel={() => {
              this.setState({ imgModalShow: false })
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  this.setState({ imgModalShow: false })
                }}
              >
                关闭
              </Button>
            ]}
          >
            <div className={Css['modal-img-box']}>
              {imgList.map((item, index) => (
                <div className={Css['modal-img-item']} key={item.clientId}>
                  <div className={Css['codeShowBox']}>
                    <div className={Css.codeImg}>
                      <img
                        crossOrigin="Anonymous"
                        src={`${item.qrCodeUrl}`}
                        alt=""
                      />
                      <div className={Css.storeName}>{imgSpecialName}</div>
                    </div>
                  </div>

                  <Button
                    className={Css['downloadButton']}
                    onClick={() =>
                      this.downloadImg(item.clientId, item.qrCodeUrl)
                    }
                  >
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </Modal>

          {/* 生成图片结束 */}
          <div
            id="codeImgId"
            ref={this.codeImgId}
            className={`${Css['codeLookBox']} ${Css['codeImgId']}`}
          >
            <div className={Css.codeImg}>
              <img crossOrigin="Anonymous" src={`${qrCodeUrl}`} alt="" />
              <div className={Css.storeName}>{imgSpecialName}</div>
            </div>
          </div>
          {/* 生成图片结束 */}
          <Modal
            title="新增专题"
            width={674}
            visible={addVisible}
            onOk={this.addHandleOk}
            onCancel={this.addHandleCancel}
            afterClose={() => {
              // eslint-disable-next-line no-unused-expressions
              this.addFormRef?.current?.resetFields?.()
            }}
          >
            <Form ref={this.addFormRef}>
              <Form.Item
                label="专题名称"
                name="addText"
                {...formItemLayout}
                rules={addTextRules}
              >
                <Input
                  type="text"
                  placeholder="请输入，12个字以内"
                  name="addText"
                  value={addText}
                  onChange={this.onChange}
                />
              </Form.Item>
              <Form.Item
                label="描述"
                name="addDescribe"
                {...formItemLayout}
                rules={addDescribeRules}
              >
                <Input
                  placeholder="请输入，24个字以内"
                  name="addDescribe"
                  value={addDescribe}
                  onChange={this.onChange}
                />
              </Form.Item>
              <div className={Css['modal-text-box']}>
                <p className={Css['modal-title']}>专题页模板：</p>
                <p style={{ width: 340 }} />
              </div>
              <div className={Css['modal-modules-select']}>
                <div
                  className={
                    decorateData == 0
                      ? `${Css['modules-item']} ${Css['modules-item-hover']}`
                      : Css['modules-item']
                  }
                  onClick={() => {
                    this.setState({
                      decorateData: 0
                    })
                  }}
                >
                  空白模板
                </div>
                <div
                  className={
                    decorateData == 1
                      ? `${Css['modules-item']} ${Css['modules-item-hover']}`
                      : Css['modules-item']
                  }
                  onClick={() => {
                    this.setState({
                      decorateData: 1
                    })
                  }}
                >
                  <img
                    className={Css['modules-item-img']}
                    src="https://img.kxll.com/admin_manage/special_modules_shop.png"
                    alt=""
                  />
                </div>
              </div>
            </Form>
          </Modal>
          <Modal
            title="编辑专题"
            width={674}
            visible={editorVisible}
            onOk={this.editorHandleOk}
            onCancel={this.editorHandleCancel}
            afterClose={() => {
              // eslint-disable-next-line no-unused-expressions
              this.addFormRef?.current?.resetFields?.()
            }}
          >
            <Form ref={this.editFormRef}>
              <Form.Item
                label="专题名称"
                name="editorText"
                {...formItemLayout}
                rules={addTextRules}
              >
                <Input
                  type="text"
                  placeholder="请输入，12个字以内"
                  name="editorText"
                  value={editorText}
                  onChange={this.onChange}
                />
              </Form.Item>
              <Form.Item
                label="描述"
                name="editorDescribe"
                {...formItemLayout}
                rules={addDescribeRules}
              >
                <Input
                  placeholder="请输入，24个字以内"
                  name="editorDescribe"
                  value={editorDescribe}
                  onChange={this.onChange}
                />
              </Form.Item>
            </Form>
            {/* <div className={Css['modal-text-box']}>
              <p className={Css['modal-title']}>专题名称：</p>
              <Input
                className={Css['modal-text-inupt']}
                type="text"
                placeholder="请输入，12个字以内"
                maxLength={12}
                name="editorText"
                value={editorText}
                onChange={this.onChange}
              />
            </div>
            <div className={Css['modal-text-box']}>
              <p className={Css['modal-title']}>描述：</p>
              <Input
                className={Css['modal-text-inupt']}
                placeholder="请输入，24个字以内"
                maxLength={24}
                name="editorDescribe"
                value={editorDescribe}
                onChange={this.onChange}
              />
            </div> */}
          </Modal>
        </div>
      </Panel>
    )
  }
}

export default withRouter(SetSpecial)
