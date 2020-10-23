import {
	NativeSyntheticEvent,
	TextInputChangeEventData,
	TextInputFocusEventData,
	TextInputProps,
} from 'react-native';
import React, { Component, PureComponent, ReactComponentElement } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native-ui';
import { resize, vw } from 'utils/resize';

import FontIcon from './FontIcon';
import { createStyle } from 'themes';

export interface Props extends TextInputProps {
	leftChild?: ReactComponentElement<any, any>;
	rightChild?: ReactComponentElement<any, any>;
	forwardedRef?: any;
	showClearButton?: boolean;
	inputStyle?: any;
	style?: any;
	radius?: boolean;
	underline?: boolean;
}
export interface State {
	focus: boolean;
	secureTextVisible: boolean;
	value: string;
}
class Input extends PureComponent<Props, State> {
	static getDerivedStateFromProps(nextProps: Props, prevState: State) {
		if (nextProps.value !== undefined) {
			return {
				value: nextProps.value,
			};
		}
		return null;
	}

	state: State = {
		focus: false,
		secureTextVisible: false,
		value: '',
	};
	private _input: any;
	private _onChange = (
		event: NativeSyntheticEvent<TextInputChangeEventData>
	) => {
		let value = event.nativeEvent.text;
		let { onChangeText, onChange, value: propsValue } = this.props;
		onChangeText && onChangeText(value);
		onChange && onChange(event);
		if (propsValue === undefined) {
			this.setState({ value });
		}
	};
	private _toggleSecureTextVisible = () => {
		this.setState({
			secureTextVisible: !this.state.secureTextVisible,
		});
	};
	private _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		let { onFocus } = this.props;
		this.setState(
			{
				focus: true,
			},
			() => {
				onFocus && onFocus(e);
			}
		);
	};
	private _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		let { onBlur } = this.props;
		this.setState(
			{
				focus: false,
			},
			() => {
				onBlur && onBlur(e);
			}
		);
	};
	private _clear() {
		this._input.current && this._input.current.clear();
		/**
		 * android调用input的clear方法不触发change事件
		 * ios下未测试
		 * 如果后续rn修复该bug可以移除下面这段避免重复触发
		 */
		this._onChange({ nativeEvent: { text: '', target: this._input } });
	}
	render() {
		const {
			leftChild,
			rightChild,
			style,
			radius = true,
			underline = false,
		} = this.props;
		const { focus } = this.state;
		return (
			<View
				style={[
					styles.wrapper,
					radius ? styles.radius : null,
					underline && !radius ? styles.underline : null,
					style,
				]}
			>
				{leftChild || null}
				{this._renderInput()}
				{rightChild || null}
			</View>
		);
	}
	private _renderInput(): ReactComponentElement<any, any> {
		let {
			clearButtonMode,
			secureTextEntry,
			forwardedRef,
			showClearButton,
			inputStyle,
			onTouchEnd,
			textAlignVertical,
			...props
		} = this.props;
		let ref = (this._input = forwardedRef);
		if (!forwardedRef) {
			ref = React.createRef();
			this._input = ref;
		}
		if (typeof forwardedRef === 'function') {
			ref = (v: any) => {
				forwardedRef(v);
				this._input = {
					current: v,
				};
			};
		}
		let { focus, value, secureTextVisible } = this.state;
		return (
			<View onTouchEnd={onTouchEnd} style={[styles.inputWrapper]}>
				<TextInput
					ref={ref}
					placeholderTextColor='rgba(160,160,160,1)'
					{...props}
					secureTextEntry={secureTextVisible ? false : secureTextEntry}
					underlineColorAndroid='transparent'
					textAlignVertical={textAlignVertical ? textAlignVertical : 'center'}
					clearButtonMode='never'
					onFocus={this._onFocus}
					onBlur={this._onBlur}
					onChangeText={undefined}
					onChange={this._onChange}
					style={[styles.input, inputStyle]}
					value={value}
				/>
				{secureTextEntry ? (
					<TouchableOpacity
						activeOpacity={1}
						onPress={this._toggleSecureTextVisible}
						style={styles.secureTextVisibleEye}
					>
						<FontIcon
							icon={secureTextVisible ? '&#xe9a4;' : '&#xe7a4;'}
							color='#dbdbdb'
							size={26}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => {
							!secureTextEntry && value && this._clear();
						}}
						style={styles.secureTextVisibleEye}
					>
						{showClearButton ? (
							<FontIcon
								icon='&#xe899;'
								size={22}
								color={secureTextEntry || !value ? 'transparent' : '#dbdbdb'}
							/>
						) : null}
					</TouchableOpacity>
				)}
			</View>
		);
	}
}

const styles = createStyle((theme) => ({
	wrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		height: resize(31),
		backgroundColor: '#fff',
		borderColor: theme.borderColor,
		...theme.input,
	},
	radius: {
		borderRadius: resize(31),
		borderWidth: theme.px,
	},
	underline: {
		borderBottomWidth: theme.px,
	},
	inputWrapper: {
		flexDirection: 'row',
		flex: 1,
		backgroundColor: 'transparent',
	},
	input: {
		height: resize(31),
		flex: 1,
		padding: 0,
		fontSize: resize(13),
		color: '#333',
		paddingHorizontal: resize(15),
		...theme.inputText,
	},
	secureTextVisibleEye: {
		justifyContent: 'center',
		alignContent: 'center',
	},
}));
export default React.forwardRef((props: Props, ref) => {
	return <Input {...props} forwardedRef={ref} />;
});
