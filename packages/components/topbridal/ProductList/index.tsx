import { FlatList, Image, Text, View } from 'react-native-ui';
import {
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import React, { PureComponent } from 'react';
import { resize, vw } from 'utils/resize';

import ListPlaceHolder from '../ListPlaceholder';
import ProductItem from 'components/topbridal/ProductItem';
import { createStyle } from 'themes';
import { dispatch } from 'febrest';

interface Props<T = {}> extends FlatListProps<T> {
  onLoad?: () => Promise<null>;
  forwardRef?: any;
  onItemPress?: (item: any) => void;
  itemBackgroundColor?: string;
  hasFavorite?: boolean;
}
class ProductList<ItemT> extends PureComponent<Props<ItemT>> {
  state = {
    isLoading: false
  };
  render() {
    const props = this.props;
    return (
      <View style={[styles.wrapper, props.style]}>
        <FlatList
          {...props}
          numColumns={3}
          contentContainerStyle={[
            styles.contentStyle,
            styles.userCenterPadding,
            props.contentContainerStyle
          ]}
          showsVerticalScrollIndicator={false}
          style={{ height: '100%' }}
          ref={props.forwardRef}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.2}
          columnWrapperStyle={styles.columnWrapperStyle}
          ListEmptyComponent={this._emptyView()}
        />
      </View>
    );
  }
  _keyExtractor = (item: ItemT, index: number) => {
    if (this.props.keyExtractor) {
      return this.props.keyExtractor(item, index);
    } else {
      return index + '';
    }
  };
  _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      nativeEvent: {
        layoutMeasurement: { height: layoutHeight },
        contentSize: { height: contentHeight },
        contentOffset: { y }
      }
    } = event;
    if (y + layoutHeight + 100 >= contentHeight) {
      this._loadMore();
    }
  };
  _onEndReached = () => {
    this._loadMore();
  };
  _loadMore() {
    const { isLoading } = this.state;
    const { onLoad } = this.props;
    if (isLoading) {
      return;
    }
    onLoad &&
      onLoad().then(
        () => {
          this.setState({
            isLoading: false
          });
        },
        () => {
          this.setState({
            isLoading: false
          });
        }
      );
  }
  _renderItem = ({ item, index }) => {
    const { onItemPress, itemBackgroundColor = '#fff' } = this.props;
    return (
      <ProductItem
        data={item}
        hasFavorite={this.props.hasFavorite}
        style={{
          marginRight: index % 3 == 2 ? null : resize(15),
          backgroundColor: itemBackgroundColor
        }}
        onPress={() => {
          if (onItemPress) {
            return onItemPress(item);
          }
          dispatch('app.navigate', {
            routeName: 'BridalDetail',
            params: {
              id: item.id
            }
          });
          dispatch('app.hideUserCenter');
        }}
      />
    );
  };
  _emptyView() {
    return <ListPlaceHolder />;
  }
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      paddingTop: resize(20),
      backgroundColor: 'transparent'
    },
    contentStyle: {
      backgroundColor: 'transparent'
    },
    columnWrapperStyle: {},
    userCenterPadding: {
      paddingBottom: theme.userCenterHeaderHeight
    }
  };
});
export default React.forwardRef((props: Props, ref) => {
  return <ProductList {...props} forwardRef={ref} />;
});
