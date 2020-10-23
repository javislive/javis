import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Application from '../Application';

interface ButtonProps {
  type: string;
  child: JSX.Element | null | undefined;
}
class Button extends Component<ButtonProps> {
  render() {
    const { type, child } = this.props;
    if (child) {
      return React.cloneElement(child, {
        style: [child.props.style, styles[type]]
      });
    } else {
      return <View style={styles[type]} />;
    }
  }
}

interface TitleProps {
  child: JSX.Element | string | null;
}
class Title extends Component<TitleProps> {
  render() {
    const child = this.props.child;
    if (typeof child === 'string') {
      return (
        <View style={styles.title}>
          <Text style={styles.titleText}>{child}</Text>
        </View>
      );
    } else if (typeof child !== 'undefined') {
      return React.cloneElement(child, {
        style: [child.props.style, styles.title]
      });
    }
    return null;
  }
}

interface HeaderConfig {
  renderLeftButton?: (
    scenes?: any,
    navigation?: any
  ) => JSX.Element | null | undefined;
  renderRightButton?: (
    scenes?: any,
    navigation?: any
  ) => JSX.Element | null | undefined;
  renderTitle?: (scenes?: any, navigation?: any) => JSX.Element | string | null;
  renderHeader?: (
    scenes?: any,
    navigation?: any
  ) => JSX.Element | null | undefined;
}
interface State {
  header?: JSX.Element | null | undefined;
  title?: JSX.Element | null | undefined | string;
  leftButton?: JSX.Element | null | undefined;
  rightButton?: JSX.Element | null | undefined;
}
export interface HeaderProps extends HeaderConfig {
  style?: any;
  scenes?: any;
  navigation?: any;
}

export default class Header extends Component<HeaderProps, State> {
  state: State = {};
  constructor(props: HeaderProps) {
    super(props);
    this.state = this.stateFromProps();
  }
  _renderLeftButton() {
    const { leftButton } = this.state;
    return <Button type="leftButton" child={leftButton} />;
  }
  _renderRightButton() {
    const { rightButton } = this.state;
    return <Button type="rightButton" child={rightButton} />;
  }
  _renderTitle() {
    const { title } = this.state;
    if (title) {
      return <Title child={title} />;
    }
  }
  private stateFromProps(): State {
    const {
      renderLeftButton,
      renderRightButton,
      renderTitle,
      renderHeader,
      scenes,
      navigation
    } = this.props;
    return {
      header: renderHeader ? renderHeader(scenes, navigation) : null,
      title: renderTitle ? renderTitle(scenes, navigation) : '',
      rightButton: renderRightButton
        ? renderRightButton(scenes, navigation)
        : null,
      leftButton: renderLeftButton ? renderLeftButton(scenes, navigation) : null
    };
  }
  update() {
    this.setState(this.stateFromProps());
  }
  render() {
    let header = this.state.header;

    return (
      <View style={[styles.headerWrapper, this.props.style]}>
        {header === undefined ? (
          <View style={[styles.header]}>
            {this._renderTitle()}
            {this._renderLeftButton()}
            {this._renderRightButton()}
          </View>
        ) : (
          header
        )}
      </View>
    );
  }
}

const styles = Application.createStyle(function(theme) {
  return {
    headerWrapper: {
      backgroundColor: theme.navigationHeaderBackgroundColor,
      paddingTop: theme.navigationHeaderMarginTop
    },
    header: {
      flexDirection: 'row',
      paddingTop: theme.navigationHeaderPaddingTop,
      height: theme.navigationHeaderHeight,
      borderBottomColor: theme.borderColor,
      borderBottomWidth: theme.px
    },
    title: {
      flex: 1,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    titleText: {
      fontSize: theme.navigationHeaderFontSize,
      color: theme.navigationHeaderColor
    },
    leftButton: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      height: '100%',
      left: 0
      // width: theme.navigationHeaderButtonWidth
    },
    rightButton: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      height: '100%',
      right: 0
      // width: theme.navigationHeaderButtonWidth
    }
  };
});
