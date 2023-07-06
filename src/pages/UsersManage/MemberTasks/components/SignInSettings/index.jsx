import React, { useState, useEffect, useRef } from 'react';
import Css from './index.module.scss';
import { Spin, InputNumber, Col, Row, Table, Space, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SpecialSelect from '@/bizComponents/EditorModules/selects/SpecialSelect';
import OssUpload from '@/components/OssUpload/index';
import SelfModal from '../SignInSettingsModal/index'
import { connect } from 'dva';
import { getSignConfigDetailApi, setSignConfigApi } from '@/services/member';
import { cloneDeep } from 'lodash-es';
import { history } from '@umijs/max';
import { Link } from 'react-router-dom';

const { Column } = Table;
const { confirm } = Modal

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

export default connect(mapStateToProps)(({ collapsed, tabsKey }) => {
  // laoding
  const [spinning, setSpinning] = useState(false);
  // 弹窗显示状态
  const [modalData, setModalData ] = useState({
    show: false,
    type: 'add',
    index: ''
  })
  // 表格数据
  const [formData, setFormData] = useState({
    continueSignForms: [],
    presentPoint: 1,
    ruleDescLinkInfo: {
      type: 'special',
      link: ''
    },
    backGroundImage: ''
  });

  const { continueSignForms, ruleDescLinkInfo, backGroundImage, presentPoint } = formData

  const tableColumn = [
    {
      title: '连续签到天数',
      align: 'center',
      dataIndex: 'continueDays',
      key: 'continueDays',
      render: text => <div>{text}&nbsp;天</div>
    },
    {
      title: '奖励',
      align: 'center',
      dataIndex: 'presentPoint',
      key: 'presentPoint',
      render: text => <div>{text}&nbsp;积分</div>
    },
    {
      width: "200px",
      align: 'center',
      title: '操作',
      key: 'action',
      render: (_, record, index) => (
        <Space size="middle">
          <Button type="link" onClick={() => setModal({type:'edit', show: true, index})}> 编辑 </Button>
          <Button type="link" danger onClick={() => deleteRow(index)}> 删除 </Button>
        </Space>
      ),
    },
  ];

  // 展示切换判断重新加载数据
  useEffect(() => {
    if (tabsKey == 1) getDetailData()
  }, [tabsKey]);

  const getDetailData = async () => {
    try {
      setSpinning(true)
      const res = await getSignConfigDetailApi()
      if (res.success) {
        const { daySignInResult = {}, continueSignForms= [] } = res.data || {}
        const { presentPoint, backGroundImage, ruleDescLinkInfo = {} } = daySignInResult
        const link = ruleDescLinkInfo?.link? JSON.parse(ruleDescLinkInfo?.link): ''
        setFormData({
          continueSignForms,
          presentPoint,
          backGroundImage,
          ruleDescLinkInfo: {
            type: ruleDescLinkInfo?.type || 'special',
            link
          }
        });
      } 
      setSpinning(false)
    } catch (error) {
      console.log(error)
      setSpinning(false)
    }
  }

  // 设置页面数据
  const formDataChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  // 设置表格数据
  const setModal = data => {
    const { type, show, index } = data
    const params = { type, show }
    if (type === 'edit') {
      params.index = index
    } else if (type === 'add'){
      params.index = {}
    }
    setModalData({
      ...modalData,
      ...params
    })
  }

  // 删除数据确认
  const deleteRow = index => {
    confirm({
      title: '删除',
      content: '确定要删除连续签到奖励设置？',
      onOk: async () =>  {
        const listData = cloneDeep(continueSignForms)
        listData.splice(index, 1)
        const params = {
          continueSignForms: listData,
          includeContinueSignIn: true
        }
        try {
          setSpinning(true)
          const res = await setSignConfigApi(params)
          if (res.success) {
            message.success('删除成功');
            await getDetailData()
            setSpinning(false)
          } else {
            setSpinning(false)
          }
        } catch (error) {
          setSpinning(false)
        }
      },
      onCancel() {},
    });
  }

  // 保存日签设置
  const submitData = async () => {
    const { link, type } = ruleDescLinkInfo

    if(!link) {
      return message.warning('请选择规则说明所在专题页')
    } if(!backGroundImage) {
      return message.warning('请设置背景图')
    } if(!presentPoint) {
      return message.warning('请设置日签奖励')
    }
    const params = {
      daySignInForm: {
        presentPoint,
        backGroundImage,
        ruleDescLinkInfo: {
          type,
          link: JSON.stringify(link)
        },
      },
      includeDaySignIn: true
    }
    try {
      setSpinning(true)
      const res = await setSignConfigApi(params)
      if (res.success) message.success('保存成功')
      setSpinning(false)
    } catch (error) {
      setSpinning(false)
    }
  }

  return (
    <Spin size="large" spinning={spinning}>
      <div className={Css['pd10']}>
        {/* 日签奖励 */}
        <Row className={Css['mb16']} wrap={false} align="middle">
          <Col flex="90px">
            <span className={Css['red']}>*</span>
            日签奖励：
          </Col>
          <Col flex="auto">
            <InputNumber
              value={presentPoint}
              onChange={(e) => formDataChange('presentPoint', e)} 
              addonAfter={<div>积分</div>}
              defaultValue={100}
              min={1}
              max={9999}
              precision={0}
            />
          </Col>
        </Row>
        {/* 连签奖励 */}
        <Row className={Css['mb16']} wrap={false} align="top">
          <Col flex="90px">
            <div style={{ paddingTop: '8px'}}>
              连签奖励：
            </div>
          </Col>
          <Col flex="auto">
            <Table
              ellipsis
              bordered
              rowKey={record => record.continueDays}
              dataSource={continueSignForms}
              columns={tableColumn}
              pagination={false}
              scroll={{ y: 300 }}
              size="small"
            />
            <div style={{ marginTop: '16px' }}>
              <Space size="middle">
                <Button type="link" onClick={()=>setModal({show: true, type: 'add'})}> <PlusOutlined /> 新增连签奖励 </Button>
                <span>tips：最长连签奖励天数为签到周期</span>
              </Space>
            </div>
          </Col>
        </Row>
        {/* 规则说明 */}
        <Row className={Css['mb16']} wrap={false} align="middle">
          <Col flex="90px">
            <span className={Css['red']}>*</span>
            规则说明：
          </Col>
          <Col flex="auto">
            <Space size="middle">
              <SpecialSelect
                itemData={ruleDescLinkInfo.link}
                alterData={(e) => formDataChange('ruleDescLinkInfo', {type: 'special', link: e})}
              />
              <Link
                target="_blank"
                to="/shop/special"
                style={{ color:"#1890FF" }}
              >
                前往编辑规则专题页
              </Link>
            </Space>
          </Col>
        </Row>
        {/* 背景图 */}
        <Row className={Css['mb16']} wrap={false} align="top">
          <Col flex="90px">背景图：</Col>
          <Col flex="auto">
            <OssUpload 
              value={backGroundImage}
              heightPx='100px'
              widthPx='100px'
              limitSize={2}
              limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
              onChange={(e)=>formDataChange('backGroundImage', e)}
            />
            <span>推荐图片尺寸375*414，大小不超过2M</span>
          </Col>
        </Row>
        {/* 保存按钮 */}
        <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
          <Button type="primary" size="large" onClick={submitData}> 签到设置-保存 </Button>
        </div>
        {/* 连签奖励弹窗 */}
        <SelfModal 
          show={modalData.show}
          index={modalData.index}
          modalType={modalData.type}
          listData={continueSignForms}
          setShow={(show)=>setModalData({...modalData, show})}
          onGetDetailData={() => getDetailData()}
        />
      </div>
    </Spin>
  );
});
