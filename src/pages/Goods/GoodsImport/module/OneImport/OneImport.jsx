import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
// import { history } from '@umijs/max';
import { Upload, Button, message, Spin, Row, Col, Popover, Progress } from 'antd';
import {
  InboxOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  PaperClipOutlined,
} from '@ant-design/icons';
import xlsx from 'xlsx';
import OSS from 'ali-oss';
import Css from '../../Import.module.scss';
import ImportCourse from '../ImportCourse/ImportCourse';
import { itemImport, importResult } from '@/services/import';
import { stsToken } from '@/services/upload';

const { Dragger } = Upload;

class OneImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      status: null,
      fileListOne: [],
      visible: false,
      step: 1,
    };
  }

  componentDidMount() {
    this.initEditStepFn();
    this.getStsTokenFn();
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

  initEditStepFn() {
    const { editList } = this.props;
    if (editList && editList.result && editList.step === 'IMPORT_ITEM') {
      const {state} = editList.result;
      const {importSucceedNum} = editList.result;
      const {importFailedNum} = editList.result;
      let step = 1;
      let status = null;
      if (state == 0) {
        // 失败
        step = 3;
        status = 'error';
      }
      if (state == 1) {
        // 成功
        step = 3;
        status = 'done';
        if (!importSucceedNum) {
          status = 'doneError';
        }
        if (importFailedNum && importSucceedNum) {
          status = 'someDoneError';
        }
      }
      if (state == 2) {
        // 导入中
        step = 2;
        window.interval = setInterval(() => {
          this.importResult();
        }, 6000);
      }
      this.setState({
        editList,
        step,
        status,
      });
    }
  }

  importResult() {
    importResult().then(res => {
      console.log('查询结果返回 222', res);
      if (res && res.data) {
        if (res.data.step === 'IMPORT_ITEM' && res.data.result) {
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
              step: 3,
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
              step: 3,
              status,
            });
          }
        }
      }
    });
  }

  beforeUpload(file, fileList) {
    const rABS = true;
    const f = fileList[0];
    const fileName = file.name;
    const typeVal = fileName.substring(fileName.lastIndexOf('.'));
    const isExcel = typeVal == '.xls' || typeVal == '.xlsx';
    const sizeExcel = file.size / 1024 / 1024 < 10;
    let isMax = false;
    if (!isExcel) {
      message.warning('文件格式有误');
      return;
    }
    if (!sizeExcel) {
      message.warning('文件大小不能大于10MB');
      return;
    }
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = xlsx.read(data, {
          type: rABS ? 'binary' : 'array',
        });
        // 假设我们的数据在第一个标签
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // XLSX自带了一个工具把导入的数据转成json
        const jsonArr = xlsx.utils.sheet_to_json(first_worksheet, { header: 1 });
        if (jsonArr.length > 10000) {
          isMax = true;
          message.warning('最多导入10000件商品');
          return;
        }
        this.setState({
          status: 'uploading',
          fileNameText: file.name,
        });
        const appId = localStorage.getItem('appId') || '20200214';
        const fileNameOss = `upload/${appId}/${file.name}`;
        this.UploadToOss(file, fileNameOss);
      };
      if (rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
    }
    return false;
  }

  async UploadToOss(file, fileNameOss) {
    const me = this;
    const { percent, client } = this.state; // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发继续上传。

    await client
      .multipartUpload(fileNameOss, file, {
        progress(progress, checkpoint) {
          me.setState({
            percent: (progress * 100).toFixed(0),
          });
        },
      })
      .then(res => {
        this.setState(
          {
            itemFile: fileNameOss,
          },
          () => {
            this.itemImport();
          }
        );
      });
  }

  itemImport() {
    const { itemFile } = this.state;
    const p = {
      itemFile,
    };
    itemImport(p)
      .then(res => {
        if (res && res.data) {
          this.setState({ step: 2 });
          this.importResult();
          window.interval = setInterval(() => {
            this.importResult();
          }, 6000);
        } else {
          // 导入失败
          this.setState({ step: 3, status: 'error', errorMsg: res.errorMsg });
        }
      })
      .catch(res => {
        // 导入失败
        this.setState({ step: 3, status: 'error', errorMsg: res.errorMsg });
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
      status: null,
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

  resultMsg() {
    const { status, errorMsg, editList } = this.state;
    switch (status) {
      case 'error':
        return (
          <div>
            <div>
              <ExclamationCircleFilled className={Css.uploadError} />
            </div>
            <div className={Css.descTitle}>导入错误</div>
            <div className={Css.desc}>
              系统导入错误，错误原因：{errorMsg || editList.result.stateDesc}
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
            <div className={Css.desc}>商品表格导入失败，请重新上传</div>
          </div>
        );
      case 'someDoneError':
        return (
          <div>
            <div>
              <ExclamationCircleFilled className={Css.uploadWarn} />
            </div>
            <div className={Css.descTitle}>部分导入失败</div>
            <div className={Css.desc}>商品表格部分导入失败，您可以继续下一步或重新上传</div>
          </div>
        );

      default:
        return (
          <div>
            <div>
              <CheckCircleFilled className={Css.uploadSuccess} />
            </div>
            <div className={Css.descTitle}>商品基础信息批量导入成功</div>
            <div className={Css.desc}>商品基础信息已经导入完成，请补充图片信息后完成本次导入</div>
          </div>
        );
    }
  }

  render() {
    const { fileListOne, step, status, editList, fileNameText } = this.state;
    return (
      <div>
        <div className={Css.demoBox}>
          请按导入模板录入商品信息&nbsp;
          <a href="https://kxgshop.oss-cn-hangzhou.aliyuncs.com/item/2020/5/2020052215354808999498exceldemo.xlsx">
            下载导入模版
          </a>
          <span style={{ color: 'red' }}> (目前支持普通实物商品导入)</span>
          <a className={Css.rightImport} onClick={this.openCourseFn.bind(this)}>
            导入教程
          </a>
        </div>
        <div className={Css.uploadContent}>
          {step === 1 && status !== 'uploading' ? (
            <Dragger name="file" fileList={null} beforeUpload={this.beforeUpload.bind(this)}>
              <div className={Css.uploadBox}>
                <div>
                  <InboxOutlined className={Css.uploadIcon} />
                </div>
                <div className={Css.descTitle}>点击选择表格或将文件拖拽到本区域进行上传</div>
                <div className={Css.desc}>
                  支持xls、xlsx格式的文件，大小不超过10M，表格不能超过10000行，默认只导入第一个sheet
                </div>
              </div>
            </Dragger>
          ) : null}
          {step === 1 && status === 'uploading' ? (
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
              <div className={Css.descTitle}>表格上传中</div>
              <div className={Css.desc}>表格上传中,上传完成前请勿离开当前页面</div>
            </div>
          ) : null}
          {step === 2 ? (
            <div className={`${Css.uploadBox} ${Css.uploadComonBox}`}>
              <div>
                <Spin size="large" />
              </div>
              <div className={Css.descTitle}>表格导入中</div>
              <div className={Css.desc}>
                您可以暂时离开此页面，可以从商品管理-批量导入功能中再次进入本页面查看导入进度
              </div>
            </div>
          ) : null}
          {step === 3 && (
            <div className={`${Css.uploadBox} ${Css.uploadComonBox}`}>
              {this.resultMsg()}
              {status !== 'error' ? (
                <div className={Css.resultBox}>
                  <p className={Css.resultTilte}>导入结果</p>
                  <div className={Css.resultContent}>
                    <Row>
                      <Col span={8}>
                        <div className={Css.resultTop}>
                          <div className={Css.leftTitle}>
                            表格总数据
                            <a href={editList.result.importFile} className={Css.downloadText}>
                              下载原始表格
                            </a>
                          </div>
                        </div>
                        <div>
                          <span className={`${Css.resultNum}`}>{editList.result.importNum}</span>
                          <span className={Css.unit}> 条</span>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className={Css.resultTop}>导入成功</div>
                        <div>
                          <span className={`${Css.resultNum} ${Css.resultOk}`}>
                            {editList.result.importSucceedNum}
                          </span>
                          <span className={Css.unit}> 条</span>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className={Css.resultTop}>
                          <div className={editList.result.importFailedNum ? Css.leftTitle : null}>
                            导入失败
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
                          <span className={Css.unit}> 条</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          {status === 'done' || status === 'doneError' || status === 'someDoneError' ? null : (
            <div className={Css.msgBox}>
              <p>注意</p>
              <ul>
                <li>
                  1、表格中若商品名称已存在系统仍然会新建商品，请保证每次导入的商品名称不要重复
                </li>
                <li>
                  2、商品的规格组合需和该商品的SKU数量一致，否则会导入失败，例如颜色有红色、蓝色，尺码有S、M，那该商品在导入表格中应对应有4条数据，
                  分别是红色-S、红色-M、蓝色-S、蓝色-M
                </li>
                <li>3、不存在的规格、规格值、店铺商品类目导入成功后系统都会自动创建</li>
              </ul>
            </div>
          )}

          {step === 3 ? (
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
              {status === 'doneError' ? (
                <div className={Css.errorText}>
                  表格导入完成但未成功导入商品信息，请按失败原因修改后重新上传
                </div>
              ) : null}
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
export default withRouter(OneImport);
