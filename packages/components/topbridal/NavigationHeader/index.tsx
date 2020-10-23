import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { Component, PureComponent, ReactElement } from 'react';
import { getStoreName, getStoreType } from 'utils/topbridal';
import { resize, vm } from 'utils/resize';

import FontIcon from 'components/FontIcon';
import Header from 'components/Header';
import UserContext from 'context/UserContext';
import { broadcast, State } from 'febrest';
import { createStyle } from 'themes';

export interface NavigationHeaderProps {
  title?: string | ReactElement;
  leftButton?: ReactElement | null;
  rightButton?: ReactElement | null;
  header?: boolean | ReactElement;
}
export interface NavigationHeaderState {
  title?: string | ReactElement;
  leftButton?: ReactElement | null;
  rightButton?: ReactElement | null;
  header?: boolean | ReactElement;
  routeState?: any;
  style?: any;
  canGoBack?: boolean;
  props: NavigationHeaderProps;
}
class LeftButton extends PureComponent {
  state = {};

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          const user = State('user').get() || {};
          //加盟店不让切换
          if (user.self != 1) {
            return;
          }
          broadcast('sys.header.left');
        }}
        style={styles.button}
      >
        <FontIcon icon="&#xe7a5;" size={resize(15)} color="#3A3A3A" />
        {/* <Text style={styles.headerText}>TopBridal</Text> */}
        <UserContext.Consumer>
          {states => {
            const user = states.user || {};
            return (
              <Text style={styles.headerText}>
                {this._renderStoreName(user)}
              </Text>
            );
          }}
        </UserContext.Consumer>
      </TouchableOpacity>
    );
  }
  _renderStoreName(user: any) {
    if (!user.store || !user.store.id) {
      return 'TopBridal';
    }
    const storeName = getStoreName((user.store && user.store.name) || '上海店');
    const storeType =
      getStoreType(user.store && user.store.name) || 'TopBridal';
    return storeType + storeName;
  }
}
class RightButton extends PureComponent {
  _tickHandler: number = 0;
  state = {
    time: ''
  };
  componentDidMount() {
    this._tick();
  }
  componentWillUnmount() {
    clearTimeout(this._tickHandler);
  }

  render() {
    return (
      <View style={styles.button}>
        <Text style={styles.headerText}>{this.state.time}</Text>
      </View>
    );
  }
  _renderTime() {
    const date = new Date();
    let h: any = date.getHours();
    let af = '上午';
    if (h > 12) {
      h = h - 12;
      af = '下午';
    }
    if (h < 10) {
      h = '0' + h;
    }
    let m: any = date.getMinutes();
    if (m < 10) {
      m = '0' + m;
    }
    return af + ' ' + h + ':' + m;
  }
  _tick() {
    this.setState({
      time: this._renderTime()
    });
    setTimeout(() => {
      this._tick();
    }, 500);
  }
}
class NavigationHeader extends PureComponent<
  NavigationHeaderProps,
  NavigationHeaderState
> {
  state = {
    header: false,
    props: {}
  };
  _renderLeftButton(scene: any, navigation: any): ReactElement | null {
    return <LeftButton />;
  }
  hide() {
    this.setState({ header: false });
  }
  show() {
    this.setState({ header: true });
  }
  render() {
    let { header } = this.state;
    if (header === false) {
      return null;
    }
    return (
      <Header
        rightButton={<RightButton />}
        title={<View style={{ flex: 1 }} />}
        leftButton={<LeftButton />}
      />
    );
  }
}

const styles = createStyle(function(theme) {
  return {
    titleText: {
      fontSize: theme.navigationHeaderFontSize,
      color: theme.navigationHeaderColor,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    headerText: {
      color: '#3A3A3A',
      fontSize: resize(17)
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };
});

export default NavigationHeader;
