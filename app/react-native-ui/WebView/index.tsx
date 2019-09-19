import React, { Component } from 'react';

import { WebView as Web, WebViewProps } from 'react-native';

import assemebleJavaScript from './assembleJavaScript';

const WEB_REF = 'WEB_REF';
interface Props extends WebViewProps {}
class WebView extends Component<Props> {
  private _methods: { [idx: string]: (...args: any) => void } | null = {};
  private _callbacks: (() => void)[] | null = [];
  constructor(props: Props) {
    super(props);
  }
  componentWillUnmount() {
    this._callbacks = null;
    this._methods = null;
  }
  invokeMethod(method: string, params?: any[], callback?: () => void) {
    let data = { method, params, type: 'invokeMethod', callback: undefined };
    if (callback) {
      this._callbacks.push(callback);
      data.callback = this._callbacks.length - 1;
    }
    this._postData(data);
  }
  injectMethod(methodName: string, method: (...args: any[]) => void) {
    this._methods[methodName] = method;
  }
  _postData(data: any) {
    this.refs[WEB_REF].postMessage(JSON.stringify(data));
  }
  _onMessage = ({ nativeEvent }: any) => {
    try {
      const data = JSON.parse(nativeEvent.data);
      switch (data.type) {
        case 'invokeMethod':
          let method = this._methods[data.method];
          if (method) {
            Promise.resolve(method.apply(null, data.params)).then(result => {
              this._postData({
                result
              });
            });
          }
        case 'invokeMethodCallback':
          let callback = this._callbacks[data.callback];
          if (callback) {
            callback.call(null, data.params);
            delete this._callbacks[data.callback];
          }
      }
    } catch (e) {}
  };
  render() {
    let props = this.props;
    let injectedJavaScript = props.injectedJavaScript;
    return (
      <Web
        ref={WEB_REF}
        bounces={false}
        {...props}
        onMessage={this._onMessage}
        injectedJavaScript={assemebleJavaScript(injectedJavaScript)}
      />
    );
  }
}

export default WebView;
