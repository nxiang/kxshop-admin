/*
 *   author:langyan
 *   date：20200302
 *  explain:  用户管理模块详情页面
 * */
import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import Css from './TagList.module.scss';
import { tagList } from '@/services/tagModule';
import Panel from '@/components/Panel';
import TagListTable from './component/tagListTable/tagListTable'; // 表格组件
import TagOperate from './component/tagOperate/tagOperate'; // 标签操作（新增、编辑）
import LookTag from './component/lookTag/lookTag'; // 查看标签
import DeleteTag from './component/deleteTag/deleteTag'; // 删除标签
import { showBut } from '@/utils/utils';

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagPostData: {
        page: 1,
        tagName: '',
      },
      taglistData: {},
    };
  }

  componentDidMount() {
    this.getTagList();
  }

  // 获取标签数据
  async getTagList() {
    const { tagPostData } = this.state;
    const { data } = await tagList(tagPostData);
    this.setState({
      taglistData: data,
    });
  }

  // 表格操作 1查看 2编辑 3删除
  tagTableButton(typeId, tagId) {
    switch (typeId) {
      case 1:
        this.lookTagModule.showModal(tagId);
        break;
      case 2:
        this.tagOperateModule.showModal(tagId);
        break;
      case 3:
        this.deleteTagModule.showModal(tagId);
        break;
      default:
        break;
    }
  }

  // 分页函数
  paginationChange(e) {
    const { tagPostData } = this.state;
    this.setState(
      {
        tagPostData: {
          ...tagPostData,
          page: e,
        },
      },
      () => {
        this.getTagList();
      }
    );
  }

  // 输入框事件
  serachInputChange(e) {
    if (e.target.value.length >= 12) {
      return;
    }
    this.setState({
      tagPostData: {
        tagName: e.target.value,
        page: 1,
      },
    });
  }

  // 搜索按钮事件
  searchButtonFun() {
    // if (this.state.tagPostData.tagName == '') {
    //   message.error('请先输入搜索条件！');
    // } else {
    //   this.getTagList();
    // }
    this.getTagList();
  }

  // 获取子组件
  onRef(name, ref) {
    switch (name) {
      case 'tagOperateModule':
        this.tagOperateModule = ref;
        break;
      case 'lookTagModule':
        this.lookTagModule = ref;
        break;
      case 'deleteTagModule':
        this.deleteTagModule = ref;
        break;
      default:
        break;
    }
  }

  // 弹窗操作成功回调
  moduleSuccess() {
    this.getTagList();
  }

  render() {
    const { tagPostData, taglistData } = this.state;
    return (
      <Panel title="标签管理">
        <div className={Css['tagList-box']}>
          {/* 内容开始 */}
          <div className={Css['tagList-content']}>
            {/* 标题开始 */}
            <div className={Css['tagList-title']}>
              <h2>标签管理</h2>
              {showBut('tagList', 'tag_list_add_label') && (
                <Button type="primary" onClick={() => this.tagTableButton(2, '')}>
                  <PlusOutlined />
                  新增标签
                </Button>
              )}
            </div>
            {/* 标题结束 */}
            <div className={Css['tagList-table']}>
              {/* 搜索开始 */}
              <div className={Css['tagList-search']}>
                <Input
                  className={Css['search-input']}
                  placeholder="搜索标签"
                  value={tagPostData.tagName}
                  onChange={e => this.serachInputChange(e)}
                />
                <Button type="primary" onClick={() => this.searchButtonFun()}>
                  搜索
                </Button>
              </div>
              {/* 搜索结束 */}
              {/* 表格组件开始 */}
              {taglistData ? (
                <TagListTable
                  taglistData={taglistData}
                  tagTableButton={this.tagTableButton.bind(this)}
                  paginationChange={this.paginationChange.bind(this)}
                />
              ) : (
                ''
              )}
              {/* 表格组件结束 */}
            </div>
          </div>
          {/* 内容结束 */}
          {/* 标签操作弹窗 */}
          <TagOperate onRef={this.onRef.bind(this)} moduleSuccess={this.moduleSuccess.bind(this)} />
          {/* 标签操作弹窗结束 */}
          {/* 查看标签开始 */}
          <LookTag onRef={this.onRef.bind(this)} />
          {/* 查看标签结束 */}
          {/* 删除标签 */}
          <DeleteTag onRef={this.onRef.bind(this)} moduleSuccess={this.moduleSuccess.bind(this)} />
          {/* 删除标签结束 */}
        </div>
      </Panel>
    );
  }
}

export default withRouter(TagList);
