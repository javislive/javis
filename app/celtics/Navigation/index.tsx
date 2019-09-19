import {
  NavigationAction,
  NavigationActions,
  NavigationContainer,
  NavigationContainerComponent,
  NavigationNavigator,
  NavigationStackScreenOptions,
  NavigationState,
  createAppContainer
} from 'react-navigation';
import React, {
  ComponentClass,
  PureComponent,
  RefObject,
  createRef
} from 'react';

import { NavigationContainerProps } from 'react-navigation';
import { PageClass } from '../Page';
import Screen from './Screen';
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationRouteConfigMap } from 'react-navigation';

function createNavigator(
  pages: PageClass[],
  config?: any
): NavigationNavigator {
  const routeConfigMap: NavigationRouteConfigMap = {};
  pages.forEach(page => {
    const routeConfig = page.routeConfig;
    const name = routeConfig.name || page.name;
    const screen = Screen(page);
    routeConfigMap[name] = {
      screen,
      path: routeConfig.path || name
    };
  });

  const stackConfig = {
    ...config
  };
  return createStackNavigator(routeConfigMap, stackConfig);
}

function createContainer(
  pages: PageClass[],
  config?: any
): NavigationContainer {
  const navigator = createNavigator(pages, config);
  return createAppContainer(navigator);
}
export interface Props extends NavigationContainerProps {
  pages: PageClass[];
  config?: any;
  style?: object;
}
export default class Navigation extends PureComponent<Props> {
  private _container: NavigationContainer | null = null;
  private _containerRef: RefObject<NavigationContainerComponent> = createRef();
  constructor(props: Props) {
    super(props);
    if (props.pages) {
      this._container = createContainer(props.pages, props.config);
    }
  }
  render() {
    const Container = this._container;
    if (Container) {
      return (
        <Container
          ref={this._containerRef}
          style={this.props.style}
          onNavigationStateChange={this._onNavigationStateChange}
        />
      );
    } else {
      return null;
    }
  }
  navigate(routeName: string, params?: any) {
    this._containerRef.current &&
      this._containerRef.current.dispatch(
        NavigationActions.navigate({
          routeName,
          key: routeName,
          params
        })
      );
  }
  goBack(key?: string) {
    this._containerRef.current &&
      this._containerRef.current.dispatch(NavigationActions.back({ key }));
  }
  reset() {}
  private _onNavigationStateChange = (
    prevNavigationState: NavigationState,
    nextNavigationState: NavigationState,
    action: NavigationAction
  ) => {
    const { onNavigationStateChange } = this.props;
    onNavigationStateChange &&
      onNavigationStateChange(prevNavigationState, nextNavigationState, action);
  };
}
