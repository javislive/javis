import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui';

import Application from 'celtics/Application';
import app from 'actions/app';
import { dispatch } from 'febrest';
import { resize } from 'utils/resize';
import common from 'actions/common';

interface Props {
	data: any;
}
export default class ReservationItem extends PureComponent<Props> {
	render() {
		let { data } = this.props;
		data = data || {};
		return (
			<View style={styles.wrapper}>
				<TouchableOpacity
					style={styles.wrapperTouch}
					onPress={() => {
						dispatch(app.navigate, {
							routeName: 'ReversionDetail',
							params: { id: data.id },
						});
					}}
				>
					<View style={styles.main}>
						<View style={styles.mainTop}>
							<Text style={[styles.topText, { width: resize(120) }]}>
								{data.visit_time}
							</Text>
							<Text style={[styles.topText]}>{data.person}</Text>
							<Text style={styles.topText}>{data.mobile}</Text>
						</View>
						<View style={styles.mainBottom}>
							<Text style={[styles.bottomText, { width: resize(120) }]}>
								婚期:{data.wedding_date}
							</Text>
							<Text style={styles.bottomText}>{data.status}</Text>
							<Text style={styles.bottomText}>{data.flag}</Text>
						</View>
					</View>

					{data.visit === 0 ? (
						<View style={styles.cancelTag}>
							<Text style={styles.cancelText}>已取消</Text>
						</View>
					) : data.agreement_time ? (
						<View style={styles.button}>
							<TouchableOpacity
								style={styles.buttonTouch}
								onPress={() => {
									dispatch(app.navigate, {
										routeName: 'TryProtocol',
										params: { sn: data.book_id },
									});
									// dispatch(common.agreementHasSign, data.book_id).then(
									//   (d: any) => {
									//     if (d && d.has_sign_agreement == 1) {
									//       dispatch(app.navigate, {
									//         routeName: 'TryProtocol',
									//         params: { sn: data.book_id }
									//       });
									//     } else {
									//       dispatch(app.toast, {
									//         message: '客户暂未签署试纱协议'
									//       });
									//     }
									//   }
									// );
								}}
							>
								<Text style={styles.buttonText}>试纱协议</Text>
							</TouchableOpacity>
						</View>
					) : null}
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = Application.createStyle((theme) => {
	return {
		wrapper: {
			borderBottomWidth: theme.px,
			borderColor: theme.borderColor,
			backgroundColor: '#fff',
			flex: 1,
		},
		wrapperTouch: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
		main: {
			flex: 1,
			marginTop: resize(19),
			marginBottom: resize(13),
		},
		mainTop: {
			flexDirection: 'row',
			marginBottom: resize(3),
		},
		topText: {
			color: '#3A3A3A',
			fontSize: resize(13),
			marginRight: resize(25),
			width: resize(90),
		},
		mainBottom: {
			flexDirection: 'row',
		},
		bottomText: {
			color: '#3A3A3A88',
			fontSize: resize(13),
			marginRight: resize(25),
			width: resize(90),
		},
		button: {
			width: resize(88),
			height: resize(31),
			borderRadius: resize(16),
			borderColor: '#806E47',
			borderWidth: theme.px,
			overflow: 'hidden',
		},
		buttonTouch: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		buttonText: {
			color: '#806E47',
			fontSize: resize(13),
		},
		cancelTag: {
			position: 'absolute',
			height: resize(48),
			width: resize(48),
			borderWidth: resize(2),
			borderColor: '#82704A',
			borderRadius: Platform.OS === 'ios' ? 48 : resize(24),
			justifyContent: 'center',
			alignItems: 'center',
			transform: [{ rotate: '45deg' }],
			right: resize(20),
			backgroundColor: '#0000',
			overflow: 'hidden',
		},
		cancelText: {
			color: '#82704A',
			fontSize: resize(12),
			borderWidth: 0,
			backgroundColor: '#0000',
		},
	};
});
