import { FlatList, Text, View } from 'react-native-ui';
import {
	ListRenderItem,
	ListRenderItemInfo,
	TouchableOpacity,
} from 'react-native';
import React, { PureComponent } from 'react';

import Application from 'celtics/Application';
import { PrefixSource } from 'webpack-sources';
import Radio from 'components/Radio';
import { resize } from 'utils/resize';

let inst: Chooser;
export default class Chooser extends PureComponent {
	static hide() {
		inst && inst.close();
	}
	state = {
		data: [],
		show: false,
		select: null,
		onSelect: (item: any) => {},
	};
	componentDidUpdate() {
		if (this.state.show) {
			inst && inst !== this && inst.close();
			inst = this;
		}
	}
	show({
		data,
		select,
		onSelect,
	}: {
		data: any[];
		select: any;
		onSelect: (item: any) => void;
	}) {
		// if (this.state.show) {
		//   return;
		// }
		// inst = this;
		this.setState({ data, show: true, select, onSelect });
	}
	close() {
		if (inst == this) {
			//@ts-ignore
			inst = null;
		}
		this.setState({ data: [], show: false });
	}
	render() {
		const { data, show } = this.state;
		if (!show) {
			return null;
		}
		return (
			<View style={styles.wrapper}>
				<FlatList
					data={data}
					renderItem={this._renderItem}
					keyExtractor={this._keyExtractor}
				/>
			</View>
		);
	}
	private _renderItem = ({ item }: ListRenderItemInfo<any>) => {
		const { select, onSelect } = this.state;
		return (
			<View style={styles.row}>
				<TouchableOpacity
					onPress={() => {
						onSelect(item);
						this.close();
					}}
					style={styles.btn}
				>
					<View style={styles.name}>
						<Text style={styles.nameText}>{item.name}</Text>
					</View>
					{select === item.id ? (
						<Radio name={1} value={1} style={styles.radio} />
					) : null}
				</TouchableOpacity>
			</View>
		);
	};
	private _keyExtractor = (info: ListRenderItemInfo<any>, index: number) => {
		return index + '';
	};
}
const styles = Application.createStyle((themes) => {
	return {
		wrapper: {
			position: 'absolute',
			width: resize(270),
			height: resize(332),
			borderRadius: resize(9),
			overflow: 'hidden',
			top: resize(115),
			left: resize(20),
			zIndex: 99,
		},
		row: {
			paddingBottom: themes.px,
			backgroundColor: themes.borderColor,
		},
		btn: {
			flexDirection: 'row',
			height: resize(40),
			paddingHorizontal: resize(24),
			justifyContent: 'center',
			backgroundColor: '#fff',
		},
		name: {
			flex: 1,
			justifyContent: 'center',
		},
		nameText: { color: '#3A3A3A', fontSize: resize(14) },
		radio: {},
	};
});
