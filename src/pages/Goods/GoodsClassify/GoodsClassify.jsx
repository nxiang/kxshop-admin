import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from './GoodsClassify.module.scss';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Table, Modal, Spin, message, ConfigProvider } from 'antd';
import Panel from '@/components/Panel';
import AddClass from './modules/AddClass';
import AlterClass from './modules/AlterClass';
import SubClass from './modules/SubClass';
import { showBut } from '@/utils/utils';
// 引入接口
import { storeLabelList, storeLabelRemove } from '@/services/storeLabel';

const { Column } = Table;
const { confirm } = Modal;

class GoodsClassify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表加载阀门
      spinIs: false,
      // 列表展示数组
      listData: [],
    };
  }

  componentDidMount() {
    this.storeLabelListApi();
  }

  storeLabelListApi() {
    const that = this;
    this.setState(
      {
        spinIs: true,
      },
      () => {
        storeLabelList()
          .then(res => {
            if (res.errorCode === '0') {
              that.setState({
                listData: res.data.list,
              });
            }
            this.setState({
              spinIs: false,
            });
          })
          .catch(() => {
            this.setState({
              spinIs: false,
            });
          });
      }
    );
  }

  // 输入change事件
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 修改类目
  alterClassShowModal(record) {
    this.refs.AlterClass.alterClassShowModal(record);
  }

  // 子类目
  subClassShowModal(storeLabelId) {
    this.refs.SubClass.subClassShowModal(storeLabelId);
  }

  // 删除类目
  delClass(storeLabelId) {
    const that = this;
    confirm({
      icon: <CloseCircleOutlined style={{ color: 'rgba(247, 38, 51, 1)' }} />,
      title: '确定要删除此分类么？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        storeLabelRemove({
          storeLabelId: storeLabelId,
        }).then(res => {
          if (res.errorCode === '0') {
            message.success('类目删除成功');
            that.storeLabelListApi();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  customizeRenderEmpty = () => (
    //这里面就是我们自己定义的空状态
    <div style={{ textAlign: 'center', height: 650 }}>
      <img
        style={{ marginTop: 114, marginBottom: 18 }}
        src="https://img.kxll.com/admin_manage/wufenlei.png"
        alt=""
      />
      <p>暂未添加分类，添加一些分类让顾客更易找到</p>
    </div>
  );

  render() {
    const { spinIs } = this.state;
    return (
      <Panel title="店铺商品类目" content="商品类目信息管理">
        <div className={Css['goods-classify-box']}>
          <div className={Css['content-box']}>
            <div>
              <AddClass storeLabelListApi={this.storeLabelListApi.bind(this)} />
            </div>
            <Spin spinning={spinIs} size="large">
              <ConfigProvider renderEmpty={this.customizeRenderEmpty}>
                <Table
                  ellipsis
                  childrenColumnName="childList"
                  rowKey={record => record.storeLabelId}
                  dataSource={this.state.listData}
                >
                  <Column
                    title={() => {
                      return <div className={Css['table-project-box']}>类目ID</div>;
                    }}
                    dataIndex="storeLabelId"
                  />
                  <Column title="类目名称" dataIndex="storeLabelName" />
                  <Column
                    title={() => {
                      return (
                        <div className={Css['table-order-box']}>
                          类目排序
                          <InfoCircleOutlined className={Css['table-order-icon']} />
                          <div className={Css['order-mask-box']}>
                            <div className={Css['mask-content']}>
                              该分类在分类列表中展示的顺序，数值越大展示越靠前
                            </div>
                            <div className={Css['mask-triangle']} />
                          </div>
                        </div>
                      );
                    }}
                    dataIndex="storeLabelSort"
                  />
                  <Column
                    title="操作"
                    render={record => (
                      <div>
                        {record.level === 1 ? (
                          <div className={Css['table-operation-box']}>
                            {showBut('classifyList', 'classifyList_edit') ? (
                              <p
                                className={Css['blue-text']}
                                onClick={this.alterClassShowModal.bind(this, record)}
                              >
                                修改
                              </p>
                            ) : null}
                            <div className={Css['division']} />
                            {showBut('classifyList', 'classifyList_addCategorys') ? (
                              <p
                                className={Css['blue-text']}
                                onClick={this.subClassShowModal.bind(this, record.storeLabelId)}
                              >
                                添加子类目
                              </p>
                            ) : null}
                            <div className={Css['division']} />
                            {showBut('classifyList', 'classifyList_delete') ? (
                              <p
                                className={Css['red-text']}
                                onClick={this.delClass.bind(this, record.storeLabelId)}
                              >
                                删除
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                        {record.level > 1 ? (
                          <div className={Css['table-operation-box']}>
                            {showBut('classifyList', 'classifyList_edit') ? (
                              <p
                                className={Css['blue-text']}
                                onClick={this.alterClassShowModal.bind(this, record)}
                              >
                                修改
                              </p>
                            ) : null}
                            <div className={Css['division']} />
                            {showBut('classifyList', 'classifyList_delete') ? (
                              <p
                                className={Css['red-text']}
                                onClick={this.delClass.bind(this, record.storeLabelId)}
                              >
                                删除
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    )}
                  />
                </Table>
              </ConfigProvider>
            </Spin>
          </div>

          <AlterClass ref="AlterClass" storeLabelListApi={this.storeLabelListApi.bind(this)} />

          <SubClass ref="SubClass" storeLabelListApi={this.storeLabelListApi.bind(this)} />
        </div>
      </Panel>
    );
  }
}

export default withRouter(GoodsClassify);
