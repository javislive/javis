import Header, {HeaderProps} from './Header';
import {NavigationEventPayload, NavigationScreenProps} from 'react-navigation';
import Page, {PageClass} from './../Page/index';
import React, {PureComponent, RefObject, createRef} from 'react';

import {ContentContainer} from '../ContentContainer';
import {View, TouchableOpacity, Text} from 'react-native';
import Application from '../Application';
import FontIcon from 'components/FontIcon';
import {createStyle} from 'celtics/Theme';

interface Props extends NavigationScreenProps {}

function Placeholder(props: {children: JSX.Element; top?: number}) {
  const {children, top} = props;
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#f4f4f4',
        top: top ? top : 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}>
      {children}
    </View>
  );
}
interface HeaderButtonProps {
  onPress?: () => void;
  style?: any;
  button?: JSX.Element | string | null;
}
class HeaderButton<P = {}> extends PureComponent<HeaderButtonProps & P> {
  state: {
    button?: JSX.Element | string | null;
  } = {
    button: null,
  };
  // update(button: JSX.Element | string | null) {
  //   this.setState({button});
  // }
  render() {
    const {button} = this.props;
    if (typeof button === 'string') {
      return (
        <TouchableOpacity
          style={[styles.headerButton, this.props.style]}
          activeOpacity={1}
          onPress={this.props.onPress}>
          <Text style={styles.headerButtonText}>{button}</Text>
        </TouchableOpacity>
      );
    }
    return button;
  }
}

interface LeftButtonProps extends HeaderButtonProps {
  scenes?: any;
  onBack?: () => boolean;
  navigation?: any;
}
class LeftButton extends HeaderButton<LeftButtonProps> {
  render() {
    const {button} = this.state;
    const {scenes, onBack, style, navigation} = this.props;
    if (!button && scenes && scenes.length > 1) {
      return (
        <TouchableOpacity
          style={[style, {paddingHorizontal: 10, marginHorizontal: 0}]}
          activeOpacity={1}
          onPress={() => {
            // dispatch(navigationGoBack);
            if (onBack && onBack()) {
              return;
            }
            navigation && navigation.dispatch({type: 'Navigation/BACK'});
          }}>
          <FontIcon icon="&#xe6db;" size={20} />
        </TouchableOpacity>
      );
    }
    return super.render();
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
      },
    };
    private pageRef: RefObject<Page> = createRef();
    private headerRef: RefObject<Header> = createRef();
    private containerRef: RefObject<ContentContainer<any>> = createRef();
    private focusSubscrition: any;
    private blurSubscrition: any;
    private ready = false;
    componentDidMount() {
      const {navigation} = this.props;
      this.focusSubscrition = navigation.addListener(
        'didFocus',
        this.navigationListener,
      );
      this.blurSubscrition = navigation.addListener(
        'didBlur',
        this.navigationListener,
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
    }
    render() {
      const {navigation} = this.props;
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
            }}></ContentContainer>
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
      let leftButton: JSX.Element | string = <View></View>;
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
          button={leftButton}></LeftButton>
      );
    };
    private renderRightButton = (scenes: any, navigation: any) => {
      let rightButton = null;
      if (this.pageRef.current) {
        rightButton =
          this.pageRef.current.renderHeaderRightButton(scenes, navigation) ||
          null;
      }
      return (
        <HeaderButton
          onPress={this.onRightPress}
          button={rightButton}
          style={styles.rightButton}></HeaderButton>
      );
    };
    private navigationListener = (paylod: NavigationEventPayload) => {
      const {type} = paylod;
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

const styles = createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
    },
    headerButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#28a745',
      height: 30,
      borderRadius: 5,
      width: 60,
      alignSelf: 'center',
    },
    headerButtonText: {
      fontSize: 12,
      color: '#fff',
    },
    leftButton: {
      marginHorizontal: theme.navigationHeaderButtonMargin,
    },
    rightButton: {
      marginHorizontal: theme.navigationHeaderButtonMargin,
    },
  };
});
