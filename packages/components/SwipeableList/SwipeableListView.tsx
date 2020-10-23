import React from 'react';
import {
  ListView,
  ListViewProps,
} from 'react-native';
import SwipeableListViewDataSource from './SwipeableListViewDataSource';
import SwipeableRow from './SwipeableRow';

// interface Props extends ListViewProps {
interface Props {
  ...ListViewProps: any,
  /**
   * To alert the user that swiping is possible, the first row can bounce
   * on component mount.
   */
  bounceFirstRowOnMount: boolean,
  /**
   * Use `SwipeableListView.getNewDataSource()` to get a data source to use,
   * then use it just like you would a normal ListView data source
   */
  dataSource: SwipeableListViewDataSource,
  /**
   * Maximum distance to open to after a swipe
   */
  maxSwipeDistance:
  | number
  | ((rowData: Object, sectionID: string, rowID: string) => number),
  onScroll?: Function,
  /**
   * Callback method to render the swipeable view
   */
  renderRow: (
    rowData: Object,
    sectionID: string,
    rowID: string,
  ) => React.ReactElement<any>,
  /**
   * Callback method to render the view that will be unveiled on swipe
   */
  renderQuickActions: (
    rowData: Object,
    sectionID: string,
    rowID: string,
  ) => React.ReactElement<any>,
};

interface State {
  dataSource: Object,
};

export default class SwipeableListView extends React.Component<Props, State> {
  props: Props;
  state: State;

  _listViewRef = null;
  _shouldBounceFirstRowOnMount: boolean = false;

  static getNewDataSource(): Object {
    return new SwipeableListViewDataSource({
      getRowData: (data: any, sectionID: any, rowID: any) => data[sectionID][rowID],
      getSectionHeaderData: (data: any, sectionID: any) => data[sectionID],
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
      sectionHeaderHasChanged: (s1: any, s2: any) => s1 !== s2,
    });
  }

  static defaultProps = {
    bounceFirstRowOnMount: false,
    renderQuickActions: () => null,
  };

  constructor(props: Props, context: any): void {
    super(props, context);

    this._shouldBounceFirstRowOnMount = this.props.bounceFirstRowOnMount;
    this.state = {
      dataSource: this.props.dataSource,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (
      this.state.dataSource.getDataSource() !==
      nextProps.dataSource.getDataSource()
    ) {
      this.setState({
        dataSource: nextProps.dataSource,
      });
    }
  }

  render(): React.ReactNode {
    return (
      // $FlowFixMe Found when typing ListView
      <ListView
        {...this.props}
        ref={ref => {
          // $FlowFixMe Found when typing ListView
          this._listViewRef = ref;
        }}
        dataSource={this.state.dataSource.getDataSource()}
        onScroll={this._onScroll}
        renderRow={this._renderRow}
      />
    );
  }

  _onScroll = (e): void => {
    // Close any opens rows on ListView scroll
    if (this.props.dataSource.getOpenRowID()) {
      this.setState({
        dataSource: this.state.dataSource.setOpenRowID(null),
      });
    }
    this.props.onScroll && this.props.onScroll(e);
  };

  /**
   * This is a work-around to lock vertical `ListView` scrolling on iOS and
   * mimic Android behaviour. Locking vertical scrolling when horizontal
   * scrolling is active allows us to significantly improve framerates
   * (from high 20s to almost consistently 60 fps)
   */
  _setListViewScrollable(value: boolean): void {
    if (
      this._listViewRef &&
      /* $FlowFixMe(>=0.68.0 site=react_native_fb) This comment suppresses an
      * error found when Flow v0.68 was deployed. To see the error delete this
      * comment and run Flow. */
      typeof this._listViewRef.setNativeProps === 'function'
    ) {
      this._listViewRef.setNativeProps({
        scrollEnabled: value,
      });
    }
  }

  // Passing through ListView's getScrollResponder() function
  getScrollResponder(): Object {
    if (
      this._listViewRef &&
      /* $FlowFixMe(>=0.68.0 site=react_native_fb) This comment suppresses an
      * error found when Flow v0.68 was deployed. To see the error delete this
      * comment and run Flow. */
      typeof this._listViewRef.getScrollResponder === 'function'
    ) {
      return this._listViewRef.getScrollResponder();
    }
  }

  // This enables rows having variable width slideoutView.
  _getMaxSwipeDistance(
    rowData: Object,
    sectionID: string,
    rowID: string,
  ): number {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(rowData, sectionID, rowID);
    }

    return this.props.maxSwipeDistance;
  }

  _renderRow = (
    rowData: Object,
    sectionID: string,
    rowID: string,
  ): React.ReactElement<any> => {
    const slideoutView = this.props.renderQuickActions(
      rowData,
      sectionID,
      rowID,
    );

    // If renderQuickActions is unspecified or returns falsey, don't allow swipe
    if (!slideoutView) {
      return this.props.renderRow(rowData, sectionID, rowID);
    }

    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = rowID === this.props.dataSource.getFirstRowID();
    }

    return (
      <SwipeableRow
        slideoutView={slideoutView}
        isOpen={rowData.id === this.props.dataSource.getOpenRowID()}
        maxSwipeDistance={this._getMaxSwipeDistance(rowData, sectionID, rowID)}
        key={rowID}
        onOpen={() => this._onOpen(rowData.id)}
        onClose={() => this._onClose(rowData.id)}
        onSwipeEnd={() => this._setListViewScrollable(true)}
        onSwipeStart={() => this._setListViewScrollable(false)}
        shouldBounceOnMount={shouldBounceOnMount}>
        {this.props.renderRow(rowData, sectionID, rowID)}
      </SwipeableRow>
    );
  };

  _onOpen(rowID: string): void {
    this.setState({
      dataSource: this.state.dataSource.setOpenRowID(rowID),
    });
  }

  _onClose(rowID: string): void {
    this.setState({
      dataSource: this.state.dataSource.setOpenRowID(null),
    });
  }
}
