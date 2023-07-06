import React, { Component } from 'react';
import Css from './AddSpec.module.scss';
import { CloseCircleFilled } from '@ant-design/icons';
import { Button, Modal, Input, message } from 'antd';
// 引入接口
import { specDetail, addSpec, editSpec } from '@/services/spec';
import { showBut } from '@/utils/utils';

class AddSpec extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      SpecName: '',
      SpecList: [
        {
          specId: '',
          specValue: '',
        },
      ],
      // 防冲阀门
      addSpecIs: false,
    };
  }

  // 输入change事件
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 新增规格打开
  SpecShowModal() {
    this.props.SpecShowModal();
    this.setState({
      visible: true,
      addSpecIs: false,
    });
  }

  // 修改规格打开
  alterSpecShowModal(record) {
    const that = this;
    specDetail({
      specId: record.specId,
    }).then(res => {
      if (res.errorCode === '0') {
        that.setState({
          SpecId: record.specId,
          SpecName: record.specName,
          SpecList: res.data.specValueList,
          visible: true,
          addSpecIs: false,
        });
      }
    });
  }

  SpecOk() {
    const that = this;
    const { specTitleNum } = this.props;
    const { SpecId, SpecName, SpecList } = this.state;
    if (SpecName === '') {
      message.warning('规格名称不能为空');
      return;
    }
    for (let i in SpecList) {
      if (SpecList[i].specValue === '') {
        message.warning('规格值不能为空');
        return;
      }
    }
    if (this.state.addSpecIs) {
      return;
    }
    this.setState(
      {
        addSpecIs: true,
      },
      () => {
        if (specTitleNum === 'add') {
          let listData = SpecList.map(item => {
            return item.specValue;
          });
          addSpec({
            specName: SpecName,
            specValues: listData,
          })
            .then(res => {
              if (res.errorCode === '0') {
                message.success('添加成功');
                that.props.specListApi();
                that.setState({
                  visible: false,
                  SpecName: '',
                  SpecList: [
                    {
                      specId: '',
                      specValue: '',
                    },
                  ],
                  addSpecIs: false,
                });
              } else {
                that.setState({
                  // visible: false,
                  SpecName: '',
                  SpecList: [
                    {
                      specId: '',
                      specValue: '',
                    },
                  ],
                  addSpecIs: false,
                });
              }
            })
            .catch(() => {
              this.setState({
                addSpecIs: false,
              });
            });
        } else if (specTitleNum === 'alter') {
          editSpec({
            specId: SpecId,
            specName: SpecName,
            specValueList: SpecList,
          })
            .then(res => {
              if (res.errorCode === '0') {
                message.success('修改成功');
                that.props.specListApi();
                that.setState({
                  visible: false,
                  SpecName: '',
                  SpecList: [
                    {
                      specId: '',
                      specValue: '',
                    },
                  ],
                  addSpecIs: false,
                });
              } else {
                that.setState({
                  // visible: false,
                  SpecName: '',
                  SpecList: [
                    {
                      specId: '',
                      specValue: '',
                    },
                  ],
                  addSpecIs: false,
                });
              }
              this.setState({
                addSpecIs: false,
              });
            })
            .catch(() => {
              this.setState({
                addSpecIs: false,
              });
            });
        }
      }
    );
  }

  SpecCancel() {
    this.setState({
      visible: false,
      SpecName: '',
      SpecList: [
        {
          specId: '',
          specValue: '',
        },
      ],
    });
  }

  // 新增列表子类修改
  SpecListItemonChange(index, e) {
    let newSpecList = this.state.SpecList;
    newSpecList[index].specValue = e.target.value.trim();
    this.setState({
      SpecList: newSpecList,
    });
  }

  // 新增列表子类添加
  SpecListItemIncrease() {
    let SpecList = this.state.SpecList;
    SpecList.push({
      specId: '',
      specValue: '',
    });
    this.setState({
      SpecList: SpecList,
    });
  }

  // 新增列表子类删除
  SpecListItemDelect(index) {
    let SpecList = this.state.SpecList;
    SpecList.splice(index, 1);
    this.setState({
      SpecList: SpecList,
    });
  }

  render() {
    const { SpecList } = this.state;
    const { specTitleNum } = this.props;
    let specTitle = '';
    if (specTitleNum === 'add') {
      specTitle = '添加规格';
    } else if (specTitleNum === 'alter') {
      specTitle = '修改规格';
    }
    return (
      <div>
        {showBut('specList', 'specList_add') ? (
          <Button
            style={{ marginBottom: '16px' }}
            type="primary"
            onClick={this.SpecShowModal.bind(this)}
          >
            添加规格
          </Button>
        ) : null}
        <Modal
          title={specTitle}
          width={'580px'}
          visible={this.state.visible}
          onOk={this.SpecOk.bind(this)}
          onCancel={this.SpecCancel.bind(this)}
        >
          <div className={Css['spec-modal-box']}>
            <div className={Css['spec-modal-header']}>
              <p className={Css['header-title']}>规格名称：</p>
              <Input
                className={Css['header-input-text']}
                placeholder={'请输入'}
                maxLength={10}
                name="SpecName"
                value={this.state.SpecName}
                onChange={this.onChange.bind(this)}
              />
            </div>
            <div className={Css['spec-modal-content']}>
              <p className={Css['content-header']}>每个规格最多可添加20个规格</p>
              {SpecList.map((item, index) => {
                return (
                  <div className={Css['content-item-box']} key={index}>
                    <p className={Css['item-title']}>规格值：</p>
                    <Input
                      className={Css['item-input-text']}
                      placeholder={'请输入'}
                      maxLength={10}
                      value={item.specValue}
                      onChange={this.SpecListItemonChange.bind(this, index)}
                    />
                    {SpecList && SpecList.length > 1 ? (
                      <CloseCircleFilled
                        className={Css['item-del-icon']}
                        onClick={this.SpecListItemDelect.bind(this, index)}
                      />
                    ) : null}
                  </div>
                );
              })}
              {SpecList && SpecList.length < 20 ? (
                <p
                  className={Css['content-add-text']}
                  onClick={this.SpecListItemIncrease.bind(this)}
                >
                  +添加规格值
                </p>
              ) : null}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddSpec;
