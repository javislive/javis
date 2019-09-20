import {FlatList, Text, TouchableOpacity} from 'react-native';
import Page, {PageClass} from 'celtics/Page';

import Application from 'celtics/Application';
import React from 'react';
import {dispatch} from 'febrest';
import pages from './index';
import {navigate} from 'controller/app';
interface Props {}
export default class PageList extends Page<Props> {
  constructor(props: any) {
    super(props);
  }
  renderItem({item}: {item: PageClass}) {
    return (
      <TouchableOpacity
        style={{
          height: 60,
          paddingLeft: 20,
          borderBottomWidth: Application.getTheme().px,
          borderBottomColor: '#fefefe',
          justifyContent: 'center',
        }}
        key={item.name}
        onPress={() => {
          dispatch(navigate, {routeName: item.name});
        }}>
        <Text>{item.name}</Text>
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
