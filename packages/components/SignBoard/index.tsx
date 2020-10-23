import React, { PureComponent, RefObject, createRef } from 'react';
import { View, WebView } from 'react-native-ui';

import Application from 'celtics/Application';
import { PixelRatio } from 'react-native';
import html from './web/html';
import js from './web/js';

const REAL_PIXEL_RATIO = PixelRatio.get();

interface Props {
  style?: any;
  onFinish?: (data: any) => void;
}
export default class SignBoard extends PureComponent<Props> {
  private _web: RefObject<WebView> = createRef();
  componentDidMount() {}
  getImage(): Promise<string> {
    return this._web.current
      ? this._web.current.invokeMethod('getImage')
      : Promise.resolve('');
  }
  upload({ url, params }: { url: string; params: any }) {
    return this._web.current
      ? this._web.current.invokeMethod('upload', [url, params])
      : Promise.resolve('');
  }
  clear() {
    this._web.current && this._web.current.invokeMethod('clear');
  }
  render() {
    const { style } = this.props;
    return (
      <View style={style}>
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          scrollEnabled={false}
          containerStyle={{ margin: 0 }}
          source={{
            html: html()
          }}
          ref={this._web}
          injectedJavaScript={js(REAL_PIXEL_RATIO)}
        ></WebView>
      </View>
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    webview: {
      height: '100%',
      width: '100%',
      margin: 0
    }
  };
});
