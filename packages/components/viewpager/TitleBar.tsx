'use script';

import { Animated, NativeSyntheticEvent, Text, View } from 'react-native';
import React, { PureComponent, RefObject, createRef } from 'react';
import Title, { TitleProps } from './TitleBar.Title';
import {
	ViewPagerOnPageScrollEventData,
	ViewPagerOnPageSelectedEventData,
	ViewPagerProps,
} from '@react-native-community/viewpager';

import ViewPager from './ViewPager';

interface Props {
	titleStyle?: any;
	titleItemStyle?: any;
}

class TitleBar extends PureComponent<TitleProps & ViewPagerProps & Props> {
	// static propTypes = {
	//     ...ViewPager.propTypes,
	//     ...Title.propTypes
	// }
	static defaultProps = {
		initialPage: 0,
	};
	private titleRef: RefObject<Title> = createRef();
	private viewPagerRef: RefObject<ViewPager> = createRef();

	setPage(selectedPage: number) {
		this.viewPagerRef.current &&
			this.viewPagerRef.current.setPage(selectedPage);
	}
	setPageWithoutAnimation(selectedPage: number) {
		this.viewPagerRef.current &&
			this.viewPagerRef.current.setPageWithoutAnimation(selectedPage);
	}
	render() {
		const {
			backgroundColor,
			onLayout,
			style: propsStyle,
			renderTitle,
			borderStyle,
			initialPage,
			titles,
			titleStyle,
			titleItemStyle,
			...props
		} = this.props;
		const viewpagerProps = {
			...props,
			style: {
				flex: 1,
			},
			onPageSelected: this._onPageSelected,
			onPageScroll: this._onPageScroll,
		};
		const style = [
			propsStyle,
			{
				flexDirection: 'column',
				justifyContent: undefined,
				alignItems: undefined,
			},
		];
		return (
			<View style={style} onLayout={onLayout}>
				<Title
					ref={this.titleRef}
					backgroundColor={backgroundColor}
					titleItemStyle={titleItemStyle}
					renderTitle={renderTitle}
					borderStyle={borderStyle}
					style={titleStyle}
					onItemPress={(position) => this._onItemPress(position)}
					initialPage={initialPage}
					titles={titles}
				/>
				<ViewPager ref={this.viewPagerRef} {...viewpagerProps} />
			</View>
		);
	}
	private _onPageScroll = (
		e: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>
	) => {
		this.titleRef.current && this.titleRef.current.onPageScroll(e);
		this.props.onPageScroll && this.props.onPageScroll(e);
	};
	private _onPageSelected = (
		e: NativeSyntheticEvent<ViewPagerOnPageSelectedEventData>
	) => {
		this.titleRef.current && this.titleRef.current.onPageSelected(e);
		this.props.onPageSelected && this.props.onPageSelected(e);
	};
	private _onItemPress(position: number) {
		this.viewPagerRef.current &&
			this.viewPagerRef.current.setPageWithoutAnimation(position);
		this._onPageSelected({ nativeEvent: { position } });
	}
}

export default TitleBar;
