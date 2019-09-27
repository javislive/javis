import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native-ui';
import {nextSong, playStop, preSong} from 'controller/music';

import Application from 'celtics/Application';
import FontIcon from 'components/FontIcon';
import {dispatch} from 'febrest';
import {resize} from 'utils/resize';

//          &#xe6b3;

export default class MusicPlayer extends PureComponent {
  render() {
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => dispatch(preSong)}
          style={styles.button}>
          <FontIcon icon="&#xe6aa;" size={50} color="#fb3c4b"></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => dispatch(playStop)}
          style={styles.button}>
          <FontIcon icon="&#xe6a5;" size={50} color="#fb3c4b"></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => dispatch(nextSong)}
          style={styles.button}>
          <FontIcon icon="&#xe6a2;" size={50} color="#fb3c4b"></FontIcon>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      height: 100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      height: resize(60),
      marginHorizontal: resize(10),
    },
  };
});
