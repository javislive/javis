import {Text, TouchableOpacity, View} from 'react-native-ui';

import Application from 'celtics/Application';
import Clock from 'components/javis/Clock';
import MusicPlayer from 'components/javis/MusicPlayer';
import Page from 'celtics/Page';
import React from 'react';
import {dispatch} from 'febrest';

interface Props {}
let socket: number;
export default class Main extends Page<Props> {
  static routeConfig = {
    name: 'Main',
  };
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View style={styles.wrapper}>
        <Clock></Clock>
        <MusicPlayer></MusicPlayer>
      </View>
    );
  }
}

const styles = Application.createStyle(() => {
  return {
    wrapper: {
      flex: 1,
      backgroundColor: '#fff',
    },
  };
});
