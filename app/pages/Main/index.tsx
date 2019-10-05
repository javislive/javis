import {Text, TouchableOpacity, View} from 'react-native-ui';

import Application from 'celtics/Application';
import Clock from 'components/javis/Clock';
import MusicPlayer from 'components/javis/MusicPlayer';
import Page from 'celtics/Page';
import React from 'react';
import {dispatch} from 'febrest';
import FontIcon from 'components/FontIcon';
import {navigate} from 'controller/app';

interface Props {}
let socket: number;
export default class Main extends Page<Props> {
  static routeConfig = {
    name: 'Main',
    header: null,
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
        <TouchableOpacity
          style={styles.settionButton}
          onPress={() => {
            dispatch(navigate, {routeName: 'Config'});
          }}>
          <FontIcon icon="&#xe6df;" size={20} color="#3A3A3A"></FontIcon>
        </TouchableOpacity>
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
    settionButton: {
      position: 'absolute',
      top: 0,
      right: 20,
      height: 44,
      width: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});
