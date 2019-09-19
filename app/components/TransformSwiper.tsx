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
  header?: React.ReactElement;
  style?: object;
  scale?: boolean;
  itemBorderImage: any;
  itemBorderImageWidth: number;
  onTouched?: (isTouched: boolean) => void;
  renderPage: (data: any, index: number) => React.ReactElement;
  renderBackground?: (data: any, index: number) => React.ReactElement;
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
  scrollValue: Animated.Value;
}
export default class TransformSwiper extends PureComponent<Props> {
  static defaultProps = {
    isLoop: false,
    dataSource: [],
    pageMargin: 10,
    pageInset: { horizontal: 30, vertical: 30 }
  };
  static getDerivedStateFromProps() {}
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
    currentPage: 1,
    dataSource: [],
    scrollValue: new Animated.Value(1)
  };
  constructor(props: Props) {
    super(props);
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
  render() {
    const {
      isLoop,
      pageInset,
      renderBackground,
      renderPage,
      onTouched,
      style,
      header,
      scale,
      itemBorderImage,
      itemBorderImageWidth
    } = this.props;
    const pageInsetHorizontal = pageInset.horizontal;
    const pageInsetVertical = pageInset.vertical;
    const pageMargin = this.props.pageMargin - resize(10);
    const { height, width } = this.state;
    const itemHeight = height - 2 * pageInsetVertical + resize(10);
    const itemWidth = width - 2 * pageInsetHorizontal + resize(10);
    const dataSource = this.props.dataSource.slice();
    if (isLoop && dataSource.length > 1) {
      dataSource.unshift(dataSource[dataSource.length - 1]);
      dataSource.push(dataSource[1]);
    }
    const { scrollValue } = this.state;
    const pageCount = dataSource.length;
    this.state.dataSource = dataSource;
    const pageMaxIndex = pageCount - 1;
    let children = [];
    children = dataSource.map((item, index) => {
      return (
        <Animated.Image
          key={index}
          resizeMode="stretch"
          source={itemBorderImage}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            marginRight: pageMargin,
            padding: resize(itemBorderImageWidth),
            height: scale
              ? scrollValue.interpolate({
                  inputRange: [-(1 / 0), index - 1, index, index + 1, 1 / 0],
                  outputRange: [
                    0 == index ? itemHeight : 0.8 * itemHeight,
                    0 == index ? itemHeight : 0.8 * itemHeight,
                    itemHeight,
                    index == pageMaxIndex ? itemHeight : 0.8 * itemHeight,
                    index == pageMaxIndex ? itemHeight : 0.8 * itemHeight
                  ]
                })
              : itemHeight,
            width: scale
              ? scrollValue.interpolate({
                  inputRange: [-(1 / 0), index - 1, index, index + 1, 1 / 0],
                  outputRange: [
                    0 == index ? itemWidth : 0.8 * itemWidth,
                    0 == index ? itemWidth : 0.8 * itemWidth,
                    itemWidth,
                    index == pageMaxIndex ? itemWidth : 0.8 * itemWidth,
                    index == pageMaxIndex ? itemWidth : 0.8 * itemWidth
                  ]
                })
              : itemWidth
          }}
        >
          <Animated.View
            style={{
              height: itemHeight - resize(itemBorderImageWidth * 2),
              overflow: 'hidden',
              width: itemWidth - resize(itemBorderImageWidth * 2),
              backgroundColor: 'transparent',
              flexDirection: 'row',
              transform: scale
                ? [
                    {
                      scale: scrollValue.interpolate({
                        inputRange: [
                          -(1 / 0),
                          index - 1,
                          index,
                          index + 1,
                          1 / 0
                        ],
                        outputRange: [
                          0 == index ? 1 : 0.8,
                          0 == index ? 1 : 0.8,
                          1,
                          index == pageMaxIndex ? 1 : 0.8,
                          index == pageMaxIndex ? 1 : 0.8
                        ]
                      })
                    }
                  ]
                : null
            }}
          >
            {renderPage(item, index)}
          </Animated.View>
        </Animated.Image>
      );
    });
    const backgrounds = renderBackground
      ? dataSource.map((data, index) => {
          return (
            <Animated.View
              key={'background_' + index}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                opacity: scrollValue.interpolate({
                  inputRange: [-(1 / 0), index - 1, index, index + 1, 1 / 0],
                  outputRange: [
                    0 == index ? 0.64 : 0,
                    0 == index ? 0.64 : 0,
                    0.64,
                    index == pageMaxIndex ? 0.64 : 0,
                    index == pageMaxIndex ? 0.64 : 0
                  ]
                })
              }}
            >
              {renderBackground && renderBackground(data, index)}
            </Animated.View>
          );
        })
      : null;
    return (
      <View onTouchEnd={this._onTouchEnd} style={{ flexDirection: 'column' }}>
        {backgrounds}
        {header}
        <View
          {...this._panResponder.panHandlers}
          onLayout={this._onLayout}
          style={[style, { flexDirection: 'row' }]}
        >
          {dataSource.length > 0 ? (
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: scrollValue.interpolate({
                      inputRange: [
                        -(1 / 0),
                        -1,
                        0,
                        pageMaxIndex,
                        pageCount,
                        1 / 0
                      ],
                      outputRange: [
                        itemWidth / 2,
                        itemWidth / 2,
                        0,
                        -(0.8 * itemWidth + pageMargin) * pageMaxIndex,
                        -(0.8 * itemWidth + pageMargin) * pageMaxIndex -
                          itemWidth / 2,
                        -(0.8 * itemWidth + pageMargin) * pageMaxIndex -
                          itemWidth / 2
                      ]
                    })
                  }
                ],
                height,
                alignItems: 'center',
                overflow: 'hidden',
                paddingHorizontal: pageInsetHorizontal - resize(6),
                flexDirection: 'row'
              }}
            >
              {children}
            </Animated.View>
          ) : null}
        </View>
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
