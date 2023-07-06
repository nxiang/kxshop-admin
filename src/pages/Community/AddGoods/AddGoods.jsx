import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import Panel from '@/components/Panel';
import { addItem, editItem, itemDetail } from '@/services/item';
import { templateList } from '@/services/storeLabel';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { useLocation } from '@/utils/compatible';

const PointManageEdit = props => {
  // const {
  //   location: { query },
  // } = props;
  const location = useLocation()
  const query = location.query
  const [curStep, setCurStep] = useState(0);
  const [stepOneParams, setStepOneParams] = useState(undefined);
  const [templateListData, setTemplateListData] = useState([]);
  // 加载
  const [spinning, setSpinning] = useState(false);
  const [productInfo, setProductInfo] = useState(undefined);
  // 修改优惠券积分商品ID
  const [alterStockIds, SetAlterStockIds] = useState('');

  useEffect(() => {
    getTemplateList();
    if (query.type == 'update') {
      getItemDetail();
    }
  }, []);

  const getTemplateList = () => {
    templateList().then(res => {
      if (res.errorCode == '0') {
        setTemplateListData(res.data);
      }
    });
  };

  const getItemDetail = () => {
    setSpinning(true);
    itemDetail({ itemId: query.itemId })
      .then(res => {
        if (res.errorCode == '0') {
          setProductInfo(res.data);
        }
        setSpinning(false);
      })
      .catch(() => {
        setSpinning(false);
      });
  };

  const doSubmit = params => {
    console.log('params=', params);
    if (query.type == 'add') {
      addItem({ publishFlag: true, ...params }).then(res => {
        if (res.errorCode == '0') {
          setCurStep(2);
        }
      });
    } else {
      params.skuList[0].skuId = productInfo.skuList[0].skuId;
      editItem({
        itemId: query.itemId,
        publishFlag: true,
        ...params,
      }).then(res => {
        if (res.errorCode == '0') {
          setCurStep(2);
        }
      });
    }
  };

  return (
    <Panel title="社区团购商品" content="社区团购信息管理和查看">
      <Spin spinning={spinning} tip="加载中...">
        <Card>
          {curStep == 0 ? (
            <StepOne
              {...props}
              productInfo={productInfo}
              alterStockIds={alterStockIds}
              onNext={setCurStep}
              stepOneParams={stepOneParams}
              setStepOneParams={setStepOneParams}
              onSubmit={doSubmit}
            />
          ) : curStep == 1 ? (
            <StepTwo
              {...props}
              productInfo={productInfo}
              templateListData={templateListData}
              onNext={setCurStep}
              onSubmit={doSubmit}
            />
          ) : (
            <StepThree {...props} />
          )}
        </Card>
      </Spin>
    </Panel>
  );
};

export default PointManageEdit;
