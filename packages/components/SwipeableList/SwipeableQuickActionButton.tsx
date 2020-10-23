import React from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

interface Props {
  accessibilityLabel?: string,
  imageSource?: ImageSourcePropType,
  imageStyle?: StyleProp<ViewStyle>,
  mainView?: React.ReactNode,
  onPress?: Function,
  style?: StyleProp<ViewStyle>,
  testID?: string,
  text?: string | Object | Array<string | Object>,
  textStyle?: StyleProp<ViewStyle>,
  containerStyle?: StyleProp<ViewStyle>,
}

export default class SwipeableQuickActionButton extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.imageSource && !this.props.text && !this.props.mainView) {
      return null;
    }
    const mainView = this.props.mainView ? (
      this.props.mainView
    ) : (
        <View style={this.props.style}>
          <Image
            accessibilityLabel={this.props.accessibilityLabel}
            source={this.props.imageSource}
            style={this.props.imageStyle}
          />
          <Text style={this.props.textStyle}>{this.props.text}</Text>
        </View>
      );
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        testID={this.props.testID}
        underlayColor="transparent"
        style={this.props.containerStyle}>
        {mainView}
      </TouchableHighlight>
    );
  }
}
