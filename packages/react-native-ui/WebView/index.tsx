import {
	Platform,
	UIManager,
	requireNativeComponent,
	NativeModules,
} from 'react-native';
import React, { PureComponent, RefObject, createRef } from 'react';
import Web, { WebViewProps } from 'react-native-webview';

import assemebleJavaScript from './assembleJavaScript';

const NativeWebView = requireNativeComponent(
	Platform.OS === 'android' ? 'WebViewManager' : 'WebView'
);
const NativeManager =
	Platform.OS === 'android' ? null : NativeModules.WebViewManager;

class RCTWebView extends Web {
	print(name: String) {
		//@ts-ignore
		UIManager.dispatchViewManagerCommand(
			//@ts-ignore
			this.getWebViewHandle(),
			//@ts-ignore
			Platform.OS === 'ios'
				? UIManager.getViewManagerConfig('WebView').Commands.print
				: 9,
			[name]
		);
	}
}
interface Props extends WebViewProps {
	initialMethods?: { [idx: string]: (...args: any) => void };
}
interface CallBack {
	resolve: (data: any) => void;
	reject: (error: any) => void;
}
interface MethodPayload {
	params?: any[];
	method: string;
	callback: number;
	type: 'invokeMethod';
}
interface CallBackPayload {
	callback: number;
	success: boolean;
	type: 'invokeMethodCallback';
	result?: any;
}
class WebView extends PureComponent<Props> {
	private _methods: { [idx: string]: (...args: any) => void } = {};
	private _callbacks: CallBack[] = [];
	private _web: RefObject<RCTWebView> = createRef();
	constructor(props: Props) {
		super(props);
		this._callbacks = [];
		this._methods = {
			...props.initialMethods,
			print: (name) => {
				this._web.current && this._web.current.print(name);
			},
		};
	}
	invokeMethod(method: string, params?: any[]) {
		return new Promise((resolve, reject) => {
			this._callbacks.push({
				reject,
				resolve,
			});
			let data: MethodPayload = {
				method,
				params,
				type: 'invokeMethod',
				callback: this._callbacks.length - 1,
			};
			this._postData(data);
		});
	}
	injectMethod(methodName: string, method: (...args: any[]) => void) {
		this._methods[methodName] = method;
	}
	print(name: string) {
		this._web.current && this._web.current.print(name);
	}
	_postData(data: any) {
		this._web.current &&
			this._web.current.injectJavaScript(
				`nativeWebView.postMessage(${JSON.stringify(data)})`
			);
	}
	_onMessage = ({ nativeEvent }: any) => {
		try {
			const data = JSON.parse(nativeEvent.data);
			switch (data.type) {
				case 'invokeMethod':
					let method = this._methods[data.method];
					if (method) {
						try {
							let result = method.apply(null, data.params);
							Promise.resolve(result).then((result) => {
								const d: CallBackPayload = {
									result,
									success: true,
									callback: data.callback,
									type: 'invokeMethodCallback',
								};
								this._postData(d);
							});
						} catch (e) {
							const d: CallBackPayload = {
								result: e.message,
								success: false,
								callback: data.callback,
								type: 'invokeMethodCallback',
							};
							this._postData(d);
						}
					}
				case 'invokeMethodCallback':
					let callback = this._callbacks[data.callback];
					if (callback) {
						delete this._callbacks[data.callback];
						if (data.success) {
							callback.resolve(data.result);
						} else {
							callback.reject(data.result);
						}
					}
			}
		} catch (e) {}
	};
	render() {
		let { injectedJavaScript, ...props } = this.props;
		return (
			<RCTWebView
				ref={this._web}
				bounces={false}
				javaScriptEnabled={true}
				originWhitelist={['*']}
				{...props}
				nativeConfig={{
					component: NativeWebView,
					viewManager: NativeManager,
				}}
				onMessage={this._onMessage}
				injectedJavaScript={assemebleJavaScript(injectedJavaScript)}
			/>
		);
	}
}

export default WebView;
