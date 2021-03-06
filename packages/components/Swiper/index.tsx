"use strict";

import PropTypes, { number } from "prop-types";
import React, { PureComponent, RefObject, createRef } from "react";
import { View, ViewPagerAndroidProps } from "react-native";

import Indicator from "./Indicator";
import { ViewPager } from "components/viewpager";

interface Props extends ViewPagerAndroidProps {
  loop: boolean;
  autoplay: boolean;
  interval: number;
  indicator: boolean;
}
class Swiper extends PureComponent<Props> {
  static defaultProps = {
    initialPage: 0,
    interval: 5000,
    loop: false,
    autoplay: false,
    keyboardDismissMode: "on-drag",
    scrollEnabled: true,
    indicator: true
  };
  _timeout: number | undefined;
  _selected = 0;
  _pageCount = 0;
  state = {};
  viewpagerRef: RefObject<ViewPager> = createRef();
  incatorRef: RefObject<Indicator> = createRef();
  componentDidMount() {
    if (this.props.autoplay) {
      this._play();
    }
  }
  componentWillUnmount() {
    this._stop();
  }

  _play() {
    this._timeout = setTimeout(() => {
      clearTimeout(this._timeout);
      var page = this._page(this._selected) + 1;
      this.setPage(page);
      this._play();
    }, this.props.interval);
  }
  _stop() {
    clearTimeout(this._timeout);
  }

  _onPageScrollStateChange(state: "Idle" | "Dragging" | "Settling") {
    if (state !== "Idle") {
      this._stop();
    } else if (this.props.autoplay) {
      this._play();
    }
    this.props.onPageScrollStateChanged &&
      this.props.onPageScrollStateChanged(state);
  }
  _onPageSelected(e) {
    var { position } = e.nativeEvent;
    var page = this._page(position);
    this._selected = position;
    if (this.props.loop && this._pageCount > 1) {
      if (position == 0) {
        this.setPageWithoutAnimation(this._pageCount - 1);
      } else if (position == this._pageCount + 1) {
        this.setPageWithoutAnimation(0);
      }
    }
    var outerEvent = { nativeEvent: { position: page } };
    this.incatorRef.current &&
      this.incatorRef.current.onPageSelected(outerEvent);
    this.props.onPageSelected && this.props.onPageSelected(outerEvent);
  }
  _onPageScroll(e) {
    var { position, offset } = e.nativeEvent;
    var page = this._page(position);
    var outerEvent = { nativeEvent: { position: page, offset } };
    this.incatorRef.current && this.incatorRef.current.onPageScroll(outerEvent);
    this.props.onPageScroll && this.props.onPageScroll(outerEvent);
  }
  _position(page: number): number {
    if (this.props.loop && this._pageCount > 1) {
      page++;
    }
    return page;
  }
  _page(position: number): number {
    if (this.props.loop && this._pageCount > 1) {
      if (position == 0) {
        position = this._pageCount - 1;
      } else if (position == this._pageCount + 1) {
        position = 0;
      } else {
        position--;
      }
    }
    return position;
  }

  setPageWithoutAnimation(selectedPage: number) {
    selectedPage = this._position(selectedPage);
    this.viewpagerRef.current &&
      this.viewpagerRef.current.setPageWithoutAnimation(selectedPage);
  }

  setPage(selectedPage: number) {
    selectedPage = this._position(selectedPage);
    this.viewpagerRef.current &&
      this.viewpagerRef.current.setPage(selectedPage);
  }

  render() {
    var { children, initialPage } = this.props;
    var childrenCount = React.Children.count(children);
    this._pageCount = childrenCount;

    if (this.props.loop && childrenCount > 1) {
      var first = children[0];
      var last = children[childrenCount - 1];
      first = React.createElement(first.type, first.props);
      last = React.createElement(last.type, last.props);
      children = React.Children.map(children, function(child) {
        return child;
      });
      children.push(first);
      children.unshift(last);
      initialPage++;
    }
    this._selected = initialPage;
    var viewpagerProps = {
      ...this.props,
      onPageSelected: e => this._onPageSelected(e),
      onPageScroll: e => this._onPageScroll(e),
      onPageScrollStateChange: state => this._onPageScrollStateChange(state),
      children,
      initialPage,
      ref: this.viewpagerRef,
      style: { flex: 1 }
    };
    var style = [
      this.props.style,
      {
        flexDirection: "column",
        justifyContent: undefined,
        alignItems: undefined
      }
    ];
    return (
      <View style={style} onLayout={this.props.onLayout}>
        <ViewPager {...viewpagerProps} />
        {this.props.indicator && (
          <Indicator
            ref={this.incatorRef}
            initialPage={this.props.initialPage}
            count={childrenCount}
          />
        )}
      </View>
    );
  }
}

export default Swiper;
