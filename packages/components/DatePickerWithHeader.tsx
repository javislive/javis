import React, { PureComponent, RefObject, createRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui';
import { resize, vh, vw } from 'utils/resize';

import DatePicker from 'components/DatePicker';
import FontIcon from 'components/FontIcon';
import XDate from './VisualDatePicker/XDate';
import { createStyle } from 'themes';

const YEAR = 365 * 24 * 60 * 60 * 1000;
const TEN_YEAR = 365 * 24 * 60 * 60 * 1000 * 10;
interface Props {
	start?: number;
	end?: number;
	onCancel?: () => void;
	pickTimes?: number;
	onDateSelect?: (date: number) => void;
	selectDate?: { date: number; backgroundColor?: string }[];
	onFinish?: (date: {
		start?: number;
		end?: number;
		selectDate?: number[];
	}) => void;
}

export default class DatePickerWithHeader extends PureComponent<Props> {
	state = {
		startDate: 0,
		endDate: 0,
	};
	constructor(props: Props) {
		super(props);
		const { start, end, selectDate } = props;
		const { startDate, endDate } = this.initDateBound(start, end, selectDate);
		this.state.startDate = startDate;
		this.state.endDate = endDate;
	}
	private datePickerRef: RefObject<DatePicker> = createRef();
	render() {
		let { start, end, onFinish, ...props } = this.props;
		const { startDate, endDate } = this.state;
		return (
			<View style={styles.wrapper}>
				<View style={styles.header}>
					<Text
						style={[styles.headerText, { flex: 1, marginLeft: resize(20) }]}
					>
						{new XDate(startDate).format('yyyy') + '年'}
					</Text>
					<TouchableOpacity style={styles.yearButton} onPress={this.clear}>
						<Text style={styles.headerText}>清除</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.yearButton} onPress={this.preYear}>
						<Text style={styles.headerText}>上一年</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.yearButton} onPress={this.nextYear}>
						<Text style={styles.headerText}>下一年</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.yearButton, { marginRight: resize(40) }]}
						onPress={this.currentYear}
					>
						<Text style={styles.headerText}>今年</Text>
					</TouchableOpacity>
					<View style={styles.cancelButtonWrapper}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={this.props.onCancel}
						>
							<FontIcon icon='&#xe781;' size={resize(16)} />
						</TouchableOpacity>
					</View>
				</View>
				<DatePicker
					ref={this.datePickerRef}
					{...props}
					onFinish={this.onValueChange}
					start={startDate}
					end={endDate}
					startDate={start}
					endDate={end}
				/>
			</View>
		);
	}
	private onValueChange = (date: {
		start?: number;
		end?: number;
		selectDate?: number[];
	}) => {
		this.props.onFinish && this.props.onFinish(date);
		// this._tempValue = v;
	};
	private onCancel() {
		this.props.onCancel && this.props.onCancel();
	}
	private clear = () => {
		this.datePickerRef.current && this.datePickerRef.current.clear();
	};
	private currentYear = () => {
		const date = new XDate(Date.now()).firstDateOfYear();
		const startDate = date.getTime();
		const endDate = date.nextYear().getTime();
		this.setState({
			startDate,
			endDate,
		});
	};
	private nextYear = () => {
		const { startDate: time } = this.state;
		const date = new XDate(time).firstDateOfYear();
		date.nextYear();
		const startDate = date.getTime();
		const endDate = date.nextYear().getTime();
		this.setState({
			startDate,
			endDate,
		});
	};
	private preYear = () => {
		const { startDate: time } = this.state;
		const date = new XDate(time).firstDateOfYear();
		date.preYear();
		const startDate = date.getTime();
		const endDate = date.nextYear().getTime();
		this.setState({
			startDate,
			endDate,
		});
	};
	/**
	 * 初始化日期范围
	 * 有start 以start为准取一年
	 * 有end 以end为准取一年
	 * 否则以selectDate为准取一年
	 * 都没有取今年
	 * */

	private initDateBound(
		start?: number,
		end?: number,
		selectDate?: { date: number; backgroundColor?: string }[]
	) {
		const time =
			start || end || (selectDate && selectDate[0].date) || Date.now();
		const date = new XDate(time).firstDateOfYear();
		const startDate = date.getTime();
		const endDate = date.nextYear().getTime();
		return {
			startDate,
			endDate,
		};
	}
}
const styles = createStyle((theme) => {
	return {
		wrapper: {
			backgroundColor: '#fff',
			position: 'absolute',
			bottom: 0,
			top: 0,
			width: vw(100),
		},
		header: {
			borderBottomWidth: theme.px,
			borderColor: theme.borderColor,
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			height: resize(36),
		},
		yearButton: {
			marginLeft: resize(10),
			width: resize(80),
			height: resize(30),
			justifyContent: 'center',
			alignItems: 'center',
			borderColor: '#82704A',
			borderWidth: theme.px,
			borderRadius: resize(30),
		},
		headerText: {
			color: theme.color,
			fontSize: resize(15),
		},
		cancelButtonWrapper: {
			position: 'absolute',
			right: 0,
		},
		cancelButton: {
			padding: 12,
		},
	};
});
