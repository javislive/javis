import Page from 'celtics/Page';
import {View, Text} from 'react-native-ui';
import TextInput from 'components/TextInput';
import React from 'react';
export default class BaseConfig extends Page {
  static routeConfig = {
    name: 'BaseConfig',
  };
  render() {
    return (
      <View>
        <View>
          <View>
            <Text>服务器地址</Text>
          </View>
          <TextInput></TextInput>
        </View>
        <View>
          <View>
            <Text>服务器端口</Text>
          </View>
          <TextInput></TextInput>
        </View>
        <View>
          <View>
            <Text>连接事件</Text>
          </View>
          <TextInput></TextInput>
        </View>
        <View>
          <View>
            <Text>连接动作</Text>
          </View>
          <TextInput></TextInput>
        </View>
      </View>
    );
  }
}
