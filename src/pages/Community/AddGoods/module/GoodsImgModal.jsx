import React from 'react';
import ReactDOM from 'react-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Upload, Modal } from "antd";
import Css from "./GoodsDetail.module.scss";

class GoodsImgModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileListOne: []
    }
  }
  componentDidMount () {

  }
  beforeUpload (file, fileList) {
    const { fileListOne } = this.state;
    const imgNumner = !( (fileListOne.length + fileList.length) > 10 )  // 大于20张
		const size = file.size / 1024 / 1024 <  2;
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
		if (!imgNumner) {
			message.error("一次最多添加5张");
		}
		if (!isJpgOrPng) {
			message.error("仅支持jpg、png、jpeg格式");
		}
		if (!size) {
			message.error("文件不能大于2MB");
		}
		return size && isJpgOrPng && imgNumner;
  }
  uploadOne (info) {
		let fileListOne = info.fileList;
		fileListOne = fileListOne.map((file) => {
		  if (file.response) {
        file.url = file.response.data.url;
      }
		  return file;
		});
		fileListOne = fileListOne.filter((file, index) => {
			if (file.response) {
			  return file.response.success || file.status === 'done';
			}
			return true;
    });
    fileListOne.map(item => {
      if(!item.status){
        item.status = 'error'
      }
      if(item.size / 1024 / 1024 > 2){
        item.status = 'error'
      }
    })
		this.setState({ fileListOne });
  }
  lengthMaxFn(){  // 是否超出20张图片
    let isMax = false;
    const { fileListOne } = this.state;
    const { detailContentList } = this.props;
    const outArr = [];
    detailContentList.map(item => {
      if(item.type === "image"){
        outArr.push(item)
      }
    })
    if(outArr.length + fileListOne.length > 50){
       isMax = true
    }
    return isMax
  }
  uploadOkFn() {
    const { fileListOne } = this.state;
    if(this.lengthMaxFn()){
      message.error('最多添加50张详情图片');
      return
    }

    let isError = false;
    fileListOne.map(item => {
      if(!item.response || !item.status){
        isError = true
      }
    })
    if(isError){
      message.error("请替换上传失败图片")
      return;
    }
    if(fileListOne.length == 0){
      message.error("请上传图片")
      return;
    }
    if(fileListOne.length > 10){
      message.error("最多上传10张图片")
      return;
    }
    const detailImgList = fileListOne.map((file) =>{
      return (file.response && file.response.imageUrl) || file.url
    });
    this.props.uploadImgOkFn(detailImgList);
    message.success("添加成功")
    this.props.closeModal();
  }
  render() {
    const { fileListOne } = this.state;
    return (
      <Modal
      maskClosable={false}
      visible={this.props.visible}
      onCancel={this.props.closeModal}
      onOk={this.uploadOkFn.bind(this)}
      >
          <Upload
           fileList={fileListOne}
           listType="picture"
           name="file"
           action="/proxy/cloud/oss/upload?type=goods"
           multiple  // 多选
           beforeUpload={this.beforeUpload.bind(this)}
           onChange={this.uploadOne.bind(this)}
            >
            <Button disabled={fileListOne.length >= 50}>
              <UploadOutlined /> 上传图片
            </Button>
        </Upload>
        <div  style={{"color": "#999", 'marginTop': '10px'}}>
          单次最多添加10张,详情页最多50张，支持jpg.jpeg.png图片,大小不超过2M，建议宽度750px
      </div>
      </Modal>
    );
  }
}

export default GoodsImgModal