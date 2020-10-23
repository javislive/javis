import { Animated, Easing } from "react-native";
import { Image, TouchableOpacity, View } from "react-native-ui";
import React, { PureComponent } from "react";
import { resize, vh } from "utils/resize";
import { subscribe, unsubscribe } from "febrest";

import FontIcon from "components/FontIcon";
import UserContext from "context/UserContext";
import { createPortal } from "components/Protal";
import { createStyle } from "themes";
import { dispatch } from "febrest";

const { Portal, Component } = createPortal();

function IconItem({ children }) {
  return <View style={styles.icon}>{children}</View>;
}
let pages: any[] = [];
class SideBarPortal extends Component {
  state = {
    backArrow: false,
    isFold: false
  };
  _foldHandler: any = null;
  animationValue = new Animated.Value(-1);
  componentDidMount() {
    subscribe(this._pageActionListener);
    this.autoFold();
  }
  componentWillUnmount() {
    clearTimeout(this._foldHandler);
  }
  _pageActionListener = ({ cmd, data }: { cmd: string; data: any }) => {
    switch (cmd) {
      case "sys.navigation.change":
        pages = data;
        if (pages.length > 1) {
          this.setState({ backArrow: true });
        } else {
          this.setState({ backArrow: false });
        }
        break;
    }
  };
  fold() {
    if (this.state.isFold) {
      return;
    }
    Animated.timing(this.animationValue, {
      toValue: -resize(56),
      easing: Easing.ease,
      duration: 100
    }).start(() => {
      this.state.isFold = true;
    });
  }
  unfold() {
    clearTimeout(this._foldHandler);
    this.autoFold();
    if (!this.state.isFold) {
      return;
    }
    this.state.isFold = false;
    Animated.timing(this.animationValue, {
      toValue: -1,
      easing: Easing.ease,
      duration: 100
    }).start(() => {});
  }
  autoFold = () => {
    this._foldHandler = setTimeout(() => {
      this.fold();
    }, 5000);
  };
  renderPortal = (portals: any, user: any) => {
    // const { user } = this.context;
    if (!user || !user.mobile) {
      return null;
    }
    const icons =
      portals && portals.length > 0
        ? portals[portals.length - 1].children
        : null;
    const { backArrow } = this.state;
    // const height = this.animationValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [
    //     0,
    //     48 *
    //       ((icons ? React.Children.count(icons) + 1 : 1) + (backArrow ? 1 : 0))
    //   ]
    // });
    return (
      <Animated.View style={[styles.wrapper, { right: this.animationValue }]}>
        <IconItem>
          <TouchableOpacity
            style={styles.fill}
            onPress={() => {
              dispatch("app.navigate", { routeName: "Search" });
            }}
          >
            <FontIcon icon="&#xe99b;" size={resize(24)} color="#282828" />
          </TouchableOpacity>
        </IconItem>
        {backArrow ? (
          <IconItem>
            <TouchableOpacity
              style={styles.fill}
              onPress={() => {
                dispatch("app.navigationGoBack");
              }}
            >
              <FontIcon size={resize(24)} icon="&#xe860;" color="#282828" />
            </TouchableOpacity>
          </IconItem>
        ) : null}
        <IconItem>
          <TouchableOpacity
            style={styles.fill}
            onPress={() => {
              dispatch("app.showUserCenter");
            }}
          >
            <FontIcon size={resize(24)} icon="&#xe7ce;" color="#282828" />
          </TouchableOpacity>
        </IconItem>
        <IconItem>
          <TouchableOpacity
            style={styles.fill}
            onPress={() => {
              dispatch("app.navigationReset", { routeName: "Main" });
            }}
          >
            <FontIcon size={resize(24)} icon="&#xe801;" color="#282828" />
          </TouchableOpacity>
        </IconItem>
        <IconItem>
          <TouchableOpacity
            style={styles.fill}
            onPress={() => {
              dispatch("app.navigate", { routeName: "FilterPage" });
            }}
          >
            <Image
              style={{ height: resize(24), width: resize(24) }}
              resizeMode="contain"
              source={require("./Shape.png")}
            />
          </TouchableOpacity>
        </IconItem>
        {React.Children.map(icons, (child, index) => {
          return <IconItem key={index}>{child}</IconItem>;
        })}
      </Animated.View>
    );
  };
  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => {
          return <Portal render={p => this.renderPortal(p, user)} />;
        }}
      </UserContext.Consumer>
    );
  }
}
export { Component as default, SideBarPortal };

const styles = createStyle(theme => {
  return {
    wrapper: {
      position: "absolute",
      bottom: vh(50),
      width: resize(56),
      right: -1,
      backgroundColor: "rgba(233,236,240,0.8)",
      borderTopLeftRadius: resize(10),
      borderBottomLeftRadius: resize(10),
      overflow: "hidden"
    },
    icon: {
      height: resize(56),
      justifyContent: "center",
      alignItems: "center"
    },
    fill: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  };
});
