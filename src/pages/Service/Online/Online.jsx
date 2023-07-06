import React, { useState, useEffect, useRef } from 'react';
import Css from './Online.module.scss';
import Panel from '@/components/Panel';
import { CaretRightOutlined, UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
import E from 'wangeditor';
import { Button, Avatar, message, Badge } from 'antd';

import {
  hisLinkmanJson,
  getLinkMan,
  hisMsg,
  send,
  delLinkMan,
  sub,
  heartlm,
  getAvatarMsg,
} from '@/services/im';
import { itemDetail } from '@/services/item';

let editor;

export default function Online() {
  // 客服头像
  const [imageUrl, setImageUrl] = useState('');
  // 联系人展开阀门
  const [tabList, setTabList] = useState([false, true]);
  // 正在联系用户列表
  const [nowList, setNowList] = useState([]);
  // 最近联系用户列表
  const [hisList, setHisList] = useState([]);
  // 当前聊天框选中客户
  const [chitchatCurrent, setChitchatCurrent] = useState({
    type: 'recently',
    userId: '',
  });
  // 当前客户商品信息
  const [goodsInfo, setGoodsInfo] = useState({
    itemName: '',
    imageSrc: '',
  });
  // 当前聊天客户信息
  const [chitchatInfo, setChitchatInfo] = useState('');
  // 最近联系用户更多阀门
  const [serviceIs, setServiceIs] = useState(false);
  // 展示查看更多阀门
  const [moreIs, setMoreIs] = useState(false);
  // 最近联系用户更多页数
  const [servicePage, setServicePage] = useState(2);
  // 查看更多页数
  const [morePage, setMorePage] = useState(2);
  // 当前聊天内容数据
  const [chatData, setChatData] = useState([]);

  const nowListRef = useRef();
  const hisListRef = useRef();
  const chitchatInfoRef = useRef();
  const chatDataRef = useRef();

  // 聊天框
  const recordRef = useRef();
  // 输入框
  const wangRef = useRef();

  // 初始化（执行一次）
  useEffect(() => {
    hisLinkmanJsonApi();
    editorCreate();
    subApi();
    getAvatarMsgApi();
    // 页面销毁执行
    return () => {
      heartlmApi = function() {};
      subApi = function() {};
    };
  }, [323]);

  // 获取最新的nowList
  useEffect(() => {
    nowListRef.current = nowList;
  }, [nowList]);

  // 获取最新的hisList
  useEffect(() => {
    hisListRef.current = hisList;
  }, [hisList]);

  // 获取最新的用户信息
  useEffect(() => {
    chitchatInfoRef.current = chitchatInfo;
  }, [chitchatInfo]);

  // 获取最新的当前聊天记录
  useEffect(() => {
    chatDataRef.current = chatData;
  }, [chatData]);

  // 获取历史联系人
  function hisLinkmanJsonApi(page) {
    hisLinkmanJson({
      page: page || 1,
      row: 20,
    }).then(res => {
      if (res.success) {
        if (res.data == '') {
          setServiceIs(false);
          return;
        }
        setServiceIs(true);
        if (page) {
          setMorePage(page + 1);
        }
        let dataList = res.data.map(item => {
          return {
            ...item,
            // 在线状态判断
            online_type: 0,
            // 消息点展示
            user_msg: false,
          };
        });
        setHisList([...hisList, ...dataList]);
        heartlmApi();
      }
    });
  }

  // 获取用户信息
  function getLinkManApi(userId) {
    getLinkMan({ sid: userId }).then(res => {
      if (res.success) {
        res.data[0];
        let listData = { ...res.data[0], online_type: 2, user_msg: true };
        setNowList([...nowListRef.current, listData]);
        setTabList([true, tabList[1]]);
      }
    });
  }

  // 获取客服头像
  function getAvatarMsgApi() {
    getAvatarMsg().then(res => {
      if (res.success) {
        setImageUrl(res.data.kefu_avatar);
      }
    });
  }

  // 获取聊天历史记录
  function hisMsgApi(userId, page) {
    hisMsg({
      sid: userId,
      page: page || 1,
    }).then(res => {
      if (res.success) {
        let newChatData = res.data.map(item => {
          return {
            ...item,
            message_content: htmlRestore(item.message_content),
          };
        });
        setChatData(newChatData);
      }
    });
  }

  function itemDetailApi(itemId) {
    if (!itemId) {
      itemId = 0;
    }
    if (itemId == 0) {
      setGoodsInfo({
        itemName: '',
        imageSrc: '',
      });
      return;
    }
    itemDetail({
      itemId: itemId,
    }).then(res => {
      if (res.success) {
        setGoodsInfo({
          itemName: res.data.itemName,
          imageSrc: res.data.imageSrc,
        });
      }
    });
  }

  // 文本转义
  function htmlRestore(str) {
    var s = '';
    if (str.length === 0) {
      return '';
    }
    s = str.replace(/&amp;/g, '&');
    s = s.replace(/&lt;/g, '<');
    s = s.replace(/&gt;/g, '>');
    s = s.replace(/&nbsp;/g, ' ');
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    return s;
  }

  // 监听消息
  function subApi() {
    sub()
      .then(res => {
        if (res.success) {
          let dataList = res.data;
          let addList = [];
          for (let i in dataList) {
            let userId = dataList[i].from_user_id;
            // 判断是否为当前聊天的用户
            if (chitchatInfoRef.current.user_id == userId) {
              let newDataListItem = {
                ...dataList[i],
                message_content: htmlRestore(dataList[i].message_content),
              };
              setChatData([...chatDataRef.current, newDataListItem]);
              // 滚动条置底
              recordRef.current.scrollTop = recordRef.current.scrollHeight;
            } else {
              let newNowList = [...nowListRef.current];
              let addIndex = 0;
              let typeIs = false;
              let addIs = true;
              // 判断正在联系中是否有该用户
              for (let i in newNowList) {
                if (newNowList[i].user_id == userId) {
                  typeIs = true;
                  addIndex = i;
                }
              }
              // 判断在这次请求中，是否添加过该用户
              for (let i in addList) {
                if (addList[i] == userId) {
                  addIs = false;
                }
              }
              // 有该客户，改变状态展示未读
              if (typeIs && addIs) {
                newNowList[addIndex].user_msg = true;
                setNowList([...newNowList]);
              } else if (addIs) {
                // 无该客户，新增客户，展示未读
                addList.push(userId);
                getLinkManApi(userId);
              }
            }
          }
          subApi();
        }
      })
      .catch(() => {
        console.log('err');
        subApi();
      });
  }

  // 心跳检测联系人在线情况
  function heartlmApi() {
    heartlm()
      .then(res => {
        let dataList = res.data.lmList;
        let dataListKeys = Object.keys(dataList);
        let newNowList = [...nowListRef.current];
        let newHisList = [...hisListRef.current];
        let newChitchatInfo = { ...chitchatInfoRef.current };
        for (let i in dataListKeys) {
          for (let j in newNowList) {
            if (dataListKeys[i] == newNowList[j].user_id) {
              newNowList[j].online_type = dataList[dataListKeys[i]];
            }
          }
          for (let j in newHisList) {
            if (dataListKeys[i] == newHisList[j].user_id) {
              newHisList[j].online_type = dataList[dataListKeys[i]];
            }
          }
          if (dataListKeys[i] == newChitchatInfo.user_id) {
            newChitchatInfo.online_type = dataList[dataListKeys[i]];
          }
        }
        setNowList(newNowList);
        setHisList(newHisList);
        setChitchatInfo(newChitchatInfo);
        setTimeout(() => {
          heartlmApi();
        }, 5000);
      })
      .catch(() => {
        setTimeout(() => {
          heartlmApi();
        }, 5000);
      });
  }

  // 聊天输入框初始化
  function editorCreate() {
    const elem = wangRef.current; //获取editorElem盒子
    editor = new E(elem); //new 一个 editorElem富文本
    editor.config.showFullScreen = false;
    editor.config.height = 158;
    editor.config.zIndex = 500;
    editor.config.debug = true;
    // 自定义菜单配置
    editor.config.menus = [
      // 'emoticon',
      'image',
    ];
    editor.onKeyUp = function() {
      console.log();
    };
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
    editor.create(); //创建
    editor.txt.html('');
  }

  // 点击联系人触发事件
  function chitchatChoice(type, userId, itemIndex) {
    if (chitchatCurrent.type == type && chitchatCurrent.userId == userId) return;
    if (type == 'now') {
      let newNowList = [...nowListRef.current];
      newNowList[itemIndex].user_msg = false;
      setNowList([...newNowList]);
    }
    setChitchatCurrent({ type: type, userId: userId });
    getUserInfo(userId, type);
    hisMsgApi(userId);
    setMoreIs(true);
    setMorePage(2);
    // 滚动条置底
    setTimeout(() => {
      recordRef.current.scrollTop = recordRef.current.scrollHeight;
    }, 300);
  }

  // 选择用户信息赋值
  function getUserInfo(userId, type) {
    if (type == 'recently') {
      for (let i in hisList) {
        if (hisList[i].user_id === userId) {
          console.log(hisList[i]);
          setChitchatInfo(hisList[i]);
          itemDetailApi(hisList[i].common_id);
        }
      }
    }
    if (type == 'now') {
      for (let i in nowList) {
        if (nowList[i].user_id === userId) {
          console.log(nowList[i]);
          setChitchatInfo(nowList[i]);
          itemDetailApi(nowList[i].common_id);
        }
      }
    }
  }

  // 聊天记录查看更多
  function queryMore() {
    hisMsg({
      sid: chitchatCurrent.userId,
      page: morePage,
    }).then(res => {
      if (res.success) {
        setMorePage(morePage + 1);
        let newChatData = res.data.map(item => {
          return {
            ...item,
            message_content: htmlRestore(item.message_content),
          };
        });
        if (res.data != '') {
          setChatData([...newChatData, ...chatData]);
        } else {
          setMoreIs(false);
        }
      }
    });
  }

  // 店家发送信息
  function sendMsg() {
    let textData = editor.txt.html();
    let neWtextData = textData.replace(/<p><br><\/p>/g, '');
    if (neWtextData == '') {
      editor.txt.html('');
      message.warning('请输入要发送的信息');
      return;
    }
    if (chitchatCurrent.userId == '') {
      editor.txt.html(neWtextData);
      message.warning('请选择客户');
      return;
    }
    send({
      cid: 'ys5texm8mm',
      sid: chitchatCurrent.userId,
      content: neWtextData,
    }).then(res => {
      if (res.errorCode == '0') {
        editor.txt.html('');
        setChatData([...chatData, res.data.msg]);
        let newAddIs = true;
        for (let i in nowList) {
          if (nowList[i].user_id === chitchatCurrent.userId) {
            newAddIs = false;
          }
        }
        if (newAddIs) {
          let newListItem = '';
          for (let i in hisList) {
            if (hisList[i].user_id === chitchatCurrent.userId) {
              newListItem = hisList[i];
            }
          }
          setNowList([...nowList, newListItem]);
          setTabList([true, tabList[1]]);
          setChitchatCurrent({
            type: 'now',
            userId: chitchatCurrent.userId,
          });
        } else {
          setTabList([true, tabList[1]]);
          setChitchatCurrent({
            type: 'now',
            userId: chitchatCurrent.userId,
          });
        }
        // 滚动条置底
        recordRef.current.scrollTop = recordRef.current.scrollHeight;
      }
    });
  }

  // 删除最近联系人
  function delChitchat(linkId, e) {
    e.stopPropagation();
    delLinkMan({
      lid: linkId,
    }).then(res => {
      if (res.errorCode == '0') {
        let newHisList = [...hisList];
        for (let i in newHisList) {
          if (newHisList[i].link_id == linkId) {
            newHisList.splice(i, 1);
          }
        }
        setHisList([...newHisList]);
      }
    });
  }

  function onKeyup(e) {
    if (e.keyCode === 13) {
      sendMsg();
    }
  }

  return (
    <Panel>
      <div className={Css['online-box']}>
        <div className={Css['online-left']}>
          <div className={Css['left-item']}>
            <p className={Css['left-item-text']}>正在联系（{nowList.length}）</p>
            <CaretRightOutlined
              className={
                tabList[0]
                  ? `${Css['left-item-direction']} ${Css['left-item-direction-hover']}`
                  : Css['left-item-direction']
              }
              onClick={() => {
                setTabList([!tabList[0], tabList[1]]);
              }}
            />
          </div>
          {tabList[0] && (
            <div className={Css['left-client-list-box']}>
              {nowList.length > 0 &&
                nowList.map((item, index) => {
                  return (
                    <div
                      className={
                        chitchatCurrent.type === 'now' && chitchatCurrent.userId === item.user_id
                          ? `${Css['client-list-item-box']} ${Css['client-list-item-box-hover']}`
                          : Css['client-list-item-box']
                      }
                      key={index}
                      onClick={() => chitchatChoice('now', item.user_id, index)}
                    >
                      {item.user_avatar ? (
                        <Badge dot={item.user_msg}>
                          <Avatar size="small" src={item.user_avatar} />
                        </Badge>
                      ) : (
                        <Badge dot={item.user_msg}>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </Badge>
                      )}
                      {item.online_type > 0 && <p className={Css['item-name']}>{item.user_name}</p>}
                      {item.online_type == 0 && (
                        <p className={Css['item-name-offline']}>{item.user_name}</p>
                      )}
                      {true && <div className={Css['item-message-red']} />}
                    </div>
                  );
                })}
            </div>
          )}
          <div className={Css['left-item']}>
            <p className={Css['left-item-text']}>最近联系（{hisList.length}）</p>
            <CaretRightOutlined
              className={
                tabList[1]
                  ? `${Css['left-item-direction']} ${Css['left-item-direction-hover']}`
                  : Css['left-item-direction']
              }
              onClick={() => {
                setTabList([tabList[0], !tabList[1]]);
              }}
            />
          </div>
          {tabList[1] && (
            <div className={Css['left-client-list-box']}>
              {hisList.length > 0 &&
                hisList.map((item, index) => {
                  return (
                    <div
                      className={
                        chitchatCurrent.type === 'recently' &&
                        chitchatCurrent.userId === item.user_id
                          ? `${Css['client-list-item-box']} ${Css['client-list-item-box-hover']}`
                          : Css['client-list-item-box']
                      }
                      key={item.link_id}
                      onClick={() => chitchatChoice('recently', item.user_id, index)}
                    >
                      {item.user_avatar ? (
                        <Avatar size="small" src={item.user_avatar} />
                      ) : (
                        <Avatar size="small" icon={<UserOutlined />} />
                      )}
                      <p
                        className={
                          item.online_type == 0
                            ? `${Css['item-name']} ${Css['item-name-offline']}`
                            : Css['item-name']
                        }
                      >
                        {item.user_name}
                      </p>
                      <CloseCircleOutlined
                        className={Css['item-icon-del']}
                        onClick={e => delChitchat(item.link_id, e)}
                      />
                    </div>
                  );
                })}
            </div>
          )}
          {tabList[1] && serviceIs && (
            <p className={Css['more-service']} onClick={() => hisLinkmanJsonApi(morePage)}>
              查看更多
            </p>
          )}
        </div>
        <div className={Css['online-right']}>
          <div className={Css['online-right-title']}>
            <p>
              {chitchatInfo.user_name ? chitchatInfo.user_name : ''}
              {chitchatInfo.online_type == 0 && '【离线】'}
              {chitchatInfo.online_type == 2 && '【手机在线】'}
            </p>
          </div>
          <div className={Css['online-right-content']}>
            <div className={Css['content-chitchat-box']}>
              <div className={Css['chitchat-exhibition-box']} ref={recordRef}>
                {moreIs && (
                  <div className={Css['query-more-box']}>
                    <p className={Css['query-more-btn']} onClick={() => queryMore()}>
                      查看更多
                    </p>
                  </div>
                )}
                {chatData &&
                  chatData.length > 0 &&
                  chatData.map((item, index) => {
                    if (item.from_user_type === 1) {
                      return (
                        <div className={Css['exhibition-item-left']} key={index}>
                          {chitchatInfo.user_avatar ? (
                            <Avatar size="small" src={chitchatInfo.user_avatar} />
                          ) : (
                            <Avatar size="small" icon={<UserOutlined />} />
                          )}
                          <div className={Css['left-content-box']}>
                            <div className={Css['left-triangle']} />
                            <span dangerouslySetInnerHTML={{ __html: item.message_content }} />
                          </div>
                          <p className={Css['exhibition-time-text']}>
                            {new Date(parseInt(item.add_time))
                              .toLocaleString()
                              .replace(/:\d{1,2}$/, ' ')}
                          </p>
                        </div>
                      );
                    } else if (item.from_user_type === 2) {
                      return (
                        <div className={Css['exhibition-item-right']} key={index}>
                          <p className={Css['exhibition-time-text']}>
                            {new Date(parseInt(item.add_time))
                              .toLocaleString()
                              .replace(/:\d{1,2}$/, ' ')}
                          </p>
                          <div className={Css['right-content-box']}>
                            <div className={Css['right-triangle']} />
                            <span dangerouslySetInnerHTML={{ __html: item.message_content }} />
                          </div>
                          {imageUrl ? (
                            <Avatar size="small" src={imageUrl} />
                          ) : (
                            <Avatar size="small" icon={<UserOutlined />} />
                          )}
                        </div>
                      );
                    }
                  })}
              </div>
              <div className={Css['chitchat-import-box']}>
                <div ref={wangRef} onKeyUp={onKeyup} />
                <Button type="primary" className={Css['chitchat-import-btn']} onClick={sendMsg}>
                  发送
                </Button>
              </div>
            </div>
            <div className={Css['content-goods-box']}>
              {goodsInfo.itemName && <p className={Css['goods-title']}>咨询商品</p>}
              {goodsInfo.imageSrc && <img className={Css['goods-img']} src={goodsInfo.imageSrc} />}
              {goodsInfo.itemName && <p className={Css['goods-text']}>{goodsInfo.itemName}</p>}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
