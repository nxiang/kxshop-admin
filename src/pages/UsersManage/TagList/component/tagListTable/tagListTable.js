/*
 *   author:langyan
 *   date：20200302
 *  explain:  标签管理列表组件
 * */
import React, { Component } from 'react';
import { Table } from 'antd';
import Css from './tagListTable.module.scss';
import { showBut } from '@/utils/utils';

const { Column } = Table;

class TagListTable extends Component {

  // 列表操作
  tagTableOperation(e) {
    const { tagTableButton } = this.props;
    return (
      <div className={Css['tagTable-button']}>
        {showBut('tagList', 'tag_list_view') && (
          <a onClick={() => tagTableButton(1, e.tagId)}>查看</a>
        )}
        &nbsp;|&nbsp;
        {showBut('tagList', 'tag_list_eidt') && (
          <a onClick={() => tagTableButton(2, e.tagId)}>编辑</a>
        )}
        &nbsp;|&nbsp;
        {showBut('tagList', 'tag_list_del') && (
          <a onClick={() => tagTableButton(3, e.tagId)}>删除</a>
        )}
      </div>
    );
  }

  render() {
    const { taglistData, paginationChange } = this.props;
    return (
      <div className={Css['tagList-table-content']}>
        <Table
          dataSource={taglistData.rows}
          rowKey="tagId"
          pagination={{
            current: taglistData.current,
            pageSize: taglistData.pageSize,
            total: taglistData.total,
            onChange: paginationChange,
          }}
        >
          <Column align="center" title="编号" dataIndex="tagId" key="tagId" />
          <Column align="center" title="标签名称" dataIndex="tagName" key="tagName" />
          <Column align="center" title="标签类型" dataIndex="tagType" key="tagType" />
          <Column
            align="center"
            title="支付宝用户数"
            dataIndex="alipayMemberQuantity"
            key="alipayMemberQuantity"
          />
          <Column
            align="center"
            title="微信用户数"
            dataIndex="weixinMemberQuantity"
            key="weixinMemberQuantity"
          />
          <Column
            align="center"
            ellipsis
            title="打标条件"
            width="200px"
            dataIndex="condition"
            key="condition"
          />
          <Column
            align="center"
            ellipsis
            title="操作"
            width="150px"
            key="action"
            render={e => this.tagTableOperation(e)}
          />
        </Table>
      </div>
    );
  }
}

export default TagListTable;
