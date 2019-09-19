import Header, { HeaderDelegate, HeaderUpdateConfig } from '../Header';
import {
  NavigationEventPayload,
  NavigationScreenProps
} from 'react-navigation';
import Page, { PageClass } from './../Page/index';
import React, { PureComponent, RefObject, createRef } from 'react';

import { ContentContainer } from '../ContentContainer';
import { View } from 'react-native';
import Application from '../Application';

interface Props extends NavigationScreenProps {}

function Placeholder(props: { children: JSX.Element; top?: number }) {
  const { children, top } = props;
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#f4f4f4',
        top: top ? top : 0,
        left: 0,
        bottom: 0,
        right: 0
      }}
    >
      {children}
    </View>
  );
}
export default function(Page: PageClass) {
  const routeConfig = Page.routeConfig;
  const isShowHeader = routeConfig.header !== null;
  return class Screen extends PureComponent<Props> implements HeaderDelegate {
    static navigationOptions = {
      header() {
        return null;
      }
    };
    private pageRef: RefObject<Page> = createRef();
    private headerRef: RefObject<Header> = createRef();
    private containerRef: RefObject<ContentContainer<any>> = createRef();
    private focusSubscrition: any;
    private blurSubscrition: any;
    private ready = false;
    componentDidMount() {
      const { navigation } = this.props;
      this.focusSubscrition = navigation.addListener(
        'didFocus',
        this.navigationListener
      );
      this.blurSubscrition = navigation.addListener(
        'didBlur',
        this.navigationListener
      );
      if (this.pageRef.current) {
        Promise.resolve(this.pageRef.current.onCreate()).then(() => {
          this.ready = true;
          this.containerRef.current && this.containerRef.current.update();
          this.pageRef.current && this.pageRef.current.onReady();
        });
      }
    }
    componentWillUnmount() {
      this.focusSubscrition.remove();
      this.blurSubscrition.remove();
    }
    render() {
      const { navigation } = this.props;
      return (
        <View style={styles.wrapper}>
          {isShowHeader ? (
            <Header ref={this.headerRef} delegate={this} />
          ) : null}
          <Page
            getParam={navigation.getParam}
            headerUpdater={this.updateHeader}
            ref={this.pageRef}
          />
          <ContentContainer
            ref={this.containerRef}
            renderContent={() => {
              /*可能会存在如果navigationHeaderHeight变化更新不到的情况，需要待验证*/
              return this.ready ? null : (
                <Placeholder
                  top={
                    isShowHeader
                      ? Application.getTheme().navigationHeaderHeight
                      : 0
                  }
                >
                  {Page.LoadingView()}
                </Placeholder>
              );
            }}
          ></ContentContainer>
        </View>
      );
    }
    onBack(): boolean {
      if (this.pageRef.current) {
        return this.pageRef.current.onBack();
      }
      return false;
    }
    onLeftPress() {
      if (this.pageRef.current) {
        return this.pageRef.current.onHeaderLeftButtonPress();
      }
    }
    onRightPress() {
      if (this.pageRef.current) {
        return this.pageRef.current.onHeaderRightButtonPress();
      }
    }
    private updateHeader = (config: HeaderUpdateConfig) => {
      /*header未加载的情况需要处理*/
      this.headerRef.current && this.headerRef.current.update(config);
    };
    private navigationListener = (paylod: NavigationEventPayload) => {
      const { type } = paylod;
      if (type === 'didBlur' && this.pageRef.current) {
        this.pageRef.current.onBlur();
        this.pageRef.current.pageStatus = 'blur';
      }
      if (type === 'didFocus' && this.pageRef.current) {
        this.pageRef.current.onFocus();
        this.pageRef.current.pageStatus = 'focus';
      }
    };
  };
}

const styles = {
  wrapper: {
    flex: 1
  }
};
