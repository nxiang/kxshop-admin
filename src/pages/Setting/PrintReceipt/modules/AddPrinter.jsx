import React, { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import Css from './AddPrinter.module.scss';

import { Button, Modal, Input, Select, Popover, message, Switch } from 'antd';

import { printerAdd, printerEdit } from '@/services/printer';

const { Option } = Select;

function AddPrinter({ printerInfoIs, setPrinterInfoIs, listDataRefresh }, ref) {
  // 是否为修改
  const [alterIs, setAlterIs] = useState(false);
  // 打印机数据
  const [printerInfo, setPrinterInfo] = useState({
    id: 1,
    printName: '',
    machineCode: '',
    msign: '',
    // 份数
    numOfCopies: 1,
    // 自动打印：0 关闭 1 开启
    autoPrint: 0,
  });

  useImperativeHandle(ref, () => ({
    alterPrinterInfo: newVal => {
      setAlterIs(true);
      setPrinterInfo({
        id: newVal.id,
        printName: newVal.printName,
        machineCode: newVal.machineCode,
        msign: newVal.msign,
        numOfCopies: newVal.numOfCopies,
        autoPrint: newVal.autoPrint,
      });
    },
  }));

  const content = (
    <div>
      <img style={{ width: 180 }} src="https://img.kxll.com/admin_manage/WechatIMG1.jpg" alt="" />
    </div>
  );

  function printerAddApi() {
    if (printerInfo.printName == '') {
      message.warning('设备名称不能为空');
      return;
    }
    if (printerInfo.machineCode == '') {
      message.warning('设备终端号不能为空');
      return;
    }
    if (printerInfo.msign == '') {
      message.warning('设备密钥不能为空');
      return;
    }
    printerAdd({
      printName: printerInfo.printName,
      machineCode: printerInfo.machineCode,
      msign: printerInfo.msign,
      numOfCopies: printerInfo.numOfCopies,
      autoPrint: printerInfo.autoPrint,
    }).then(res => {
      if (res.success) {
        message.success('添加成功');
        onCancel();
        listDataRefresh();
      }
    });
  }

  function printerEditApi() {
    if (printerInfo.printName == '') {
      message.warning('设备名称不能为空');
      return;
    }
    if (printerInfo.machineCode == '') {
      message.warning('设备终端号不能为空');
      return;
    }
    if (printerInfo.msign == '') {
      message.warning('设备密钥不能为空');
      return;
    }
    printerEdit({
      id: printerInfo.id,
      printName: printerInfo.printName,
      numOfCopies: printerInfo.numOfCopies,
      autoPrint: printerInfo.autoPrint,
    }).then(res => {
      if (res.success) {
        message.success('修改成功');
        onCancel();
        listDataRefresh();
      }
    });
  }

  function selectChange(e) {
    setPrinterInfo({
      ...printerInfo,
      numOfCopies: e,
    });
  }

  function switchChange(e) {
    if (e) {
      setPrinterInfo({
        ...printerInfo,
        autoPrint: 1,
      });
    } else {
      setPrinterInfo({
        ...printerInfo,
        autoPrint: 0,
      });
    }
  }

  function printerInfoChange(e, name) {
    setPrinterInfo({
      ...printerInfo,
      [name]: e.target.value,
    });
  }

  // 关闭弹窗
  function onCancel() {
    setPrinterInfo({
      id: 1,
      printName: '',
      machineCode: '',
      msign: '',
      numOfCopies: 1,
      autoPrint: 0,
    });
    setAlterIs(false);
    setPrinterInfoIs(false);
  }

  return (
    <Modal
      title={alterIs ? '修改打印机' : '添加打印机'}
      visible={printerInfoIs}
      width={700}
      centered
      footer={null}
      onCancel={() => onCancel()}
    >
      <div className={Css['modal-add-box']}>
        <div className={Css['add-row']}>
          <div className={Css['row-title']}>设备名称：</div>
          <div className={Css['row-content']}>
            <Input
              type="text"
              placeholder="如前台打印机，20字以内"
              maxLength={20}
              value={printerInfo.printName}
              onChange={e => printerInfoChange(e, 'printName')}
            />
          </div>
        </div>
        <div className={Css['add-row']}>
          <div className={Css['row-title']}>设备终端号：</div>
          {alterIs ? (
            <div className={Css['row-content']}>{printerInfo.machineCode}</div>
          ) : (
            <div className={Css['row-content']}>
              <Input
                type="text"
                placeholder="一般在设备底部"
                value={printerInfo.machineCode}
                onChange={e => printerInfoChange(e, 'machineCode')}
              />
            </div>
          )}
        </div>
        <div className={Css['add-row']}>
          <div className={Css['row-title']}>设备密钥：</div>
          {alterIs ? (
            <div className={Css['row-content']}>{printerInfo.msign}</div>
          ) : (
            <div className={Css['row-content']}>
              <Input
                type="text"
                placeholder="一般在设备底部"
                value={printerInfo.msign}
                onChange={e => printerInfoChange(e, 'msign')}
              />
            </div>
          )}
          <Popover content={content} placement="right" title={null} trigger="click">
            <p className={Css['row-hint']}>找不到？</p>
          </Popover>
        </div>
        <div className={Css['add-row']}>
          <div className={Css['row-title']}>打印份数：</div>
          <div className={Css['row-content']}>
            <Select
              style={{ width: 200 }}
              defaultValue={1}
              value={printerInfo.numOfCopies}
              onChange={selectChange}
            >
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
            </Select>
          </div>
        </div>
        <div className={Css['add-row']}>
          <div className={Css['row-title']}>自动打单：</div>
          <div className={Css['row-content']}>
            <Switch
              checked={printerInfo.autoPrint}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={switchChange}
            />
          </div>
        </div>
        <div className={Css['foot-box']}>
          <Button className={Css['foot-item']} onClick={() => onCancel()}>
            取消
          </Button>
          <Button
            className={Css['foot-item']}
            type="primary"
            onClick={alterIs ? () => printerEditApi() : () => printerAddApi()}
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default forwardRef(AddPrinter);
