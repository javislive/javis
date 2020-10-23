import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui';

import Application from 'celtics/Application';
import BuildConfig from 'BuildConfig';
import app from 'actions/app';
import common from 'actions/common';
import { dispatch } from 'febrest';
import { resize } from 'utils/resize';

interface Props {
  mobile: () => string;
}

const ERROR_MESSAGE =
  BuildConfig.platform == 'c' ? '请输入客户手机号码' : '请输入手机号码';
const SUCCESS_MESSAGE =
  BuildConfig.platform == 'c'
    ? '验证码已经发送到客户手机，请查收'
    : '验证码已经发送到手机，请查收';
export class CountDown extends PureComponent<Props> {
  state = {
    startTime: 0,
    duration: 60
  };
  timeout: any;
  componentDidUpdate() {}
  render() {
    const seconds = this.seconds();
    const { duration } = this.state;
    const isActive = seconds >= duration;
    this.refresh(isActive);
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.touch}
          activeOpacity={1}
          onPress={() => {
            if (isActive) {
              this.onPress();
            }
          }}
        >
          <Text style={styles.text}>
            {isActive ? '获取' : duration - seconds}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  private onPress() {
    const mobile = this.props.mobile();
    if (!mobile) {
      dispatch(app.toast, {
        message: ERROR_MESSAGE
      });
      return;
    }
    dispatch(common.verify, mobile).then(data => {
      dispatch(app.toast, {
        message: SUCCESS_MESSAGE + (BuildConfig.env === 'prod' ? '' : data)
      });
      this.setState({
        startTime: Date.now()
      });
    });
  }
  private refresh(isActive: boolean) {
    clearTimeout(this.timeout);
    if (!isActive) {
      this.timeout = setTimeout(() => {
        this.forceUpdate();
      }, 500);
    }
  }
  private seconds() {
    const { startTime } = this.state;
    const now = Date.now();
    return Math.ceil((now - startTime) / 1000);
  }
}
const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      width: resize(56),
      height: resize(13),
      borderLeftWidth: theme.px,
      borderLeftColor: theme.borderColor
    },
    touch: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      color: '#806E47',
      fontSize: resize(13)
    }
  };
});
