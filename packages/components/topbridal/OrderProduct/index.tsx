import { Image, Text, TouchableOpacity, View } from 'react-native-ui';
import React, { PureComponent } from 'react';
import { resize } from 'utils/resize';

import { createStyle } from 'themes';

interface Props {
  source: any;
  onPress?: () => void;
  style?: any;
}

export default class OrderProduct extends PureComponent<Props> {
  render() {
    const { source = {}, onPress, style = {} } = this.props;
    return (
      <View style={[styles.wrapper, style]}>
        <TouchableOpacity onPress={onPress} style={styles.content}>
          <Image
            style={styles.image}
            resizeMode="stretch"
            source={{ uri: source.img_url }}
          />
          <View style={styles.info}>
            <Text style={styles.text1}>{source.brand_name}</Text>
            <Text style={styles.text1}>{source.sn}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{source.category_name}</Text>
          </View>
          <View style={[styles.tag, { top: resize(30) }]}>
            <Text style={styles.tagText}>{source.color}</Text>
          </View>
          <View style={[styles.tag, { top: resize(50) }]}>
            <Text style={styles.tagText}>{source.size}</Text>
          </View>
          <View style={styles.storeName}>
            <Text style={styles.tagText}>{source.store_name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = createStyle(theme => {
  const width = resize(150);
  const height = resize(253);
  return {
    wrapper: {
      height,
      width,
      backgroundColor: '#fff',
      borderRadius: resize(10),
      overflow: 'hidden',
      marginBottom: resize(17)
    },
    content: {
      width,
      height
    },
    image: {
      width,
      height: resize(200)
    },
    info: {
      backgroundColor: '#F3F4F7',
      paddingHorizontal: resize(8),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text1: {
      fontSize: resize(13),
      color: '#3A3A3A',
      textAlign: 'center'
    },
    tag: {
      position: 'absolute',
      left: resize(7),
      top: resize(9),
      paddingHorizontal: resize(5),
      minWidth: resize(32),
      height: resize(15),
      borderRadius: resize(15),
      backgroundColor: '#82704A',
      justifyContent: 'center',
      alignItems: 'center'
    },
    star: {
      position: 'absolute',
      right: 0,
      top: resize(6),
      height: resize(28),
      width: resize(28),
      justifyContent: 'center',
      alignItems: 'center'
    },
    innerStar: {
      position: 'absolute',
      top: 1,
      left: 1,
      height: resize(16),
      width: resize(16),
      textAlign: 'center',
      lineHeight: resize(16),
      color: '#82704A',
      fontSize: resize(16)
    },
    starBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: resize(18),
      width: resize(18),
      textAlign: 'center',
      lineHeight: resize(18),
      color: '#fff',
      fontSize: resize(18)
    },
    tagText: {
      color: '#fff',
      fontSize: resize(9)
    },
    storeName: {
      position: 'absolute',
      bottom: resize(53),
      left: 0,
      right: 0,
      backgroundColor: '#82704A',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };
});
