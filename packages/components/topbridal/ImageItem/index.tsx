import { Image, TouchableOpacity, View } from 'react-native-ui';

import Application from 'celtics/Application';
import React from 'react';
import { resize } from 'utils/resize';

interface Props {
  source: any;
  style?: any;
  onLongPress?: () => void;
  onPress?: () => void;
  children?: JSX.Element | JSX.Element[];
}
export default function ImageItem({
  source,
  style,
  onLongPress,
  children,
  onPress
}: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        onLongPress={onLongPress}
      >
        <Image source={source} style={styles.image} />
      </TouchableOpacity>
      {children}
    </View>
  );
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      height: resize(180),
      width: resize(149),
      borderRadius: resize(9),
      overflow: 'hidden',
      marginBottom: resize(16),
      backgroundColor: 'rgba(220,220,220,0.3)'
    },
    button: {
      height: '100%',
      width: '100%'
    },
    image: {
      height: '100%',
      width: '100%'
    }
  };
});
