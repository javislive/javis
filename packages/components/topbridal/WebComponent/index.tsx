import React, { PureComponent, RefObject, createRef } from 'react';
import { View, WebView } from 'react-native-ui';

import Application from 'celtics/Application';
import BuildConfig from 'BuildConfig';
import { fetch } from 'utils/fetch';
import source from './source';

interface Props {
  style?: any;
  path: string;
  params: object;
}

function f(url: string, data?: any, method?: any) {
  return fetch(url, data, method);
}
function injectJS(params: object) {
  return `window.params=${JSON.stringify(
    params
  )};window.fetch = function(url,params,method){return  nativeWebView.invokeMethod("fetch",[url,params,method])};window.topbridal=true;`;
}
export default class WebComponent extends PureComponent<Props> {
  private _webviewRef: RefObject<WebView> = createRef();
  print() {
    this._webviewRef.current &&
      this._webviewRef.current.print(source(this.props.path).uri);
  }
  getWebView = () => {
    return this._webviewRef.current;
  }
  render() {
    const { style, path, params } = this.props;
    return (
      <View style={style}>
        <WebView
          ref={this._webviewRef}
          style={styles.webview}
          initialMethods={{ fetch: f }}
          applicationNameForUserAgent={'topbridal'}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          injectedJavaScript={injectJS(params)}
          allowingReadAccessToURL={
            BuildConfig.publicApiURI
              ? BuildConfig.publicApiURI.domain
              : 'http://*'
          }
          source={source(path)}
        />
      </View>
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    webview: {
      height: '100%',
      width: '100%'
    }
  };
});
