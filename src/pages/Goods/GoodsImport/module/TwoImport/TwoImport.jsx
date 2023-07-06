import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from '../../Import.module.scss';
import { Upload, Button, message, Spin, Row, Col, Progress, Popover } from 'antd';
import {
  InboxOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  PaperClipOutlined,
} from '@ant-design/icons';
import ImportCourse from '../ImportCourse/ImportCourse';
import { stsToken } from '@/services/upload';
import { imageImport, importResult } from '@/services/import';
import Cookies from 'js-cookie';
import OSS from 'ali-oss';

const { Dragger } = Upload;

class TwoImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      step: 1,
      status: null,
      percent: 0,
    };
  }
  componentDidMount() {
    this.initEditStepFn();
    this.getStsTokenFn();
  }
  importResult() {
    importResult().then(res => {
      if (res && res.data) {
        this.setState({
          importId: res.data.importId,
        });
        if (res.data.step === 'IMPORT_IMAGE' && res.data.result) {
          const {state} = res.data.result;
          const {importSucceedNum} = res.data.result;
          const {importFailedNum} = res.data.result;

          if (state != 2) {
            clearInterval(window.interval);
          }
          if (state == 0) {
            // 失败
            this.setState({
              editList: res.data,
              step: 4,
              status: 'error',
            });
          }
          if (state == 1) {
            // 成功
            let status = 'done';
            if (!importSucceedNum) {
              status = 'doneError';
            }
            if (importFailedNum && importSucceedNum) {
              status = 'someDoneError';
            }
            this.setState({
              editList: res.data,
              step: 4,
              status,
            });
          }
        }
      }
    });
  }
  initEditStepFn() {
    const { editList } = this.props;
    if (editList && editList.result && editList.step === 'IMPORT_IMAGE') {
      const {state} = editList.result;
      const {importSucceedNum} = editList.result;
      const {importFailedNum} = editList.result;

      let step = 1;
      let status = null;
      if (state == 2) {
        // 导入中
        step = 3;
        this.importResult();
        window.interval = setInterval(() => {
          this.importResult();
        }, 6000);
      }
      if (state == 0) {
        // 失败
        step = 4;
        status = 'error';
      }
      if (state == 1) {
        // 成功
        step = 4;
        status = 'done';
        if (!importSucceedNum) {
          status = 'doneError';
        }
        if (importFailedNum && importSucceedNum) {
          status = 'someDoneError';
        }
      }
      this.setState({
        importId: editList.importId,
        editList,
        step,
        status,
      });
    } else {
      this.importResult();
    }
  }
  getStsTokenFn() {
    stsToken({ roleSessionName: 'seller' }).then(res => {
      if (res) {
        const client = new OSS({
          region: 'oss-cn-hangzhou', // oss服务区域名称
          timeout: 3600000,
          bucket: 'kxgshop',
          accessKeyId: res.data.accessKeyId,
          accessKeySecret: res.data.accessKeySecret,
          stsToken: res.data.securityToken,
        });
        this.setState({
          client,
          ossInfo: res.data,
        });
      }
    });
  }
  beforeOssUpload = file => {
    const fileName = file.name;
    const typeVal = fileName.substring(fileName.lastIndexOf('.'));
    const isZip = typeVal == '.zip';
    const size = file.size / 1024 / 1024 < 500;
    if (!isZip) {
      message.warning('上传文件格式有误');
      return;
    }
    if (!size) {
      message.warning('文件大小不能大于500MB');
      return;
    }

    const resultupload = false;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        step: 2,
        fileNameText: file.name,
      });
      const appId = localStorage.getItem('appId') || '20200214';
      const fileName = `upload/${appId}/${file.name}`;
      let tempCheckpoint = localStorage.getItem('tempCheckpoint');

      if (tempCheckpoint) {
        // 是否存在断点
        tempCheckpoint = JSON.parse(tempCheckpoint);
        tempCheckpoint.file = file;
        if (tempCheckpoint.name === fileName && tempCheckpoint.fileSize === file.size) {
          this.resumeMultipartUpload(file, fileName, tempCheckpoint);
        } else {
          this.UploadToOss(file, fileName);
        }
      } else {
        this.UploadToOss(file, fileName);
      }
    };
    return false;
  };
  async UploadToOss(file, fileName) {
    const me = this;
    const { percent, client } = this.state; // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发继续上传。
    await client
      .multipartUpload(fileName, file, {
        progress(progress, checkpoint) {
          console.log('分片进度', progress);
          console.log('分片包', checkpoint);
          if (checkpoint && checkpoint.doneParts && checkpoint.doneParts.length) {
            localStorage.setItem('tempCheckpoint', JSON.stringify(checkpoint));
          }

          me.setState({
            percent: (progress * 100).toFixed(0),
          });
          if (progress == 1) {
            me.setState({
              step: 3,
            });
            localStorage.removeItem('tempCheckpoint');
          }
        },
      })
      .then(res => {
        // const zipUrl = `http://kxgshop.oss-cn-hangzhou.aliyuncs.com/${fileName}`;
        me.imageImport(fileName);
      });
  }
  async resumeMultipartUpload(file, fileName, tempCheckpoint) {
    // 续传
    const me = this;
    const { percent, client } = this.state;
    await client
      .multipartUpload(fileName, file, {
        checkpoint: tempCheckpoint,
        progress(progress, checkpoint) {
          console.log('续传', progress);
          localStorage.setItem('tempCheckpoint', JSON.stringify(checkpoint));
          me.setState({
            percent: (progress * 100).toFixed(0),
          });
          if (progress == 1) {
            me.setState({
              step: 3,
            });
            localStorage.removeItem('tempCheckpoint');
          }
        },
      })
      .then(res => {
        me.imageImport(fileName);
      });
  }
  imageImport(imageFile) {
    const p = {
      importId: this.state.importId,
      imageFile,
    };
    imageImport(p)
      .then(res => {
        if (res && res.data) {
          this.setState({ step: 3 });
          this.importResult();
          window.interval = setInterval(() => {
            this.importResult();
          }, 6000);
        } else {
          // 导入失败
          this.setState({ step: 4, status: 'error', errorMsg: res.errorMsg });
        }
      })
      .catch(res => {
        // 导入失败
        this.setState({ step: 4, status: 'error', errorMsg: res.errorMsg });
      });
  }
  nextFn() {
    this.props.nextStep();
  }
  initStep() {
    this.setState({
      step: 1,
      percent: 0,
      status: null,
    });
  }
  noStopFn() {
    this.setState({
      stopShow: false,
    });
  }
  okStopFn() {
    const { client } = this.state;
    client.cancel(); // 取消上传
    this.setState({
      percent: 0,
      stopShow: false,
      step: 1,
    });
  }
  stopShowChange(show) {
    this.setState({
      stopShow: show,
    });
  }
  cancelUploadPop() {
    const popDom = (
      <div className={Css.stopBox}>
        <span className={Css.stopText}>
          <CheckCircleFilled className={Css.stopSuccess} />
          <span>确认取消?</span>
        </span>

        <div className={Css.stepBottom}>
          <Button type="primary" onClick={this.okStopFn.bind(this)}>
            确定
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={this.noStopFn.bind(this)}>
            取消
          </Button>
        </div>
      </div>
    );
    return popDom;
  }
  openCourseFn() {
    this.setState({
      visible: true,
    });
  }
  closeModal() {
    this.setState({
      visible: false,
    });
  }
  resultMsg() {
    const { status, editList, errorMsg } = this.state;

    switch (status) {
      case 'error':
        return (
          <div className={`${Css.uploadBox} ${Css.uploadComonBox}`}>
            <div>
              <ExclamationCircleFilled className={Css.uploadError} />
            </div>
            <div className={Css.descTitle}>导入错误</div>
            <div className={Css.desc}>
              系统导入错误，错误原因：
              {errorMsg ||
                (editList && editList.step === 'IMPORT_IMAGE' && editList.result.stateDesc)}
            </div>
          </div>
        );
      case 'doneError':
        return (
          <div>
            <div>
              <ExclamationCircleFilled className={Css.uploadWarn} />
            </div>
            <div className={Css.descTitle}>导入失败</div>
            <div className={Css.desc}>商品图片导入失败，请重新上传</div>
          </div>
        );
      case 'someDoneError':
        return (
          <div>
            <div>
              <ExclamationCircleFilled className={Css.uploadWarn} />
            </div>
            <div className={Css.descTitle}>部分导入失败</div>
            <div className={Css.desc}>商品图片部分导入失败，您可以继续下一步或重新上传</div>
          </div>
        );

      default:
        return (
          <div>
            <div>
              <CheckCircleFilled className={Css.uploadSuccess} />
            </div>
            <div className={Css.descTitle}>商品批量导入成功</div>
            <div className={Css.desc}>商品基础信息已经导入完成，请补充图片信息后完成本次导入</div>
          </div>
        );
    }
  }
  render() {
    const { step, status, fileNameText, editList } = this.state;
    return (
      <div>
        <div className={Css.demoBox}>
          将上一步导入成功的商品按要求整理好图片后打包上传&nbsp;
          <a href="http://kxgshop.oss-cn-hangzhou.aliyuncs.com//upload/20200214/商品图片压缩包模板.zip">
            下载压缩包模板
          </a>
          <a className={Css.rightImport} onClick={this.openCourseFn.bind(this)}>
            导入教程
          </a>
        </div>
        <div className={Css.uploadContent}>
          {step === 1 ? (
            <Dragger name="file" fileList={null} beforeUpload={this.beforeOssUpload.bind(this)}>
              <div className={Css.uploadBox}>
                <div>
                  <InboxOutlined className={Css.uploadIcon} />
                </div>
                <div className={Css.descTitle}>请选择文件压缩包或将压缩包拖拽到此处上传</div>
                <div className={Css.desc}>
                  支持zip格式的压缩文件,压缩包最大500M,为避免上传时间过长建议图片压缩包不超过100M
                </div>
              </div>
            </Dragger>
          ) : null}
          {step === 2 ? (
            <div className={`${Css.uploadBox} ${Css.uploadComonBox}`}>
              <div className={Css.percentBox}>
                <div className={Css.fileNameText}>
                  <PaperClipOutlined /> {fileNameText}
                </div>
                <Progress style={{ width: 566 }} percent={this.state.percent} />
                <Popover
                  content={this.cancelUploadPop()}
                  visible={this.state.stopShow}
                  onVisibleChange={this.stopShowChange.bind(this)}
                  trigger="click"
                >
                  <span className={Css.cancelBtn}>取消</span>
                </Popover>
              </div>
              <div className={Css.descTitle}>图片压缩包上传中</div>
              <div className={Css.desc}>
                压缩包上传中，请勿离开当前页面，若文件较大上传时间可能较长请耐心等待{' '}
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div className={`${Css.uploadBox} ${Css.uploadComonBox}`}>
              <div>
                <Spin size="large" />
              </div>
              <div className={Css.descTitle}>商品图片导入中</div>
              <div className={Css.desc}>
                您可以暂时离开此页面，可以从商品管理-批量导入功能中再次进入本页面查看导入进度
              </div>
            </div>
          ) : null}
          {step === 4 && (
            <div className={`${Css.uploadBox} ${Css.uploadComonBox}`}>
              {this.resultMsg()}
              {status !== 'error' ? (
                <div className={Css.resultBox}>
                  <p className={Css.resultTilte}>导入结果</p>
                  <div className={Css.resultContent}>
                    <Row>
                      <Col span={6}>
                        <div className={Css.resultTop}>商品文件数量</div>
                        <div>
                          <span className={`${Css.resultNum}`}>
                            {editList.result.directoryNum || 0}
                          </span>
                          <span className={Css.unit}> 条</span>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={Css.resultTop}>图片总数量</div>
                        <div>
                          <span className={`${Css.resultNum}`}>{editList.result.importNum}</span>
                          <span className={Css.unit}> 条</span>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={Css.resultTop}>导入成功张数</div>
                        <div>
                          <span className={`${Css.resultNum} ${Css.resultOk}`}>
                            {editList.result.importSucceedNum}
                          </span>
                          <span className={Css.unit}> 张</span>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={Css.resultTop}>
                          <div className={editList.result.importFailedNum ? Css.leftTitle : null}>
                            导入失败张数
                            {editList.result.resultFile ? (
                              <a href={editList.result.resultFile} className={Css.downloadText}>
                                下载失败数据
                              </a>
                            ) : null}
                          </div>
                        </div>
                        <div>
                          <span className={`${Css.resultNum} ${Css.resultError}`}>
                            {editList.result.importFailedNum}
                          </span>
                          <span className={Css.unit}> 张</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {status === 'error' || step !== 4 ? (
            <div className={Css.msgBox}>
              <p>注意</p>
              <ul>
                <li>1、请严格按照导入表格中的商品名称命名文件夹，否则会导致导入失败 </li>
                <li>2、商品主图最多5张，单张图片大小不超过500K，支持JPG、JPEG、PNG格式图片</li>
                <li>
                  3、商品详情图最多20张，单张图片大小不超过2M，支持JPG、JPEG、PNG格式图片，建议宽度750px
                </li>
                <li>
                  4、若有顺序要求请在图片文件名末尾添加"-
                  数字"，例如：商品主图-1.jpg，系统将按数字进行排序
                </li>
                <li>5、图片导入不成功的商品请在商品管理中重新上传</li>
                <li>6、为避免图片匹配错误，导入完成后上架商品前请先确认商品图片是否匹配</li>
              </ul>
            </div>
          ) : null}

          {step === 4 ? (
            <div style={{ marginTop: 50 }}>
              {status === 'done' || status === 'someDoneError' ? (
                <Button type="primary" onClick={this.nextFn.bind(this)}>
                  下一步
                </Button>
              ) : (
                <Button type="primary" onClick={this.initStep.bind(this)}>
                  重新上传
                </Button>
              )}
            </div>
          ) : null}
        </div>
        {this.state.visible ? (
          <ImportCourse closeModal={this.closeModal.bind(this)} visible={this.state.visible} />
        ) : null}
      </div>
    );
  }
}
export default withRouter(TwoImport);
