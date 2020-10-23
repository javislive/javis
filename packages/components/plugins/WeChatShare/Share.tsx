import React, { PureComponent } from 'react';
import Application from 'celtics/Application';
import { Text, View, TouchableOpacity, Image } from 'react-native-ui';
import { dispatch } from 'febrest';
import { resize } from 'utils/resize';
import { WeChatManager } from 'native';

const WX_APPID = 'wxb60e74d9b8e2aa80';

interface Props {
	data: any;
	onShared: () => void;
}

export default class Share extends PureComponent<Props> {
	componentDidMount() {
		WeChatManager.registerApp(WX_APPID, (res: any) => {
			if (!res) {
				dispatch('app.toast', '微信注册失败');
			}
		});
	}

	_shareToSession = () => {
		const { data = {}, onShared } = this.props;
		if (!data) return;
		WeChatManager.shareToSession(data, () => {});
		onShared && onShared();
	};

	_shareToTimeline = () => {
		const { data = {}, onShared } = this.props;
		if (!data) return;
		WeChatManager.shareToTimeline(data, () => {});
		onShared && onShared();
	};

	render() {
		return (
			<TouchableOpacity style={styles.main}>
				<Text style={styles.title}>分享到</Text>
				<View style={styles.items}>
					<TouchableOpacity
						style={[styles.item, { marginRight: resize(55) }]}
						onPress={this._shareToSession}
					>
						<Image
							style={styles.img}
							source={require('./wx_session.png')}
						></Image>
						<Text>微信</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item} onPress={this._shareToTimeline}>
						<Image
							style={styles.img}
							source={require('./wx_timeline.png')}
						></Image>
						<Text>朋友圈</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = Application.createStyle((theme) => {
	return {
		main: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			height: resize(150),
			backgroundColor: '#FFF',
			borderTopLeftRadius: resize(9),
			borderTopRightRadius: resize(9),
			paddingHorizontal: resize(30),
		},
		title: {
			marginTop: resize(15),
			marginBottom: resize(10),
			fontSize: resize(20),
			color: '#3B3E42',
		},
		items: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			flex: 1,
		},
		item: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		img: {
			height: resize(44),
			width: resize(44),
			marginBottom: resize(10),
		},
	};
});
