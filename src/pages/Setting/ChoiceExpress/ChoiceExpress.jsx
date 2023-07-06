import React, { useState, useEffect } from 'react';
import Css from './ChoiceExpress.module.scss';
import { Alert, Checkbox, Button, Col, message } from 'antd'
import Panel from '@/components/Panel';
import { showBut } from '@/utils/utils'

import { shipList, shipSave } from '@/services/ship'

export default function ChoiceExpress() {
  const [listData, setListData] = useState([])
  const [checkboxValueList, setCheckboxValueList] = useState([])

  useEffect(() => {
    shipList().then(res => {
      if (res.errorCode === "0") {
        let checkboxValueList = []
        const newData = res.data.list.map(item => {
          item.checked > 0 ? checkboxValueList.push(item.shipId) : null
          return {
            value: item.shipId,
            label: item.shipName
          }
        })
        console.log(checkboxValueList)
        setListData(newData)
        setCheckboxValueList(checkboxValueList)
      }
    })
  }, [123])

  function checkListChange(e) {
    setCheckboxValueList(e)
  }

  function expressSave() {
    let shipIds = checkboxValueList.join(",")
    shipSave({
      shipIds:shipIds
    }).then(res => {
      if (res.errorCode="0") {
        message.success("保存成功")
      }
    })
  }

  const AlertErrorText = (
    <div>
      <p>·如果商家未选择快递公司，则发货时系统会列出常用的快递公司供商家选择。</p>
      <p>·如果商家选择使用某些快递公司，则发货时系统只列出商家选择的快递公司。</p>
    </div>
  )

  return <Panel title="快递公司" content="选择快递公司">
    <div className={Css["choice-express-box"]}>
      <div className={Css["choice-express-header"]}>
        选择快递公司
      </div>
      <div className={Css["choice-express-content"]}>
        <Alert
          style={{ width: 550 }}
          description={AlertErrorText}
          type="error"
          closable
        />
        <div className={Css["check-group-box"]}>
          <Checkbox.Group
            // options={listData}
            onChange={checkListChange}
            value={checkboxValueList}
          >
            <div className={Css["check-group-item-box"]}>
              {
                listData.map(item => {
                  return <div className={Css["check-group-item"]} key={item.value}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </div>
                })
              }
            </div>
          </Checkbox.Group>
        </div>
        <div style={{ marginBottom: 30 }}>
         {showBut('choiceExpress', 'choice_express_submit') && <Button type="primary" onClick={expressSave}>保存</Button> }
        </div>
      </div>
    </div>
  </Panel>
}