import React from 'react'
// import { Space, Popover, Button } from 'antd'
import { Space } from 'antd'
// 表格操作区域
export default (props) => {
  const { datas } = props
  const renders = datas
    .filter((ele) => {
      return ele.isShow === undefined || ele.isShow?.()
    })
    .map((ele) => ele.render())
  return (
    <Space>
      {renders.map((ele, index) => (
        <span key={index}>{ele}</span>
      ))}
    </Space>
  )
  //   // 前2个
  //   const rendeChildren = renders
  //     .slice(0, 2)
  //     .map((ele, index) => <span key={index}>{ele}</span>)
  //   // 截取第2个后面的chilren
  //   const moreChildren = renders
  //     .slice(2)
  //     .map((ele, index) => <div key={index}>{ele}</div>)
  //   return (
  //     <Space>
  //       {rendeChildren}
  //       {moreChildren.length > 0 ? (
  //         <Popover content={moreChildren}>
  //           <Button type="link" size="small">
  //             更多
  //           </Button>
  //         </Popover>
  //       ) : null}
  //     </Space>
  //   )
}
