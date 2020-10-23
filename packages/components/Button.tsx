import {
  GestureResponderEvent,
  TextStyle,
  TouchableOpacityProps
} from "react-native";
import React, { PureComponent, ReactComponentElement } from "react";
import { Text, TouchableHighlight, TouchableOpacity } from "react-native-ui";
import { resize, vw } from "utils/resize";

import Application from "celtics/Application";
import { GestureHandlerGestureEvent } from "react-native-gesture-handler";

export interface Props extends TouchableOpacityProps {
  titleStyle?: TextStyle;
  style?: object;
  backgroundColor?: string;
  title?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  type?: "normal" | "black" | "active" | "inactive";
  children?: JSX.Element;
  interval?: number;
}
const WIDTH = {
  sm: resize(108),
  md: resize(126),
  lg: resize(212)
};
class Button extends PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    activeOpacity: 1
  };
  private pressTime: number = 0;
  render() {
    const {
      children,
      style,
      titleStyle,
      title,
      disabled,
      backgroundColor,
      onPress,
      size = "sm",
      type = "normal",
      interval = 1000,
      ...props
    } = this.props;
    const styleWithProps = {
      width: WIDTH[size]
    };
    const themeStyle = styles[type];
    const themeTextStyle = styles[type + "Text"];
    return (
      <TouchableOpacity
        onPress={this.onPress}
        activeOpacity={1}
        style={[styles.button, styleWithProps, themeStyle, style]}
        {...props}
      >
        {children ? (
          children
        ) : (
          <Text style={[themeTextStyle, titleStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
  private onPress = (event: GestureResponderEvent) => {
    const {
      disabled,

      onPress,

      interval = 1000
    } = this.props;
    const pressTime = this.pressTime;
    const now = Date.now();
    if (!onPress || disabled || interval >= now - pressTime) {
      return;
    }
    onPress(event);
    this.pressTime = now;
  };
}

const styles = Application.createStyle(theme => ({
  button: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: resize(34),
    borderRadius: resize(17),
    justifyContent: "center",
    alignItems: "center"
  },
  normal: {
    borderColor: "#000000",
    borderWidth: 1
  },
  normalText: {
    color: "#303030",
    fontSize: resize(14)
  },
  black: {
    backgroundColor: "#303030"
  },
  blackText: {
    color: "#fff",
    fontSize: resize(14)
  },
  active: {
    backgroundColor: "#82704A"
  },
  activeText: {
    color: "#fff",
    fontSize: resize(14)
  },
  inactive: {
    borderColor: "#82704A",
    borderWidth: 1
  },
  inactiveText: {
    color: "#82704A",
    fontSize: resize(14)
  }
}));

export default Button;
