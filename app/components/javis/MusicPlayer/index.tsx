import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native-ui';

import Application from 'celtics/Application';
import FontIcon from 'components/FontIcon';
import {resize} from 'utils/resize';

//          &#xe6b3;

export default class MusicPlayer extends PureComponent {
  render() {
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button}>
          <FontIcon icon="&#xe6aa;" size={50} color="#fb3c4b"></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FontIcon icon="&#xe6a5;" size={50} color="#fb3c4b"></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
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
