import React, { PureComponent } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native-ui";
import { resize, vh, vw } from "utils/resize";

import FilterContext from "context/FilterContext";
import FontIcon from "components/FontIcon";
import { createStyle } from "themes";

export default class Filter extends PureComponent {
  state = {
    isShow: false,
    key: "",
    values: [],
    callback: null
  };
  isShow() {
    return this.state.isShow;
  }
  show(
    key: string,
    values: { [idx: string]: any },
    callback: (item: any) => void
  ) {
    this.setState({
      isShow: true,
      values,
      callback,
      key
    });
  }
  hide() {
    this.setState({
      isShow: false,
      values: [],
      callback: null,
      key: ""
    });
  }
  render() {
    const { key, isShow, values } = this.state;
    if (!isShow) {
      return null;
    }
    return (
      <FilterContext.Consumer>
        {(filter: any) => {
          filter = filter || {};
          let items = filter[key];
          if (!items) {
            return null;
          }
          if (key === "store") {
            items = [
              {
                key: "store",
                value: "topbridal",
                id: "",
                name: "TopBridal"
              }
            ].concat(items);
          }
          return (
            <View style={[styles.wrapper, this.props.style]}>
              <ScrollView style={styles.scrollView}>
                {items.map((item: any) => {
                  const isSelected = !values.every(v => {
                    if (v.value === item.value && v.key === item.key) {
                      return false;
                    }
                    return true;
                  });
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={item.value}
                      onPress={() => this._selectItem(item)}
                      style={styles.item}
                    >
                      <Text
                        style={[
                          styles.itemName,

                          isSelected ? styles.itemNameSelect : null
                        ]}
                      >
                        {item.name + (isSelected ? "(已选)" : "")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                onPress={() => this.hide()}
                style={styles.closeButton}
              >
                <FontIcon icon="&#xe888;" size={resize(22)} />
              </TouchableOpacity>
            </View>
          );
        }}
      </FilterContext.Consumer>
    );
  }
  _selectItem = (item: any) => {
    const values = this.state.values;
    this.hide();
    if (values.every(v => !(v.value === item.value && item.key === v.key))) {
      this.state.callback && this.state.callback(item);
    }
  };
}
const styles = createStyle(theme => {
  return {
    wrapper: {
      position: "absolute",
      top: resize(58),
      bottom: 0,
      width: vw(100),
      backgroundColor: "#fff",
      paddingHorizontal: resize(20)
      // borderLeftWidth: theme.px,
      // borderLeftColor: theme.borderColor,
      // borderRightWidth: theme.px,
      // borderRightColor: theme.borderColor
    },
    scrollView: {
      flex: 1,
      height: vh(37),
      width: vw(100),
      backgroundColor: "#fff",
      borderBottomWidth: theme.px,
      borderBottomColor: theme.borderColor
    },
    item: {
      height: resize(48),
      justifyContent: "center",
      backgroundColor: "#fff"
    },
    itemName: {
      color: "#282828",
      fontSize: resize(15)
    },
    itemNameSelect: {
      color: "#82704A"
    },
    closeButton: {
      position: "absolute",
      top: resize(10),
      right: resize(30)
    }
  };
});
