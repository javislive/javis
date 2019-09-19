import React, { PureComponent } from 'react';

import Application from '../Application';
import { View } from 'react-native';
import { HeaderUpdateConfig } from '../Header';

interface Props {
  getParam: (name: string) => any;
  headerUpdater: (config: HeaderUpdateConfig) => void;
}
export interface PageClass<T = {}, C = {}> {
  new (props: T, context?: any): Page<T, C>;
  LoadingView: () => JSX.Element;
  routeConfig: RouteConfig;
}
export interface RouteConfig extends HeaderUpdateConfig {
  path?: string;
  name?: string;
  header?: boolean;
}
class Page<T = {}, C = {}> extends PureComponent<Props & T, C> {
  static LoadingView() {
    return <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}></View>;
  }
  static routeConfig: RouteConfig = {
    header: true
  };
  /**header delegate*/
  onBack(): boolean {
    return false;
  }
  updateHeader(config: HeaderUpdateConfig) {
    this.props.headerUpdater && this.props.headerUpdater(config);
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

  application() {
    return Application.getInstance();
  }
  getParam(name: string) {
    return this.props.getParam(name);
  }
  renderHeaderLeftButton() {
    return null;
  }
  renderHeaderRightButton() {
    return null;
  }
  renderTitle() {
    return null;
  }
}
export default Page;
