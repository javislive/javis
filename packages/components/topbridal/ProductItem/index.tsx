import { Image, Text, TouchableOpacity, View } from 'react-native-ui';
import React, { PureComponent } from 'react';
import { resize, vm } from 'utils/resize';

import BuildConfig from 'BuildConfig';
import FontIcon from 'components/FontIcon';
import { createStyle } from 'themes';
import { dispatch } from 'febrest';

interface Props {
  data: any;
  onPress?: () => void;
  style?: any;
  hasFavorite?: boolean;
  children?: JSX.Element | JSX.Element[];
}
export default class ProductItem extends PureComponent<Props> {
  render() {
    const { data = {}, onPress, style, hasFavorite, children } = this.props;
    return (
      <View style={[styles.wrapper, style]}>
        <TouchableOpacity onPress={onPress} style={styles.content}>
          <Image
            style={styles.image}
            resizeMode="stretch"
            source={{ uri: data.img_url }}
          />
          <View style={styles.info}>
            <Text style={styles.text1}>{data.brand_name}</Text>
            <Text style={styles.text1}>{data.sn}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{data.category_name}</Text>
          </View>
          <View style={[styles.tag, { top: resize(30) }]}>
              <Text style={styles.tagText}>{data.color}</Text>
          </View>
          {
            data.size && BuildConfig.platform === 'b' ? (
              <View style={[styles.tag, { top: resize(50) }]}>
                <Text style={styles.tagText}>{data.size}</Text>
              </View>
            ) : null
          }
          {
            data.store_name ? (
              <View style={styles.storeName}>
                <Text style={styles.tagText}>{data.store_name}</Text>
              </View>
            ) : null
          }
          {hasFavorite ? (
            <TouchableOpacity
              onPress={this._toggleFav}
              activeOpacity={1}
              style={styles.star}
            >
              <FontIcon
                icon="&#xe839;"
                color="#fff"
                style={styles.starBorder}
              />
              <FontIcon
                icon="&#xe908;"
                color="#82704A"
                style={styles.innerStar}
              />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
        {children}
      </View>
    );
  }
  _toggleFav = () => {
    const { data = {} } = this.props;
    dispatch('user.removeFav', data.id).then(() => {
      dispatch('app.toast', { message: '取消收藏' });
    });
  };
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
      paddingHorizontal: resize(8),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
      // alignItems: 'flex-end',
    },
    text1: {
      fontSize: resize(13),
      color: '#3A3A3A',
      textAlign: 'center'
      // textAlign:'right'
    },
    tag: {
      position: 'absolute',
      left: resize(7),
      top: resize(9),
      paddingHorizontal: resize(5),
      minWidth: resize(32),
      height: resize(15),
      borderRadius: resize(15),
      // borderColor: '#fff',
      // borderWidth: 2,
      // backgroundColor: '#282828',
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
