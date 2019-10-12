import {State, dispatch} from 'febrest';
import {Text, View} from 'react-native-ui';
import {navigationGoBack, setConfig} from 'controller/app';

import Application from 'celtics/Application';
import ConfigContext from 'context/ConfigContext';
import ConnectType from 'constants/ConnectType';
import Item from 'components/javis/ListItem';
import Page from 'celtics/Page';
import React from 'react';
import TextInput from 'components/TextInput';
import state from 'state';

const CONNECT_TYPE_TEXT = {
  [ConnectType.ALWAYS]: {
    value: ConnectType.ALWAYS,
    text: '所有网络',
  },
  [ConnectType.SPECIFY]: {
    value: ConnectType.SPECIFY,
    text: '指定WIFI',
  },
};
export default class Net extends Page {
  constructor(props: any) {
    super(props);
    const net = State(state.config).get().net;
    this.state = {
      ...net,
    };
  }
  static routeConfig = {
    name: 'Net',
    title: '网络',
  };
  state = {
    port: '',
    ip: '',
    connectType: '',
  };
  renderHeaderRightButton() {
    return '完成';
  }
  onHeaderRightButtonPress() {
    this.commit();
  }

  render() {
    const {port, ip, connectType} = this.state;
    return (
      <View style={styles.wrapper}>
        <Item title="连接方式" onPress={this._showConnectTypePicker}>
          <Text style={{flex: 1}}>{this._getConnectTypeText(connectType)}</Text>
        </Item>
        <Item title="服务器地址">
          <TextInput
            placeholder="服务器地址"
            style={{flex: 1}}
            value={ip + ''}
            onChangeText={v => {
              this.setState({ip: v});
            }}></TextInput>
        </Item>
        <Item title="端口号">
          <TextInput
            placeholder="端口号"
            style={{flex: 1}}
            value={port + ''}
            onChangeText={v => {
              this.setState({port: v});
            }}></TextInput>
        </Item>
      </View>
    );
  }
  private commit() {
    dispatch(setConfig, {net: {port: this.state.port, ip: this.state.ip}});
    dispatch(navigationGoBack);
  }
  private _getConnectTypeText(type: string): string {
    const v = CONNECT_TYPE_TEXT[type];
    if (v) {
      return v.text;
    }
    return '';
  }
  private _showConnectTypePicker() {}
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
  };
});
