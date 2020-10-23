import React from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
} from 'react-native';
import SwipeableRow from './SwipeableRow';

interface SwipableListProps<ItemT> {
  /**
   * To alert the user that swiping is possible, the first row can bounce
   * on component mount.
   */
  bounceFirstRowOnMount: boolean,

  /**
   * Maximum distance to open to after a swipe
   */
  maxSwipeDistance: number,

  /**
   * Callback method to render the view that will be unveiled on swipe
   */
  renderQuickActions: ListRenderItem<ItemT>,
};

// interface Props<ItemT> {
//   ...SwipableListProps<ItemT>: any,
//   ...FlatListProps<ItemT>: any,
// };

type Props<ItemT> = SwipableListProps<ItemT> & FlatListProps<ItemT>;

interface State {
  openRowKey: string,
};

export default class SwipeableFlatList<ItemT> extends React.Component<Props<ItemT>, State> {
  _flatListRef: FlatList<ItemT> = null;
  _shouldBounceFirstRowOnMount: boolean = false;

  static defaultProps = {
    ...FlatList.defaultProps,
    bounceFirstRowOnMount: true,
    renderQuickActions: () => null,
  };

  constructor(props: Props<ItemT>, context: any): void {
    super(props, context);
    this.state = {
      openRowKey: null,
    };

    this._shouldBounceFirstRowOnMount = this.props.bounceFirstRowOnMount;
  }

  render(): React.ReactNode {
    return (
      <FlatList
        {...this.props}
        ref={ref => {
          this._flatListRef = ref;
        }}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
        extraData={this.state}
      />
    );
  }

  _onScroll = (e): void => {
    // Close any opens rows on ListView scroll
    if (this.state.openRowKey) {
      this.setState({
        openRowKey: null,
      });
    }

    this.props.onScroll && this.props.onScroll(e);
  };

  _renderItem = (info: Object): React.ReactElement<any> => {
    const slideoutView = this.props.renderQuickActions(info);
    const key = this.props.keyExtractor(info.item, info.index);

    // If renderQuickActions is unspecified or returns falsey, don't allow swipe
    if (!slideoutView) {
      return this.props.renderItem(info);
    }

    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = true;
    }

    return (
      <SwipeableRow
        slideoutView={slideoutView}
        isOpen={key === this.state.openRowKey}
        maxSwipeDistance={this._getMaxSwipeDistance(info)}
        onOpen={() => this._onOpen(key)}
        onClose={() => this._onClose(key)}
        shouldBounceOnMount={shouldBounceOnMount}
        onSwipeEnd={this._setListViewScrollable}
        onSwipeStart={this._setListViewNotScrollable}>
        {this.props.renderItem(info)}
      </SwipeableRow>
    );
  };

  // This enables rows having variable width slideoutView.
  _getMaxSwipeDistance(info: Object): number {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(info);
    }

    return this.props.maxSwipeDistance;
  }

  _setListViewScrollableTo(value: boolean) {
    if (this._flatListRef) {
      this._flatListRef.setNativeProps({
        scrollEnabled: value,
      });
    }
  }

  _setListViewScrollable = () => {
    this._setListViewScrollableTo(true);
  };

  _setListViewNotScrollable = () => {
    this._setListViewScrollableTo(false);
  };

  _onOpen(key: any): void {
    this.setState({
      openRowKey: key,
    });
  }

  _onClose(key: any): void {
    this.setState({
      openRowKey: null,
    });
  }
}
