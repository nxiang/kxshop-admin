import {
  actDelete,
  actDisable,
  actInfo,
  actPostpone
} from '@/services/activity'
import { withRouter } from '@/utils/compatible'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import { Button, Modal, PageHeader, Tabs } from 'antd'
import { Component } from 'react'
import Css from './ActivityDetail.module.scss'
import DetailTable from './modules/DetailTable/DetailTable'
// import DetailData from "./modules/DetailData/DetailData";
import { activityId } from '@/actions/index'
import SelectDate from '@/components/SelectDate/SelectDate'
import { connect } from 'dva'
import Panel from '../../../components/Panel'

const { TabPane } = Tabs
@connect(({ activitys }) => ({
  ...activitys
}))
class ActivityDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detailData: {},
      tabKey: 'drawRecord',
      visible: false,
      // beginTime: null,
      endTime: null,
      action: '',
      modalTitle: ''
    }
  }
  componentDidMount() {
    console.log(this.props)
    this.getActivityDetail()
  }

  // 获取活动详情
  async getActivityDetail() {
    const { data } = await actInfo({ activityId: this.props.location.state.id })
    this.setState({
      detailData: data
    })
  }

  // 展示活动状态 1 未开始  2 进行中 3 已结束 4 已禁用
  filterStatus(status) {
    let color = ''
    let text = ''
    switch (status) {
      case 1:
        color = 'grey'
        text = '未开始'
        break
      case 2:
        color = 'green'
        text = '进行中'
        break
      case 3:
        color = 'dark'
        text = '已结束'
        break
      case 4:
        color = 'red'
        text = '已禁用'
        break
      default:
        break
    }
    return (
      <span className={Css.status}>
        <span className={`${Css[color]} ${Css.dot}`} />
        <span className={`${Css[color]} ${Css.tag}`}>{text}</span>
      </span>
    )
  }

  // 切换标签
  switchTab(e) {
    // console.log(e)
    this.setState({
      tabKey: e
    })
  }

  // 动态显示弹框
  buttonAction(action) {
    this.setState({
      action,
      visible: true
    })
    switch (action) {
      case 'delete':
        this.setState({
          modalTitle: '删除'
        })
        break
      case 'disable':
        this.setState({
          modalTitle: '禁用'
        })
        break
      case 'postpone':
        this.setState({
          modalTitle: '延期'
        })
        break
      case 'edit':
        this.props.dispatch(activityId(this.props.location.state.id))
        // history.push(`/operation/activitys/add?id=${this.props.location.state.id}`);
        history.push(`/operation/activitys/add`)
        break
      default:
        break
    }
  }

  // 动态显示弹框内容
  modalContent() {
    const { action, detailData } = this.state
    console.log(action, this.props)
    switch (action) {
      case 'delete':
        return (
          <div>
            <ExclamationCircleOutlined
              style={{ color: '#FAB427', marginRight: '6px' }}
            />
            删除后，此活动数据将一同被删除，确定删除么？
          </div>
        )
      case 'disable':
        return (
          <div>
            <ExclamationCircleOutlined
              style={{ color: '#FAB427', marginRight: '6px' }}
            />
            禁用后，用户将无法参加活动，确定禁用么？
          </div>
        )
      case 'postpone':
        return (
          <div>
            <div style={{ marginBottom: '12px' }}>请选择活动延期时间</div>
            <SelectDate
              onSelectDate={this.setDate.bind(this)}
              fbeginTime={detailData.beginTime}
              fendTime={detailData.endTime}
              postpone
            />
          </div>
        )
      default:
    }
  }

  // 弹框确认操作
  async handleOk() {
    const { endTime } = this.state
    switch (this.state.action) {
      case 'delete':
        await actDelete({ activityId: this.props.location.state.id })
        history.push('/operation/activitys/list')
        break
      case 'disable':
        await actDisable({ activityId: this.props.location.state.id })
        this.getActivityDetail()
        break
      case 'postpone':
        // console.log(this.state.endTime)
        await actPostpone({ activityId: this.props.location.state.id, endTime })
        this.getActivityDetail()
        break
      default:
        break
    }
    this.setState({
      visible: false
    })
  }

  // 弹框取消操作
  handleCancel() {
    this.setState({
      visible: false
    })
  }

  // 选择延期活动时间
  setDate(phase, date) {
    console.log(phase, date)
    let dateFormat = date
    if (date) {
      dateFormat = date.format('YYYY-MM-DD HH:mm')
    }
    this.setState({
      [`${phase}Time`]: dateFormat
    })
  }

  render() {
    const { detailData, tabKey, visible, modalTitle } = this.state
    const { status } = this.state.detailData
    return (
      <Panel>
        <PageHeader
          title="活动详情"
          style={{ backgroundColor: '#fff' }}
          extra={[
            (status == 1 || status == 4) && (
              <Button
                key="btn1"
                type="primary"
                onClick={this.buttonAction.bind(this, 'edit')}
              >
                编辑
              </Button>
            ),
            status == 1 && (
              <Button
                key="btn2"
                type="primary"
                onClick={this.buttonAction.bind(this, 'delete')}
              >
                删除
              </Button>
            ),
            status == 2 && (
              <Button
                key="btn3"
                type="primary"
                onClick={this.buttonAction.bind(this, 'postpone')}
              >
                延期
              </Button>
            ),
            status == 2 && (
              <Button
                key="btn4"
                type="primary"
                onClick={this.buttonAction.bind(this, 'disable')}
              >
                禁用
              </Button>
            )
          ]}
        >
          <div className={Css.downHeader}>
            <div className={Css.detailTitle}>
              <span>{detailData.activityName}</span>
              {this.filterStatus(status)}
            </div>
            <div className={Css.detailDesc}>
              <div className={Css.descOne}>
                <span>应用模板：{detailData.templateName}</span>
                <span>
                  活动时间：{detailData.beginTime} 至 {detailData.endTime}
                </span>
                <span>活动方案：{detailData.copyWrite}</span>
              </div>
              <span>活动规则：{detailData.ruleDesc}</span>
            </div>
            <div>
              {/* 只修改当前的Tabs样式 故className设置为字符串而非导入样式 不会被css loader编译成哈希字符串 */}
              <Tabs
                defaultActiveKey="drawRecord"
                onChange={this.switchTab.bind(this)}
                animated={false}
                className="tab"
              >
                <TabPane tab="抽奖记录" key="drawRecord">
                  {tabKey === 'drawRecord' ? (
                    <DetailTable fprops={this.props} tabKey={tabKey} />
                  ) : null}
                </TabPane>
                <TabPane tab="中奖明细" key="winDetail">
                  {tabKey === 'winDetail' ? (
                    <DetailTable fprops={this.props} tabKey={tabKey} />
                  ) : null}
                </TabPane>
                {/* <TabPane tab="活动数据" key="activityData">
									<DetailData />
								</TabPane> */}
              </Tabs>
            </div>
          </div>
        </PageHeader>
        <div className={Css.ActivityDetailBox}>
          <div className={Css.ActivityDetailHeader} />
          <Modal
            title={modalTitle}
            centered
            visible={visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
          >
            {this.modalContent()}
          </Modal>
        </div>
      </Panel>
    )
  }
}

export default withRouter(ActivityDetail)
