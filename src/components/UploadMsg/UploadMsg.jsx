import React, { Component } from "react";
import Css from "./UploadMsg.module.scss";

class UploadMsg extends Component {
	// 恢复默认
	defaultFn() {
		if (this.props.default) {
			this.props.default();
		}
	}

	render() {
		const { type } = this.props;
		return (
			<div className={Css["msgBox"]}>
				<div className={Css["defaultBtn"]} onClick={this.defaultFn.bind(this)}>
					恢复默认
				</div>
				<div className={Css["msg"]}>
					<span>*</span>建议尺寸：{!type || type == 1 ? "96px*96px，200k以内" : type == 2 ? "588px*200px，1m以内" : "750px*956px，1m以内"}，仅支持jpg、png、jpeg格式
				</div>
			</div>
		);
	}
}

export default UploadMsg;
