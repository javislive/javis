'use strict';
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import { Image } from 'react-native-ui';
const AnimatedImage = Animated.createAnimatedComponent(Image);
interface Props {
  initialWidth: number;
  initialHeight: number;
  uri: string;
  maxWidth: number;
  maxHeight: number;
  style?: object;
  onLayout?: (event: any) => void;
  resize?: (width: number, height: number) => boolean;
}
interface State {
  uri: string;
  height: number;
  width: number;
  heightWidth: Animated.ValueXY;
}
export default class AutoSizeImage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { initialWidth = 0, initialHeight = 0 } = this.props;
    this.state = {
      uri: '',
      height: 0,
      width: 0,
      heightWidth: new Animated.ValueXY({
        x: initialWidth,
        y: initialHeight
      })
    };
  }
  static defaultProps = {
    maxHeight: Infinity,
    maxWidth: Infinity,
    initialHeight: 0,
    initialWidth: 0
  };
  static getDerivedStateFromProps(props: Props, state: State) {
    // return {
    //   uri: props.uri
    // };
    return null;
  }
  componentDidMount() {
    this._getSize();
  }
  componentDidUpdate(props: Props, state: State) {
    this._getSize();
  }
  _getSize() {
    const { uri, initialHeight, initialWidth, resize } = this.props;
    if (!uri || typeof uri !== 'string') {
      return;
    }
    const { height, width } = this.state;
    if (this.state.uri !== uri) {
      //防止重复加载
      this.state.uri = uri;
      Image.getSize(
        uri,
        (width: number, height: number) => {
          this._resizeImage(width, height);
          this.setState({
            height,
            width
          });
        },
        error => {
          this._resizeImage(initialWidth, initialHeight);
          this.setState({
            height: initialHeight,
            width: initialWidth
          });
        }
      );
    } else {
      this._resizeImage(width, height);
    }
  }
  _resizeImage(width: number, height: number) {
    const { maxWidth, maxHeight } = this.props;
    let x, y;
    if (width > maxWidth) {
      x = maxWidth;
      y = (x / width) * height;
    } else if (height > maxHeight) {
      y = maxHeight;
      x = (y / height) * width;
    } else {
      x = width;
      y = height;
    }
    this.state.heightWidth.setValue({ x, y });
  }
  getWidth() {
    return this.state.width;
  }
  getHeight() {
    return this.state.height;
  }
  render() {
    const {
      uri,
      style,
      onLayout,
      resize,
      maxHeight,
      maxWidth,
      initialHeight,
      initialWidth,
      ...props
    } = this.props;
    if (!this.props.uri) {
      return null;
    }
    let { width, height } = this.state;
    const { x, y } = this.state.heightWidth;
    const isResize = resize ? resize(width, height) : true;
    return (
      <AnimatedImage
        {...props}
        source={{ uri }}
        style={[
          style,
          isResize ? { height: y, width: x, flex: undefined } : null
        ]}
      />
    );
  }
}
