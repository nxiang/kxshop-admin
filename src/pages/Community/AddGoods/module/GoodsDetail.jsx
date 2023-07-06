import React from 'react';
import ReactDOM from 'react-dom';
import { FormOutlined, PictureOutlined } from '@ant-design/icons';
import { Button, Input, message, Upload } from 'antd';
import Css from './GoodsDetail.module.scss';
import GoodsImgModal from './GoodsImgModal';
import GoodsTextModal from './GoodsTextModal';
const { TextArea } = Input;

class GoodsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgShow: false,
      textShow: false,
      detailContentList: [],
    };
  }
  componentDidMount() {
    const { detailEditList } = this.props;
    if (detailEditList) {
      this.setState({
        detailContentList: detailEditList,
      });
    }
  }
  addImgFn() {
    this.setState(
      {
        imgShow: true,
      },
      () => {
        this.props.showDetailFn(false);
      }
    );
  }
  addTextFn() {
    this.setState(
      {
        textShow: true,
      },
      () => {
        this.props.showDetailFn(false);
      }
    );
  }
  closeModal() {
    this.setState(
      {
        imgShow: false,
        textShow: false,
      },
      () => {
        this.props.showDetailFn(true);
      }
    );
  }
  uploadImgOkFn(detailImgList) {
    const { detailContentList } = this.state;
    detailImgList.map(item => {
      detailContentList.push({
        type: 'image',
        value: item,
      });
    });
    this.setState(
      {
        detailContentList,
      },
      () => {
        this.props.detailContentList(detailContentList);
      }
    );
  }
  uploadTextOkFn(detailTextList) {
    const { detailContentList } = this.state;
    // detailTextList.map(item => {
    //   var reg=new RegExp("<br/>","g");
    //   var str= item.replace(reg,"\r\n")
    //   detailContentList.push({
    //     type: 'text',
    //     value: str
    //   })
    // })
    detailContentList.push({
      type: 'editor',
      value: detailTextList,
    });
    this.setState(
      {
        detailContentList,
      },
      () => {
        this.props.detailContentList(detailContentList);
      }
    );
  }
  mouseOverFn(index) {
    const { detailContentList } = this.state;
    detailContentList.map((item, allIndex) => {
      if (allIndex == index) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    this.setState({
      detailContentList,
    });
  }
  editDetailFn(index, edit) {
    const { detailContentList } = this.state;

    if (edit === 'up') {
      detailContentList.map((item, allIndex) => {
        if (allIndex == index) {
          if (detailContentList[index - 1]) {
            const replace = detailContentList[index - 1];
            detailContentList[index - 1] = item;
            detailContentList[index] = replace;
          } else {
            message.error('已置顶,无法上移');
          }
        }
      });
    }
    if (edit === 'down') {
      detailContentList.map((item, allIndex) => {
        if (allIndex == index) {
          if (detailContentList[index + 1]) {
            const replace = detailContentList[index + 1];
            detailContentList[index + 1] = item;
            detailContentList[index] = replace;
          } else {
            message.error('已在底部,无法下移');
          }
        }
      });
    }
    if (edit === 'delete') {
      detailContentList.splice(index, 1);
    }
    this.setState({
      detailContentList,
    });
  }
  render() {
    const { imgShow, textShow, detailContentList } = this.state;

    return (
      <div className={Css.DetailImgBox}>
        <div className={Css.GoodsContent}>
          <div className={Css.btnBox}>
            <Button onClick={this.addImgFn.bind(this)}>
              <PictureOutlined />
              添加图片
            </Button>
            <Button onClick={this.addTextFn.bind(this)} style={{ marginLeft: '15px' }}>
              <FormOutlined />
              添加文本
            </Button>
          </div>
          <div className={Css.DetailContent}>
            <ul>
              {detailContentList.length
                ? detailContentList.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={item.active ? Css['overActive'] : ''}
                        onMouseOver={this.mouseOverFn.bind(this, index)}
                      >
                        {item.active ? (
                          <div className={Css.editBox}>
                            <span onClick={this.editDetailFn.bind(this, index, 'up')}>上移</span>
                            <span onClick={this.editDetailFn.bind(this, index, 'down')}>下移</span>
                            <span onClick={this.editDetailFn.bind(this, index, 'delete')}>
                              删除
                            </span>
                          </div>
                        ) : null}
                        {item.type === 'image' && <img src={item.value} />}
                        {item.type === 'text' && (
                          <TextArea disabled={true} className={Css.TextBox} value={item.value} />
                        )}
                        {item.type === 'editor' && (
                          <div dangerouslySetInnerHTML={{ __html: item.value }} />
                        )}
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
        </div>
        {imgShow ? (
          <GoodsImgModal
            visible={imgShow}
            detailContentList={detailContentList}
            closeModal={this.closeModal.bind(this)}
            uploadImgOkFn={this.uploadImgOkFn.bind(this)}
          />
        ) : null}
        {textShow ? (
          <GoodsTextModal
            detailContentList={detailContentList}
            uploadTextOkFn={this.uploadTextOkFn.bind(this)}
            closeModal={this.closeModal.bind(this)}
            visible={textShow}
          />
        ) : null}
      </div>
    );
  }
}

export default GoodsDetail;
