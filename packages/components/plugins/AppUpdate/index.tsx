import { Plugin } from 'celtics/Plugin';
import React, { RefObject, createRef } from 'react';
import Displayer from './Displayer';
import { dispatch } from 'febrest';
import { appVersion } from 'services/api';
import app from 'actions/app';
import { FileCache, UserAgent } from 'native';
import { Platform } from 'react-native';

function checkVersion(c: string, n: string) {
	const curV = c.split('.');
	const nV = n.split('.');
	const l = Math.max(curV.length, nV.length);
	for (let i = 0; i < l; i++) {
		const v1 = parseInt(curV[i] || '0');
		const v2 = parseInt(nV[i] || '0');
		if (v1 < v2) {
			return true;
		}
	}
	return false;
}

export default class AppUpdate extends Plugin<any> {
	private _datePicker: RefObject<Displayer> = createRef();
	state = {
		isShow: false,
		data: {},
	};
	dispatch(action: string, payload?: any) {
		if (Platform.OS === 'ios') {
			return;
		}
		if (action == 'check') {
			dispatch(appVersion).then(
				(data: any) => {
					if(!data) return;
					if (!checkVersion(UserAgent.VERSION_NAME, data.version)) {
						return;
					}
					//判断数据，检查版本号
					// this.setState({ isShow: true, data });
					const buttons = [
						{
							text: '取消',
							onPress: () => {},
						},
						{
							text: '确定',
							onPress: () => {
								this.update(data);
							},
						},
					];
					if (data.force_update == 1) {
						buttons.shift();
					}
					dispatch(app.alert, {
						message: data.memo,
						title: '发现新版本',
						buttons,
					});
				},
				(e) => {
					//dispatch(app.toast, { message: e.message });
				}
			);
		}
	}
	private update(data: any) {
		FileCache.cache(data.app_url, function (data: any) {
			const { status, progress, source } = data;
			if (status === 'error') {
			} else if (status == 'success') {
				const uri = Platform.OS === 'android' ? source : source;
				UserAgent.install(uri);
			}
		});
	}
	render() {
		return null;
		// const { isShow, data } = this.state;
		// if (!isShow) {
		//   return null;
		// }
		// //const { version, memo, app_url, md5, force_update } = data;
		// return <Displayer {...data} />;
	}
}
