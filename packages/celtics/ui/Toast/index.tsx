import React, { PureComponent } from 'react';
import { Text, View } from 'react-native-ui';
import { createStyle } from '../../Theme';
import { Plugin } from '../../Plugin';

interface Props {}
export interface State {
  showMessage: boolean;
  message: string;
}
const LONG_DISSMISS = 5 * 1e3;
const SHROT_DISSMISS = 2 * 1e3;
let TOAST_INST: Toast | undefined;
export interface ToastPayload {
  message: string;
  duration?: number;
  callback?: () => void;
}
export default class Toast extends Plugin<ToastPayload> {
  static readonly LONG_DISSMISS = LONG_DISSMISS;
  static readonly SHROT_DISSMISS = SHROT_DISSMISS;
  static toast(message: string, dismiss?: number, callback?: () => void) {
    TOAST_INST && TOAST_INST.toast(message, dismiss, callback);
  }
  state: State = {
    showMessage: false,
    message: ''
  };
  private timeout: any;
  private callback: undefined | (() => void);
  componentWillUnmount() {
    this.timeout = undefined;
    this.callback = undefined;
    TOAST_INST = undefined;
  }
  componentDidMount() {
    TOAST_INST = this;
  }
  dispatch(action: string, payload?: ToastPayload) {
    if (action === 'toast' && payload) {
      this.toast(payload.message, payload.duration, payload.callback);
    }
  }
  toast(message: string, dismiss?: number, callback?: () => void): void {
    if (typeof dismiss === 'function') {
      callback = dismiss;
      dismiss = undefined;
    }
    if (dismiss === undefined) {
      dismiss = LONG_DISSMISS;
    }
    this.setState({ message: message, showMessage: true });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.callback) {
      this.callback();
    }
    this.callback = callback;
    this.timeout = setTimeout(this._dissmiss, dismiss);
  }
  private _dissmiss = () => {
    this.setState({
      message: '',
      showMessage: false
    });
    this.callback && this.callback();
    this.callback = undefined;
    this.timeout = undefined;
  };
  render() {
    const { message, showMessage } = this.state;
    if (!showMessage) {
      return null;
    }
    return (
      <View style={styles.wrapper}>
        <Text style={styles.message}>{message}</Text>
      </View>
    );
  }
}

const styles = createStyle(theme => ({
  wrapper: {
    position: 'absolute',
    ...theme.toastWrapper
  },
  message: {
    ...theme.toastText
  }
}));
