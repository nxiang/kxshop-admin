import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal, message, Form, Input, Radio } from 'antd';
import { PlusOutlined, MenuOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Css from './SetNavigation.module.scss';
import Panel from '@/components/Panel';
import ChoiceIcon from '@/components/ChoiceIcon/ChoiceIcon';
import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather';

// 引入接口
import { getStoreDecorateNavi, saveOrUpdateDecorateNavi } from '@/services/item';

const { confirm } = Modal;

// 默认图标
const homeIcon = 'https://img.kxll.com/kxshop_uniapp/template/olive/home.png';
const classIcon = 'https://img.kxll.com/kxshop_uniapp/template/olive/class.png';
const shopIcon = 'https://img.kxll.com/kxshop_uniapp/template/olive/shop.png';
const myIcon = 'https://img.kxll.com/kxshop_uniapp/template/olive/my.png';
const lastIcon = 'https://img.kxll.com/kxshop_uniapp/template/olive/duibiao.png';
// 单选类型列表
const functionPageList = ['special', 'memberCenter', 'dailyAttendance'];

const SetNavigation = () => {
  const [form] = Form.useForm();
  // 默认导航
  const [tabBar, setTabBar] = useState([
    {
      menuText: '首页', // 名称
      iconType: 'default', // 图标模式
      defaultIcon: [], // 未选中图标
      hoverIcon: [], // 选中图标
      type: 'tabBar',
      path: '/pages/home/home', // 跳转路径
      link: { value: '首页' },
    },
    {
      menuText: '分类页', // 名称
      iconType: 'default', // 图标模式
      defaultIcon: [], // 未选中图标
      hoverIcon: [], // 选中图标
      type: null,
      path: '', // 跳转路径
      link: '',
    },
    {
      menuText: '购物车', // 名称
      iconType: 'default', // 图标模式
      defaultIcon: [], // 未选中图标
      hoverIcon: [], // 选中图标
      type: null,
      path: '', // 跳转路径
      link: '',
    },
    {
      menuText: '我的', // 名称
      iconType: 'default', // 图标模式
      defaultIcon: [], // 未选中图标
      hoverIcon: [], // 选中图标
      type: 'tabBar',
      path: '/pages/my/my', // 跳转路径
      link: { value: '我的' },
    },
  ]);
  // 模板选中
  const [specialOnPut, setSpecialOnPut] = useState(null);
  // 排序阀门
  const [specialRank, setSpecialRank] = useState(true);
  // 是否包含专题页
  const [isHast, setIsHast] = useState(false);

  useEffect(() => {
    getInfo();
  }, []);

  // 添加导航
  const addTabBar = () => {
    const temp = tabBar;
    const Arr = {
      menuText: '', // 名称
      iconType: 'default', // 图标模式
      defaultIcon: [], // 未选中图标
      hoverIcon: [], // 选中图标
      path: '', // 跳转路径
      type: null,
      link: '',
    };
    temp.splice(tabBar.length - 1, 0, Arr);
    const allTemp = [...tabBar];
    console.log(temp);
    setTabBar(allTemp);
  };

  // 删除
  const deleteTabBar = index => {
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '是否删除该导航？',
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        let Arr = tabBar;
        Arr.splice(index, 1);
        let temp = [...Arr];
        setTabBar(temp);
      },
      onCancel() {},
    });
  };

  // 链接选择
  const alterType = (type, index) => {
    const Arr = tabBar;
    const isHas = Arr.some(item => functionPageList.includes(item.type));
    console.log('isHas===', isHas);
    if (functionPageList.includes(type)) {
      setIsHast(true);
    }
    if (functionPageList.includes(type) && index != Arr.length - 1) {
      if (type != tabBar[index].type) {
        tabBar[index].type = type;
        tabBar[index].link = '';
        const temp = [...tabBar];
        setTabBar(temp);
      }
    } else if (index != 0 && index != Arr.length - 1) {
      tabBar[index].type = type;
      tabBar[index].link = '';
      const temp = [...tabBar];
      setTabBar(temp);
    }
  };

  const alterFocus = type => {
    const Arr = tabBar;
    const isHas = Arr.some(item => functionPageList.includes(item.type));
    setIsHast(isHas);
  };

  // 返回
  const backtrack = () => {};

  // 确认
  const saveAndSubmit = () => {
    const Arr = JSON.parse(JSON.stringify(tabBar));
    Arr.map(item => {
      if (item.iconType == 'custom' && item.defaultIcon.length > 0) {
        item.defaultIcon = item.defaultIcon[0].url;
      } else if (item.iconType == 'default') {
        item.defaultIcon = '';
      }
      if (
        item.type == 'special' ||
        item.type == 'h5Url' ||
        item.type == 'alipaySkip' ||
        item.type == 'aliapp'
      ) {
        item.path = '';
      }
      if (item.type == 'memberCenter' || item.type == 'dailyAttendance') {
        item.path = '';
        item.link = item.type;
      }
      if (item.iconType == 'custom' && item.hoverIcon.length > 0) {
        item.hoverIcon = item.hoverIcon[0].url;
      } else if (item.iconType == 'default') {
        item.hoverIcon = '';
      }

      if (item.type == 'h5Url' || item.type == 'alipaySkip') {
        let obj = {};
        obj['value'] = item.link;
        item.link = obj;
      }
    });
    console.log('Arr', Arr);
    for (let i = 0; i < Arr.length; i++) {
      if (Arr[i].menuText == '') {
        message.warning('请填写完整的名称');
        return;
      } else if (
        (Arr[i].iconType == 'custom' && Arr[i].defaultIcon == '') ||
        (Arr[i].iconType == 'custom' && Arr[i].hoverIcon == '')
      ) {
        message.warning('请将图标补充完整');
        return;
      } else if (Arr[i].type == null || Arr[i].link == '' || Arr[i].link.value == '') {
        message.warning('请将链接信息补充完整');
        return;
      }
    }
    const temp = JSON.stringify(Arr);
    saveOrUpdateDecorateNavi({
      decorateData: temp,
    }).then(res => {
      if (res.success) {
        message.success('保存成功');
        getInfo();
      }
    });
  };

  const getInfo = () => {
    getStoreDecorateNavi().then(res => {
      if (res.success) {
        if (!(JSON.stringify(res.data) === '{}')) {
          const data = JSON.parse(res.data);
          console.log(data);
          const isHas = data.some(item => functionPageList.includes(item.type));
          console.log('isHas=', isHas);
          setIsHast(isHas);
          data.map(item => {
            if (item.defaultIcon != '') {
              let Arr = [];
              Arr.push({
                url: item.defaultIcon,
              });
              item.defaultIcon = Arr;
            } else {
              item.defaultIcon = [];
            }
            if (item.hoverIcon != '') {
              let Arr = [];
              Arr.push({
                url: item.hoverIcon,
              });
              item.hoverIcon = Arr;
            } else {
              item.hoverIcon = [];
            }
            if (item.type == 'h5Url' || item.type == 'alipaySkip') {
              item.link = item.link.value;
            }
          });
          console.log('data=', data);
          const temp = [...data];
          setTabBar(temp);
        }
      }
    });
  };

  const specialOnPutItemClick = (index, isTrue) => {
    setSpecialOnPut(index);
    setSpecialRank(isTrue);
  };

  // 向上移动
  const upward = () => {
    if (specialOnPut == 0) {
      message.warning('首页不允许移动');
      return;
    }
    if (specialOnPut == tabBar.length - 1) {
      message.warning('我的不允许移动');
      return;
    }
    if (specialOnPut > 0) {
      if (!(specialOnPut - 1 == 0)) {
        const data = tabBar.splice(specialOnPut, 1);
        tabBar.splice(specialOnPut - 1, 0, data[0]);
        setTabBar([...tabBar]);
        setSpecialOnPut(specialOnPut - 1);
      }
    }
  };

  // 向下移动
  const downward = () => {
    if (specialOnPut == 0) {
      message.warning('首页不允许移动');
      return;
    }
    if (specialOnPut == tabBar.length - 1) {
      message.warning('我的不允许移动');
      return;
    }
    if (specialOnPut < tabBar.length - 1) {
      if (!(specialOnPut + 1 == tabBar.length - 1)) {
        const data = tabBar.splice(specialOnPut, 1);
        tabBar.splice(specialOnPut + 1, 0, data[0]);
        setTabBar([...tabBar]);
        setSpecialOnPut(specialOnPut + 1);
      }
    }
  };

  return (
    <Panel title="导航配置">
      <div className={Css['main_box']}>
        <div className={Css['container']}>
          <Row>
            <Col span={8}>
              <div className={Css['container_left']}>
                <div className={Css['phone_header']}>
                  <img src="https://img.kxll.com/admin_manage/photo_header.png" alt="" />
                </div>
                <div className={Css['phone_footer']}>
                  {tabBar.map((item) => {
                    return (
                      <div className={Css['config-photo-foot-item']}>
                        {item.iconType == 'default' && (
                          <img
                            className={Css['item-img']}
                            src={
                              {
                                '/pages/home/home': homeIcon,
                                '/pages/product/product': classIcon,
                                '/pages/shop/shop': shopIcon,
                                '/pages/my/my': myIcon,
                                '': lastIcon,
                              }[item.path]
                            }
                            alt=""
                          />
                        )}
                        {item.iconType == 'custom' && (
                          <img className={Css['item-img']} src={item.defaultIcon[0]?.url} alt="" />
                        )}
                        <p className={Css['item-text']}>{item.menuText}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={Css['container_right']}>
                <Form form={form}>
                  {tabBar.map((item, index) => {
                    return (
                      <div
                        className={`${Css['list_box']} ${index === specialOnPut &&
                          Css['blue-btn']}`}
                        key={index}
                      >
                        <div onClick={() => specialOnPutItemClick(index, false)}>
                          <div className={Css['list_box_header']}>
                            <div className={Css['list_box_logo']}>
                              <MenuOutlined style={{ position: 'relative', top: '5px' }} />
                              <span style={{ position: 'relative', top: '5px', left: '4px' }}>
                                导航{index + 1}
                              </span>
                            </div>
                            {item.link.value != '首页' && item.link.value != '我的' ? (
                              <div className={Css['list_box_btn']}>
                                <Button type="link" onClick={() => deleteTabBar(index)}>
                                  删除
                                </Button>
                              </div>
                            ) : null}
                          </div>
                          <div className={Css['list_box_content']}>
                            <div>
                              名称：
                              <Input
                                className={Css['list_input']}
                                value={item.menuText}
                                showCount
                                maxLength={5}
                                onChange={e => {
                                  item.menuText = e.target.value;
                                  const temp = [...tabBar];
                                  setTabBar(temp);
                                }}
                              />
                            </div>
                            <div>
                              图标：
                              <Radio.Group
                                onChange={e => {
                                  item.iconType = e.target.value;
                                  const temp = [...tabBar];
                                  setTabBar(temp);
                                }}
                                value={item.iconType}
                              >
                                <Radio value="default">默认图标</Radio>
                                <Radio value="custom">自定义图标</Radio>
                              </Radio.Group>
                            </div>
                            <div
                              className={item.iconType == 'custom' ? Css.picList : Css.hidePiclist}
                              style={{ color: '#999' }}
                            >
                              上传的图片不会跟随主题风格变化
                            </div>
                            <div
                              className={item.iconType == 'custom' ? Css.picList : Css.hidePiclist}
                            >
                              <div>
                                <ChoiceIcon
                                  name={'未选中'}
                                  value={item.defaultIcon}
                                  onChange={value => {
                                    let arr = [];
                                    if (value.url) {
                                      arr.push(value);
                                      item.defaultIcon = arr;
                                    } else {
                                      item.defaultIcon = value;
                                    }
                                    const temp = [...tabBar];
                                    setTabBar(temp);
                                  }}
                                />
                              </div>
                              <div>
                                <ChoiceIcon
                                  name={'选中'}
                                  value={item.hoverIcon}
                                  onChange={value => {
                                    let arr = [];
                                    if (value.url) {
                                      arr.push(value);
                                      item.hoverIcon = arr;
                                    } else {
                                      item.hoverIcon = value;
                                    }
                                    const temp = [...tabBar];
                                    setTabBar(temp);
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className={item.iconType == 'custom' ? Css.picList : Css.hidePiclist}
                              style={{ color: '#999' }}
                            >
                              仅支持jpeg、png、gif,建议尺寸80*80,大小不超过100k
                            </div>
                          </div>
                          <div className={Css['list_box_footer']}>
                            <span style={{ display: 'inline-block' }}>链接:</span>
                            <div style={{ display: 'inline-block', paddingLeft: '10px' }}>
                              <SelectGather
                                allChoose
                                type={item.type}
                                data={item.link}
                                storeType="tabBar"
                                isHas={isHast && !functionPageList.includes(item.type)}
                                disabled={index == 0 || index == tabBar.length - 1 ? true : false}
                                alterType={e => alterType(e, index)}
                                alterData={link => {
                                  if (
                                    item.type == 'tabBar' &&
                                    link.value &&
                                    link.value == '分类页'
                                  ) {
                                    item.link = link;
                                    item.path = '/pages/product/product';
                                  } else if (
                                    item.type == 'tabBar' &&
                                    link.value &&
                                    link.value == '购物车'
                                  ) {
                                    item.link = link;
                                    item.path = '/pages/shop/shop';
                                  } else {
                                    item.link = link;
                                  }
                                  const temp = [...tabBar];
                                  setTabBar(temp);
                                }}
                                alterFocus={e => {
                                  alterFocus(e);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {!specialRank && index === specialOnPut && (
                          <div className={Css['config-operation-box']}>
                            <div
                              className={`${Css['config-operation-item']} ${Css['icon-upward']}`}
                              onClick={() => upward()}
                            />
                            <div
                              className={`${Css['config-operation-item']} ${Css['icon-downward']}`}
                              onClick={() => downward()}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className={Css.btnAdd}>
                    {tabBar?.length < 5 && (
                      <Button className={Css['addBtn']} icon={<PlusOutlined />} onClick={addTabBar}>
                        添加导航
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
        <div className={Css['main_footer']}>
          <Button style={{ marginRight: 16 }} onClick={() => backtrack()}>
            返回
          </Button>
          <Button type="primary" onClick={() => saveAndSubmit()}>
            保存
          </Button>
        </div>
      </div>
    </Panel>
  );
};
export default SetNavigation;
