import React, { PureComponent, RefObject, createRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui';
import { resize, vh, vw } from 'utils/resize';

import Application from 'celtics/Application';
import Board from 'components/SignBoard';
import Button from 'components/Button';
import { dispatch } from 'febrest';
import { getUplaodConfig } from 'actions/upload';

export default class SignBoard extends PureComponent {
  private _signBoard: RefObject<Board> = createRef();
  state = {
    show: false,
    inited: false
  };
  private callback: null | ((sign: string) => void) = null;
  sign(callback: (sign: string) => void) {
    this.callback = callback;
    this.setState({ show: true, inited: true });
  }
  upload() {
    return dispatch(getUplaodConfig).then(
      config => {
        return (
          this._signBoard.current &&
          this._signBoard.current
            .upload({ url: config.url, params: { token: config.token } })
            .then(data => {
              if (data && data.key) {
                return data.key;
              } else {
                return '';
              }
            })
        );
      },
      e => Promise.reject(e)
    );
  }
  render() {
    const { show, inited } = this.state;
    if (!inited) {
      return null;
    }
    return (
      <View
        style={[
          styles.wrapper,
          show ? null : { transform: [{ translateX: vw(100) }] }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.title}>
            <Text style={styles.titleText}>请在白色区域内签名</Text>
          </View>
          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>
              Copyright© TopBridal All Rights Reserved.
            </Text>
          </View>
        </View>
        <Board ref={this._signBoard} style={styles.main} />

        <View style={styles.footer}>
          <Button
            title="取消"
            onPress={this.cancel}
            size="sm"
            type="black"
          ></Button>
          <Button
            title="重签"
            onPress={this.clear}
            size="sm"
            type="inactive"
          ></Button>
          <Button
            title="完成"
            onPress={this.confirm}
            size="sm"
            type="active"
          ></Button>
        </View>
      </View>
    );
  }
  private cancel = () => {
    this.setState({ show: false });
    this.callback = null;
  };
  private clear = () => {
    this._signBoard.current && this._signBoard.current.clear();
  };
  private confirm = () => {
    this._signBoard.current &&
      this._signBoard.current.getImage().then(sign => {
        this.callback && this.callback(sign);
        this.callback = null;
        this.setState({ show: false });
      });
  };
}
const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgb(250,250,250)',
      top: 0,
      left: 0
    },
    header: {
      height: vh(22),
      borderBottomWidth: theme.px,
      borderBottomColor: theme.borderColor,
      paddingHorizontal: resize(28)
    },
    main: {
      flex: 1,
      backgroundColor: '#fff'
    },
    footer: {
      height: vh(22),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: theme.px,
      borderTopColor: theme.borderColor,
      paddingHorizontal: resize(28)
    },
    title: {
      paddingTop: vh(6),
      paddingBottom: vh(5),
      justifyContent: 'center',
      flexDirection: 'row'
    },
    titleText: {
      fontSize: resize(13),
      color: '#4A4A4A'
    },
    copyright: {
      justifyContent: 'flex-end',
      flexDirection: 'row'
    },
    copyrightText: {
      fontSize: resize(11),
      color: '#4A4A4A88'
    }
  };
});
