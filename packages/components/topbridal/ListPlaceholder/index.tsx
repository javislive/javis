import { Image, Text, View } from "react-native-ui";

import Application from "celtics/Application";
import React from "react";
import { resize } from "utils/resize";

export default function ListPlaceHolder() {
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: resize(91)
      }}
    >
      <Image
        style={styles.logo}
        source={require("./toplogo.png")}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "#BBBCBD",
          fontSize: resize(15),
          marginTop: resize(23)
        }}
      >
        抱歉，没有找到符合条件的产品
      </Text>
    </View>
  );
}

const styles = Application.createStyle(theme => {
  return {
    logo: {
      height: resize(30),
      width: resize(141)
    }
  };
});
