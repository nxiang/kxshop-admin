import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Input, message, Form, Spin } from 'antd';
import html2canvas from 'html2canvas';
import Validator from 'kx-validator';
import { showBut } from '@/utils/utils';
import Css from './SetPopUpAd.module.scss';
import Panel from '@/components/Panel';

import {
  delAdvertising,
  getAdConfigLists
} from '@/services/shop';

const { Column } = Table;
const { confirm } = Modal;

const validator = new Validator({
  mode: 'cache',
  timeout: 200,
});

class SetSpecial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表展示数组
      listData: [],
      // 分页数据
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      spinning: false,
      statusKey: { finish: '已结束', processing: '进行中', toStart: '未开始' }
    };
  }

  componentDidMount() {
    this.getListDataApi();
  }

  getListDataApi(page) {
    const {
      sourcePage: { pageSize },
    } = this.state;
    const data = {
      pageNo: page || 1,
      pageSize,
    };
    this.setState({
      spinning: true
    })
    getAdConfigLists(data).then(res => {
      if (res.success) {
        this.setState({
          spinning: false,
          listData: res.data.rows,
          sourcePage: {
            current: res.data.current,
            pageSize: res.data.pageSize,
            total: res.data.total,
          },
        });
        // console.log('this.listData', this.state.listData)
      } else {
        this.setState({
          spinning: false,
        })
      }
    }).catch(err => {
      this.setState({
        spinning: false,
      })
    });
  }

  // 输入change事件
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  delPop = oneId => {
    const that = this;
    const {
      sourcePage: { current },
    } = this.state;
    confirm({
      title: '删除',
      content: '删除后不会生效，确定要删除么？',
      onOk() {
        const data = {
          oneId,
        };
        delAdvertising(data).then(res => {
          if (res.success&&res.errorCode === '0') {
            message.success('删除成功');
            that.getListDataApi(current);
          }
        });
      },
      onCancel() {},
    });
  };

  addPopupAd = () => {
    history.push(`/shop/popupAd/config/add`);
  };

  editPop = id => {
    history.push(`/shop/popupAd/config/${id}`);
  };

  render() {
    const {
      spinning,
      listData,
      statusKey,
      sourcePage: { current, pageSize, total }
    } = this.state;
    return (
      <Panel title="弹窗广告">
        <div className={Css['set-special-box']}>
          <div className={Css['content-box']}>
            <div>
              {showBut('popupAd', 'addPop') ? (
                <Button
                  className={Css['content-header-add-buttom']}
                  type="primary"
                  onClick={this.addPopupAd}
                >
                  <PlusOutlined
                    style={{ width: '18px', height: '18px', marginRight: '8px', fontSize: '18px' }}
                  />
                  <p>新增弹窗</p>
                </Button>
              ) : null}
            </div>
            <Spin size="large" spinning={spinning}>
              <Table
                ellipsis
                rowKey={record => record.oneId}
                dataSource={listData}
                pagination={{
                  current,
                  pageSize,
                  total,
                  onChange: page => this.getListDataApi(page),
                }}
              >
                <Column align="center" title="广告名称" dataIndex="advertisingName" />
                <Column align="center" title="投放时间" render={record => 
                  (<div>{ `${record.launchStartDate} 至 ${record.launchEndDate}` }</div>)
                }/>
                <Column align="center" title="当前状态" render={ record => (<div>{ statusKey[record.status] }</div>) }/>
                <Column align="center" title="创建时间" dataIndex="gmtCreate" />
                <Column
                  align="center"
                  title="操作"
                  render={record => (
                    <div className={Css['bule-text-box']}>
                      {showBut('popupAd', 'editPop') ? (
                        <p
                          className={Css['bule-text']}
                          onClick={() => this.editPop(record.oneId)}
                        >
                          编辑
                        </p>
                      ) : null}
                      {showBut('popupAd', 'delePop') ? (
                        <p
                          className={Css['bule-text']}
                          onClick={() => this.delPop(record.oneId)}
                        >
                          删除
                        </p>
                      ) : null}
                    </div>
                  )}
                />
              </Table>
            </Spin>
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(SetSpecial);
