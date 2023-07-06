import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Input, Upload, message, Table } from 'antd';
import { setting, areaList, storeInfo, findParentIdsBycode } from '@/services/shop.js';
import Amap from './Amap';
import Panel from '@/components/Panel';
import Css from './SetShop.module.scss';

console.log('PlusOutlined',PlusOutlined)

const { TextArea } = Input;
const FormItem = Form.Item;

const beforeUpload = file => {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('仅支持jpg、png、jpeg格式');
  }
  const isLt40M = file.size / 1024 / 1024 < 1;
  if (!isLt40M) {
    message.error('文件不能大于1MB');
  }
  return isLt40M && isJpgOrPng;
};
// 自定义校验
const freeaskTimesVerify = (rule, value, callback) => {
  if (!value) {
    callback();
  }
  if (!/^[0-9]*$/.test(value)) {
    callback('请输入数字！');
  }
  callback();
};

class SetShop extends Component {
  // 上传标题文件
  UploadTitleProps = {
    name: 'file',
    action: '/proxy/cloud/oss/upload?type=marketing',
    beforeUpload,
    showUploadList: false,
    response: '{"status": "success"}',
    onChange: info => {
      const that = this;
      console.log('info', info);
      if (info.file.status === 'uploading') {
        that.setState({
          documentSpin: true,
        });
      } else if (info.file.status === 'done') {
        // this.setState({
        //   fileList: info.fileList,
        // });
        if (info.file.response) {
          if (info.file.response.errorCode === '0') {
            message.success(`${info.file.name} 上传成功`);
            that.setState({
              storeAvatar: info.file.response.data.url,
            });
          } else {
            message.error(`${info.file.name} 上传失败`);
          }
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      storeAvatar: null,
      areaData: [],
      areaCode: null,
      // fileList: [],
      initAreaIds: null,
      AreaPrams: {
        areaId: 0,
        maxDeep: 4,
      },
      markerPosition: {},
      editList: null,
      listData: [],
      count: 0,
    };
  }

  componentDidMount() {
    this.storeInfo();
  }

  loadData = selectedOptions => {
    const { areaData } = this.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const p = {
      areaId: targetOption.value,
      maxDeep: 4,
    };
    areaList(p).then(info => {
      if (info) {
        targetOption.loading = false;
        targetOption.children = [];
        if (info.data && info.data.areaList.length) {
          info.data.areaList.forEach(item => {
            // 对于台湾和香港只有二级单独判断
            const isLeaf =
              item.areaDeep === 3 || item.areaParentId === 33 || item.areaParentId === 32;
            targetOption.children.push({
              areaCode: item.areaCode,
              value: item.areaId,
              label: item.areaName,
              parentId: item.areaParentId,
              isLeaf,
            });
          });
          this.setState({
            areaData: [...areaData],
          });
        }
      }
    });
  };

  selectArea = values => {
    // 根据areaid反查国标码
    const { areaData, areaCode } = this.state;
    if (values && values.length < 3) {
      return;
    }
    if (areaCode) {
      // 二次选择前清空
      this.setState({
        areaCode: null,
      });
    }
    const childrenArr = areaData.find(item => item.value === values[0]).children;
    if (childrenArr && childrenArr.length) {
      const childrenTwo = childrenArr.find(item => item.value === values[1]).children;
      console.log(childrenTwo);
      if (childrenTwo?.length > 0) {
        this.setState({
          areaCode: childrenTwo.find(item => item.value === values[2])?.areaCode || null,
        });
        // 查询不到清空数据
        if (!childrenTwo.find(item => item.value === values[2])?.areaCode) {
          this.setState({
            initAreaIds: null,
          });
        }
      }
    }
  };

  searchUserInfo = () => {
    const { markerPosition, editList, storeAvatar, listData } = this.state;
    const {
      form: { validateFields },
    } = this.props;
    const me = this;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const newValue = { ...values };
      if (editList && editList.storeAddress) {
        // 编辑地址详情
        if (markerPosition.keyword && !markerPosition.lng) {
          // 选择了无效地址
          message.error('请选择有效定位');
          return;
        }
        if (!markerPosition.lng) {
          // 未编辑过地址
          newValue.location = editList.location;
          newValue.companyArea = editList.companyArea;
          newValue.storeAddress = editList.storeAddress;
        }
        if (markerPosition.keyword && markerPosition.lng) {
          // 选择了有效地址
          newValue.location = `${markerPosition.lng},${markerPosition.lat}`;
          newValue.companyArea = markerPosition.companyArea;
          newValue.storeAddress = markerPosition.storeAddress;
        }
      } else {
        newValue.companyArea = markerPosition.companyArea;
        newValue.storeAddress = markerPosition.storeAddress;
        newValue.location = `${markerPosition.lng},${markerPosition.lat}`;
      }
      newValue.companyAreaId = newValue.address[newValue.address.length - 1];
      newValue.storeAvatar = storeAvatar;
      newValue.storePhone = newValue.storePhone ? newValue.storePhone.toString() : null;
      delete newValue.address;
      if (!newValue.storeAddress || !newValue.location) {
        message.error('请选择详细地址');
        return;
      }
      if (!newValue.storeAvatar) {
        message.error('请选择店铺头像');
        return;
      }
      if (listData.length > 0) {
        for (let i = 0; i < listData.length; i++) {
          if (listData[i].guaranteeType == '' || listData[i].guaranteeDesc == '') {
            message.error('请填写店铺保障信息');
            return;
          }
        }
      }
      newValue.guaranteeList = listData;
      me.submitShop(newValue);
    });
  };

