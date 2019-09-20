import {
  BackHandler,
  EasingFunction,
  GestureResponderEvent,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {RefObject, createRef} from 'react';
import {bordercast, plugin, subscribe} from 'febrest';

import Application from 'celtics/Application';
import BuildConfig from 'BuildConfig';
import Navigation from 'celtics/Navigation';
import {NavigationState} from 'react-navigation';
import {View} from 'react-native-ui';
import router from 'router';

const INTIAL_ROUTE_NAME = BuildConfig.env === 'dev' ? 'PageList' : 'StartPage';
export interface State {
  navigation: number;
  ready: boolean;
  routeName: string;
}
export interface Props {}
const pages: any[] = [];
class App extends Application {
  state: State = {
    navigation: 0,
    ready: false,
    routeName: INTIAL_ROUTE_NAME,
  };
  private navigaionRef: RefObject<Navigation> = createRef();
  onCreate() {
    super.onCreate();
    subscribe(this._ui);
    // return this.requestPermission().then(() => {
    //   // UserAgent.hideMask();
    //   subscribe(this._ui);
    // });
  }
  onReady() {
    super.onReady();
    plugin({
      initialized: action => {},
      close: action => {},
    });
  }
  requestPermission() {
    return Platform.select({
      ios: () => {
        return Promise.resolve({});
      },
      android: () => {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
      },
    })().then((data: {[permission: string]: PermissionStatus}) => {
      for (const v in data) {
        if (data[v] !== PermissionsAndroid.RESULTS.GRANTED) {
          BackHandler.exitApp();
          return;
        }
      }
    });
  }
  _ui = ({cmd, data}: {cmd: string; data: any}) => {
    switch (cmd) {
      case 'sys.toast':
        return this.toast(data);
      case 'sys.alert':
        return this.alert(data);
      case 'sys.navigation.navigate':
        return (
          this.navigaionRef.current &&
          this.navigaionRef.current.navigate(data.routeName, data.params)
        );
      case 'sys.navigation.goBack':
        return (
          this.navigaionRef.current &&
          this.navigaionRef.current.goBack(data && data.key)
        );
      case 'sys.navigation.reset':
        this.setState(
          {
            navigation: this.state.navigation + 1,
            routeName: (data && data.routeName) || INTIAL_ROUTE_NAME,
          },
          () => {
            bordercast('sys.navigation.change', []);
          },
        );
      default:
        return;
    }
  };
  renderContent() {
    let {navigation, routeName} = this.state;
    return (
      <View
        onTouchMove={e => this._onTouchMove(e)}
        onTouchEnd={e => this._onTouchEnd(e)}
        style={styles.wrapper}>
        <Navigation
          key={navigation}
          pages={router}
          ref={this.navigaionRef}
          config={{initialRouteName: routeName}}
          onNavigationStateChange={this._onNavigationStateChange}
          style={styles.wrapper}
        />
      </View>
    );
  }
  _onNavigationStateChange = (
    prevState: NavigationState,

    nextState: NavigationState,
  ) => {
    bordercast('sys.navigation.change', nextState.routes);
  };
  _onTouchStart() {}
  _onTouchMove(e: GestureResponderEvent) {}
  _onTouchEnd(e: GestureResponderEvent) {}
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      flexDirection: 'column',
    },
    main: {
      flex: 1,
      flexDirection: 'column',
    },
  };
});

export default App;
