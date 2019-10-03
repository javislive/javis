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
            <Text>端口号</Text>
          </View>
          <TextInput></TextInput>
        </View>
      </View>
    );
  }
}
