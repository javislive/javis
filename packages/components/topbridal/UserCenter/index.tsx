import { Animated, BackAndroid, Easing, PanResponder } from 'react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native-ui';
import React, { PureComponent } from 'react';
import { dispatch, State as FState } from 'febrest';
import { resize, vh, vw } from 'utils/resize';

import FavList from './FavList';
import FontIcon from 'components/FontIcon';
import { LayoutEvent } from 'react-navigation';
import Login from './Login';
import Logout from './Logout';
import { createStyle } from 'themes';
import UserContext from 'context/UserContext';
import User from 'state/User';
import { agreement } from 'services/api';
import app from 'actions/app';

const Wrapper = Animated.View;
interface State {
  show: boolean;
  isShowLogout: boolean;
  favTotal: number;
  stage: 'HALF' | 'HIDE' | 'SHOW' | 'CLOSE';
}

const MAIN_HEIGHT = resize(780);
const TOP_HEIGHT = resize(76);
const BODY_HEIGHT = MAIN_HEIGHT - TOP_HEIGHT;
export default class UserCenter extends PureComponent {
  static contextType = UserContext;
  state: State = {
    show: true,
    isShowLogout: false,
    favTotal: 0,
    stage: 'HIDE'
  };
  translateY: Animated.Value = new Animated.Value(MAIN_HEIGHT);
  _height: number = 0;
  _hideHandler: any;
  stage() {
    return this.state.stage;
  }
  show() {
    clearTimeout(this._hideHandler);

    if (this.state.stage === 'SHOW') {
      return;
    }
    this.state.stage = 'SHOW';
    Animated.timing(this.translateY, {
      toValue: 0,
      easing: Easing.ease,
      duration: 300
    }).start();
  }
  halfHide() {
    clearTimeout(this._hideHandler);
    const { stage } = this.state;
    if (stage !== 'HALF') {
      this.state.stage = 'HALF';
      Animated.timing(this.translateY, {
        toValue: BODY_HEIGHT,
        easing: Easing.ease,
        duration: 268
      }).start(() => {
        this.autoHide();
      });
    }
  }
  hide() {
    const { stage } = this.state;
    const user = this.context.user;
    if (user && user.mobile && stage !== 'HIDE') {
      this.state.stage = 'HIDE';
      Animated.timing(this.translateY, {
        toValue: MAIN_HEIGHT,
        easing: Easing.ease,
        duration: 268
      }).start();
    }
  }
  autoHide() {
    // clearTimeout(this._hideHandler);
    // this._hideHandler = setTimeout(() => {
    //   this.hide();
    // }, 5000);
  }
  close() {
    const { stage } = this.state;
    if (stage !== 'CLOSE') {
      this.state.stage = 'CLOSE';
      Animated.timing(this.translateY, {
        toValue: MAIN_HEIGHT,
        easing: Easing.ease,
        duration: 268
      }).start();
    }
  }
  render() {
    const { show, stage } = this.state;
    if (!show) {
      return null;
    }
    const translateY = this.translateY;
    const backHeight = translateY.interpolate({
      inputRange: [0, MAIN_HEIGHT - 100],
      outputRange: [vh(100), 0]
    });
    const r = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true
    });
    return (
      <Wrapper
        onLayout={({
          nativeEvent: {
            layout: { height }
          }
        }: LayoutEvent) => (this._height = height)}
        style={[styles.wrapper, { transform: [{ translateY }] }]}
      >
        <Animated.View
          style={[styles.back, { height: backHeight }]}
          onTouchEnd={() => this.hide()}
        />
        <UserContext.Consumer>
          {({ user, favorites }: { user: any; favorites: any }) => {
            favorites = favorites || {};
            return (
              <View style={[styles.container]}>
                <Image
                  style={styles.background}
                  resizeMode="stretch"
                  source={require('./bg.png')}
                />
                <View {...r} style={styles.main}>
                  {this._renderHeader(user, favorites)}
                  <View style={styles.content}>
                    {this._renderContent(user, favorites)}
                  </View>
                </View>
              </View>
            );
          }}
        </UserContext.Consumer>
      </Wrapper>
    );
  }
  _renderHeader(user: any, favorites: any) {
    let children;
    let left = null;
    let right = null;
    if (user && user.mobile) {
      children = (
        <View style={styles.headerMain}>
          <Text style={styles.title}>
            {'欢迎新人 ' + user.name + '  ' + user.mobile}
          </Text>
          <Text style={styles.subTitle}>婚期：{user.date}</Text>
        </View>
      );
      left = (
        <TouchableOpacity style={styles.headerLeft} onPress={this._logout}>
          <Image
            resizeMode="contain"
            style={styles.logout}
            source={require('./icon_logout.png')}
          />
        </TouchableOpacity>
      );
      right = (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.headerRight}
          onPress={() => this._showFav()}
        >
          <FontIcon icon="&#xe839;" size={resize(18)} color="#fff" />
          <View style={styles.favTag}>
            <Text style={styles.favTagText}>{favorites.total}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      children = (
        <View style={styles.headerMain}>
          <Text style={styles.title}>客户登录</Text>
          <Text style={styles.subTitle}>Login</Text>
        </View>
      );
    }
    return (
      <View style={styles.header}>
        {left}
        {children}
        {right}
      </View>
    );
  }
  _renderLogin() {}
  _renderContent(user: any, favorites: any) {
    const { isShowLogout } = this.state;

    if (user && user.mobile) {
      if (isShowLogout) {
        return (
          <Logout onLogout={this._onLogout} onCancel={this._onLogoutCancel} />
        );
      } else {
        return <FavList data={favorites.data} />;
      }
    } else {
      return <Login onLogin={this._onLogin} />;
    }
  }
  _onLogin = () => {
    this.hide();
    dispatch(agreement).then((data: any) => {
      dispatch(app.navigationReset, {
        routeName: data.has_sign_agreement == 1 ? 'Main' : 'TryProtocol'
      });
    });
  };
  _onLogoutCancel = () => {
    this.setState({ isShowLogout: false });
  };
  _onLogout = () => {
    this.close();
    dispatch('app.navigationReset', { routeName: 'StartPage' });
  };
  _showFav() {
    this.setState({ isShowLogout: false });
  }
  _logout = () => {
    this.setState({ isShowLogout: true });
  };
  _onBack() {
    const { stage } = this.state;
    const user = this.context.user;
    if (stage == 'SHOW') {
      if (user && user.mobile) {
        this.hide();
      } else {
        dispatch('app.navigationReset');
        this.close();
      }
      return true;
    }
    return false;
  }
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      width: vw(100),
      position: 'absolute',
      bottom: 0,
      backgroundColor: 'transparent'
    },
    back: {
      width: vw(100),
      height: vh(100),
      backgroundColor: 'transparent'
    },
    container: {
      width: vw(100),
      height: resize(780)
    },
    background: {
      position: 'absolute',
      width: vw(100),
      height: resize(780)
    },
    main: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingHorizontal: resize(30)
    },
    header: {
      height: resize(76),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    headerMain: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      color: '#FFFFFF',
      fontSize: resize(17)
    },
    subTitle: {
      color: '#A3A3A3',
      fontSize: resize(17)
    },
    content: {
      flex: 1,
      borderTopWidth: theme.px,
      borderColor: '#FFFFFF'
    },
    headerLeft: {
      height: resize(25),
      width: resize(25),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: resize(10)
    },
    logout: {
      height: resize(25),
      width: resize(25)
    },
    favTag: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      borderRadius: resize(6),
      backgroundColor: '#82704A',
      height: resize(12),
      width: resize(20),
      justifyContent: 'center',
      alignItems: 'center'
    },
    favTagText: {
      fontSize: resize(10),
      color: '#fff'
    },
    headerRight: {
      height: resize(27),
      width: resize(27),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: resize(10)
    }
  };
});
