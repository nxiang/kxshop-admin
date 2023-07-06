import React, { useState, useEffect, useRef } from 'react';
import { history } from '@umijs/max';
import { connect } from 'dva';
import Css from './MemberTasksEdit.module.scss';
import Panel from '@/components/Panel';
import { PageHeader, Spin, Button, Row, Col, Input, Checkbox, InputNumber, Space, Modal, message } from 'antd';
import OssUpload from '@/components/OssUpload/index';
import AlipaySkipSelect from '@/bizComponents/EditorModules/selects/AlipaySkipSelect';
import { vipTaskEditApi, getVipTaskDetailApi } from '@/services/member';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible';

const { TextArea } = Input;
const { confirm } = Modal;

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

export default withRouter(connect(mapStateToProps)(({ collapsed, match })  =>  {
  const [spinning, setSpinning] = useState(false);

  const [pagesData, setPagesData] = useState({
    id: '',
    type: '',
    taskName: '',
    taskDesc: '',
    icon: '',
    linkInfo: {
      type: 'alipaySkip',
      link: ''
    },
    presentPoint: 1
  })

  const { params: { id: detailId } } = match
  const { type, taskName, taskDesc, icon, linkInfo, presentPoint } = pagesData

  const typeDictionaries = {
    joinVip: '加入会员',
    joinFansGroup: '加入粉丝群',
    favoriteApplet: '收藏小程序',
    firstOrderOfDay: '每日首单',
    order: '下单得积分',
    comment: '评论得积分',
  }

  // 展示切换判断重新加载数据
  useEffect(() => {
    getDetail(detailId)
  }, [detailId]);

  const getDetail = async id => {
    try {
      setSpinning(true)
      const res = await getVipTaskDetailApi({ taskId: id })
      if (res.success) {
        const { id, type, icon, linkInfo, presentPoint, desc: taskDesc, name: taskName} = res.data
        const pagesDataTmp = {
          id,
          type,
          taskName,
          taskDesc,
          icon,
          presentPoint,
          linkInfo: {
            type: linkInfo?.type || 'alipaySkip',
            link: linkInfo?.link
          },
        }
        // if(type === 'order') delete pagesDataTmp.presentPoint
        setPagesData(pagesDataTmp)
      }
      setSpinning(false)
    } catch (error) {
      setSpinning(false)
    }
  }

  const setPagesDataFn = (key, value) => {
    setPagesData({
      ...pagesData,
      [key]: value
    })
  }

  const saveChange = async () => {
    if (!taskDesc.trim()) {
      return message.warning('请配置任务名称')
    } if(!taskName.trim()) {
      return message.warning('请配置任务说明')
    } if(!linkInfo.link&&type==='joinFansGroup') {
      return message.warning('请配置入群链接')
    } if(!icon) {
      return message.warning('请配置任务icon')
    } 
    
    if(!presentPoint&&type!=='order') {
      return message.warning('请配置任务积分奖励')
    }
    try {
      setSpinning(true)
      const params = {
        ...pagesData,
        taskDesc: taskDesc.trim(),
        taskName: taskName.trim()
      }
      const res = await vipTaskEditApi(params)
      // console.log('res', res)
      if (res.success) {
        message.success('保存成功')
        setPagesData(params)
        history.go(-1)
      }
      setSpinning(false)
    } catch (error) {
      setSpinning(false)
    }
  }

  // 返回上个页面
  const backtrack = () => {
    confirm({
      title: '返回',
      content: '确认直接返回吗？返回后将不保留当前修改内容。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        history.go(-1)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Panel>
      <Spin size="large" spinning={spinning}>
        <PageHeader style={{ background: '#fff', minHeight: '700px' }} title="会员任务编辑">
          <h1>任务描述</h1>
          {/* 任务类型 */}
          <Row className={Css['mb16']} wrap={false} align="middle">
            <Col flex="90px">
              <span className={Css['red']}>*</span>
              任务类型：
            </Col>
            <Col flex="auto">
              {typeDictionaries[type]}
            </Col>
          </Row>
          {/* 任务名称 */}
          <Row className={Css['mb16']} wrap={false} align="middle">
            <Col flex="90px">
              <span className={Css['red']}>*</span>
              任务名称：
            </Col>
            <Col flex="auto">
              <Input 
                value={taskName}
                onChange={e => setPagesDataFn('taskName', e.target.value)}
                placeholder='请输入任务名称（最多输入8个字）'
                maxLength={8}
              />
            </Col>
          </Row>
          {/* 任务说明 */}
          <Row className={Css['mb16']} wrap={false} align="top">
            <Col flex="90px">
              <span className={Css['red']}>*</span>
              任务说明：
            </Col>
            <Col flex="auto">
              <TextArea
                value={taskDesc}
                onChange={e => setPagesDataFn('taskDesc', e.target.value)}
                rows={4}
                placeholder='请输入任务说明（最多输入32个字）'
                maxLength={32}
              />
            </Col>
          </Row>
          {/* 任务Icon */}
          <Row className={Css['mb16']} wrap={false} align="top">
            <Col flex="90px">
              <span className={Css['red']}>*</span>
              任务Icon：
            </Col>
            <Col flex="auto">
              <OssUpload 
                value={icon}
                onChange={e => setPagesDataFn('icon', e)}
                heightPx='100px'
                widthPx='100px'
                limitSize={0.5}
                limitFormat={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml']}
              />
            </Col>
          </Row>
          {/* 入群链接 */}
          {type==='joinFansGroup'&&(<Row className={Css['mb16']} wrap={false} align="middle">
            <Col flex="90px">
              <span className={Css['red']}>*</span>
              入群链接：
            </Col>
            <Col flex="auto">
              <AlipaySkipSelect
                itemData={linkInfo.link}
                alterData={e => setPagesDataFn('linkInfo', {type: 'alipaySkip', link: e})}
              />
            </Col>
                                    </Row>)}

          <h1>任务奖励</h1>
          {/* 任务类型 */}
          <Row className={Css['mb16']} wrap={false} align="middle">
            {type==='order'?
              (<Col flex="auto">
                <span className={Css['red']}>*</span>
                <Space align="center">
                  <span>下单得积分任务不可配置任务奖励，奖励取自积分奖励规则</span>
                  <Link
                    target="_blank"
                    to="/users/integralRights"
                    style={{ color:"#1890FF" }}
                  >
                    去设置
                  </Link>
                </Space>
               </Col>) :
              (<Col flex="auto">
                <Space align="center">
                  <span>
                    <span className={Css['red']}>*</span>
                    赠送
                  </span>
                  <InputNumber
                    min={1}
                    max={9999}
                    precision={0}
                    value={presentPoint}
                    onChange={e => setPagesDataFn('presentPoint', e)}
                    style={{ width: '150px' }}
                    placeholder="请输入积分"
                  />
                  <span>积分</span>
                </Space>
               </Col>
              )}
          </Row>


          {/* 保存按钮 */}
          <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
            <Space size="large">
              <Button size="large" onClick={backtrack}> 取消 </Button>
              <Button type="primary" size="large" onClick={saveChange}> 保存 </Button>
            </Space>
          </div>
        </PageHeader>
      </Spin>
    </Panel>
  );
}));
