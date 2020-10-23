"use strict";

import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import React, { PureComponent } from "react";

import PropTypes from "prop-types";

interface TabProp {
  title?: string;
  icon?: any;
  selectedIcon?: any;
  text?: string;
}
interface Prop {
  initialPage: number;
  backgroundColor: string;
  tabs: TabProp[];
  renderTab: (v: TabProp, i: number, page: number) => any;
  onItemPress: (v: any) => any;
}
function renderTab(tab: TabProp, i: number, page: number) {
  var source = i == page ? tab.selectedIcon : tab.icon;
  var textStyle = {
    fontSize: 12,
    color: "#7a7e83",
    height: 16,
    lineHeight: 16,
    marginTop: 5
  };
  if (i == page) {
    textStyle.color = "#27b24a";
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Image source={source} resizeMode="stretch" />
      {tab.text && <Text style={textStyle}>{tab.text}</Text>}
    </View>
  );
}
class Tab extends PureComponent<Prop> {
  static propTypes = {
    backgroundColor: PropTypes.string,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.any,
        selectedIcon: PropTypes.any
      })
    ),
    renderTab: PropTypes.func,
    onItemPress: PropTypes.func
  };
  static defaultProps = {
    backgroundColor: "#fff",
    renderTab
  };
  state = {
    page: 0
  };
  constructor(props: Prop) {
    super(props);
    this.state = {
      page: this.props.initialPage
    };
  }
  onPageSelected(event) {
    var page = event.nativeEvent.position;
    this.setState({ page });
  }
  onPageScroll(event) {}
  _renderItem() {
    return this.props.tabs.map((tab, i) => {
      var { page } = this.state;
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          key={i}
          onPress={() => this.props.onItemPress(i)}
        >
          {this.props.renderTab(tab, i, page)}
        </TouchableOpacity>
      );
    });
  }
  render() {
    if (!this.props.tabs) {
      return null;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          height: 60,
          backgroundColor: this.props.backgroundColor
        }}
      >
        {this._renderItem()}
      </View>
    );
  }
}

export default Tab;
