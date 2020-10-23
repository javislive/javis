import React from 'react';
import { Plugin } from 'celtics/Plugin';
import { View, TouchableOpacity, Text } from 'react-native-ui';
import Application from 'celtics/Application';
import { vh, resize, vw } from 'utils/resize';
import Picker from 'components/Picker';
interface Payload {
	title?: string;
	items: { key: any; value: any }[];
	onValueChange: (v: any) => void;
	defaultValue: any;
	[idx: string]: any;
}
export default class PickerModal extends Plugin<Payload> {
	state: Payload = {
		items: [],
		value: '',
		defaultValue: '',
		onValueChange: (v) => {},
		show: false,
	};
	dispatch(action: string, payload: Payload) {
		switch (action) {
			case 'show':
				this.show(payload);
				return;
			default:
				this.close();
		}
	}
	show(payload: Payload) {
		const value =
			payload.defaultValue === undefined
				? payload.items[0] && payload.items[0].key
				: payload.defaultValue;
		this.setState({
			title: '',
			...payload,
			value,
			show: true,
		});
	}
	close() {
		this.setState({
			show: false,
			title: '',
			items: [],
			value: '',
		});
	}
	render() {
		const { value, title = '请选择', show } = this.state;
		if (!show) {
			return null;
		}
		return (
			<View style={styles.wrapper}>
				<View style={styles.pickerWrapper}>
					<View style={styles.header}>
						<View style={styles.button}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.button, styles.center]}
								onPress={this._onCancel}
							>
								<Text style={styles.buttonText}>取消</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles.title, styles.center]}>
							<Text style={styles.titleText}>{title}</Text>
						</View>
						<View style={styles.button}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.button, styles.center]}
								onPress={this._onConfirm}
							>
								<Text style={[styles.buttonText, styles.activeButtonText]}>
									确定
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<Picker
						style={styles.picker}
						selectedValue={value}
						onValueChange={(v) => this.setState({ value: v })}
					>
						{this._renderItems()}
					</Picker>
				</View>
			</View>
		);
	}
	private _renderItems() {
		const { items } = this.state;
		return items.map((item) => {
			return <Picker.Item key={item.key} label={item.value} value={item.key} />;
		});
	}
	private _onCancel = () => {
		this.close();
	};
	private _onConfirm = () => {
		const { value } = this.state;
		this.state.onValueChange(value);
		this.close();
	};
}

const styles = Application.createStyle((theme) => {
	return {
		wrapper: {
			position: 'absolute',
			left: 0,
			top: 0,
			height: '100%',
			width: '100%',
			backgroundColor: 'rgba(120,120,120,0.3)',
		},
		pickerWrapper: {
			height: vh(50),
			backgroundColor: '#fff',
			position: 'absolute',
			bottom: 0,
			width: '100%',
		},
		header: {
			flexDirection: 'row',
			height: resize(36),
			borderBottomWidth: theme.px,
			borderBottomColor: theme.borderColor,
		},
		button: {
			width: vw(10),
			flexDirection: 'row',
		},
		center: {
			justifyContent: 'center',
			alignItems: 'center',
		},

		title: {
			flex: 1,
		},
		titleText: {
			color: '#4A4A4A',
			fontSize: resize(14),
		},
		buttonText: {
			color: '#4A4A4A88',
			fontSize: resize(12),
		},
		activeButtonText: {
			color: '#806E47',
		},
		picker: {
			flex: 1,
		},
	};
});
