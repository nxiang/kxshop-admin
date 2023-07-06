import React, { Component } from "react";
import Css from "./SelectDate.module.scss";
import { DatePicker } from "antd";
import moment from "moment";

class SelectDate extends Component {
	state = {
		beginTime: this.props.fbeginTime || null,
		endTime: null,
		endOpen: false,
		dateFormat: "YYYY-MM-DD HH:mm"
	};
	componentDidMount() {
		console.log(this.props);
	}

	disabledStartDate = beginTime => {
		const { endTime } = this.state;
		if (!beginTime || !endTime) {
			return false;
		}
		return beginTime.valueOf() > endTime.valueOf();
	};
	disabledEndDate = endTime => {
		const { beginTime, dateFormat } = this.state;
		const { fbeginTime, postpone } = this.props;
		// 如果为延期时间则使用传入的开始时间
		const mmtFbeginTime = moment(fbeginTime, dateFormat);
		if (!endTime || !beginTime) {
			return false;
		}
		return postpone ? endTime.valueOf() <= mmtFbeginTime.valueOf() : endTime.valueOf() <= beginTime.valueOf();
	};
	// 选择活动时间
	selectDate(phase, date) {
		console.log(phase, date);
		this.setState({
			[`${phase}Time`]: date
		});
		this.props.onSelectDate(phase, date);
	}
	handleStartOpenChange = open => {
		if (!open) {
			this.setState({ endOpen: true });
		}
	};
	handleEndOpenChange = open => {
		this.setState({ endOpen: open });
	};

	render() {
		const { dateFormat, endOpen } = this.state;
		const { fbeginTime, fendTime, postpone } = this.props;
		return (
			<span>
				<DatePicker
					className={Css.ActivityTime}
					placeholder="请选择"
					disabledDate={this.disabledStartDate}
					disabled={postpone}
					showTime={{ format: "HH:mm" }}
					defaultValue={fbeginTime ? moment(fbeginTime, dateFormat) : ""}
					format={dateFormat}
					onChange={this.selectDate.bind(this, "begin")}
					onOpenChange={this.handleStartOpenChange}
				/>
				<span className={Css.To}>至</span>
				<DatePicker
					className={Css.ActivityTime}
					placeholder="请选择"
					disabledDate={this.disabledEndDate}
					showTime={{ format: "HH:mm" }}
					defaultValue={fendTime ? moment(fendTime, dateFormat) : ""}
					format={dateFormat}
					onChange={this.selectDate.bind(this, "end")}
					open={endOpen}
					onOpenChange={this.handleEndOpenChange}
				/>
			</span>
		);
	}
}

export default SelectDate;
