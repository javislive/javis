import Page from 'celtics/Page';
import {View} from 'react-native-ui';
import React from 'react';
import Item from 'components/javis/ListItem';
import TextInput from 'components/TextInput';
import ConfigContext from 'context/ConfigContext';
import Application from 'celtics/Application';
import {State, dispatch} from 'febrest';
import state from 'state';
import {setConfig, navigationGoBack} from 'controller/app';
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
  };
  renderHeaderRightButton() {
    return '完成';
  }
  onHeaderRightButtonPress() {
    this.commit();
  }

  render() {
    const {port} = this.state;
    return (
      <View style={styles.wrapper}>
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
    dispatch(setConfig, {net: {port: this.state.port}});
    dispatch(navigationGoBack);
  }
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
  };
});
