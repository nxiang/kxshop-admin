import React, { Component } from 'react';
import { Modal, Button, Select, message } from 'antd';
import Css from './tagAdd.module.scss';
import { queryTagList, addUserTag, addTagBatch, addUserTapBatch } from '@/services/queryUser';

const { Option } = Select;

class TagAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      sourceId: 2, // 默认为多选  1单2多
      postData: {
        memberIds: [],
        memberId: '',
        tagIds: null,
      },
      selectList: [], // 选择标签数据
      selectInput: '', // 输入标签值
      tagList: [],
    };
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef('tagAddModule', this);
  }

  // 获取标签数据
  async getTagList() {
    const { data } = await queryTagList();
    this.setState({
      tagList: data,
    });
  }

  // 打开弹窗
  showModal = tagAddObj => {
    console.log(tagAddObj);
    this.setState({
      visible: true,
      sourceId: tagAddObj.sourceId,
      postData: {
        ...this.state.postData,
        memberId: tagAddObj.memberId,
        memberIds: tagAddObj.memberIds,
      },
    });
    this.getTagList();
  };

  async handleOk() {
    let info;
    let postData;
    if (this.state.sourceId == 1) {
      postData = {
        memberId: this.state.postData.memberId,
        tagIds: this.state.selectList,
      };
      info = await addUserTag(postData);
    } else {
      postData = {
        memberIds: this.state.postData.memberIds,
        tagIds: this.state.selectList,
      };
      info = await addUserTapBatch(postData);
    }
    if (info.errorCode == 0) {
      message.success('用户标签添加成功');
      this.props.moduleSuccess();
    }
    this.setState({
      visible: false,
      selectList: [],
      selectInput: '',
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      selectList: [],
      selectInput: '',
    });
  };

  // 标签选择事件
  async onSelectChange(val) {
    const MAX = 5;
    if (val.length <= MAX && this.state.selectInput === '') {
      this.setState({ selectList: val });
    } else if (val.length <= MAX && this.state.selectInput != '') {
      val.forEach((item, index) => {
        if (item === this.state.selectInput) {
          val.splice(index, 1);
        }
      });
      let selectFlag = true;
      this.state.tagList.map(item => {
        if (item.tagName === this.state.selectInput) {
          selectFlag = false;
          // message.warning('此标签已存在！');
          this.setState({
            selectList: [...this.state.selectList, item.tagId],
          });
        }
      });
      if (selectFlag) {
        const tagNames = [];
        tagNames.push(this.state.selectInput);
        const info = await addTagBatch({ tagNames });
        if (info.errorCode == 0) {
          this.setState({
            tagList: [...this.state.tagList, info.data[0]],
            selectList: [...this.state.selectList, info.data[0].tagId],
          });

          this.props.moduleSuccess();
        } else {
          return;
        }
      }
      this.setState({ selectInput: '' });
    } else {
      message.warning('标签最多可选5个！');
    }
  }

  // 标签输入事件
  handleSearch(value) {
    this.setState({ selectInput: value });
  }

  render() {
    const { selectList, tagList, visible, sourceId } = this.state;
    return (
      <div>
        <Modal
          title={
            sourceId === 2 ? (
              <div className={Css["tag-add-title"]}>
                <p>
                  *批量添加标签
                  <i>*每次最多添加5个</i>
                </p>
              </div>
            ) : (
              '*添加标签'
            )
          }
          visible={visible}
          width="672px"
          destroyOnClose="true"
          footer={null}
          onCancel={this.handleCancel}
        >
          <div className={Css["tag-add-box"]}>
            <div className={Css["tag-add-content"]}>
              <div>
                *添加标签：{' '}
                <Select
                  placeholder="选择标签"
                  mode="tags"
                  style={{ width: '480px' }}
                  value={selectList}
                  onSearch={this.handleSearch.bind(this)}
                  onChange={this.onSelectChange.bind(this)}
                >
                  {tagList.map(item => {
                    return (
                      <Option value={item.tagId} label={item.tagName} key={item.tagId}>
                        <span role="img" aria-label={item.tagId}>
                          {item.tagName}
                        </span>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={Css["add-remark-footer"]}>
              <Button
                key="confirm"
                type="primary"
                onClick={this.handleOk.bind(this)}
              >
                确认
              </Button>
              <Button
                key="cancel"
                onClick={this.handleCancel.bind(this)}
              >
                取消
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TagAdd;
