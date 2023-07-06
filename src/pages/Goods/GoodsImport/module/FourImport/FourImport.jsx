import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import Css from "../../Import.module.scss";
import { Breadcrumb, Spin, Steps , Upload, Button, message, Row, Col, Progress, Popover } from "antd";
import { InboxOutlined, CheckCircleFilled, ExclamationCircleFilled, PaperClipOutlined  } from '@ant-design/icons';
import { importResult } from "@/services/import";

class FourImport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editList: {}
		};
	}
	componentDidMount() {
		this.importResult();
	}
	importResult(){
		importResult().then(res => {
			if(res){
			  this.setState({
				editList: res.data
			  })
			}
		})
	}
	goImportFn(){
		location.reload()
	}
	render() {
		const { editList } = this.state;
		return (
  <div className={Css.fourContent}>
    <div className={`${Css.uploadBox } ${Css.uploadComonBox}`}>
      <div>
        <CheckCircleFilled className={Css.uploadSuccess} />
      </div>
      <div className={Css.descTitle}>商品批量导入成功</div>
      <div className={Css.desc}>
        所有成功导入的商品均为下架状态，请核对信息后上架
      </div>
      <div className={Css.resultBox}>
        <p className={Css.resultTilte}>导入结果</p>
        <div className={Css.resultContent}>
          <Row>
            <Col span={6}>
              <div className={Css.resultTop}>
                成功导入商品
              </div>
              <div>
                <span className={`${Css.resultNum} ${Css.resultOk}`}>{editList.importedItemNum}</span>
                <span className={Css.unit}> 个</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={Css.resultTop}>
                商品SKU
              </div>
              <div>
                <span className={`${Css.resultNum} ${Css.resultOk}`}>{editList.importedSkuNum}</span>
                <span className={Css.unit}> 个</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={Css.resultTop}>
                无主图商品
              </div>
              <div>
                <span className={`${Css.resultNum} ${Css.resultError}`}>{editList.noMainImageNum}</span>
                <span className={Css.unit}> 个</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={Css.resultTop}>
                无详情图商品
              </div>
              <div>
                <span className={`${Css.resultNum} ${Css.resultError}`}>{editList.noDetailImageNum}</span>
                <span className={Css.unit}> 个</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div className={Css.BottomBtnBox}>
      <Button type='primary'>
        <Link to="/goods/manageList">
          查看商品列表
        </Link>
      </Button>
      <Button onClick={this.goImportFn.bind(this)} style={{marginLeft: 8}}>
        继续导入
      </Button>
    </div>
  </div>
		);
	}
}
export default withRouter(FourImport)
