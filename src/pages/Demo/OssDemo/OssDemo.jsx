import React, { Component } from "react";
import { FolderOpenOutlined } from '@ant-design/icons';
import { withRouter } from '@/utils/compatible'
import { Upload, message  } from "antd";
import xlsx from 'xlsx';
import OSS from 'ali-oss'
import Panel from '@/components/Panel';

const { Dragger } = Upload;

console.log('OSS',OSS)
// const OSS = require('ali-oss');

const config = {
    host: "https://kxgshop.oss-cn-hangzhou.aliyuncs.com",
    bucket : 'kxgshop', // bucket名称
    region : 'oss-cn-hangzhou', // oss服务区域名称
    accessKeyId : 'LTAI4GGnYEbwmXcpbgfgA5E7',
    accessKeySecret : 'tSveDCNQApCbthZGouFgwxhVsoSQEQ',
}

const client = new OSS({
  region: config.region,
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket
});

class OssDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
      fileListOne: []
		};
	}
	componentDidMount() {

  }
  beforeOssUpload = file => {
      const fileName = file.name;
      const typeVal =fileName.substring(fileName.lastIndexOf('.'));
      const isZip = typeVal == '.zip';
      const size = file.size / 1024 / 1024 < 500;
      if(!isZip){
        message.warning("上传文件格式有误")
        return
      }
      if (!size) {
        message.warning("文件大小不能大于500MB");
        return
      }
      const resultupload = false;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
          this.UploadToOss(file).then(data => {
            console.log("result", data)
          })
      }
      return false;
  }
  UploadToOss = (file) => {
      let checkpoint;
      const fileName = file.name;
      return new Promise((resolve, reject) => {
        client.multipartUpload(fileName, file, {
          checkpoint,
          progress(percentage, cpt) {
            checkpoint = percentage;
            console.log(percentage)
            if (percentage < 1 && percentage >= 0) {
              
            }
          }
        }).then(data => {
          resolve(data);
        }).catch(error => {
          reject(error)
        })
      })
    }
  beforeUpload(file, fileList){
    const rABS = true;
    const f = fileList[0];
    const fileName = file.name;
    const typeVal =fileName.substring(fileName.lastIndexOf('.'));
    const isExcel = typeVal == '.xls' || typeVal == '.xlsx' || typeVal == '.csv';
    const sizeExcel = file.size / 1024 / 1024 < 10;
    let isMax = false;
    if (!isExcel) {
      message.warning("文件格式有误");
    }
    if (!sizeExcel) {
			message.warning("文件大小不能大于10MB");
    }
    if(isExcel){
      const reader = new FileReader();
      reader.onload = (e) => {
        let data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = xlsx.read(data, {
            type: rABS ? 'binary' : 'array'
        });
        // 假设我们的数据在第一个标签
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // XLSX自带了一个工具把导入的数据转成json
        const jsonArr = xlsx.utils.sheet_to_json(first_worksheet, {header:1});
        if(jsonArr.length > 10000){
          isMax = true;
          message.warning("最多导入10000件商品");
          this.setState({
            isMax,
          })
          
        }
      }
      if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    }
    this.setState({
      isExcel,
      isMax,
      sizeExcel
    })
    return isExcel && sizeExcel;
  }
  uploadOne(info) {
    const { isExcel, sizeExcel, isMax } = this.state;
    if(!isExcel || !sizeExcel || isMax){
      this.setState({ fileListOne: [] });
      return
    }
		let {fileList} = info;
		fileList = fileList.map((file) => {
		  if (file.response) {
			 file.url = file.response.data.url
		   }
		  return file;
		});
		fileList = fileList.filter((file, index) => {
			if (file.response) {
			  return file.response.success || file.status === 'done';
			}
			return true;
    });
		this.setState({ fileListOne: fileList, excelUrl: fileList[0].url });
	}
	render() {
    const { fileListOne, excelUrl } = this.state;
    const props = {
        multiple: false,
        listType: "picture",
        name: 'file',
        fileList: this.state.fileList,
        beforeUpload: this.beforeOssUpload
    };
		return (
  <Panel title="ossUpload">
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <FolderOpenOutlined />
      </p>
      <p className="ant-upload-text">请选择文件压缩包或将压缩包拖拽到此处进行上传</p>
      <p className="ant-upload-hint">
        支持zip格式压缩文件
      </p>
    </Dragger>
    <div style={{width: 600, marginTop: 150}}>
      {
               excelUrl ?
                 <div>上传完成</div>
              : 
                 <Dragger
                   fileList={fileListOne}
                   name="file"
                   action="/proxy/cloud/oss/upload?type=goods"
                   beforeUpload={this.beforeUpload.bind(this)}
                   onChange={this.uploadOne.bind(this)}
                 >
                   <p className="ant-upload-drag-icon">
                     <FolderOpenOutlined />
                   </p>
                   <p className="ant-upload-text">点击选择表格或将文件拖拽到本区域进行上传</p>
                   <p className="ant-upload-hint">
                     支持xls.xlsx.csv格式文件
                   </p>
                 </Dragger>
            }
          
    </div>
  </Panel>
		);
	}
}

export default withRouter(OssDemo)