  getPosition = markerPosition => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      doorplate: markerPosition.doorplate,
    });
    this.setState(
      {
        markerPosition,
      },
      () => {
        if (markerPosition.adcode) {
          // 根据areaCode反查地址
          this.findParentIdsBycode();
        }
      }
    );
  };

  submitShop = async p => {
    const info = await setting(p);
    if (info) {
      message.success('店铺信息保存成功');
    }
  };

  addProject = () => {
    const newData = {
      id: this.state.count,
      guaranteeType: '',
      guaranteeDesc: '',
    };
    const temp = [...this.state.listData, newData];
    this.setState({
      listData: temp,
      count: this.state.count + 1,
    });
  };

  handleDelete = id => {
    const newData = this.state.listData.filter(item => item.id !== id);
    const temp = [...newData];
    this.setState({
      listData: temp,
    });
  };

  ChangeName = (value, index) => {
    this.state.listData[index].guaranteeType = value;
    const temp = [...this.state.listData];
    this.setState({
      listData: temp,
    });
  };

  changeContent = (value, index) => {
    this.state.listData[index].guaranteeDesc = value;
    const temp = [...this.state.listData];
    this.setState({
      listData: temp,
    });
  };

  async findParentIdsBycode() {
    const { markerPosition } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    // 查询店铺信息
    const info = await findParentIdsBycode({
      areaCode: markerPosition.adcode,
    });
    if (info) {
      const initAreaIds = [info.data[0].areaId, info.data[1].areaId, info.data[2].areaId];
      setFieldsValue({
        address: initAreaIds,
      });
    }
  }

  async storeInfo() {
    // 查询店铺信息
    const info = await storeInfo();
    if (info) {
      const temp = [];
      if (info.data.guaranteeList) {
        info.data.guaranteeList.map((item, index) => {
          temp.push(
            Object.assign({}, item, {
              id: index,
              guaranteeType: item.guaranteeType,
              guaranteeDesc: item.guaranteeDesc,
            })
          );
        });
      }
      this.setState(
        {
          editList: info.data,
          storeAvatar: info.data.storeAvatar,
          listData: temp,
          count: info.data.guaranteeList ? info.data.guaranteeList.length : 0,
        },
        () => {
          this.areaList();
        }
      );
    }
  }

  async areaList() {
    const me = this;
    const { editList, AreaPrams } = this.state;
    const info = await areaList(AreaPrams);
    if (info) {
      const areaData = [];
      info.data.areaList.forEach(item => {
        areaData.push({
          areaCode: item.areaCode,
          value: item.areaId,
          label: item.areaName,
          parentId: item.areaParentId,
          isLeaf: false,
        });
      });
      this.setState(
        {
          areaData,
        },
        () => {
          if (editList && editList.companyAreaIds && editList.companyAreaIds.length) {
            me.twoArea(editList.companyAreaIds);
          }
        }
      );
    }
  }

  async twoArea(companyAreaIds) {
    const p = {
      areaId: companyAreaIds[0],
      maxDeep: 4,
    };
    const { areaData } = this.state;
    const me = this;
    if (companyAreaIds.length < 3) {
      return;
    }
    const info = await areaList(p);
    if (info) {
      const oneArr = areaData.find(item => item.value === companyAreaIds[0]);
      oneArr.children = [];
      info.data.areaList.forEach(item => {
        oneArr.children.push({
          areaCode: item.areaCode,
          value: item.areaId,
          label: item.areaName,
          parentId: item.areaParentId,
          isLeaf: false,
        });
      });

      this.setState(
        {
          areaData,
        },
        () => {
          me.threeArea(companyAreaIds);
        }
      );
    }
  }

  async threeArea(companyAreaIds) {
    const p = {
      areaId: companyAreaIds[1],
      maxDeep: 4,
    };
    const { areaData } = this.state;
    const info = await areaList(p);
    if (info) {
      const oneArr = areaData.find(item => item.value === companyAreaIds[0]).children;
      const twoArr = oneArr.find(item => item.value === companyAreaIds[1]);
      twoArr.children = [];
      info.data.areaList.forEach(item => {
        twoArr.children.push({
          areaCode: item.areaCode,
          value: item.areaId,
          label: item.areaName,
          parentId: item.areaParentId,
          isLeaf: true,
        });
      });
      this.setState(
        {
          areaData,
        },
        () => {
          this.setState({
            initAreaIds: companyAreaIds,
          });
          // 编辑反查code编辑地址
          this.selectArea(companyAreaIds);
        }
      );
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { areaData, storeAvatar, editList, initAreaIds, areaCode, listData } = this.state;
    const columns = [
      {
        title: '保障类型',
        dataIndex: 'guaranteeType',
        render: (text, record, index) => {
          return (
            <Input
              onChange={e => this.ChangeName(e.target.value, index)}
              value={record.guaranteeType}
              showCount
              maxLength={15}
            />
          );
        },
      },
      {
        title: '描述',
        dataIndex: 'guaranteeDesc',
        render: (text, record, index) => {
          return (
            <Input
              onChange={e => this.changeContent(e.target.value, index)}
              value={record.guaranteeDesc}
              showCount
              maxLength={70}
            />
          );
        },
      },
      {
        title: '设置',
        render: (text, record, index) => {
          return (
            <span onClick={() => this.handleDelete(record.id)} style={{ cursor: 'pointer' }}>
              删除
            </span>
          );
        },
      },
    ];
    return (
      <Panel title="店铺信息" content="设置店铺基础信息">
        <div className={Css.ShopBox}>
          <div className={Css.Formbox}>
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
              <FormItem label="店铺名称">
                {getFieldDecorator('storeName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入店铺名称',
                    },
                  ],
                  initialValue: editList && editList.storeName,
                })(<Input className={Css.widthinput} placeholder="请输入名称" />)}
              </FormItem>
              <FormItem label="所在地区">
                {initAreaIds
                  ? getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: '请选择所在地区',
                        },
                      ],
                      initialValue: initAreaIds,
                    })(
                      <Cascader
                        allowClear={false}
                        onChange={this.selectArea}
                        className={Css.widthinput}
                        options={areaData}
                        loadData={this.loadData}
                        changeOnSelect
                        placeholder="请选择地区"
                      />
                    )
                  : null}
                {areaData && !initAreaIds
                  ? getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: '请选择所在地区',
                        },
                      ],
                      initialValue: [],
                    })(
                      <Cascader
                        allowClear={false}
                        onChange={this.selectArea}
                        className={Css.widthinput}
                        options={areaData}
                        loadData={this.loadData}
                        changeOnSelect
                        placeholder="请选择地区"
                      />
                    )
                  : null}
              </FormItem>
              <FormItem label="地图定位">
                {getFieldDecorator('hidden', {
                  // 隐藏为了加星号
                  rules: [
                    {
                      required: true,
                      message: '请输入详细地址',
                    },
                  ],
                  initialValue: '1',
                })(<Input type="hidden" placeholder="请输入详细地址" />)}
                {areaCode ? (
                  <Amap editList={editList} areaCode={areaCode} getPosition={this.getPosition} />
                ) : (
                  <Input
                    value={editList && editList.storeAddress}
                    placeholder="请选择地图定位"
                    className={Css.widthinput}
                    disabled
                    type="text"
                  />
                )}
              </FormItem>

              <FormItem label="详细地址">
                {getFieldDecorator('doorplate', {
                  rules: [
                    {
                      required: true,
                      message: '请输入详细地址',
                    },
                  ],
                  initialValue: editList && editList.doorplate,
                })(<Input className={Css.widthinput} placeholder="请输入详细地址" />)}
              </FormItem>
              <FormItem label="店铺头像">
                <div className={Css.uploadBox}>
                  <Upload {...this.UploadTitleProps}>
                    {storeAvatar ? (
                      <img src={storeAvatar} alt="店铺头像" />
                    ) : (
                      <div className={Css.uploadtext}>
                        <PlusOutlined />
                        <div>上传照片</div>
                      </div>
                    )}
                  </Upload>
                </div>
                <p className={Css.msgreg}>建议使用宽100像素*高100像素内的方型图片</p>
              </FormItem>

              <FormItem label="行业">
                {editList && editList.industryName ? <p>{editList.industryName}</p> : null}
              </FormItem>

              <FormItem label="客服电话">
                {getFieldDecorator('storePhone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入客服电话',
                    },
                    {
                      validator: freeaskTimesVerify,
                    },
                  ],
                  initialValue: editList && editList.storePhone,
                })(<Input className={Css.widthinput} placeholder="请输入客服电话" />)}
              </FormItem>
              <FormItem label="店铺服务">
                {getFieldDecorator('storeCommitment', {
                  rules: [
                    {
                      required: true,
                      message: '请输入店铺服务',
                    },
                    {
                      max: 100,
                      message: '店铺服务过长',
                    },
                  ],
                  initialValue: editList && editList.storeCommitment,
                })(
                  <TextArea
                    placeholder="多行输入"
                    maxLength={100}
                    style={{ width: 435, height: 150 }}
                  />
                )}
                <p className={Css.msgreg}>在商品详情售后保障处显示，请不要超过100个字符</p>
              </FormItem>
              <FormItem label="店铺保障">
                {this.state.listData.length < 8 && <Button onClick={this.addProject}>添加</Button>}
              </FormItem>
              <FormItem noStyle style={{ marginLeft: '130px' }}>
                <Table
                  rowKey="id"
                  dataSource={listData?.length > 0 ? listData : null}
                  columns={columns}
                  bordered
                />
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.searchUserInfo}>
                  保存
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(Form.create()(SetShop));
