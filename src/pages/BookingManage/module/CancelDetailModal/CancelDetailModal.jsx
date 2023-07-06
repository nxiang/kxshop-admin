import React from 'react';
import { withRouter } from '@/utils/compatible'
import {
  Button,
  Input,
  InputNumber,
  message,
  Upload,
  Icon,
  Modal,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
} from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

class CancelDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      tableData: {},
    };
  }
  componentDidMount() {
    const { tableData } = this.props;
    this.setState({
      tableData,
    });
  }
  footerBtn() {
    let btnArr = null;
    btnArr = [
      <div>
        <Button key="1" type="primary" onClick={this.props.closeModal}>
          关闭
        </Button>
      </div>,
    ];
    return btnArr;
  }
  render() {
    const { tableData } = this.state;
    const statusArr = ['无需退款', '退款中', '退款成功', '退款关闭'];
    return (
      <Modal
        maskClosable={false}
        title={'详情'}
        width={600}
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        footer={this.footerBtn()}
      >
        <Row style={{ paddingBottom: 10 }}>
          <Col span={4}>取消时间:</Col>
          <Col span={15}>{tableData ? tableData.confirmTime : null}</Col>
        </Row>
        <Row style={{ paddingBottom: 10 }}>
          <Col span={4}>操作人:</Col>
          <Col span={15}>{tableData ? tableData.confirmOper : null}</Col>
        </Row>
        <Row style={{ paddingBottom: 10 }}>
          <Col span={4}>取消原因:</Col>
          <Col span={15}>{tableData ? tableData.cancelReason : null}</Col>
        </Row>
        <Row style={{ paddingBottom: 10 }}>
          <Col span={4}>退款状态:</Col>
          {tableData.item && tableData.item.list[0] ? (
            <Col span={15}>{statusArr[tableData.refundStatus]}</Col>
          ) : null}
        </Row>
      </Modal>
    );
  }
}

export default withRouter(CancelDetailModal);
