import {
  ImageProps,
  ImageSourcePropType,
  Image as NativeImage,
  View,
  Platform
} from 'react-native';
import React, { PureComponent } from 'react';

import { FileCache } from 'native';

function isUri(source: ImageSourcePropType): boolean {
  return !!source && !!source.uri && source.uri.indexOf('http') === 0;
}

class Image extends PureComponent<ImageProps> {
  state = {
    source: null,
    progress: 0,
    uri: '',
    isRemote: false
  };
  static getSize = function(
    uri: string,
    success: (width: number, height: number) => void,
    failure: (error: any) => void
  ): any {
    FileCache.cache(uri, (data: any) => {
      const { status, progress, source } = data;
      if (status == 'success') {
        uri = Platform.OS === 'android' ? 'file://' + source : source;
      }
      NativeImage.getSize(uri, success, failure);
    });
  };
  static getDerivedStateFromProps(props: ImageProps, state: any) {
    if (isUri(props.source)) {
      if (props.source.uri !== state.uri) {
        return {
          source: null,
          isRemote: true,
          progress: 0,
          uri: props.source.uri
        };
      } else {
        return null;
      }
    } else {
      return {
        source: props.source,
        isRemote: false,
        progress: 100
      };
    }
  }
  constructor(props: ImageProps) {
    super(props);
    if (isUri(props.source)) {
      this.state.isRemote = true;
      this.state.uri = props.source.uri;
      this.state.progress = 0;
      this._fetehFile();
    } else {
      this.state.source = props.source;
    }
  }
  componentDidUpdate() {
    if (this.state.isRemote && this.state.progress == 0) {
      this._fetehFile();
    }
  }
  render() {
    let { source, isRemote, progress } = this.state;
    const { props } = this;
    if (!isRemote || progress == 100) {
      return <NativeImage {...props} source={source} />;
    } else {
      return <View style={props.style} />;
    }
  }
  _fetehFile() {
    FileCache.cache(this.state.uri, (data: any) => {
      const { status, progress, source } = data;
      if (status === 'error') {
        this.setState({
          source: this.props.source,
          progress: 100
        });
      } else if (status == 'success') {
        this.setState({
          source: {
            uri: Platform.OS === 'android' ? 'file://' + source : source
          },
          progress: 100
        });
      } else {
        this.setState({
          progress
        });
      }
    });
  }
}
export default Image;
