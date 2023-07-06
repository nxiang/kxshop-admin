import React, { Component } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { kxllUpload } from '@/services/upload';
import { http } from '@/utils/http';

const { Dragger } = Upload;

class KxUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OSSData: {},
    };
  }
  componentDidMount() {}
  init = async file => {
    const p = {
      type: 'item',
    };
    const res = await kxllUpload(p);
    if (res.success) {
      this.setState({
        OSSData: res.data,
      });
      const formData = new FormData();
      const aliyunOssToken = res.data;
      // 注意formData里append添加的键的大小写
      formData.append('key', aliyunOssToken.dir + aliyunOssToken.filename + file.name); // 存储在oss的文件路径
      formData.append('OSSAccessKeyId', aliyunOssToken.OSSAccessKeyId); // accessKeyId
      formData.append('policy', aliyunOssToken.policy); // policy
      formData.append('Signature', aliyunOssToken.signature); // 签名
      formData.append('file', file);
      formData.append('success_action_status', 200); // 成功后返回的操作码
      http('post', aliyunOssToken.host, formData).then(res => {
        const value = `${aliyunOssToken.host  }/${  aliyunOssToken.dir  }${aliyunOssToken.filename  }${file.name}`;
        const imgValue = {
          uid: value,
          name: value.substring(value.lastIndexOf('/') + 1),
          status: 'done',
          url: `${value}`,
          response: {
            data: {
              url: value,
            },
            imageUrl: value,
          },
        };
        this.props.onChange(imgValue, true);
      });
    }
  };

  onRemove = file => {
    const { fileList, onRemove } = this.props;
    const files = fileList.filter(v => v.url !== file.url);
    if (onRemove) {
      onRemove(files);
    }
  };

  beforeUpload = file => {
    const { beforeUpload } = this.props;
    if (beforeUpload && !beforeUpload(file)) {
      return;
    }
    file.status = 'uploading';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.init(file);
    };
    return false;
  };

  render() {
    const { fileList, listType, multiple } = this.props;
    const props = {
      multiple: multiple || false,
      listType: listType || 'picture',
      name: 'file',
      fileList,
      action: this.state.OSSData.host,
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload,
    };
    return (
      <div>
        <Upload {...props}>
          {this.props.children ? (
              this.props.children
            ) : (
              <Button>
                <UploadOutlined /> 上传
              </Button>
            )}
        </Upload>
      </div>
    );
  }
}

export default KxUpload;
