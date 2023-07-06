import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { history } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import Css from './SetSpecialConfig.module.scss';
import Panel from '@/components/Panel';

import EditorTemplate from '@/bizComponents/EditorTemplate/EditorTemplate';

// 引入接口
import { selectDecorateSpecial, configDecorateSpecial } from '@/services/shop';
import { dealDecorationFn } from '@/bizComponents/EditorTemplate/publicFun'
import { withRouter } from '@/utils/compatible';

const { confirm } = Modal;

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

function SetSpecialConfig(props) {
  const { collapsed, dispatch } = props;
  const editorTemplate = useRef();
  // 模板参数
  const [specialList, setSpecialList] = useState([]);
  // 模板样式
  const [specialSetting, setSpecialSetting] = useState({
    backgroundType: 1,
    backgroundImg: '',
    backgroundColor: {
      r: '255',
      g: '255',
      b: '255',
      a: '1',
    },
    antForestShow: false,
    shopShow: false,
  });
  // 模板遮罩
  const [specialSpin, setSpecialSpin] = useState(true);

  const importBasisNum = [
    'ad',
    'images_ad',
    'assist_ad',
    'coupon_ad',
    'navi',
    'notice',
    'recommend',
    'video',
    'rich_text',
    'shop_info',
    'alipay_mkt',
    'shop_cart',
    'promotion_goods',
    'subscribe',
    'anXinChong',
    'integral',
    'vipcard',
    'vipinfo',
    'zmGo',
    'signIn',
    'memberTask'
  ];

  useEffect(() => {
    channelTypeChange()
    selectDecorateSpecialApi();
  }, []);

  // 查询专题内容接口
  const selectDecorateSpecialApi = () => {
    const {
      match: {
        params: { storeSpecialId },
      },
    } = props;
    // let storeSpecialId = props.match.params.storeSpecialId;
    selectDecorateSpecial({
      storeSpecialId,
    })
      .then(async res => {
        if (res.success) {
          let specialList;
          // 兼容代码 后期更改 开始
          if (res.data.decorateData.indexOf('[') != -1) {
            specialList = JSON.parse(res.data.decorateData);
          } else {
            specialList = [];
          }
          // 兼容代码 后期更改 结束
          // 判断是否设置专题样式
          if (res.data.setting && res.data.setting != '') {
            const tmp = JSON.parse(res.data.setting);
            if (!tmp.backgroundColor)
              tmp.backgroundColor = { r: '255', g: '255', b: '255', a: '1' };
            if (!tmp.backgroundType) tmp.backgroundType = 1;
            if (!tmp.antForestShow) tmp.antForestShow = false;
            if (!tmp.shopShow) tmp.shopShow = false;
            console.log(tmp);
            setSpecialSetting(tmp);
          }

          specialList = await dealDecorationFn(specialList)
          setSpecialList(specialList);
          setSpecialSpin(false);
        }
      })
      .catch(err => {
        console.log(err);
        setSpecialSpin(false);
      });
  };

  // 保存专题内容接口
  const configDecorateSpecialApi = () => {
    const {
      match: {
        params: { storeSpecialId },
      },
    } = props;
    const decorateData = editorTemplate.current.getTemplate();
    if (decorateData.saveTemplate) {
      // let setting = JSON.stringify(specialSetting);
      configDecorateSpecial({
        storeSpecialId,
        decorateData: decorateData.saveTemplate,
        setting: JSON.stringify(decorateData.specialSetting),
      }).then(res => {
        if (res.success) {
          message.success('发布成功');
          history.go(-1);
        }
      });
    }
  };

  // 返回上个页面
  const backtrack = () => {
    confirm({
      title: '返回',
      content: '确认直接返回吗？返回后将不保留当前修改内容。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        history.go(-1);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const channelTypeChange = () => {
    dispatch({
      type: 'shop/setChannelType',
      payload: '',
    });
  };

  return (
    <Panel title="配置详情">
      <div className={Css['set-shop-config-box']}>
        <EditorTemplate
          cRef={editorTemplate}
          templateSpin={specialSpin}
          templateData={specialList}
          importBasisNum={importBasisNum}
          importSetting={specialSetting}
          specialJudge="special"
        />

        <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
          <Button style={{ marginRight: 16 }} onClick={() => backtrack()}>
            返回
          </Button>
          {/* <Button style={{ marginRight: 16 }} onClick={() => configDecorateSpecialApi()}>
            保存并继续编辑
          </Button> */}
          <Button type="primary" onClick={() => configDecorateSpecialApi()}>
            完成发布
          </Button>
        </div>
      </div>
    </Panel>
  );
}

export default withRouter(connect(mapStateToProps)(SetSpecialConfig));
