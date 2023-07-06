import React, { useEffect, useState } from 'react'
import { Result, Button } from 'antd'
import { history } from '@umijs/max'

const StepThree = () => {
  return (
    <Result
      status="success"
      title="发布成功"
      extra={[
        <span
          className="g__link"
          key="goback"
          onClick={() => {
            history.go(-1)
          }}
        >
          查看商品列表
        </span>
      ]}
    />
  )
}

export default StepThree
