import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from './GoodsImport.module.scss';
import Panel from '@/components/Panel';
import OneImport from './module/OneImport/OneImport';
import TwoImport from './module/TwoImport/TwoImport';
import ThreeImport from './module/ThreeImport/ThreeImport';
import FourImport from './module/FourImport/FourImport';
import { Breadcrumb, Spin, Steps } from 'antd';
import { importResult } from '@/services/import';

const { Step } = Steps;

class GoodsImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      loading: true,
      editList: {},
    };
  }
  componentDidMount() {
    this.importResult();
  }
  componentWillUnmount() {
    // 离开页面清除定时器
    clearInterval(window.interval);
  }
  importResult() {
    importResult().then(res => {
      console.log('查询结果返回', res);
      if (res && res.success) {
        if (res.data) {
          const stepText = res.data.step;
          const {state} = res.data.result;
          let current = 0;
          switch (stepText) {
            case 'IMPORT_ITEM':
              current = 0;
              break;
            case 'IMPORT_IMAGE':
              current = 1;
              break;
            case 'FILL_INFO':
              if (state == 1) {
                current = 0;
              } else {
                current = 2;
              }
              break;
            case 'IMPORT_COMPLETED':
              current = 3;
              break;
            default:
              break;
          }
          this.setState({
            loading: false,
            editList: res.data,
            current,
          });
        } else {
          this.setState({
            loading: false,
            editList: null,
            current: 0,
          });
        }
      }
    });
  }
  nextStep() {
    this.setState({
      current: this.state.current + 1,
    });
  }
  render() {
    const { current, editList } = this.state;
    return (
      <Panel title="商品导入" content="批量导入商品信息,快速上架商品">
        <div className={Css.importBox}>
          <Steps current={current} className={Css.stepBox}>
            <Step title="上传表格" />
            <Step title="上传图片" />
            <Step title="信息补全" />
            <Step title="导入完成" />
          </Steps>
          <div className={Css.importContent}>
            <Spin size="large" className={Css.spinBox} spinning={this.state.loading}>
              {current === 0 ? (
                <OneImport editList={editList} nextStep={this.nextStep.bind(this)} />
              ) : null}
              {current === 1 ? (
                <TwoImport editList={editList} nextStep={this.nextStep.bind(this)} />
              ) : null}
              {current === 2 ? (
                <ThreeImport editList={editList} nextStep={this.nextStep.bind(this)} />
              ) : null}
              {current === 3 ? <FourImport editList={editList} /> : null}
            </Spin>
          </div>
        </div>
      </Panel>
    );
  }
}
export default withRouter(GoodsImport);
