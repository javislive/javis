import { ContentContainer } from '../ContentContainer';
import React, {
  RefObject,
  Fragment,
  ComponentClass,
  createRef,
  PureComponent
} from 'react';

export interface PluginClass<T, P, S> {
  new (props: P, ctx?: S): Plugin<T, P, S>;
}
export abstract class Plugin<T = {}, P = {}, S = {}> extends PureComponent<
  P,
  S
> {
  abstract dispatch(action: string, payload?: T): void;
}

export interface Props {
  initialPlugins: { [name: string]: PluginClass<any, any, any> };
}
export class PluginContainer extends ContentContainer<Props> {
  private plugins: { [name: string]: RefObject<Plugin<any, any, any>> } = {};
  private pluginMap: { [name: string]: number } = {};
  private pluginElements: any[] = [];
  constructor(props: Props) {
    super(props);
    if (this.props.initialPlugins) {
      this.addPlugins(this.props.initialPlugins);
    }
  }
  getPlugin(name: string) {
    return this.plugins[name] && this.plugins[name].current;
  }
  addPlugins(plugins: { [name: string]: PluginClass<any, any, any> }) {
    const { pluginMap, pluginElements, plugins: refs } = this;
    for (let p in plugins) {
      const index = pluginMap[p];
      let ref = refs[p];
      if (index !== undefined) {
        delete pluginElements[index];
      } else {
        ref = createRef();
        refs[p] = ref;
      }
      const plugin = plugins[p];
      const element = React.createElement(plugin, { ref, key: p });
      pluginElements.push(element);
      pluginMap[p] = pluginElements.length - 1;
    }
    this.update();
  }
  removePlugin(name: string) {
    const { pluginMap, pluginElements, plugins: refs } = this;
    const index = pluginMap[name];
    if (index !== undefined) {
      delete pluginMap[name];
      delete pluginElements[index];
      delete refs[name];
      this.update();
    }
  }
  invoke(pluginName: string, action: string, payload: any) {
    const plugin = this.getPlugin(pluginName);
    if (plugin) {
      plugin.dispatch(action, payload);
    }
  }
  renderContent() {
    return <Fragment>{this.pluginElements}</Fragment>;
  }
}
