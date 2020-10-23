import Header, { HeaderProps } from './Header';
import {
  NavigationEventPayload,
  NavigationScreenProps
} from 'react-navigation';
import Page, { PageClass } from './../Page/index';
import React, { PureComponent, RefObject, createRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Application from '../Application';
import { ContentContainer } from '../ContentContainer';
import FontIcon from 'components/FontIcon';
import { createStyle } from 'celtics/Theme';
import { resize } from 'utils/resize';

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
interface HeaderButtonProps {
  onPress?: () => void;
  style?: any;
  button: JSX.Element | string | null;
}
class HeaderButton<P = {}> extends PureComponent<HeaderButtonProps & P> {
  state: {
    button?: JSX.Element | string;
  } = {
    button: ''
  };
  // update(button: JSX.Element | string | null) {
  //   this.setState({button});
  // }
  render() {
    let { button } = this.props;
    if (typeof button === 'string') {
      return (
        <TouchableOpacity
          style={[styles.headerButton, this.props.style]}
          activeOpacity={1}
          onPress={this.props.onPress}
        >
          <Text style={styles.headerButtonText}>{button}</Text>
        </TouchableOpacity>
      );
    } else {
      button = button || <View></View>;
      return React.cloneElement(button, {
        style: [button.props.style, this.props.style]
      });
    }
  }
}

interface LeftButtonProps extends HeaderButtonProps {
  scenes?: any;
  onBack?: () => boolean;
  navigation?: any;
}
class LeftButton extends HeaderButton<LeftButtonProps> {
  render() {
    const { button } = this.props;
    const { scenes, onBack, style, navigation } = this.props;
    if (!button && scenes && scenes.length > 1) {
      return (
        <TouchableOpacity
          style={[style, { paddingHorizontal: 10, marginHorizontal: 0 }]}
          activeOpacity={1}
          onPress={() => {
            // dispatch(navigationGoBack);
            if (onBack && onBack()) {
              return;
            }
            navigation && navigation.dispatch({ type: 'Navigation/BACK' });
          }}
        >
          <FontIcon icon="&#xe860;" size={resize(20)} />
          <Text
            style={{
              color: '#666',
              fontSize: resize(16)
            }}
          >
            返回
          </Text>
        </TouchableOpacity>
      );
    }
    return super.render();
  }
}
let sacrifice_data: any = null;
function _sacrifice(data?: any) {
  if (data === undefined) {
    return sacrifice_data;
  } else {
    sacrifice_data = data;
  }
}
export default function(Page: PageClass) {
  const routeConfig = Page.routeConfig;
  let headerOptions: any;
  return class Screen extends PureComponent<Props> {
    static navigationOptions = {
      header(options: any) {
        headerOptions = options;
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
          this.updateHeader();
          this.containerRef.current && this.containerRef.current.update();
          this.pageRef.current && this.pageRef.current.onReady();
        });
      }
    }
    componentWillUnmount() {
      this.focusSubscrition.remove();
      this.blurSubscrition.remove();
      const sacrifice =
        this.pageRef.current && this.pageRef.current.sacrifice();
      _sacrifice({ data: sacrifice, from: routeConfig.name });
    }
    render() {
      const { navigation } = this.props;
      return (
        <View style={[styles.wrapper]}>
          <Header
            ref={this.headerRef}
            {...headerOptions}
            renderHeader={this.renderHeader}
            renderLeftButton={this.renderLeftButton}
            renderRightButton={this.renderRightButton}
            renderTitle={this.renderTitle}
          />
          <Page
            navigationState={navigation.state}
            getParam={navigation.getParam}
            onUpdate={this.onPageUpdate}
            ref={this.pageRef}
          />
          <ContentContainer
            ref={this.containerRef}
            renderContent={() => {
              /*可能会存在如果navigationHeaderHeight变化更新不到的情况，需要待验证*/
              return this.ready ? null : (
                <Placeholder>{Page.LoadingView()}</Placeholder>
              );
            }}
          ></ContentContainer>
        </View>
      );
    }
    private onBack = (): boolean => {
      if (this.pageRef.current) {
        return this.pageRef.current.onBack();
      }
      return false;
    };
    private onLeftPress = () => {
      if (this.pageRef.current) {
        return this.pageRef.current.onHeaderLeftButtonPress();
      }
    };
    private onRightPress = () => {
      if (this.pageRef.current) {
        return this.pageRef.current.onHeaderRightButtonPress();
      }
    };
    private onPageUpdate = () => {
      this.updateHeader();
    };
    private updateHeader = () => {
      this.headerRef.current && this.headerRef.current.update();
    };
    private renderHeader = (scenes: any, navigation: any) => {
      let header;
      if (this.pageRef.current) {
        header = this.pageRef.current.renderHeader(scenes, navigation);
      }
      if (header === undefined) {
        return routeConfig.header;
      }
      return header;
    };
    private renderTitle = (scenes: any, navigation: any) => {
      let title;
      if (this.pageRef.current) {
        title = this.pageRef.current.renderTitle(scenes, navigation);
      }
      if (!title) {
        return routeConfig.title;
      }
      return title;
    };
    private renderLeftButton = (scenes: any, navigation: any) => {
      let leftButton: JSX.Element | string | null = null;
      if (this.pageRef.current) {
        leftButton =
          this.pageRef.current.renderHeaderLeftButton(scenes, navigation) ||
          leftButton;
      }
      return (
        <LeftButton
          onPress={this.onLeftPress}
          onBack={this.onBack}
          scenes={scenes}
          navigation={navigation}
          style={styles.leftButton}
          button={leftButton}
        ></LeftButton>
      );
    };
    private renderRightButton = (scenes: any, navigation: any) => {
      let rightButton: JSX.Element | string | null = null;
      if (this.pageRef.current) {
        rightButton =
          this.pageRef.current.renderHeaderRightButton(scenes, navigation) ||
          rightButton;
      }
      return (
        <HeaderButton
          onPress={this.onRightPress}
          button={rightButton}
          style={styles.rightButton}
        ></HeaderButton>
      );
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
        this.pageRef.current.onSacrifice(_sacrifice());
        _sacrifice(null);
      }
    };
  };
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      flex: 1
    },
    headerButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#28a745',
      height: 30,
      borderRadius: 5,
      width: 60,
      alignSelf: 'center'
    },
    headerButtonText: {
      fontSize: 12,
      color: '#fff'
    },
    leftButton: {
      paddingHorizontal: theme.navigationHeaderButtonMargin
    },
    rightButton: {
      paddingHorizontal: theme.navigationHeaderButtonMargin
    }
  };
});
