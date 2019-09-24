import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native-ui';

import FontIcon from 'components/FontIcon';

export default class MusicPlayer extends PureComponent {
  render() {
    return (
      <View>
        <TouchableOpacity>
          <FontIcon icon="&#xe6aa;"></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity>
          &#xe6b3;
          <FontIcon icon="&#xe6a5;"></FontIcon>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontIcon icon="&#xe6a2;"></FontIcon>
        </TouchableOpacity>
      </View>
    );
  }
}
