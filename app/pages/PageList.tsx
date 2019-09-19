import { FlatList, Text, TouchableOpacity } from 'react-native';

import React from 'react';
import pages from './index';
import Page, { PageClass } from 'components/application/Page';
import Application from 'components/application/Application';
import { dispatch } from 'febrest';
interface Props {}
export default class PageList extends Page<Props> {
  constructor(props: any) {
    super(props);
  }
  renderItem({ item }: { item: PageClass }) {
    return (
      <TouchableOpacity
        style={{
          height: 60,
          paddingLeft: 20,
          borderBottomWidth: Application.getTheme().px,
          borderBottomColor: '#fefefe',
          justifyContent: 'center'
        }}
        key={item.name}
        onPress={() => {
          dispatch('app.navigate', { routeName: item.name });
        }}
      >
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
