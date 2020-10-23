import { FlatList, View } from 'react-native-ui';

import Application from 'celtics/Application';
import ImageButton from '../ImageButton';
import { PureComponent } from 'react';
import React from 'react';
import { resize } from 'utils/resize';

interface Props {
  style?: any;
  contentContainerStyle?: any;
  itemStyle?: any;
  data: any[];
  ListFooterComponent?: JSX.Element | null;
  onItemPress?: (item: any) => void;
}
export default class ClassifyList extends PureComponent<Props> {
  render() {
    const {
      style,
      contentContainerStyle,
      data,
      ListFooterComponent
    } = this.props;
    return (
      <FlatList
        data={data}
        numColumns={2}
        contentContainerStyle={[styles.contentStyle, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        style={[styles.wrapper, style]}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={ListFooterComponent}
        columnWrapperStyle={styles.columnWrapperStyle}
      />
    );
  }
  private _keyExtractor = (item: any, index: number) => {
    return index + '';
  };
  private _renderItem = ({ item, index }: { item: any; index: number }) => {
    const uri = item.image || item.image_path;
    const { onItemPress, itemStyle } = this.props;
    return (
      <ImageButton
        style={itemStyle}
        title={item.name}
        onPress={() => onItemPress && onItemPress(item)}
        source={uri ? { uri } : null}
      />
    );
  };
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      backgroundColor: '#fff',
      height: '100%',
      paddingVertical: resize(23)
    },
    contentStyle: {
      backgroundColor: 'transparent'
    },
    columnWrapperStyle: {
      justifyContent: 'space-between'
    }
  };
});
