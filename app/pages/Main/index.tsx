import {Text, View} from 'react-native-ui';

import Page from 'celtics/Page';
import React from 'react';
import {dispatch} from 'febrest';

interface Props {}
export default class Main extends Page<Props> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text>首页</Text>
      </View>
    );
  }
}
