import React, { PureComponent } from 'react';
import {
  Animated,
  PanResponder,
  View,
  GestureResponderEvent,
  PanResponderGestureState,
  NativeTouchEvent,
  Easing
} from 'react-native';
import { resize } from 'utils/resize';
import { LayoutEvent } from 'react-navigation';
interface Props {
  isLoop: boolean;
  style?: object;
  onTouched?: (isTouched: boolean) => void;
  onPageSelected?: (page: number) => void;
  renderPage: (
    data: any,
    index: number,
    width: number,
    height: number
  ) => React.ReactElement;
  dataSource: any[];
  pageMargin: number;
  pageInset: {
    horizontal: number;
    vertical: number;
  };
}
interface State {
  width: number;
  height: number;
  currentPage: number;
  dataSource: any[];
  propsDataSource: any[];
  scrollValue: Animated.Value;
}
function setDataSource(isLoop: boolean, dataSource: any[]) {
  dataSource = dataSource.slice();
  if (isLoop && dataSource.length > 1) {
    dataSource.unshift(dataSource[dataSource.length - 1]);
    dataSource.push(dataSource[1]);
  }
  return dataSource;
}
export default class FlatSwiper extends PureComponent<Props> {
  static defaultProps = {
    isLoop: false,
    dataSource: [],
    pageMargin: resize(10),
    pageInset: { horizontal: resize(30), vertical: 0 }
  };
  private touched: boolean = false;
  private _panResponder: any;
  private onTouchedTimeout: any;
  private timestamps: number = 0;
  private x0: number = 0;
  private x1: number = 0;
  private x: number = 0;
  state: State = {
    width: 0,
    height: 0,
    currentPage: 0,
    dataSource: [],
    propsDataSource: [],
    scrollValue: new Animated.Value(1)
  };
  static getDerivedStateFromProps(nextProps: Props, state: State) {
    if (nextProps.dataSource !== state.propsDataSource) {
      const dataSource = setDataSource(nextProps.isLoop, nextProps.dataSource);
      const currentPage =
        nextProps.isLoop && nextProps.dataSource.length > 1 ? 1 : 0;
      const scrollValue = state.scrollValue;
      scrollValue.setValue(state.currentPage);
      const propsDataSource = nextProps.dataSource;
      return {
        dataSource,
        currentPage,
        scrollValue,
        propsDataSource
      };
    }
    return null;
  }
  constructor(props: Props) {
    super(props);
    const { isLoop, dataSource = [] } = this.props;
    this.state.dataSource = setDataSource(isLoop, dataSource);
    this.state.propsDataSource = dataSource;
    const currentPage = isLoop && dataSource.length > 1 ? 1 : 0;
    this.state.currentPage = currentPage;
    this.state.scrollValue.setValue(currentPage);
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (
          Math.abs(gestureState.dx) > Math.abs(1.3 * gestureState.dy) &&
          Math.abs(gestureState.dx) > 2 &&
          !this.touched
        ) {
          this.touched = true;
          this._onMoveStart(event.nativeEvent, gestureState);
        }
        return this.touched;
      },
      onPanResponderMove: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        this.touched && this._onMove(event.nativeEvent, gestureState);
      },
      onPanResponderTerminate: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (this.touched) {
          this.touched = false;
          this._onMoveEnd(event.nativeEvent, gestureState);
        }
      },
      onPanResponderEnd: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (this.touched) {
          this.touched = false;
          this._onMoveEnd(event.nativeEvent, gestureState);
        }
      },
      onPanResponderTerminationRequest: () => {
        return false;
      }
      // onResponderRelease: (t, n) => {
      //   if (this.touched) {
      //     this.touched = false;
      //     this._onMoveEnd(t.nativeEvent, n);
      //   }
      // }
    });
  }
  setPageWithoutAnimation(page: number) {
    const { isLoop, dataSource } = this.props;
    if (page < 0) {
      page = 0;
    }
    if (page > dataSource.length - 1) {
      page = dataSource.length - 1;
    }
    if (isLoop && dataSource.length > 1) {
      page++;
    }
    this.state.scrollValue.setValue(page);
  }
  render() {
    const { isLoop, pageInset, renderPage, style } = this.props;
    const pageInsetHorizontal = pageInset.horizontal;
    const pageInsetVertical = pageInset.vertical;
    const pageMargin = this.props.pageMargin;
    const { height, width } = this.state;
    const itemHeight = height - 2 * pageInsetVertical;
    const itemWidth = width - 2 * pageInsetHorizontal;
    const dataSource = this.state.dataSource;
    const { scrollValue } = this.state;
    const pageCount = dataSource.length;

    const pageMaxIndex = pageCount - 1;
    let children = [];
    children = dataSource.map((item, index) => {
      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: pageMargin,
            height: itemHeight,
            overflow: 'hidden',
            width: itemWidth
          }}
        >
          {renderPage(item, index, itemWidth, itemHeight)}
        </View>
      );
    });
    return (
      <View
        {...this._panResponder.panHandlers}
        onLayout={this._onLayout}
        onTouchEnd={this._onTouchEnd}
        style={[style, { flexDirection: 'row', overflow: 'hidden' }]}
      >
        {dataSource.length > 0 ? (
          <Animated.View
            style={{
              transform: [
                {
                  translateX: scrollValue.interpolate({
                    inputRange: [-1, 0, pageMaxIndex, pageCount],
                    outputRange: [
                      itemWidth / 2,
                      0,
                      -(itemWidth + pageMargin) * pageMaxIndex,
                      -(itemWidth + pageMargin) * pageMaxIndex - itemWidth / 2
                    ]
                  })
                }
              ],
              height,
              alignItems: 'center',
              overflow: 'hidden',
              paddingHorizontal: pageInsetHorizontal,
              flexDirection: 'row'
            }}
          >
            {children}
          </Animated.View>
        ) : null}
      </View>
    );
  }
  private _onMoveStart(
    event: NativeTouchEvent,
    gestureState: PanResponderGestureState
  ) {
    clearTimeout(this.onTouchedTimeout);
    this.props.onTouched && this.props.onTouched(true);
    this.x0 = event.pageX;
    this.x1 = event.pageX;
    this.x = event.pageX;
  }
  private _onMove(
    event: NativeTouchEvent,
    gestureState: PanResponderGestureState
  ) {
    clearTimeout(this.onTouchedTimeout);
    this.props.onTouched && this.props.onTouched(true);
    this.timestamps = Date.now();
    this.x = this.x1;
    this.x1 = event.pageX;
    this.state.scrollValue.setValue(
      -gestureState.dx / this.state.width + this.state.currentPage
    );
  }
  private _onMoveEnd(
    event: NativeTouchEvent,
    gestureState: PanResponderGestureState
  ) {
    const { dataSource, currentPage, width } = this.state;
    const pageCount = dataSource.length;
    const duration = Date.now() - this.timestamps;
    const dx = -gestureState.dx;
    let isEnd = false;
    let bange = 0;
    if (dx >= width / 3 && currentPage < pageCount - 1) {
      isEnd = true;
      bange = 1;
    } else if (dx <= width / -3 && currentPage !== 0) {
      isEnd = true;
      bange = -1;
    } else if (
      duration < 20 &&
      dx / duration > 0.5 &&
      currentPage < pageCount - 1
    ) {
      isEnd = true;
      bange = 1;
    } else if (duration < 20 && dx / duration < -0.5 && 0 != currentPage) {
      isEnd = true;
      bange = -1;
    }
    this.x0 = 0;
    this.x1 = 0;
    this.timestamps = 0;
    this.state.currentPage = this.state.currentPage + bange;

    Animated.timing(this.state.scrollValue, {
      toValue: this.state.currentPage,
      easing: Easing.bezier(0.32, 0.66, 0.48, 0.76),
      duration: 300 * (1 - Math.abs(dx) / width)
    }).start(() => {
      const { isLoop } = this.props;

      const { dataSource, currentPage, scrollValue } = this.state;
      const pageCount = dataSource.length;
      if (isLoop && 0 === currentPage) {
        this.state.currentPage = pageCount - 2;
        scrollValue.setValue(this.state.currentPage);
      } else if (isLoop && currentPage === pageCount - 1) {
        this.state.currentPage = 1;
        scrollValue.setValue(1);
      }
      let page = this.state.currentPage;
      if (isLoop && dataSource.length > 1) {
        page--;
      }
      this.props.onPageSelected && this.props.onPageSelected(page);
      clearTimeout(this.onTouchedTimeout);
      this.onTouchedTimeout = setTimeout(() => {
        return this.props.onTouched && this.props.onTouched(false);
      }, 100);
    });
  }
  private _onLayout = (event: LayoutEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({
        height,
        width
      });
    }
  };
  private _onTouchEnd = () => {
    const { onTouched } = this.props;
    this.onTouchedTimeout = setTimeout(function() {
      return onTouched && onTouched(false);
    }, 100);
  };
}
