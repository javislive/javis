'use strict';

import {
	Animated,
	LayoutChangeEvent,
	NativeSyntheticEvent,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { PureComponent } from 'react';
import {
	ViewPagerOnPageScrollEventData,
	ViewPagerOnPageSelectedEventData,
} from '@react-native-community/viewpager';

import PropTypes from 'prop-types';
import { resize } from 'utils/resize';

function renderTitleDefault(title: string, i: number, selected: number) {
	var textStyle = {
		color: '#3A3A3A',
		fontSize: resize(14),
		width: resize(90),
		textAlign: 'center',
	};
	if (selected === i) {
		textStyle.color = '#806E47';
	}
	return <Text style={textStyle}>{title}</Text>;
}

export interface TitleProps {
	initialPage: number;
	backgroundColor?: string;
	borderStyle?: any;
	style?: any;
	titleItemStyle?: any;
	renderTitle?: (title: string, index: number, selected: number) => JSX.Element;
	onItemPress?: (index: number) => void;
	titles: string[];
}
class Title extends PureComponent<TitleProps> {
	static propTypes = {
		backgroundColor: PropTypes.string,
		borderStyle: PropTypes.any,
		renderTitle: PropTypes.func,
		onItemPress: PropTypes.func,
	};
	static defaultProps = {
		backgroundColor: '#fff',
		borderStyle: { height: 3, backgroundColor: '#806E47' },
		renderTitle: renderTitleDefault,
	};
	_scrollValue: Animated.Value;
	state = {
		page: 0,
		width: 0,
	};
	constructor(props: TitleProps) {
		super(props);
		this.state = {
			page: this.props.initialPage,
			width: 0,
		};
		this._scrollValue = new Animated.Value(this.props.initialPage);
	}
	onPageSelected(
		event: NativeSyntheticEvent<ViewPagerOnPageSelectedEventData>
	) {
		var page = event.nativeEvent.position;
		if (page == this.state.page) {
			//防止重复触发
			return;
		}
		this.setState({ page });
		this._scrollValue.setValue(page);
	}
	onPageScroll(event: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) {
		var { offset, position } = event.nativeEvent;
		this._scrollValue.setValue(position + offset);
	}
	_renderTitle() {
		const {
			renderTitle = renderTitleDefault,
			titles,
			onItemPress,
			titleItemStyle,
			backgroundColor,
		} = this.props;
		return titles.map((title, index) => {
			return (
				<TouchableOpacity
					key={index}
					onPress={() => onItemPress && onItemPress(index)}
					activeOpacity={1}
					style={[
						{
							backgroundColor,
							flexDirection: 'row',
						},
						titleItemStyle,
					]}
					children={renderTitle(title, index, this.state.page)}
				/>
			);
		});
	}
	_renderBorder() {
		if (!this.props.borderStyle) {
			return null;
		} else {
			let count = this.props.titles.length;
			let width = this.state.width / count;
			let left = this._scrollValue.interpolate({
				inputRange: [0, count],
				outputRange: [0, width * count],
			});
			let style = {
				width,
				position: 'absolute',
				bottom: 0,
				left,
				flex: null,
			};
			return (
				<Animated.View
					children={<View style={this.props.borderStyle} />}
					style={[style]}
				/>
			);
		}
	}
	_onLayout(e: LayoutChangeEvent) {
		if (e.nativeEvent.layout.width !== this.state.width) {
			this.setState({ width: e.nativeEvent.layout.width });
		}
	}
	render() {
		const { titles, style } = this.props;
		if (!titles) {
			return null;
		}
		return (
			<View
				onLayout={(e) => this._onLayout(e)}
				style={[{ flexDirection: 'row', height: resize(41) }, style]}
			>
				{this._renderTitle()}
				{this._renderBorder()}
			</View>
		);
	}
}
export default Title;
