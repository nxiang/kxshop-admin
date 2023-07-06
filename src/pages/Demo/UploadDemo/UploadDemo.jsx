import React, { Component } from "react";
import { withRouter } from '@/utils/compatible'
import { Upload, Button, message } from "antd";
import { UploadOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import Panel from '@/components/Panel';
import KxUpload from '@/components/KxUpload/KxUpload';


class UploadDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileList: []
		};
	}
	componentDidMount() {

	}
	uploadRemove(fileList) {
		this.setState({
			fileList
		})
	}
	onImgChange(value, isDone) {
		const { fileList } = this.state;
		fileList.push(value);
		if (isDone) {  // 加载中图片处理
			let loadIndex = null;
			fileList.map((item, index) => {
				if (item.status === "uploading") {
					loadIndex = index;
				}
			})
			fileList.splice(loadIndex, 1);
		}
		console.log(fileList)
		this.setState({
			fileList
		})
	}
	beforeUpload(file) {
		const isImg = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
		const { fileList } = this.state;
		const size = file.size / 1024 / 1024 < 20;
		const imgNum = !(fileList.length && fileList.length >= 3);
		if (!imgNum) {
			message.warning("最多上传三张");
		}
		if (!isImg) {
			message.warning("仅支持图片格式");
		}
		if (!size) {
			message.warning("视频大小不能大于20MB");
		}
		return size && imgNum
	}
	render() {
		const { fileList } = this.state;
		return (
			<Panel title="upload" >
				<div style={{ width: 300 }}>
					<KxUpload
						beforeUpload={this.beforeUpload.bind(this)}
						onRemove={this.uploadRemove.bind(this)}
						onChange={this.onImgChange.bind(this)}
						fileList={fileList}
					>
						<Button>
							<UploadOutlined /> 上传
                  </Button>
					</KxUpload>
				</div>
			</Panel>
		);
	}
}

export default withRouter(UploadDemo)
