import React, { useEffect, useState } from 'react';
import Panel from '@/components/Panel';
import { Card, Form, Spin, Steps } from 'antd';
import { addItem, editItem, itemDetail } from '@/services/item';
import { templateList } from '@/services/storeLabel';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { floatObj } from '@/utils/utils';
import { useLocation } from '@/utils/compatible';
const { Step } = Steps;

const PointManageEdit = props => {
  // console.log('query=', props.location.query);
  const query = useLocation().query;
  const [stepTwoForm] = Form.useForm();
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
          if (res.data.classId == 4) SetAlterStockIds(res.data.couponStock.stockId);
        }
        setSpinning(false);
      })
      .catch(() => {
        setSpinning(false);
      });
  };

  const doSubmit = params => {
    // console.log('params=', Object.assign(stepOneParams, params));
    console.log('params=', params);
    // stepOneParams.skuList[0].linePrice = floatObj.multiply(stepOneParams.skuList[0].linePrice, 100);
    params.skuList[0].linePrice = floatObj.multiply(params.skuList[0].linePrice, 100);
    if (query.type == 'add') {
      // addItem(Object.assign(stepOneParams, params)).then(res => {
      //   if (res.errorCode == '0') {
      //     setCurStep(2);
      //   }
      // });
      addItem({ publishFlag: true, ...params }).then(res => {
        if (res.errorCode == '0') {
          setCurStep(2);
        }
      });
    } else {
      // stepOneParams.skuList[0].skuId = productInfo.skuList[0].skuId;
      params.skuList[0].skuId = productInfo.skuList[0].skuId;
      // editItem({
      //   itemId: query.itemId,
      //   ...Object.assign(stepOneParams, params),
      // }).then(res => {
      //   if (res.errorCode == '0') {
      //     setCurStep(2);
      //   }
      // });
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

  const disStyle = {
    height: 0,
    overflow: 'history',
  };

  return (
    <Panel title="积分商品" content="积分商品信息管理和查看">
      <Spin spinning={spinning} tip="加载中...">
        <Card>
          {/* <Steps current={curStep} style={{ marginBottom: 30 }}>
          <Step title="编辑基础信息" />
          <Step title="编辑拓展信息" />
          <Step title="发布完成" />
        </Steps> */}
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
