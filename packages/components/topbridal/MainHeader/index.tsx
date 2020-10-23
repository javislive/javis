import { FlatList, Text, TouchableOpacity, View } from 'react-native-ui';
import React, { RefObject, createRef } from 'react';

import Application from 'celtics/Application';
import FontIcon from 'components/FontIcon';
import { State, dispatch } from 'febrest';
import { parseStoreName } from 'utils/topbridal';
import { resize } from 'utils/resize';
import common from 'actions/common';

interface Props {
	placeholder: string;
	onPress: () => void;
	store: string;
	stores?: any[];
	storeId: any;
	onStoreChange?: (item: any) => void;
}
export default function MainHeader({
	placeholder,
	onPress,
	onStoreChange,
	store,
	storeId,
	stores,
}: Props) {
	const { prefix, name } = parseStoreName(store);

	let user = State('user').get();
	return (
		<View style={styles.header}>
			<View style={styles.storeButton}>
				<TouchableOpacity
					onPress={() => {
						if (user.self != 1) {
							return;
						}
						let data = stores || State('store').get();
						let promise = Promise.resolve();
						if (!data) {
							promise = dispatch(common.store).then(
								(da: any) => {
									data = da.map((item: any) => {
										return {
											value: item.id,
											name: item.name || item.store_name,
											...item,
										};
									});
								},
								(e) => Promise.reject(e)
							);
						}
						promise.then(() => {
							//@ts-ignore
							const plugin = Application.getInstance().getPlugin('Chooser');
							plugin?.dispatch('show', {
								data,
								select: storeId,
								onSelect: (item) => {
									onStoreChange && onStoreChange(item);
								},
							});
							// .show({
							// data,
							// select: storeId,
							// onSelect: item => {
							//   onStoreChange && onStoreChange(item);
							//     }
							//   });
						});
					}}
					style={styles.buttonTouch}
				>
					<FontIcon icon='&#xe785;' color='#3A3A3A' size={resize(14)} />
					<Text style={styles.storeButtonText}>{prefix}</Text>
					<Text style={styles.storeButtonText}>{name ? '·' : ''}</Text>
					<Text style={styles.storeButtonText}>{name}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.searchButton}>
				<TouchableOpacity style={styles.buttonTouch} onPress={onPress}>
					<Text style={styles.searchButtonText}>{placeholder}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = Application.createStyle((themes) => {
	return {
		header: {
			flexDirection: 'row',
			height: resize(31),
			marginBottom: resize(19),
		},

		storeButton: {
			width: resize(149),
			marginRight: resize(16),
			backgroundColor: '#fff',
			borderRadius: resize(20),
		},
		buttonTouch: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
		},
		storeButtonText: {
			color: '#3A3A3A',
			fontSize: resize(14),
		},
		searchButton: {
			backgroundColor: '#fff',
			borderRadius: resize(20),
			flex: 1,
		},
		searchButtonText: {
			color: '#848484',
			fontSize: resize(14),
		},
	};
});
