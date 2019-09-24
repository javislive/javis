import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native-ui';

import FontIcon from 'components/FontIcon';

export default class MusicPlayer extends PureComponent {
  render() {
    return (
      <View>
        <TouchableOpacity>
          <FontIcon icon=""></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontIcon icon=""></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontIcon icon=""></FontIcon>
        </TouchableOpacity>
      </View>
    );
  }
}
