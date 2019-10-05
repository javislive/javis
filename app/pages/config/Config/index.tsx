import Page from 'celtics/Page';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native-ui';
import React from 'react';
import FontIcon from 'components/FontIcon';
import {dispatch} from 'febrest';
import {navigate} from 'controller/app';
import Application from 'celtics/Application';
import button from './button';
function Item({text, routeName}: {text: String; routeName: String}) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={1}
      onPress={() => {
        dispatch(navigate, {routeName});
      }}>
      <View style={styles.itemContent}>
        <View style={styles.itemTextWrapper}>
          <Text style={styles.itemText}>{text}</Text>
        </View>
        <FontIcon icon="&#xe6b2;"></FontIcon>
      </View>
    </TouchableOpacity>
  );
}
export default class Config extends Page {
  static routeConfig = {
    name: 'Config',
    title: '设置',
  };
  render() {
    return (
      <FlatList
        style={styles.wrapper}
        data={button}
        keyExtractor={item => item.text}
        renderItem={({item}) => {
          return <Item text={item.text} routeName={item.routeName} />;
        }}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      />
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      backgroundColor: '#F4F5F7',
    },
    item: {
      height: 44,
      backgroundColor: '#fff',
    },
    itemContent: {
      marginLeft: 20,
      paddingRight: 20,
      flex: 1,
      borderBottomWidth: theme.px,
      borderBottomColor: theme.borderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemTextWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    itemText: {},
  };
});
