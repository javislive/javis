import React, { PureComponent } from 'react';
import { NavigationState } from 'react-navigation';

import Application from '../Application';
import { View } from 'react-native';

interface Props {
  getParam: (name: string) => any;
  onUpdate: () => void;
  navigationState: NavigationState;
}
export interface PageClass<T = {}, C = {}> {
  new (props: T, context?: any): Page<T, C>;
  LoadingView: () => JSX.Element;
  routeConfig: RouteConfig;
}
export interface RouteConfig {
  path?: string;
  name?: string;
  title?: string;
  header?: null | JSX.Element;
}
class Page<T = {}, C = {}> extends PureComponent<Props & T, C> {
  constructor(props: Props & T) {
    super(props);
  }
  static LoadingView() {
    return <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}></View>;
  }
  static routeConfig: RouteConfig = {};
  componentDidUpdate(prevProps: Props & T, prevState: C) {
    this.props.onUpdate && this.props.onUpdate();
  }

  /**header delegate*/
  onBack(): boolean {
    return false;
  }
  onHeaderLeftButtonPress() {}
  onHeaderRightButtonPress() {}
  pageStatus: 'blur' | 'focus' = 'blur';
  onFocus() {
    this.pageStatus = 'focus';
  }
  onBlur() {
    this.pageStatus = 'blur';
  }
  onCreate() {}
  onReady() {}
  /*接受下一级页面back的时候传递的数据*/
  onSacrifice(data: any) {}
  /*back的时候向上一级页面传递数据*/
  sacrifice() {
    return null;
  }
  application() {
    return Application.getInstance();
  }
  getParam(name: string) {
    return this.props.getParam(name);
  }
  getParams() {
    const { navigationState = {} } = this.props;
    return navigationState.params || {};
  }
  renderHeaderLeftButton(
    scenes: any,
    navigation: any
  ): string | null | JSX.Element {
    return null;
  }
  renderHeaderRightButton(
    scenes: any,
    navigation: any
  ): string | null | JSX.Element {
    return null;
  }
  renderTitle(scenes: any, navigation: any): string | null | JSX.Element {
    return null;
  }
  renderHeader(scenes: any, navigation: any): undefined | null | JSX.Element {
    return undefined;
  }
}
export default Page;
