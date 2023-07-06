import React, { Component, Fragment } from 'react';
import { Link, history } from '@umijs/max';
import {
  Popover,
  InputNumber,
  Input,
  Select,
  Button,
  Table,
  message,
  Checkbox,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Css from './AddGoods.module.scss';

import { specOptionList, specValueOptionList, addSpec, addSpecValue } from '@/services/spec';
import { withRouter } from '@/utils/compatible';

const { Option } = Select;

const beforeSpecImg = file => {
  const size = file.size / 1024 < 500;
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.warning('仅支持jpg、png、jpeg格式');
  }
  if (!size) {
    message.warning('文件不能大于500k');
  }
  return size && isJpgOrPng;
};

class Specifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specValuesInfo: [], // 规格值列表
      specNameInfo: [], // 规格值列表
      specList: [], // 规格列表
      addLoading: false,
      classId: 1,
    };
  }

  componentDidMount() {
    const {
      location: {
        query: { type = 'add' },
      },
    } = history;
    const { editInfo } = this.props;
    this.specOptionList();
    // 规格列表
    if (type == 'add') {
      this.initSpecData();
    } else if (editInfo) {
      console.log(editInfo);
      this.editSpecListFn(editInfo.specList);
      // this.setState({
      //   specList: editInfo.specList,
      //   specData: editInfo.specData,
      // })
      // this.initSpecData();
    }
  }

  nextFn() {
    // 下一步
    const { specData, specList } = this.state;
    const { editInfo } = this.props;
    const stateObj = this.state;
    // console.log(stateObj);
    // console.log(specData);
    // console.log(specList);
    // console.log(editInfo);
    if (!specData || !specData.length) {
      message.warning('请选择商品规格');
      return false;
    }
    const skuList = [];
    const specListArr = [];
    const skuValueObj = {};
    for (var key in stateObj) {
      if (key.indexOf('&&') > -1) {
        const specName = key.split('&&')[0];
        specData.forEach(item => {
          if (item.specList === specName) {
            skuValueObj[key] = stateObj[key]; // 拿到所有有规格值的数据
          }
        });
      }
    }
    let isSpecImg = false; // 规格图片是否选择
    let isSpecEmpty = false;
    specList.forEach(item => {
      const specValueList = [];
      if (item.isCheckImg) {
        item.imageSrcArr.forEach(son => {
          if (!son.imageSrc) {
            isSpecImg = true;
          } else {
            const imageSrc = son.imageSrc.map(file => {
              // 商品图片
              return (file.response && file.response.imageUrl) || file.url;
            });
            specValueList.push({
              specValueId: son.specValueId,
              specValue: son.specValue,
              imageSrc: imageSrc[0],
            });
          }
        });
      } else if (!item.specValues) {
        isSpecEmpty = true;
        return;
      } else if (item.specValues && item.specValues.length) {
        item.specValues.forEach(son => {
          const arr = item.specValuesInfo.find(i => i.specValueId == son);
          specValueList.push({
            specValueId: arr.specValueId,
            specValue: arr.specValue,
            imageSrc: null,
          });
        });
      }
      specListArr.push({
        specId: item.specId,
        specName: item.specName,
        classSpecFlag: item.classSpecFlag,
        specValueList,
      });
    });
    if (isSpecEmpty) {
      message.warning('请完善规格值');
      return false;
    }
    if (isSpecImg) {
      message.warning('请选择规格值图片');
      return false;
    }
    let isSkuValue = false; // 是否没填库存和售价
    specData.forEach(item => {
      if (item.specList === 'defaultSpec') {
        // 存在默认规格
        let salePrice = null;
        let linePrice = null;
        // let storage = null;
        let outSerial = null;
        for (var key in skuValueObj) {
          const newKey = key.split('&&')[0];
          if (item.specList == newKey) {
            if (key.indexOf('salePrice') > -1) {
              salePrice = skuValueObj[key];
            }
            if (key.indexOf('linePrice') > -1) {
              linePrice = skuValueObj[key];
            }
            // if (key.indexOf('storage') > -1) {
            //   storage = skuValueObj[key];
            // }
            if (key.indexOf('outSerial') > -1) {
              outSerial = skuValueObj[key];
            }
          }
        }
        if (salePrice) {
          salePrice = Math.round(salePrice * 100);
        }
        if (linePrice) {
          linePrice = Math.round(linePrice * 100);
        }
        if (!salePrice || !linePrice) {
          isSkuValue = true;
        }
        skuList.push({
          specList,
          salePrice,
          outSerial,
          storage: 999,
          linePrice,
        });
      } else if (!item.totalSet) {
        const specList = [];
        const specName = item.specName.split('-');
        const specValue = item.specValue.split('&&');
        const specValueId = item.specValueId.split(',');
        const specId = item.specId.split(',');
        const classSpecFlag = item.classSpecFlag.split(',');
        specId.forEach((son, index) => {
          specList.push({
            specList: item.specList,
            specId: specId[index],
            specName: specName[index],
            specValue: specValue[index],
            specValueId: specValueId[index],
            classSpecFlag: classSpecFlag[index] == 1,
          });
        });
        let salePrice = null;
        let linePrice = null;
        // let storage = null;
        let outSerial = null;
        let skuId = null;
        for (var key in skuValueObj) {
          const newKey = key.split('&&')[0];
          if (item.specList == newKey) {
            if (key.indexOf('salePrice') > -1) {
              salePrice = skuValueObj[key];
            }
            if (key.indexOf('linePrice') > -1) {
              linePrice = skuValueObj[key];
            }
            // if (key.indexOf('storage') > -1) {
            //   storage = skuValueObj[key];
            // }
            if (key.indexOf('outSerial') > -1) {
              outSerial = skuValueObj[key];
            }
          }
        }
        if (salePrice) {
          salePrice = Math.round(salePrice * 100);
        }
        if (linePrice) {
          linePrice = Math.round(linePrice * 100);
        }
        if (!salePrice || !linePrice) {
          isSkuValue = true;
        }
        if (Array.isArray(editInfo?.skuList) && editInfo?.skuList?.length > 0) {
          editInfo.skuList.forEach(i => {
            if (Array.isArray(i.specList) && i.specList.length > 0) {
              i.specList.forEach(c => {
                if (c && item.specValueId === c.specValueId) skuId = i.skuId;
              });
            }
          });
        }
        skuList.push({
          specList,
          salePrice,
          outSerial,
          storage: 999,
          linePrice,
          skuId,
        });
      }
    });
    if (isSkuValue) {
      message.warning('请输入社区团购价和划线价');
      return false;
    }
    return {
      skuList,
      specList: specListArr,
    };
  }

  specOptionList() {
    // 获得规格列表
    const { editInfo } = this.props;
    const { classId } = this.state;
    const p = {
      classId,
      classSpecFlag: false,
    };
    specOptionList(p).then(res => {
      if (res) {
        let specNameInfo = null;
        if (editInfo && editInfo.specList) {
          // 如果存在已删除规格信息
          editInfo.specList.forEach(item => {
            if (!res.data.find(i => i.specId == item.specId)) {
              // 已删除规格,重新添加到列表里
              res.data.push({
                specId: item.specId.toString(),
                specName: item.specName,
                classSpecFlag: item.classSpecFlag,
              });
            }
          });
        }
        specNameInfo = res.data;
        this.setState({
          specNameInfo,
        });
      }
    });
  }

  setNewTable() {
    // 重新封装规格表格数据结构
    const { specList } = this.state;
    const { editInfo } = this.props;
    // const isEmptySpec = editInfo ? !editInfo.specList.length && editInfo.skuList.length : false; // 存在默认规格
    let dataSource = [];
    const specData = [];
    if (specList && specList.length) {
      specList.map(item => {
        if (item.specValues && item.specValuesInfo) {
          const arr = [];
          item.specValues.map((i, index) => {
            let specValue = null;
            if (item.specValuesInfo && item.specValuesInfo.find(j => j.specValueId == i)) {
              specValue = item.specValuesInfo.find(j => j.specValueId == i).specValue;
            }
            const specValueId = i;
            const classSpecFlag = item.classSpecFlag ? 1 : 0;
            arr[index] = `${item.specId}#${
              item.specName
            }#${specValue}#${specValueId}#${classSpecFlag}`;
          });
          item.specList = arr;
          dataSource.push(item.specList);
        }
      });
    }

    dataSource = this.cartesianProductOf(...dataSource);
    dataSource.forEach(i => {
      const specIdArr = [];
      const specNameArr = [];
      const specValueArr = [];
      const specValueIdArr = [];
      const classSpecFlagArr = [];
      i.forEach(item => {
        specIdArr.push(item.split('#')[0]);
        specNameArr.push(item.split('#')[1]);
        specValueArr.push(item.split('#')[2]);
        specValueIdArr.push(item.split('#')[3]);
        classSpecFlagArr.push(item.split('#')[4]);
      });
      if (i.length) {
        const specList = `${specIdArr.join(',')}#${specNameArr.join(',')}#${classSpecFlagArr.join(
          ','
        )}-${specValueIdArr.join(',')}#${specValueArr.join(',')}`;
        specData.push({
          specList,
          specId: specIdArr.join(','),
          specName: specNameArr.join('-'),
          specValue: specValueArr.join('&&'),
          specValueId: specValueIdArr.join(','),
          classSpecFlag: classSpecFlagArr.join(','),
        });
      }
    });

    if (editInfo && editInfo.skuList) {
      editInfo.skuList.forEach((item, sonindex) => {
        item.specList = [specData[sonindex]];
      });
      this.setState(
        {
          editInfo,
        },
        () => {
          this.setMoneyFn();
        }
      );
    }
    if (specData && specData.length) {
      specData.push({
        // specList: '批量设置',
        specValue: '批量设置',
        totalSet: '1',
      });
    }
    this.setState({
      specData,
    });
  }

  setMoneyFn(isEmptySpec) {
    // 设置编辑金额
    const { editInfo } = this.state;
    if (editInfo.skuList && editInfo.skuList.length) {
      editInfo.skuList.forEach(item => {
        if (isEmptySpec) {
          const specList = 'defaultSpec';
          const salePrice = `${specList}&&salePrice`;
          const storage = `${specList}&&storage`;
          const linePrice = `${specList}&&linePrice`;
          const outSerial = `${specList}&&outSerial`;
          this.setState({
            [salePrice]: item.salePrice / 100,
            [storage]: item.storage,
            [linePrice]: item.linePrice / 100,
            [outSerial]: item.outSerial,
          });
        } else {
          item.specList &&
            item.specList.forEach(son => {
              if (son && son.specList) {
                const { specList } = son;
                const salePrice = `${specList}&&salePrice`;
                const storage = `${specList}&&storage`;
                const linePrice = `${specList}&&linePrice`;
                const outSerial = `${specList}&&outSerial`;
                this.setState({
                  [salePrice]: item.salePrice / 100,
                  [storage]: item.storage,
                  [linePrice]: item.linePrice / 100,
                  [outSerial]: item.outSerial,
                });
              }
            });
        }
      });
    }
  }

  addSizeFn = () => {
    // 添加新规格盒子
    const { specList } = this.state;
    if (specList.length === 3) {
      message.warning('最多添加三个规格');
      return;
    }
    specList.push({
      specId: null,
      specName: null,
      newspecName: null,
      specNameShow: false,
    });
    this.setState(
      {
        specList,
      },
      () => {
        this.setNewTable();
      }
    );
  };

  deleteBox = index => {
    // 删除规格盒子
    const { specList } = this.state;
    specList.splice(index, 1);
    this.setState(
      {
        specList,
      },
      () => {
        this.setNewTable();
        if (!specList || !specList.length) {
          this.initSpecData();
        }
      }
    );
  };

  editSpecListFn(data) {
    console.log('dsjdskljds', data);
    // 初始化规格块
    if (!data?.length) {
      // 不存在规格块
      this.initSpecData();
      return;
    }
    const specList = [];
    const imageSrcArr = [];
    console.log(data);
    data.forEach(item => {
      const specValues = [];
      item.specValueList.forEach(i => {
        i.specValueId = i.specValueId.toString();
        item.specValueId = i.specValueId.toString();
        specValues.push(item.specValueId);
        if (i.imageSrc) {
          const fileListOne = [];
          const imgInit = {
            uid: 1,
            name: i.imageSrc.substring(i.imageSrc.lastIndexOf('/') + 1),
            status: 'done',
            url: `${i.imageSrc}`,
            response: {
              data: {
                url: i.imageSrc,
              },
              imageUrl: i.imageSrc,
            },
          };
          fileListOne.push(imgInit);
          imageSrcArr.push({
            specValueId: i.specValueId,
            specValue: i.specValue,
            imageSrc: fileListOne,
          });
        }
      });
      specList.push({
        specId: item.specId,
        specName: item.specName,
        classSpecFlag: item.classSpecFlag,
        specValues,
        specValuesInfo: null,
      });
    });
    specList[0].isCheckImg = imageSrcArr.length;
    specList[0].imageSrcArr = imageSrcArr;
    this.setState(
      {
        specList,
      },
      () => {
        specList.forEach((item, index) => {
          // 重新赋值规格列表
          const p = {
            specId: item.specId,
            classSpecFlag: false,
          };
          this.specValueOptionList(p, index);
        });
      }
    );
  }

  initSpecData() {
    // 只存在默认规格值
    const { editInfo } = this.props;
    const specData = [];
    specData.push({
      specList: 'defaultSpec',
      specId: null,
      specName: null,
      specValue: '默认',
      specValueId: null,
      classSpecFlag: null,
    });
    this.setState(
      {
        editInfo,
        specData,
      },
      () => {
        if (editInfo && editInfo.skuList) {
          this.setMoneyFn(true);
        }
      }
    );
  }

  specNameChange = (index, value, option) => {
    // 规格名搜索栏变化
    const { specList, specNameInfo } = this.state;
    const isName = specList.find(i => i.specId == value);
    if (isName) {
      message.warning('该规格名已存在');
      return;
    }
    specList[index].specName = option.props.children;
    specList[index].specId = value;
    specList[index].classSpecFlag = specNameInfo.find(i => i.specId == value).classSpecFlag;
    specList[index].specValues = undefined;
    specList[index].specValuesInfo = undefined; // 清空默认规格值
    specList[index].imageSrcArr = null;
    const p = {
      specId: value,
      classSpecFlag: false,
    };
    this.specValueOptionList(p, index, true);
  };

  specValueOptionList(p, index, isClearEdit) {
    // 获取规格值列表
    const { specList } = this.state;
    const { editInfo } = this.props;
    specValueOptionList(p).then(res => {
      if (res) {
        if (editInfo && editInfo.specList && !isClearEdit) {
          // 如果存在编辑信息
          editInfo.specList.forEach(item => {
            if (item.specId == p.specId) {
              item.specValueList.forEach(son => {
                if (!res.data.find(i => i.specValueId == son.specValueId)) {
                  // 已删除规格值,重新添加到列表里
                  res.data.push(son);
                }
              });
            }
          });
        }
        specList[index].specValuesInfo = res.data;
        this.setState(
          {
            specList,
          },
          () => {
            this.setNewTable(index);
          }
        );
      }
    });
  }

  handleVisibleChange(index, show) {
    // 控制气泡显示变化
    const { specList } = this.state;
    specList[index].specNameShow = show;
    specList[index].newspecName = null;
    this.setState({
      specList,
    });
  }

  totalSetChange(key, clearName, show) {
    if (show) {
      this.setState({
        [clearName]: null,
      });
    }
    this.setState({
      [key]: show,
    });
  }

  saveNewspecName(index) {
    // 点击保存新规格名
    const { specList, specNameInfo } = this.state;
    const isspecName = specNameInfo.find(i => i.specName == specList[index].newspecName);
    if (isspecName) {
      message.warning('该规格名已存在');
      return;
    }
    if (specList[index].newspecName.length > 10) {
      message.warning('规格名最长十个字');
      return;
    }
    this.setState({
      addLoading: true,
    });
    const p = {
      specName: specList[index].newspecName,
    };
    this.addSpec(p, index); // 新增规格名
  }

  addSpec(p, index) {
    // 新增规格
    const { specNameInfo, specList } = this.state;
    addSpec(p).then(res => {
      if (res) {
        specNameInfo.push({
          specId: res.data.specId,
          specName: res.data.specName,
          classSpecFlag: false,
        });
        specList[index].specId = res.data.specId;
        specList[index].specName = res.data.specName;
        specList[index].specNameShow = false;
        specList[index].specValues = undefined;
        specList[index].specValuesInfo = undefined;
        specList[index].classSpecFlag = false;
        this.setState(
          {
            addLoading: false,
            specNameInfo,
            specList,
          },
          () => {
            this.setNewTable();
          }
        );
      }
    });
  }

  closePop(index) {
    // 点击气泡取消
    const { specList } = this.state;
    specList[index].specNameShow = false;
    this.setState({
      specList,
    });
  }

  setNewspecName = (index, e) => {
    // 输入新规格名称时
    const { specList } = this.state;
    specList[index].newspecName = e.target.value;
    this.setState(
      {
        specList,
      },
      () => {
        this.setNewTable();
      }
    );
  };

  imgSrcChange(index) {
    // 规格值图片时时变化
    const { specList } = this.state;
    if (!specList[index].isCheckImg) {
      return;
    }
    if (!specList[index].specValues) {
      specList[index].imageSrcArr = [];
      return;
    }
    specList[index].imageSrcArr = [];
    specList[index].specValues.map((item, sonIndex) => {
      const {specValue} = specList[index].specValuesInfo.find(i => i.specValueId == item);
      specList[index].imageSrcArr.push({
        specValue,
        specValueId: item,
        imageSrc: null,
      });
    });
    this.setState({
      specList,
    });
  }

  addSizeImgFn = (index, e) => {
    // 勾选添加规格图片
    const { specList } = this.state;
    specList[index].isCheckImg = e.target.checked;
    if (e.target.checked && specList[index].specValues instanceof Array) {
      this.imgSrcChange(index);
    } else {
      specList[index].imageSrcArr = null;
      this.setState({
        specList,
      });
    }
  };

  getspecValuesFn(index, value, option) {
    // 获得规格值
    if (value && value.length > 20) {
      message.warning('最多添加20个规格值');
      return;
    }
    if (value && value.length && value[value.length - 1].length > 15) {
      message.warning('规格值最长15个字');
      return;
    }
    const { specList } = this.state;
    const specValue = option.length ? option[option.length - 1].props.children : null;
    const isValue = specList[index].specValuesInfo
      ? specList[index].specValuesInfo.find(i => i.specValue == specValue)
      : false;
    if (!isValue) {
      // 选中规格值不存在,新增操作
      const lastValue = value[value.length - 1];
      if (!value.length) {
        // 已删除所有规格
        specList[index].specValues = undefined;
        this.setState({
          specList,
        });
        return;
      }
      const p = {
        specId: specList[index].specId,
        specValues: [lastValue],
      };
      // 新增规格值
      this.addSpecValue(p, value, index);
    } else {
      // 选中已存在
      specList[index].specValues = value; // 规格值ID赋值
    }
    this.setState(
      {
        specList,
      },
      () => {
        this.imgSrcChange(index);
        this.setNewTable();
      }
    );
  }

  addSpecValue(p, value, index) {
    // 添加规格值
    const { specList } = this.state;
    addSpecValue(p).then(res => {
      if (res) {
        if (!specList[index].specValuesInfo) {
          specList[index].specValuesInfo = [];
        }
        specList[index].specValuesInfo.push({
          specValueId: res.data[0].specValueId,
          specValue: res.data[0].specValue,
        });
        value[value.length - 1] = res.data[0].specValueId;
        specList[index].specValues = value;
        this.setState(
          {
            specList,
          },
          () => {
            this.imgSrcChange(index);
            this.setNewTable();
          }
        );
      }
    });
  }

  popContent = index => {
    // 气泡内容
    const { specList, addLoading } = this.state;
    const popDom = (
      <div>
        <Input
          value={specList[index].newspecName}
          onChange={e => this.setNewspecName(index, e)}
          placeholder="新增规格"
        />
        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <Button size="small" onClick={() => this.closePop(index)} style={{ marginRight: '5px' }}>
            取消
          </Button>
          <Button
            type="primary"
            loading={addLoading}
            onClick={() => this.saveNewspecName(index)}
            size="small"
          >
            确定
          </Button>
        </div>
      </div>
    );
    return popDom;
  };

  commonChange(key, value) {
    // 价格库存输入框
    if (key.indexOf('&&outSerial') > -1) {
      value = value.target.value;
    }
    this.setState({
      [key]: value,
    });
  }

  cartesianProductOf() {
    // sku 算法
    return Array.prototype.reduce.call(
      arguments,
      function(a, b) {
        const ret = [];
        a.forEach(function(a) {
          b.forEach(function(b) {
            ret.push(a.concat([b]));
          });
        });
        return ret;
      },
      [[]]
    );
  }

  closeTotal(showName) {
    // 关闭批量设置
    this.setState({
      [showName]: false,
    });
  }

  totalInputChange(key, value) {
    // 批量输入框
    if (key.indexOf('outSerial') > -1) {
      value = value.target.value;
    }
    this.setState({
      [key]: value,
    });
  }

  setTotalValFn(setName, value, showName) {
    // 点击确定批量设置
    const { specData } = this.state;
    specData.forEach(item => {
      if (item.specList) {
        const key = `${item.specList}&&${setName}`;
        this.setState({
          [key]: this.state[value],
        });
      }
    });
    this.setState({
      [showName]: false,
      specData,
    });
  }

  setValuePop = (setName, showName) => {
    const popDom = (
      <div>
        {setName === 'outSerial' ? (
          <Input
            style={{ width: '150px' }}
            value={this.state[`total-${setName}`]}
            onChange={value => this.totalInputChange(`total-${setName}`, value)}
          />
        ) : (
          <InputNumber
            style={{ width: '150px' }}
            min={0}
            precision={2}
            value={this.state[`total-${setName}`]}
            onChange={value => this.totalInputChange(`total-${setName}`, value)}
          />
        )}

        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Button
            size="small"
            style={{ marginRight: '5px' }}
            onClick={this.closeTotal.bind(this, showName)}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={this.setTotalValFn.bind(this, setName, `total-${setName}`, showName)}
            size="small"
          >
            确定
          </Button>
        </div>
      </div>
    );
    return popDom;
  };

  specImageFn = (index, item, sonIndex) => {
    const { specList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">选择图片</div>
      </div>
    );
    const newImageSrc = specList[index].imageSrcArr[sonIndex].imageSrc;
    return (
      <Upload
        // className={Css.specImgBox}
        // key={sonIndex}
        fileList={newImageSrc}
        name="file"
        action="/proxy/cloud/oss/upload?type=goods"
        listType="picture-card"
        beforeUpload={beforeSpecImg}
        onChange={this.uploadSpecImg.bind(this, index, item.specValueId)}
      >
        {newImageSrc && newImageSrc.length === 1 ? null : uploadButton}
      </Upload>
    );
  };

  uploadSpecImg(index, specValueId, info) {
    const { specList } = this.state;
    let fileListOne = info.fileList;
    fileListOne = fileListOne.map(file => {
      if (file.response) {
        file.url = file.response.data.url;
      }
      return file;
    });
    fileListOne = fileListOne.filter(file => {
      if (file.response) {
        return file.response.success || file.status === 'done';
      }
      return true;
    });
    fileListOne.forEach(item => {
      if (item.size / 1024 > 500) {
        item.status = 'error';
      }
    });
    specList[index].imageSrcArr.forEach(item => {
      if (item.specValueId == specValueId) {
        item.imageSrc = fileListOne;
      }
    });
    this.setState({ specList });
  }

  editMoreFn() {
    const { moreShow } = this.state;
    this.setState({
      moreShow: !moreShow,
    });
  }

  render() {
    const { specList, specNameInfo, specValuesInfo, specData } = this.state;

    const specNameList = specNameInfo.map(item => {
      return (
        <Option key={item.specId} value={item.specId}>
          {item.specName}
        </Option>
      );
    });

    const specValuesList = specValuesInfo.map(item => {
      return (
        <Option key={item.specValueId} value={item.specValueId}>
          {item.specValue}
        </Option>
      );
    });

    const columns = [
      {
        title: '规格值',
        dataIndex: 'specValue',
      },
      {
        title: '*社区团购价',
        dataIndex: 'salePrice',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑社区团购价"
                content={this.setValuePop('salePrice', 'salePriceShow')}
                visible={this.state['salePriceShow']}
                onVisibleChange={this.totalSetChange.bind(this, 'salePriceShow', 'total-salePrice')}
                trigger="click"
              >
                <a>社区团购价</a>
              </Popover>
            );
          }
          return (
            <InputNumber
              precision={2}
              onChange={this.commonChange.bind(this, `${record.specList}&&salePrice`)}
              value={this.state[`${record.specList}&&salePrice`]}
              min={0}
            />
          );
        },
      },
      // {
      //   title: '*库存',
      //   dataIndex: 'storage',
      //   render: (text, record) => {
      //     if (record.totalSet === '1') {
      //       return (
      //         <Popover
      //           title="批量编辑库存"
      //           precision={0}
      //           content={this.setValuePop('storage', 'storageShow')}
      //           visible={this.state['storageShow']}
      //           onVisibleChange={this.totalSetChange.bind(this, 'storageShow', 'total-storage')}
      //           trigger="click"
      //         >
      //           <a>库存</a>
      //         </Popover>
      //       );
      //     }
      //     return (
      //       <InputNumber
      //         precision={0}
      //         onChange={this.commonChange.bind(this, `${record.specList}&&storage`)}
      //         value={this.state[`${record.specList}&&storage`]}
      //         min={0}
      //       />
      //     );
      //   },
      // },
      {
        title: '*划线价',
        dataIndex: 'linePrice',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑划线价"
                precision={2}
                content={this.setValuePop('linePrice', 'linePriceShow')}
                visible={this.state['linePriceShow']}
                onVisibleChange={this.totalSetChange.bind(this, 'linePriceShow', 'total-linePrice')}
                trigger="click"
              >
                <a>划线价</a>
              </Popover>
            );
          }
          return (
            <InputNumber
              onChange={e => this.commonChange(`${record.specList}&&linePrice`, e)}
              value={this.state[`${record.specList}&&linePrice`]}
              min={0}
            />
          );
        },
      },
      {
        title: '规格编码',
        dataIndex: 'outSerial',
        render: (text, record) => {
          if (record.totalSet === '1') {
            return (
              <Popover
                title="批量编辑规格编码"
                content={this.setValuePop('outSerial', 'outSerialShow')}
                visible={this.state['outSerialShow']}
                onVisibleChange={this.totalSetChange.bind(this, 'outSerialShow', 'total-outSerial')}
                trigger="click"
              >
                <a>规格编码</a>
              </Popover>
            );
          }
          return (
            <Input
              style={{ width: '150px' }}
              onChange={e => this.commonChange(`${record.specList}&&outSerial`, e)}
              value={this.state[`${record.specList}&&outSerial`]}
            />
          );
        },
      },
    ];

    return (
      <Fragment>
        <div className={Css.SizeBox} style={{ display: specList.length ? 'block' : 'none' }}>
          <ul className={Css.sizeUl}>
            {specList.map((item, index) => {
              return (
                <li key={index}>
                  <div className={Css.specNameBox}>
                    <span>规格名称: </span>
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: 240 }}
                      placeholder="请输入规格名称"
                      onChange={(value, option) => this.specNameChange(index, value, option)}
                      value={item.specId ? item.specId.toString() : null}
                    >
                      {specNameList}
                    </Select>
                    <Popover
                      onVisibleChange={show => this.handleVisibleChange(index, show)}
                      content={this.popContent(index)}
                      visible={item.specNameShow}
                      trigger="click"
                    >
                      <a style={{ margin: '0 10px' }}>新增</a>
                    </Popover>
                    {index === 0 ? (
                      <Checkbox
                        checked={specList[index].isCheckImg}
                        onChange={e => this.addSizeImgFn(index, e)}
                      >
                        添加规格图片
                      </Checkbox>
                    ) : null}

                    <span onClick={() => this.deleteBox(index)} className={Css.deleteSize}>
                      删除
                    </span>
                  </div>
                  <div className={Css.sizeValueBox}>
                    <span>规格值: </span>
                    <Select
                      disabled={!item.specId}
                      mode="tags"
                      style={{ width: '300px' }}
                      value={item.specValues}
                      onChange={(value, option) => this.getspecValuesFn(index, value, option)}
                      placeholder="请选择规格值,最多20个"
                    >
                      {item.specValuesInfo
                        ? item.specValuesInfo.map(i => {
                            return (
                              <Option key={i.specValueId} value={i.specValueId}>
                                {i.specValue}
                              </Option>
                            );
                          })
                        : specValuesList}
                    </Select>
                  </div>
                  {/* 规格图片 */}
                  {item.isCheckImg ? (
                    <div style={{ marginLeft: '7px' }}>
                      {item.imageSrcArr &&
                        item.imageSrcArr.map((sonItem, sonIndex) => {
                          return (
                            <div key={sonItem.specValueId} className={Css.specVaueImgBox}>
                              {this.specImageFn(index, sonItem, sonIndex)}
                              <div className={Css.specVaueTextBox}>{sonItem.specValue}</div>
                            </div>
                          );
                        })}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
        <Button onClick={() => this.addSizeFn()}> + 添加规格</Button>
        <Link target="_blank" to="/goods/specList" style={{ marginLeft: '15px' }}>
          规格管理
        </Link>
        <div style={{ height: 18 }} />
        <Table
          rowKey={record => record.specList}
          bordered
          pagination={false}
          columns={columns}
          dataSource={specData}
        />
      </Fragment>
    );
  }
}

export default withRouter(Specifications);
