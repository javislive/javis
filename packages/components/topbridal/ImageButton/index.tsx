import { Image, Text, TouchableOpacity, View } from 'react-native-ui';

import Application from 'celtics/Application';
import React from 'react';
import { resize } from 'utils/resize';

interface Props {
  source?: any;
  onPress?: () => void;
  title?: string;
  style?: any;
  children?: JSX.Element;
  overlay?: boolean;
}
export default function ImageButton({
  source,
  onPress,
  title,
  style,
  children,
  overlay = true
}: Props) {
  return (
    <View
      style={[
        styles.filterItem,
        style
        // !source ? { backgroundColor: '#82704Abb' } : null
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={styles.filterItemBg}
          resizeMode="stretch"
        />
      ) : null}

      {overlay ? <View style={styles.filterTitleBg} /> : null}
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={onPress}
      >
        {children ? (
          children
        ) : (
          <Text style={styles.filterItemTitle}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = Application.createStyle(theme => {
  return {
    filterItem: {
      width: resize(222),
      height: resize(130),
      borderRadius: resize(10),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: 'transparent',
      marginBottom: resize(14)
    },
    filterItemBg: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      right: 0
    },
    filterTitleBg: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(40,40,40,0.5)',
      top: 0,
      right: 0
    },
    filterItemTitle: {
      fontSize: resize(20),
      color: '#fff',
      textAlign: 'center'
    }
  };
});
