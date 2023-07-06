import React, { Component, createRef } from 'react';
import { Steps, Button, message, Radio } from 'antd';
import { connect } from 'dva';
import Panel from '@/components/Panel';
import Css from './ShopDecoration.module.scss';
import { cloneDeep } from 'lodash-es';

import {
  appColor,
  recommondItemTitleColor,
  picPropertiesArr,
} from '@/bizComponents/EditorTemplate/formatData';

import EditorTemplate from '@/bizComponents/EditorTemplate/EditorTemplate';
import { dealDecorationFn } from '@/bizComponents/EditorTemplate/publicFun'

// 引入接口
import { decorate, decorateSaveNew, decorateIntroduction, dataSearch } from '@/services/shop';

const { Step } = Steps;

@connect(({ global, shop }) => ({
  global,
  shop,
}))
class ShopDecoration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 模板id
      decorateId: null,
      // 步进条
      current: 0,
      // 模板参数
      specialList: [],
      // 模板遮罩
      specialSpin: true,
      // 主题色
      subjectColor: '',
      importBasisNum: [
        'ad',
        'images_ad',
        'assist_ad',
        'coupon_ad',
        'navi',
        'notice',
        'recommend',
        'video',
        'rich_text',
        'alipay_mkt',
        'subscribe',
        'anXinChong',
        'integral',
        'vipcard',
        'vipinfo',
        'zmGo',
        'signIn',
        'memberTask'
        // 'community',
      ],
    };
    this.editorTemplate = createRef();
  }

  componentDidMount() {
    this.channelTypeChange({ target: { value: 'alipay' } })
    // this.decorateIntroductionApi();
  }

  channelTypeChange = e => {
    // this.setState({
    //   channelType: e.target.value,
    // });
    // channelType
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/setChannelType',
      payload: e.target.value,
    });
    this.decorateIntroductionApi();
  };

  // 上一步
  lastStep = () => {
    const { current } = this.state;
    this.setState({
      current: current - 1,
    });
  };

  // 下一步
  nextStep() {
    const { current } = this.state;
    switch (current) {
      case 0:
        this.setState({
          current: 1,
        });
        break;
      case 1:
        this.setState({
          current: 2,
        });
        break;
      default:
    }
  }

  // 店铺装修查询
  decorateApi() {
    this.setState(
      {
        specialSpin: true,
      },
      () => {
        decorate({
          storeType: 'custom',
          headersConfig: { appType: this.props.shop.channelType },
        })
          .then(async res => {
            if (res.errorCode === '0') {
              const color = JSON.parse(res.data.color);
              let specialList = JSON.parse(res.data.decorateData);
              specialList = await dealDecorationFn(specialList)
              this.setState({
                specialList,
                specialSpin: false,
                subjectColor: color,
              });
            }
          })
          .catch(() => {
            this.setState({
              specialSpin: false,
            });
          });
      }
    );
  }

  // 店铺当前模板id查询
  decorateIntroductionApi() {
    const that = this;
    decorateIntroduction({ headersConfig: { appType: this.props.shop.channelType } }).then(res => {
      if (res.errorCode === '0') {
        // let decorateId = res.data;
        that.setState({
          decorateId: res.data,
        });
      }
    });
    this.decorateApi();
  }

  // 店铺装修保存
  decorateSaveNewApi() {
    const { subjectColor } = this.state;
    const decorateData = this.editorTemplate.current.getTemplate();
    if (decorateData.saveTemplate) {
      // console.log('decorateData', JSON.parse(decorateData.saveTemplate))
      decorateSaveNew({
        storeType: 'custom',
        decorateData: decorateData.saveTemplate,
        color: JSON.stringify(subjectColor),
        headersConfig: { appType: this.props.shop.channelType },
      }).then(res => {
        if (res.errorCode === '0') {
          message.success('发布成功');
        }
      });
    }
  }

  render() {
    const {
      current,
      specialSpin,
      decorateId,
      subjectColor,
      importBasisNum,
      specialList,
    } = this.state;
    const {
      global: { collapsed },
      shop: { channelType },
    } = this.props;
    return (
      <Panel title="店铺装修" content="选择装修模板、配置装修店铺效果">
        <div className={Css['shop-decoration-box']}>
          <div className={Css['content-box']}>
            <div className={Css['content-steps-box']}>
              <Steps current={current}>
                <Step title="默认模板" />
                <Step title="选择风格" />
                <Step title="装修店铺" />
              </Steps>
            </div>
            {current === 0 && (
              <div className={Css['template-choice-box']}>
                <div className={Css['choice-channel-box']}>
                  <h1>装修类型</h1>
                  <div className={Css['choice-channel-radio']}>
                    <Radio.Group onChange={e => this.channelTypeChange(e)} value={channelType}>
                      <div className={Css['choice-channel-radioItem']}>
                        <Radio value="alipay">支付宝小程序</Radio>
                      </div>
                      <div className={Css['choice-channel-radioItem']}>
                        <Radio value="wechat">微信小程序</Radio>
                      </div>
                    </Radio.Group>
                  </div>
                </div>
                <div className={Css['choice-photo-box']}>
                  {decorateId && decorateId === 1 ? (
                    <img
                      className={Css['choice-photo-img']}
                      src="https://img.kxll.com/admin_manage/photoHome.png"
                      alt=""
                    />
                  ) : null}
                  {decorateId && decorateId === 2 ? (
                    <img
                      className={Css['choice-photo-img']}
                      src="https://img.kxll.com/admin_manage/photoHome_3.png"
                      alt=""
                    />
                  ) : null}
                  {decorateId && decorateId === 3 ? (
                    <img
                      className={Css['choice-photo-img']}
                      src="https://img.kxll.com/admin_manage/photoHome_4.png"
                      alt=""
                    />
                  ) : null}
                  {decorateId && decorateId === 4 ? (
                    <img
                      className={Css['choice-photo-img']}
                      src="https://img.kxll.com/admin_manage/photoHome_2.png"
                      alt=""
                    />
                  ) : null}
                  {decorateId && decorateId === 5 ? (
                    <img
                      className={Css['choice-photo-img']}
                      src="https://img.kxll.com/admin_manage/photoHome_2.png"
                      alt=""
                    />
                  ) : null}
                </div>
              </div>
            )}
            {current === 1 && (
              <div className={Css['template-color-box']}>
                <div className={Css['color-row']}>
                  <p className={Css['row-left']}>选择配色方案：</p>
                  <div className={Css['row-item-box']}>
                    {appColor.map(item => {
                      return (
                        <div
                          className={
                            item.colorName === subjectColor.colorName
                              ? `${Css['row-item']} ${Css['row-item-blue']}`
                              : Css['row-item']
                          }
                          key={item.colorName}
                          onClick={() => this.setState({ subjectColor: item })}
                        >
                          <div style={{ background: item.titleColor }} />
                          <div style={{ background: item.btnColor }} />
                          <div style={{ background: item.textColor }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={Css['color-row']}>
                  <p className={Css['row-left']}>效果预览：</p>
                  <div className={Css['row-img-box']}>
                    {subjectColor.colorName === 'red' && (
                      <img
                        className={Css['row-img']}
                        src="https://img.kxll.com/admin_manage/template/template_red.jpg"
                        alt=""
                      />
                    )}
                    {subjectColor.colorName === 'gre' && (
                      <img
                        className={Css['row-img']}
                        src="https://img.kxll.com/admin_manage/template/template_gre.jpg"
                        alt=""
                      />
                    )}
                    {subjectColor.colorName === 'olive' && (
                      <img
                        className={Css['row-img']}
                        src="https://img.kxll.com/admin_manage/template/template_olive.jpg"
                        alt=""
                      />
                    )}
                    {subjectColor.colorName === 'bla' && (
                      <img
                        className={Css['row-img']}
                        src="https://img.kxll.com/admin_manage/template/template_bla.jpg"
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {current === 2 && (
              <EditorTemplate
                cRef={this.editorTemplate}
                templateSpin={specialSpin}
                templateData={specialList}
                importBasisNum={importBasisNum}
                subjectColor={subjectColor}
                channelType={channelType}
                specialJudge="home"
              />
            )}
          </div>
          <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
            {current !== 0 && (
              <Button style={{ marginRight: 16 }} onClick={() => this.lastStep()}>
                上一步
              </Button>
            )}
            {current < 2 && (
              <Button style={{ marginRight: 16 }} type="primary" onClick={() => this.nextStep()}>
                下一步
              </Button>
            )}
            {current === 2 && (
              <Button type="primary" onClick={() => this.decorateSaveNewApi()}>
                发布
              </Button>
            )}
          </div>
        </div>
      </Panel>
    );
  }
}

export default ShopDecoration;
