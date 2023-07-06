import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, InputNumber, message, Upload, Icon, Modal, Select, DatePicker, Form, Row, Col } from "antd";
import moment from "moment";
import Css from "./CodeModal.module.scss";
import html2canvas from "html2canvas"
import { orderList, qrcode } from "@/services/reserveOrder";
import { storeInfo } from "@/services/shop";
import emptycode from '@/assets/images/emptycode.png'

const { Option } = Select;
const { TextArea } = Input;


class CodeModal extends React.Component {
constructor(props) {
    super(props);
        this.formRef = React.createRef()
        this.state = {
            storeName: null,
            codeInfo: null,
            codeType: null,
            show: false
        }
    }
    componentDidMount () {
        this.qrcode();
        this.storeInfo();
    }
    async storeInfo() {  // 查询店铺信息
		const info = await storeInfo();
		if (info) {
		  this.setState({
			storeName: info.data.storeName
		  })
		}
	  }
    qrcode(){
		qrcode().then(res => {
            if(res){
                this.setState({
                    codeInfo: res.data
                })
            }
		})
	}
    footerBtn(){
        let btnArr = null;
        btnArr = [
            <div>
                <Button key="1"   onClick={this.props.closeModal}>
                    关闭
                </Button>
            </div>
        ];
        return btnArr;
    }
    codeShowFn(codeType, qrCodeUrl){
        this.setState({
            codeType,
            qrCodeUrl,
            show: true
        })
    }
    closeCodeFn(){
        this.setState({
            show: false
        })
    }
    imgType = (t) => {
        const type = t.toLowerCase().replace(/jpg/i, 'jpeg');
        const r = type.match(/png|jpeg|bmp|gif/)[0];
        return `image/${r}`
      }
    downloadImg(codeType, qrCodeUrl){
        const codeDom = document.querySelector("#codeImgId");
        this.setState({
            codeType,
            qrCodeUrl
        }, () => {
            html2canvas(codeDom, {
                allowTaint: false,
                useCORS: true,//允许加载跨域的图片
            }).then(canvas => {
                const imgPngSrc = canvas.toDataURL('image/png'); //将canvas保存为图片
                const imgData = imgPngSrc.replace(this.imgType('png'), 'image/octet-stream');
                const typeStr = codeType == 2 ? '微信核销码' : '支付宝核销码'
                const filename = `${typeStr}.png`
                this.saveFile(imgData, filename);
            });
        })
    }
    saveFile = (data, fileName) => {
        const saveLink = document.createElement('a');
        saveLink.href = data;
        saveLink.download = fileName;
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, false);
        saveLink.dispatchEvent(event);
    }
    render() {
      const { show, codeType, codeInfo, qrCodeUrl, storeName } = this.state;
      const timeStr = new Date().getTime();
      return (
        <Modal
            maskClosable={false}
            title={'查看核销码'}
            width={600}
            visible={this.props.visible}
            onCancel={this.props.closeModal}
            footer={this.footerBtn()}
        >
            <div style={{ height: 450}}>
            {
                codeInfo && codeInfo.length ? 
                <div>
                <div className={Css.topCode}>
                    {
                        codeInfo && codeInfo.length ? 
                        codeInfo.map(item => {
                            return(
                                <div className={Css.commonCodeBox}>
                                    <div className={Css.qrCodeUrl}>
                                        <img src={item.qrCodeUrl} alt=""/>
                                    </div>
                                    <div className={Css.codeText}>{item.clientId == 2 ? '微信核销码' : '支付宝核销码'}</div>
                                    <div className={item.clientId == 2 ? `${Css.codeBtn} ${Css.weixinBtn}`: `${Css.codeBtn}`}>
                                        <Button type="primary" onClick={this.codeShowFn.bind(this, item.clientId, item.qrCodeUrl)}  style={{ marginRight: 27 }}>预览</Button>
                                        <Button  type="primary" onClick={this.downloadImg.bind(this, item.clientId, item.qrCodeUrl)}>下载</Button>
                                    </div>
                                </div>
                            )
                        }) : null
                    }
                </div>
                <div className={Css.bottomRule}>
                    <div className={Css.ruleTitle}>介绍</div>
                        <ul>
                            <li>
                            1.商家核销码是用于买家到店核销订单时，扫码使用的；
                            </li>
                            <li>
                            2.点击下载后，将核销码打印出来，贴在门店的显眼位置，用户下单到店享受服务时， 可以直接使用微信或支付宝扫码核销门店的预约订单。
                            </li>
                        </ul>
                </div>
                </div>
                : 
                <div className={Css.emptyBox}>
                    <div>
					    <img src={emptycode} />
                    </div>
                    <div className={Css.emptyText}>应用未授权，无核销码展示</div>
				</div>
            }
            </div>
        
            {/* 生成图片开始 */}
            <div id="codeImgId" className={codeType == 2 ?`${Css['codeLookBox']} ${Css['codeImgId']} ${Css['codeWxBox']}` : `${Css['codeLookBox']} ${Css['codeImgId']} ${Css['codeAlipayBox']}`}>
                <div className={Css.codeImg}>
                    <div className={Css.storeName}>{storeName}</div>
                    <img crossOrigin="Anonymous" src={`${qrCodeUrl}?${timeStr}`}/>
                </div>
            </div>
            {/* 生成图片结束 */}

            {
                show ? 
                    <Modal
                            maskClosable={false}
                            title={'预览'}
                            width={380}
                            visible={show}
                            onCancel={this.closeCodeFn.bind(this)}
                            footer={false}
                            centered
                        >
                            <div className={codeType == 2 ?`${Css['codeLookBox']} ${Css['codeWxBox']}` : `${Css['codeLookBox']} ${Css['codeAlipayBox']}`}>
                                <div className={Css.codeImg}>
                                     <div className={Css.storeName}>{storeName}</div>
                                    <img src={`${qrCodeUrl}?${timeStr}`}/>
                                </div>
                            </div>
                    </Modal>
                : null
            }
        </Modal>
    )
    }
}

export default withRouter(CodeModal)
