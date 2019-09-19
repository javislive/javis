import React, { Component, ReactComponentElement } from 'react';
import { Text, TouchableHighlight } from 'react-native-ui';
import { TextStyle, TouchableHighlightProps } from 'react-native';
import { ThemeConsumer, createStyle } from 'themes';

import { vw } from 'utils/resize';

export interface Props extends TouchableHighlightProps {
  titleStyle?: TextStyle;
  style?: object;
  backgroundColor?: string;
  title?: string;
  disabled?: boolean;
  child?: ReactComponentElement<any, any>;
}
class Button extends Component<Props> {
  static defaultProps = {
    disabled: false,
    activeOpacity: 1
  };
  render() {
    let {
      child,
      style,
      titleStyle,
      title,
      disabled,
      backgroundColor,
      onPress,
      ...props
    } = this.props;
    return (
      <ThemeConsumer>
        {theme => {
          return (
            <TouchableHighlight
              onPress={!disabled ? onPress : undefined}
              style={[
                styles.button,
                style,
                backgroundColor && { backgroundColor },
                disabled
                  ? {
                      backgroundColor: theme.disabledColor
                    }
                  : null
              ]}
              underlayColor={disabled ? theme.disabledColor : '#bb0707'}
              {...props}
            >
              {child ? (
                child
              ) : (
                <Text style={[styles.wrapper, titleStyle]}>{title}</Text>
              )}
            </TouchableHighlight>
          );
        }}
      </ThemeConsumer>
    );
  }
}

const styles = createStyle(theme => ({
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 96,
    height: theme.defaultHeight,
    borderRadius: 8,
    borderColor: theme.borderColor,
    borderWidth: theme.px,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: theme.f3,
    color: theme.color
  }
}));

export default Button;
