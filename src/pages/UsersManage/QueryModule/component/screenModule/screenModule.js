import React, { Component } from 'react';
import { Cascader, DatePicker, InputNumber, Select } from 'antd';
import Css from "./screenModule.module.scss"
import { queryDistrict } from '@/services/queryUser';

const { Option } = Select;
const { RangePicker } = DatePicker;
class ScreenModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sexList: [
        // 性别数据

        {
          name: '男',
          code: 1,
        },
        {
          name: '女',
          code: 2,
        },
        {
          name: '保密',
          code: 0,
        },
      ],
      educationList: [
        // 学历数据
        {
          name: '小学',
          code: 1,
        },
        {
          name: '初中',
          code: 2,
        },
        {
          name: '高中',
          code: 3,
        },
        {
          name: '本科',
          code: 4,
        },
        {
          name: '硕士',
          code: 5,
        },
        {
          name: '博士',
          code: 6,
        },
        {
          name: '其他',
          code: 0,
        },
      ],
      addressList: [],
      optionsValue: [],
      options: [],
    };
  }

  componentDidMount() {
    this.getDistrictData();
  }

  // 获取省级数据
  async getDistrictData() {
    const { data: addressList } = await queryDistrict();
    const options = addressList.map(item => {
      return {
        ...item,
        isLeaf: false,
      };
    });
    this.setState({
      options,
    });
  }

  // 级联加载
  async cascaderloadData(selectedOptions) {
    let options = [];
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const { data: addressList } = await queryDistrict({ areaId: targetOption.areaId });
    targetOption.loading = false;
    switch (targetOption.level) {
      case 1:
        options = addressList.map(item => {
          return {
            ...item,
            isLeaf: false,
          };
        });
        targetOption.children = options;
        break;
      case 2:
        targetOption.children = addressList;
        break;
      default:
        break;
    }
    this.setState({
      options: [...this.state.options],
    });
  }

  // 最小交易金额
  onChangeMinTradeAmount(value) {
    this.props.modificationState({ minTradeAmount: value });
  }

  // 最大交易总额
  onChangeMaxTradeAmount(value) {
    this.props.modificationState({ maxTradeAmount: value });
  }

  // 最小平均交易额
  onChangeMinAvgTradeAmount(value) {
    this.props.modificationState({ minAvgTradeAmount: value });
  }

  // 最大平均交易额
  onChangeMaxAvgTradeAmount(value) {
    this.props.modificationState({ maxAvgTradeAmount: value });
  }

  // 最小交易笔数
  onChangeMinTradeQuantity(value) {
    this.props.modificationState({ minTradeQuantity: value });
  }

  // 最大交易笔数
  onChangeMaxTradeQuantity(value) {
    this.props.modificationState({ maxTradeQuantity: value });
  }

  // 性别选择
  sexHandleChange(value) {
    this.props.modificationState({ sex: value });
  }

  // 地区选择
  addressHandleChange(value) {
    this.setState({
      optionsValue: value,
    });
    this.props.modificationState({ provinceId: value[0], cityId: value[1], areaId: value[2] });
  }

  // 学历选择
  educationHandleChange(value) {
    this.props.modificationState({ education: value });
  }

  // 时间选择
  onChangeDate(value, dateString) {
    this.props.modificationState({
      minLastTradeTime: dateString[0],
      maxLastTradeTime: dateString[1],
    });
  }

  render() {
    const { screenData } = this.props;
    const { optionsValue, options } = this.state;
    return (
      <div className={Css["screen-more"]}>
        <ul className={Css["screen-more-money"]}>
          <li className={Css["screen-money-item"]}>
            交易总额：&nbsp;&nbsp;
            <InputNumber
              style={{ width: 108 }}
              min={0}
              max={99999999.99}
              step={0.01}
              defaultValue="0"
              value={screenData.minTradeAmount}
              onChange={this.onChangeMinTradeAmount.bind(this)}
            />
            &nbsp;&nbsp;至&nbsp;&nbsp;
            <InputNumber
              style={{ width: 108 }}
              min={0}
              max={99999999.99}
              step={0.01}
              defaultValue="0"
              value={screenData.maxTradeAmount}
              onChange={this.onChangeMaxTradeAmount.bind(this)}
            />
          </li>
          <li className={Css["screen-money-item"]}>
            平均交易额：&nbsp;&nbsp;
            <InputNumber
              style={{ width: 108 }}
              min={0}
              max={99999999.99}
              step={0.01}
              defaultValue="0"
              value={screenData.minAvgTradeAmount}
              onChange={this.onChangeMinAvgTradeAmount.bind(this)}
            />
            &nbsp;&nbsp;至&nbsp;&nbsp;
            <InputNumber
              style={{ width: 108 }}
              min={0}
              max={99999999.99}
              step={0.01}
              defaultValue="0"
              value={screenData.maxAvgTradeAmount}
              onChange={this.onChangeMaxAvgTradeAmount.bind(this)}
            />
          </li>
          <li className={Css["screen-money-item"]}>
            交易笔数：&nbsp;&nbsp;
            <InputNumber
              style={{ width: 108 }}
              min={0}
              max={99999999}
              defaultValue="0"
              value={screenData.minTradeQuantity}
              onChange={this.onChangeMinTradeQuantity.bind(this)}
            />
            &nbsp;&nbsp;至&nbsp;&nbsp;
            <InputNumber
              style={{ width: 108 }}
              min={0}
              max={99999999}
              defaultValue="0"
              value={screenData.maxTradeQuantity}
              onChange={this.onChangeMaxTradeQuantity.bind(this)}
            />
          </li>
        </ul>
        <ul className={Css["screen-more-rest"]}>
          <li className={Css["screen-rest-item"]}>
            性别：&nbsp;
            <Select
              placeholder="全部"
              style={{ width: 108 }}
              onChange={this.sexHandleChange.bind(this)}
            >
              {this.state.sexList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </li>
          <li className={Css["screen-rest-item"]}>
            地区：&nbsp;
            <Cascader
              value={optionsValue}
              options={options}
              loadData={this.cascaderloadData.bind(this)}
              onChange={this.addressHandleChange.bind(this)}
              placeholder="请选择地区"
              fieldNames={{
                label: 'areaName',
                value: 'areaId',
                children: 'children',
              }}
            />
          </li>
          <li className={Css["screen-rest-item"]}>
            学历：&nbsp;
            <Select
              placeholder="全部"
              style={{ width: 108 }}
              onChange={this.educationHandleChange.bind(this)}
            >
              {this.state.educationList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </li>
          <li className={Css["screen-rest-item"]}>
            上次交易时间：&nbsp;
            <RangePicker
              onChange={this.onChangeDate.bind(this)}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default ScreenModule;
