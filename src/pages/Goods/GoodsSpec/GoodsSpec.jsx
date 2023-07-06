import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from './GoodsSpec.module.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Table, Spin, Modal, message, ConfigProvider } from 'antd';
import AddSpec from './modules/AddSpec';
import Panel from '@/components/Panel';
import { showBut } from '@/utils/utils';
// 引入接口
import { specList, deleteSpec } from '@/services/spec';

const { Column } = Table;
const { confirm } = Modal;

class GoodsSpec extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表加载阀门
      spinIs: false,
      // 列表展示数组
      listData: [],
      // 列表分页
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      // 添加规格弹框相关数据
      specTitleNum: 'add',
    };
  }

  componentDidMount() {
    this.specListApi();
  }

  // 规格列表数据请求
  specListApi(page) {
    const that = this;
    that.setState(
      {
        spinIs: true,
      },
      () => {
        specList({
          page: page || 1,
          pageSize: this.state.sourcePage.pageSize,
        })
          .then(res => {
            if (res.errorCode === '0') {
              // 判断当前页是否还有数据
              if (res.data.rows.length === 0 && that.state.sourcePage.current > 1) {
                that.setState(
                  {
                    spinIs: false,
                  },
                  () => {
                    that.specListApi(that.state.sourcePage.current - 1);
                  }
                );
              } else {
                that.setState({
                  listData: res.data.rows,
                  sourcePage: {
                    current: res.data.current,
                    pageSize: res.data.pageSize,
                    total: res.data.total,
                  },
                });
              }
            }
            that.setState({
              spinIs: false,
            });
          })
          .catch(() => {
            that.setState({
              spinIs: false,
            });
          });
      }
    );
  }

  // 新增规格打开
  SpecShowModal() {
    this.setState({
      specTitleNum: 'add',
    });
  }

  // 修改规格打开
  alterSpecShowModal(record) {
    this.setState(
      {
        specTitleNum: 'alter',
      },
      () => {
        this.refs.AddSpec.alterSpecShowModal(record);
      }
    );
  }

  delSpec(specId) {
    const that = this;
    const { sourcePage } = this.state;
    confirm({
      icon: <CloseCircleOutlined style={{ color: 'rgba(247, 38, 51, 1)' }} />,
      title: '确定要删除该规格?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        deleteSpec({
          specId: specId,
        }).then(res => {
          if (res.errorCode === '0') {
            message.success('规格删除成功');
            that.specListApi(sourcePage.current);
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center', height: 650 }}>
      <img
        style={{ marginTop: 114, marginBottom: 18 }}
        src="https://img.kxll.com/admin_manage/wgg.png"
        alt=""
      />
      <p>暂无规格，去添加一些规格吧</p>
    </div>
  );

  render() {
    const { spinIs } = this.state;
    return (
      <Panel title="商品规格" content="管理商品规格信息">
        <div className={Css['goods-spec-box']}>
          <div className={Css['content-box']}>
            <div>
              <AddSpec
                ref="AddSpec"
                specTitleNum={this.state.specTitleNum}
                SpecShowModal={this.SpecShowModal.bind(this)}
                specListApi={this.specListApi.bind(this, this.state.sourcePage.current)}
              />
            </div>
            <Spin spinning={spinIs} size="large">
              <ConfigProvider renderEmpty={this.customizeRenderEmpty}>
                <Table
                  ellipsis
                  rowKey={record => record.specId}
                  dataSource={this.state.listData}
                  pagination={{
                    current: this.state.sourcePage.current,
                    pageSize: this.state.sourcePage.pageSize,
                    total: this.state.sourcePage.total,
                    onChange: page => this.specListApi(page),
                  }}
                >
                  <Column title="规格名称" width={200} dataIndex="specName" />
                  <Column title="规格值" width={800} dataIndex="specValues" />
                  <Column
                    title="操作"
                    width={200}
                    render={record => (
                      <div className={Css['table-operation-box']}>
                        {showBut('specList', 'specList_edit') ? (
                          <p
                            className={Css['blue-text']}
                            onClick={this.alterSpecShowModal.bind(this, record)}
                          >
                            修改
                          </p>
                        ) : null}
                        <div className={Css['division']} />
                        {showBut('specList', 'specList_delete') ? (
                          <p
                            className={Css['red-text']}
                            onClick={this.delSpec.bind(this, record.specId)}
                          >
                            删除
                          </p>
                        ) : null}
                      </div>
                    )}
                  />
                </Table>
              </ConfigProvider>
            </Spin>
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(GoodsSpec);
