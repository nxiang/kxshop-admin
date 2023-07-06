import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Button, PageHeader, message } from 'antd';
import Css from './Decorate.module.scss';
import { cloneDeep } from 'lodash-es'
import { recommondItemTitleColor, picPropertiesArr } from '@/bizComponents/EditorTemplate/formatData';

// 引入组件
import Panel from '@/components/Panel';
import EditorTemplate from '@/bizComponents/EditorTemplate/EditorTemplate';

// 引入接口
import {
  decorate,
  decorateSaveNew,
  // decorateIntroduction,
  dataSearch,
} from '@/services/shop';

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
  };
};

export default connect(mapStateToProps)(({ collapsed }) => {
  const editorTemplate = useRef();
  // 模板遮罩
  const [specialSpin, setSpecialSpin] = useState(true);
  // 模板参数
  const [specialList, setSpecialList] = useState([]);
  // 拖拽模块参数
  const importBasisNum = ['ad', 'images_ad', 'assist_ad', 'recommend', 'rich_text', 'subscribe'];

  useEffect(() => {
    getDecorate();
  }, []);

  const getDecorate = () => {
    setSpecialSpin(true);
    decorate({
      storeType: 'community',
    })
      .then(async res => {
        if (res.success) {
          const specialList = JSON.parse(res.data.decorateData);
          const listLocation = [];
          const requestState = [];
          specialList.forEach((item, index) => {
            if (
              item.itemType != 'assist_ad' &&
              item.itemType != 'subscribe' &&
              item.itemType != 'notice' &&
              item.itemType != 'video' &&
              item.itemType != 'rich_text' &&
              item.itemType != 'shop_info' &&
              item.itemType != 'alipay_mkt' &&
              item.itemType != 'anXinChong' &&
              item.itemType != 'integral' &&
              item.itemType != 'vipcard' 
            ) {
              item.itemData.forEach((subItem, subIndex) => {
                if ((subItem?.type === 'goods' && subItem?.data != '')||(subItem?.type === 'integral' && subItem?.data != '')) {
                  const listData = subItem.data.split(',');
                  listLocation.push({
                    type: subItem.type,
                    listIndex: index,
                    itemitemDataIndex: subIndex,
                    startIndex: requestState.length,
                    endIndex: requestState.length + listData.length,
                  });
                  if (Array.isArray(listData))
                    listData.forEach(listItem => {
                      requestState.push({
                        type: subItem?.type,
                        id: String(listItem),
                      });
                    });
                } else if (
                  subItem?.type !== 'none' &&
                  subItem?.type !== 'keyword' &&
                  subItem?.type !== 'h5Url' &&
                  subItem?.type !== 'pageSkip' &&
                  subItem?.type !== 'wxapp' &&
                  subItem?.type !== 'aliapp' &&
                  subItem?.type !== 'alipayCoupon' &&
                  subItem?.type !== 'alipayMembers' &&
                  subItem?.type !== 'alipaySkip' &&
                  subItem?.type !== 'getCoupon' &&
                  subItem?.data != ''
                ) {
                  listLocation.push({
                    type: subItem.type,
                    listIndex: index,
                    itemitemDataIndex: subIndex,
                    startIndex: requestState.length,
                    endIndex: requestState.length + 1,
                  });
                  requestState.push({
                    type: subItem.type,
                    id: String(subItem.data),
                  });
                }
              });
            }
            // 兼容老数据
            if ((item.itemType == 'recommend' && !item.itemTitleColor)||(item.itemType == 'integral' && !item.itemTitleColor)) {
              item.itemTitleColor = cloneDeep(recommondItemTitleColor)
            }
            if (['ad', 'images_ad', 'assist_ad', 'video', 'subscribe'].includes(item.itemType) && !item.propertiesArr) {
              item.propertiesArr = cloneDeep(picPropertiesArr)
            }
          });
          if (requestState.length > 0)
            await dataSearch(requestState).then(res => {
              if (res.errorCode === '0') {
                listLocation.forEach(item => {
                  const listData = res.data.slice(item.startIndex, item.endIndex);
                  let newlistData;
                  if (item.type === 'goods'|| item.type === 'integral') {
                    newlistData = listData.map(item => {
                      return JSON.parse(item.value);
                    });
                  } else {
                    // eslint-disable-next-line prefer-destructuring
                    newlistData = listData[0];
                  }
                  specialList[item.listIndex].itemData[item.itemitemDataIndex].data = newlistData;
                });
              }
            });
          setSpecialList(specialList);
          setSpecialSpin(false);
        }
      })
      .catch(() => {
        setSpecialSpin(false);
      });
  };

  // 店铺装修保存
  //  decorateSaveNewApi() {
  //   const { subjectColor } = this.state;
  //   const decorateData = this.editorTemplate.current.getTemplate();
  //   if (decorateData.saveTemplate) {
  //     decorateSaveNew({
  //       storeType: "custom",
  //       decorateData: decorateData.saveTemplate,
  //       color: JSON.stringify(subjectColor),
  //     }).then(res => {
  //       if (res.errorCode === '0') {
  //         message.success('发布成功');
  //       }
  //     });
  //   }
  // }

  const release = () => {
    const decorateData = editorTemplate.current.getTemplate();
    console.log(decorateData);
    if (decorateData.saveTemplate) {
      decorateSaveNew({
        storeType: 'community',
        decorateData: decorateData.saveTemplate,
        // color: JSON.stringify(subjectColor),
      }).then(res => {
        if (res.errorCode === '0') {
          message.success('发布成功');
        }
      });
    }
  };

  return (
    <Panel title="装修">
      <PageHeader style={{ backgroundColor: '#fff' }}>
        <EditorTemplate
          cRef={editorTemplate}
          templateSpin={specialSpin}
          templateData={specialList}
          importBasisNum={importBasisNum}
          storeType="community"
          itemType={2}
        />
      </PageHeader>
      <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
        <Button type="primary" onClick={() => release()}>
          完成发布
        </Button>
      </div>
    </Panel>
  );
});
