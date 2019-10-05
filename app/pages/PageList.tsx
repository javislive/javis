import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Page, {PageClass} from 'celtics/Page';

import Application from 'celtics/Application';
import React from 'react';
import {dispatch} from 'febrest';
import pages from './index';
import {navigate} from 'controller/app';
interface Props {}
export default class PageList extends Page<Props> {
  static routeConfig = {
    name: 'PageList',
    header: null,
  };
  constructor(props: any) {
    super(props);
  }
  renderItem({item}: {item: PageClass}) {
    return (
      <TouchableOpacity
        style={{
          height: 44,
          paddingLeft: 20,
        }}
        onPress={() => {
          dispatch(navigate, {routeName: item.name});
        }}>
        <View
          style={{
            flex: 1,
            borderBottomWidth: Application.getTheme().px,
            borderBottomColor: Application.getTheme().borderColor,
            justifyContent: 'center',
          }}>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <FlatList
        keyExtractor={item => item.name}
        data={pages}
        renderItem={item => this.renderItem(item)}
      />
    );
  }
}
