import { Image, Text, TouchableOpacity, View } from "react-native-ui";
import React, { PureComponent } from "react";

import { createStyle } from "themes";
import { dispatch } from "febrest";
import { resize } from "utils/resize";

interface Props {
  onCancel: () => void;
  onLogout: () => void;
}
export default class Logout extends PureComponent<Props> {
  render() {
    return (
      <View style={styles.wrapper}>
        <Image
          resizeMode="stretch"
          source={require("./toplogo.png")}
          style={styles.logo}
        />
        <View style={styles.main}>
          <View style={styles.mainHeader}>
            <Text style={styles.mainHeaderText}>是否确认退出？</Text>
          </View>
          <View style={styles.quitButtons}>
            <View style={[styles.quitButton, { marginRight: resize(20) }]}>
              <TouchableOpacity
                onPress={this._logout}
                style={styles.quitButtonContent}
              >
                <Text style={styles.buttonText}>退出</Text>
                <Text style={styles.buttonTextTip}>QUIT</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quitButton}>
              <TouchableOpacity
                onPress={this._cancel}
                style={styles.quitButtonContent}
              >
                <Text style={styles.buttonText}>留下</Text>
                <Text style={styles.buttonTextTip}>STAY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  _cancel = () => {
    this.props.onCancel && this.props.onCancel();
  };
  _logout = () => {
    dispatch("user.logout").then(() => {
      this.props.onLogout && this.props.onLogout();
    });
  };
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      alignItems: "center",
      paddingTop: resize(140)
    },
    logo: {
      height: resize(30),
      width: resize(141),
      marginBottom: resize(57)
    },
    main: {
      flex: 1
    },
    mainHeader: {
      marginBottom: resize(27),
      justifyContent: "center",
      alignItems: "center"
    },
    mainHeaderText: {
      color: "#fff",
      fontSize: resize(15)
    },
    quitButtons: {
      flexDirection: "row",
      alignItems: "center"
    },
    quitButton: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: resize(10),
      height: resize(113),
      width: resize(113),
      backgroundColor: "#fff",
      overflow: "hidden"
    },
    quitButtonContent: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1
    },
    buttonText: {
      color: "#282828",
      fontSize: resize(18)
    },
    buttonTextTip: {
      color: "#28282888",
      fontSize: resize(15)
    }
  };
});
