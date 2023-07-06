import React from 'react'
import { Popover, Space, Input, Button, message, Skeleton } from "antd"
import copy from 'copy-to-clipboard'
import Css from './CouponLink.module.scss'
import { showBut } from '@/utils/utils'

export default props => {
  const { context, stockUrls, getLink, copyLink } = props
  return (
    <Popover
      content={
        <Space direction={"vertical"} size={20}>
          <div className={Css["signBox"]}>
            {stockUrls.length <= 0 && <Skeleton active />}
            {stockUrls.map((val, index) => {
              return (
                <div key={`link_${index}`}>
                  {Object.keys(val).length ? (
                    <div className={Css["signItem"]}>
                      <div className={Css["signRow"]}>
                        <img className={Css["signImg"]} src={val.qrCodeUrl} alt="下载二维码" />
                        <a
                          target="_blank"
                          href={val.qrCodeUrl}
                          download="下载二维码"
                          rel="noreferrer noopener"
                        >
                          下载二维码
                        </a>
                      </div>
                      <div className={Css["signName"]}>
                        {val.clientId == 1 ? '支付宝' : '微信'}二维码
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          {stockUrls.map(val => {
            if (val.url) {
              return (
                <div className={Css["linkRow"]}>
                  <div className={Css["linkTitle"]}>
                    {val.clientId == 1 ? '支付宝' : '微信'}领券链接：
                  </div>
                  <Input id="alipayInput" className={Css["linkInput"]} disabled value={val.url} />
                  <button className={Css["copy"]} onClick={() => copyLink(val.url)}>
                    复制
                  </button>
                </div>
              );
            }
          })}
        </Space>
      }
      title="二维码链接"
      trigger="click"
    >
     { showBut('couponManage', 'couponManage_link') && <Button type="primary" onClick={() => getLink(context)}>领券链接</Button> }
    </Popover>
  )
}