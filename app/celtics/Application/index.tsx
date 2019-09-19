import Alert, { AlertConfig } from '../ui/Alert';
import {
  AppState,
  AppStateStatus,
  StyleSheet as Style,
  View
} from 'react-native';
import { Plugin, PluginClass, PluginContainer } from '../Plugin';
import React, { PureComponent, RefObject, createRef } from 'react';
import Toast, { ToastPayload } from '../ui/Toast';
import { addTheme, createStyle, getTheme } from '../Theme';

import { ContentContainer } from '../ContentContainer';
import { ITheme } from '../Theme';

let inst: null | Application<any> = null;

interface Props {}
export default class Application<C = {}> extends PureComponent<Props> {
  static addTheme<T>(theme: T) {
    return addTheme(theme);
  }
  static getTheme(): ITheme {
    return getTheme();
  }
  static createStyle<T>(styleCreator: (theme: ITheme) => T): T {
    return createStyle(styleCreator);
  }
  static getInstance(): Application<any> | null {
    return inst;
  }
  constructor(props: Props) {
    super(props);
    inst = this;
  }
  private containerRef: RefObject<ContentContainer<any>> = createRef();
  private pluginRef: RefObject<PluginContainer> = createRef();
  private ctxs: { [name: string]: any } = {};
  private created: boolean = false;
  private appState: 'inactive' | 'background' | 'active' = 'inactive';
  private _plugins: { [name: string]: PluginClass<any, any, any> } = {};
  get plugins() {
    return {
      ...this._plugins,
      ...{
        TOAST: Toast,
        ALERT: Alert
      }
    };
  }
  set plugins(plugins: { [name: string]: PluginClass<any, any, any> }) {
    this._plugins = plugins;
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    Promise.resolve(this.onCreate())
      .then(() => {
        this.created = true;
        this.appState = 'active';
        this.forceUpdate();
      })
      .then(() => {
        this.onReady();
      });
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  onCreate() {}
  onReady() {}
  onPause() {}
  onResume() {}

  toast(payload: ToastPayload) {
    const toastPlugin = this.getPlugin('TOAST');
    if (toastPlugin) {
      toastPlugin.dispatch('toast', payload);
    }
  }
  alert(payload: AlertConfig) {
    const alertPlugin = this.getPlugin('ALERT');
    if (alertPlugin) {
      alertPlugin.dispatch('alert', payload);
    }
  }
  ctx(name: string, ctx?: any) {
    if (ctx) {
      this.ctxs[name] = ctx;
    } else {
      return this.ctxs[name];
    }
  }
  renderContent(): null | JSX.Element {
    return null;
  }
  getPlugin(name: string) {
    return this.pluginRef.current && this.pluginRef.current.getPlugin(name);
  }
  render() {
    if (!this.created) {
      return null;
    }
    return (
      <View style={styles.wrapper}>
        <ContentContainer
          ref={this.containerRef}
          renderContent={() => this.renderContent()}
        />
        <PluginContainer initialPlugins={this.plugins} ref={this.pluginRef} />
      </View>
    );
  }
  private _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.onResume();
    } else {
      this.onPause();
    }
    this.appState = nextAppState;
  };
}
const styles = Style.create({
  wrapper: {
    flex: 1
  }
});
