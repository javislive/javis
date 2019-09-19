import React, { Component, ReactElement } from 'react';

import Application from '../Application';
import { View } from 'react-native';

interface ButtonProps {
  type: string;
  child: JSX.Element;
}
class Button extends Component<ButtonProps> {
  render() {
    const { type, child } = this.props;
    if (child) {
      return React.cloneElement(child, {
        style: [child.props.style, styles[type]]
      });
    } else {
      return null;
    }
  }
}

interface TitleProps {
  child: JSX.Element;
}
class Title extends Component<TitleProps> {
  render() {
    const child = this.props.child;
    if (child) {
      return React.cloneElement(child, {
        style: [child.props.style, styles.title]
      });
    }
    return null;
  }
}

interface HeaderConfig {
  leftButton?: JSX.Element;
  rightButton?: JSX.Element;
  title?: JSX.Element;
}
interface State extends HeaderConfig {}
export interface HeaderProps extends HeaderConfig {
  delegate?: HeaderDelegate;
  style?: any;
}
export interface HeaderDelegate {
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onBack?: () => boolean;
}
export interface HeaderUpdateConfig extends HeaderConfig {}
export default class Header extends Component<HeaderProps, State> {
  state: State = {};
  _renderLeftButton() {
    let leftButton = this.state.leftButton || this.props.leftButton;
    return <Button type="leftButton" child={leftButton} />;
  }
  _renderRightButton() {
    let rightButton = this.state.rightButton || this.props.rightButton;
    if (typeof rightButton) {
      return <Button type="rightButton" child={rightButton} />;
    } else {
      return null;
    }
  }
  _renderTitle() {
    return <Title child={this.props.title} />;
  }
  update(config: HeaderUpdateConfig) {
    this.setState(config);
  }
  render() {
    return (
      <View style={[styles.header, this.props.style]}>
        {this._renderLeftButton()}
        {this._renderTitle()}
        {this._renderRightButton()}
      </View>
    );
  }
}

const styles = Application.createStyle(function(theme) {
  return {
    header: {
      backgroundColor: theme.navigationHeaderBackgroundColor,
      flexDirection: 'row',
      height: theme.navigationHeaderHeight,
      paddingTop: theme.navigationHeaderPaddingTop,
      paddingHorizontal: theme.navigationHeaderLeftButtonMargin
      // borderBottomColor: theme.borderColor,
      // borderBottomWidth: theme.px
    },
    title: {
      flex: 1,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center'
    },
    leftButton: {
      flexDirection: 'row',
      paddingLeft: theme.navigationHeaderLeftButtonMargin,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginRight: theme.navigationHeaderLeftButtonMargin
    },
    rightButton: {
      flexDirection: 'row',
      paddingRight: theme.navigationHeaderLeftButtonMargin,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginLeft: theme.navigationHeaderLeftButtonMargin
    }
  };
});
