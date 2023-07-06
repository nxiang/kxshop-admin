import React, { useState, useEffect, useRef } from 'react';
import Css from './PrintReceipt.module.scss';

import { Button, Table, Alert, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Panel from '@/components/Panel';
import AddPrinter from './modules/AddPrinter';
import { showBut } from '@/utils/utils'

import { printerList, printerState, printerDelete, printTest } from '@/services/printer';

const { Column } = Table;
const { confirm } = Modal;

function PrintReceipt(props) {
  const addPrinterRef = useRef();
  const [listData, setListData] = useState([]);
  const [sourcePage, setSourcePage] = useState({
    current: 1, //当前页
    pageSize: 20, //每页显示记录数
    total: 0, //总记录数
  });
  // 弹框控制
  const [printerInfoIs, setPrinterInfoIs] = useState(false);

  // 提示信息文本
  const AlertWarningText = (
    <div>
      <p>
        目前支持易联云（不支持K1/K2/K3）小票打印机（推荐使用K4），按打印机说明连接WiFi并绑定账号后再添加打印机
      </p>
      <p>
        <a
          className={Css['alert-warning-btn']}
          href="https://s.click.taobao.com/sxVuywu"
          target="_blank"
        >
          打印机购买
        </a>
        <a
          className={Css['alert-warning-btn']}
          href="https://mp.weixin.qq.com/s/RIAUjw-uwtlTNif2VjclIQ"
          target="_blank"
        >
          WiFi打印机如何连接网络
        </a>
      </p>
    </div>
  );

  useEffect(() => {
    printerListApi();
  }, [2323]);

  // 请求打印机列表
  function printerListApi(page) {
    printerList({
      page: page ? page : sourcePage.current,
    }).then(res => {
      if (res.success) {
        if (res.data.rows == [] && res.data.current > 1) {
          console.log(111);
          printerListApi(res.data.current - 1);
          return;
        }
        setSourcePage({
          current: res.data.current,
          pageSize: res.data.pageSize,
          total: res.data.total,
        });
        setListData(res.data.rows);
      }
    });
  }

  // 改变打印机状态
  function printerStateApi(record) {
    console.log(record);
    printerState({
      id: record.id,
      state: record.state ? 0 : 1,
    }).then(res => {
      if (res.success) {
        if (record.state) {
          message.success('关闭成功');
        } else {
          message.success('开启成功');
        }
        printerListApi();
      }
    });
  }

  // 测试打印
  function printTestApi(record) {
    printTest(record.id).then(res => {
      if (res.success) {
        message.success('测试打印成功');
      }
    });
  }

  // 删除打印机
  function printerDeleteApi(record) {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该打印机吗？',
      onOk() {
        printerDelete({
          id: record.id,
          machineCode: record.machineCode,
        }).then(res => {
          if (res.success) {
            message.success('删除成功');
            printerListApi();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 修改打印机
  function modificationPrinter(record) {
    addPrinterRef.current.alterPrinterInfo(record);
    setPrinterInfoIs(true);
  }

  // 状态render
  function stateRender(record) {
    if (record.state) {
      return '开启';
    } else {
      return '关闭';
    }
  }

  // 操作render
  function operationRender(record) {
    return (
      <div className={Css['operation-box']}>
      {
        showBut('printReceipt', 'print_peceipt_pevise') && (
          <p className={Css['operation-text']} onClick={() => modificationPrinter(record)}>
            修改
          </p>
        )
      }
        <div className={Css['operation-division']} />
        {
          showBut('printReceipt', 'print_peceipt_stop') && (
            <p className={Css['operation-text']} onClick={() => printerStateApi(record)}>
              {record.state ? '关闭打印' : '开启打印'}
            </p>
          )
        }
        <div className={Css['operation-division']} />
        {
          showBut('printReceipt', 'print_peceipt_test') && (
            <p className={Css['operation-text']} onClick={() => printTestApi(record)}>
              测试
            </p>
          )
        }
        <div className={Css['operation-division']} />
        {
          showBut('printReceipt', 'print_peceipt_del') && (
            <p
              className={`${Css['operation-text']} ${Css['red-text']}`}
              onClick={() => printerDeleteApi(record)}
            >
              删除
            </p>
          )
        }
      </div>
    );
  }

  return (
    <Panel title="小票打印" content="线下配送订单小票打印机配置">
      <div className={Css['print-receipt-box']}>
        <Alert
          className={Css['alert-warning-box']}
          message="打印机说明"
          description={AlertWarningText}
          type="warning"
        />
        <div className={Css['operation-btn-box']}>
        {
          showBut('printReceipt', 'print_peceipt_add') && (
            <Button type="primary" onClick={() => setPrinterInfoIs(true)}>
              添加打印机
            </Button>
          )
        }
        </div>
        <div className={Css['tabler-box']}>
          <Table
            ellipsis
            rowKey={record => record.id}
            dataSource={listData}
            pagination={{
              showSizeChanger: false,
              current: sourcePage.current,
              pageSize: sourcePage.pageSize,
              total: sourcePage.total,
              onChange: page => printerListApi(page),
            }}
          >
            <Column title="设备名称" dataIndex="printName" />
            <Column title="设备编号" dataIndex="machineCode" />
            <Column title="打印份数" dataIndex="numOfCopies" />
            <Column title="状态" render={record => stateRender(record)} />
            <Column title="自动打印" render={record => (record.autoPrint ? '开启' : '关闭')} />
            <Column title="操作" render={record => operationRender(record)} />
          </Table>
        </div>
        <AddPrinter
          ref={addPrinterRef}
          printerInfoIs={printerInfoIs}
          setPrinterInfoIs={setPrinterInfoIs}
          listDataRefresh={printerListApi}
        />
      </div>
    </Panel>
  );
}

export default PrintReceipt;
