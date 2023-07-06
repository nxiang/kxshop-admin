import React, { Component } from "react";
import Css from "./CouponData.module.scss";

class CoponData extends Component {
  render () {
    return <div className={Css["ConponData"]}>
      <div className={Css["title"]}>运营数据</div>
      <div className={Css["dataRow"]}>
        <div className={Css["dataCol"]}>
          <div className={Css["dataName"]}>领取数量(张)</div>
          <div className={Css["dataNum"]}>{this.props.couponInfo.receivedQuantity}</div>
        </div>
        <div className={Css["dataCol"]}>
          <div className={Css["dataName"]}>剩余数量(张)</div>
          <div className={Css["dataNum"]}>{this.props.couponInfo.stockQuantity}</div>
        </div>
        <div className={Css["dataCol"]}>
          <div className={Css["dataName"]}>核销数量(张)</div>
          <div className={Css["dataNum"]}>{this.props.couponInfo.usedQuantity}</div>
        </div>
        <div className={Css["dataCol"]}>
          <div className={Css["dataName"]}>核销率</div>
          <div className={Css["dataNum"]}>{this.props.couponInfo.usedRate/100}%</div>
        </div>
      </div>
    </div>
  }
}

export default CoponData