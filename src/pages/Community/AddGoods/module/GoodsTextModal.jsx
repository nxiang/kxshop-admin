import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from '@/utils/compatible'
import E from 'wangeditor';
import '@ant-design/compatible/assets/index.css';
import { Modal, message } from 'antd';
import Css from './GoodsDetail.module.scss';

let editor = null;

function GoodsTextModal(props) {
  // 输入框
  const wangRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      editorCreate();
    }, 0);
  }, []);

  const editorCreate = () => {
    const elem = wangRef.current; //获取editorElem盒子
    editor = new E(elem); //new 一个 editorElem富文本
    editor.config.debug = true;
    editor.config.showFullScreen = false;
    // 自定义菜单配置
    editor.config.menus = ['bold', 'fontSize', 'italic', 'indent', 'foreColor', 'justify'];

    editor.create(); //创建
    editor.txt.html('');
  };

  const lengthMaxFn = () => {
    // 是否超出20个文字块
    let isMax = false;
    const { detailContentList } = props;
    const outArr = [];
    detailContentList.map(item => {
      if (item.type === 'text') {
        outArr.push(item);
      }
    });
    if (outArr.length + 1 > 20) {
      isMax = true;
    }
    return isMax;
  };

  const textOkFn = () => {
    let textData = editor.txt.html();
    let neWtextData = textData.replace(/<p><br><\/p>/g, '');
    if (neWtextData == '') {
      editor.txt.html('');
      message.warning('请输入文本');
      return;
    }
    let div = document.createElement('div');
    div.innerHTML = neWtextData;
    recursionNode(div.childNodes);

    props.uploadTextOkFn(String(div.innerHTML));
    message.success('添加成功');
    props.closeModal();
  };

  const recursionNode = nodeList => {
    console.log(nodeList);
    for (let i in nodeList) {
      if (nodeList[i].nodeName == 'FONT') {
        let span = document.createElement('span');
        span.innerHTML = nodeList[i].innerHTML;
        if (nodeList[i].attributes['size']) {
          switch (nodeList[i].attributes['size'].nodeValue) {
            case '1':
              span.style.fontSize = '10px';
              break;
            case '2':
              span.style.fontSize = '13px';
              break;
            case '3':
              span.style.fontSize = '16px';
              break;
            case '4':
              span.style.fontSize = '18px';
              break;
            case '5':
              span.style.fontSize = '24px';
              break;
            case '6':
              span.style.fontSize = '32px';
              break;
            case '7':
              span.style.fontSize = '48px';
              break;
          }
        }
        if (nodeList[i].attributes['color']) {
          span.style.color = nodeList[i].attributes['color'].nodeValue;
        }
        nodeList[i].parentNode.replaceChild(span, nodeList[i]);
      }
      if (nodeList[i].childNodes) {
        recursionNode(nodeList[i].childNodes);
      }
    }
  };

  return (
    <Modal
      closable={false}
      title="添加文本"
      width={500}
      visible={props.visible}
      // visible={true}
      onCancel={props.closeModal}
      onOk={textOkFn}
      className={Css.TextModal}
    >
      <div ref={wangRef} />
    </Modal>
  );
}

export default withRouter(GoodsTextModal);
