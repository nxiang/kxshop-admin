import React, { useState, useEffect } from 'react';
import E from 'wangeditor';
import { Modal, message, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Css from './AlterRichText.module.scss';
const { confirm } = Modal;
let editor = null;
function AlterRichText(props) {
  const [content, setContent] = useState('');

  useEffect(() => {
    editor = new E('#editor');
    editor.config.menus = [
      'bold',
      'fontSize',
      'italic',
      'indent',
      'lineHeight',
      'foreColor',
      'image',
    ];
    editor.config.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#666666',
    ];
    editor.config.height = 400;
    editor.config.showFullScreen = false;
    // 自定义上传图片配置
    editor.config.uploadFileName = 'file'; //置上传接口的文本流字段
    editor.config.uploadImgServer = '/proxy/cloud/oss/upload'; //服务器接口地址
    editor.config.uploadImgParams = {
      type: 'message',
    };

    editor.config.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        if (result.errorCode === '0') {
          let url = result.data.url;
          insertImg(url);
          // 手动添加图片
          // editor.txt.append(`<img src="${url}" style='max-width:289px'/>`);
        } else {
          message.error(result.errorMsg);
        }
      },
      error: function(xhr, editor) {
        message.error('上传出错');
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
    };

    const rich_text_content = props.itemData && props.itemData.length && props.itemData[0].data;
    // 富文本编辑改变事件
    editor.config.onchange = function(newHtml) {
      console.log('change 之后最新的 html----', newHtml, rich_text_content);

      if (newHtml !== rich_text_content) {
        let itemData = [
          {
            data: newHtml,
          },
        ];

        props.alterTrigger(itemData);
      }
    };
    console.log('props.index', props);
    editor.create();
    editor.txt.html(rich_text_content);
  }, [props.indexNum]);

  function moduleDel() {
    const that = this;
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        props.alterDel();
        message.success('模块删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
    <div className={Css['alter-rich-text-box']}>
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>内容编辑</p>
        </div>
        <div className={Css['header-right']} onClick={moduleDel.bind(this)}>
          <DeleteOutlined className={Css['header-right-icon']} />
          <p className={Css['header-right-text']}>删除</p>
        </div>
      </div>
      <div>
        <p className={Css['rich-text-title']}>内容编辑</p>
        <div id="editor" className={Css['rich-text-box']} />
      </div>
    </div>
  );
}

export default AlterRichText;
