'use strict';
import React, { PureComponent } from 'react';
import { View, Animated } from 'react-native';

interface Props {
  initialPage: number;
  count: number;
}
interface State {
  page: number;
}
class Indicator extends PureComponent<Props> {
  state: State = {
    page: 0
  };
  _scrollValue: Animated.Value = new Animated.Value(0);
  constructor(props: Props) {
    super(props);
    this.state = {
      page: this.props.initialPage
    };
    this._scrollValue = new Animated.Value(this.props.initialPage);
  }
  onPageSelected(event) {
    var page = event.nativeEvent.position;
    this.setState({ page });
    this._scrollValue.setValue(page);
    this.state = {
      page: this.props.initialPage
    };
    this._scrollValue = new Animated.Value(0);
  }
  onPageScroll(event) {
    var { offset, position } = event.nativeEvent;
    this._scrollValue.setValue(position + offset);
  }
  _renderIndicator() {
    if (this.props.count == 1) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            height: 8,
            width: 8,
            borderRadius: 4
          }}
        />
      );
    }
    return new Array(this.props.count).fill(1).map((a, i) => {
      let count = this.props.count;
      var opacity, scale;
      if (i === 0) {
        opacity = this._scrollValue.interpolate({
          inputRange: [0, 1, count - 1, count],
          outputRange: [1, 0.5, 0.5, 1]
        });
        scale = this._scrollValue.interpolate({
          inputRange: [0, 1, count - 1, count],
          outputRange: [1.2, 1, 1, 1.2]
        });
      } else if (i === count - 1) {
        opacity = this._scrollValue.interpolate({
          inputRange: [-Infinity, i - 1, i, i + 1, Infinity],
          outputRange: [0.5, 0.5, 1, 0.5, 0.5]
        });
        scale = this._scrollValue.interpolate({
          inputRange: [-Infinity, i - 1, i, i + 1, Infinity],
          outputRange: [1, 1, 1.2, 1, 1]
        });
      } else {
        opacity = this._scrollValue.interpolate({
          inputRange: [-Infinity, i - 1, i, i + 1, Infinity],
          outputRange: [0.5, 0.5, 1, 0.5, 0.5]
        });
        scale = this._scrollValue.interpolate({
          inputRange: [-Infinity, i - 1, i, i + 1, Infinity],
          outputRange: [1, 1, 1.2, 1, 1]
        });
      }
      var style = {
        backgroundColor: '#fff',
        height: 8,
        width: 8,
        borderRadius: 4,
        opacity,
        transform: [{ scale }],
        marginRight: i !== this.props.count - 1 ? 10 : 0
      };
      return <Animated.View key={i} style={style} />;
    });
  }
  render() {
    var style = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      paddingBottom: 20,
      justifyContent: 'center',
      flexDirection: 'row'
    };
    return <View style={style}>{this._renderIndicator()}</View>;
  }
}

export default Indicator;
