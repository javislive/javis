import { Image, Text, View } from 'react-native-ui';
import React, { PureComponent } from 'react';

import FontIcon from 'components/FontIcon';
import TextInput from 'components/TextInput';
import { createStyle } from 'themes';
import { dispatch } from 'febrest';
import { CountDown } from 'components/CountDown';

import { resize } from 'utils/resize';
import BuildConfig from 'BuildConfig';
import Button from 'components/Button';

interface Props {
  onLogin: () => void;
}
export default class Login extends PureComponent<Props> {
  state = {
    mobile: '',
    admin: '',
    code: ''
  };
  componentDidMount() {
    // dispatch("user.login", { id: "13661638284" }).then(() => {
    //   this.props.onLogin();
    // });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Image
          resizeMode="stretch"
          source={require('./toplogo.png')}
          style={styles.logo}
        />
        <TextInput
          onChangeText={v => (this.state.mobile = v)}
          placeholder="请输入新人手机号码"
          placeholderTextColor="#A3A3A3"
          style={styles.inputWrapper}
          inputStyle={styles.input}
          radius={false}
          underline={true}
        />
        <TextInput
          onChangeText={v => (this.state.admin = v)}
          placeholder="请输入婚纱顾问账号"
          placeholderTextColor="#A3A3A3"
          style={styles.inputWrapper}
          inputStyle={styles.input}
          radius={false}
          underline={true}
        />
        <TextInput
          onChangeText={v => (this.state.code = v)}
          placeholder="请输入新人手机验证码"
          placeholderTextColor="#A3A3A3"
          style={styles.inputWrapper}
          inputStyle={styles.input}
          radius={false}
          underline={true}
          rightChild={<CountDown mobile={() => this.state.mobile} />}
        />
        <Button title="登录" size="lg" onPress={this.login} />
      </View>
    );
  }
  private login = () => {
    const { mobile, admin, code } = this.state;
    if (!mobile) {
      dispatch('app.toast', { message: '请输入新人手机号码' });
      return;
    }
    if (!admin) {
      dispatch('app.toast', { message: '请输入婚纱顾问账号' });
      return;
    }
    if (!code) {
      dispatch('app.toast', { message: '请输入新人手机验证码' });
      return;
    }
    dispatch('user.login', { mobile, employee: admin, code }).then(() => {
      this.props.onLogin();
    });
  };
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      alignItems: 'center',
      paddingTop: resize(120)
    },
    logo: {
      height: resize(30),
      width: resize(141),
      marginBottom: resize(68)
    },
    inputWrapper: {
      width: resize(306),
      height: resize(36),
      borderBottomWidth: theme.px,
      borderBottomColor: '#979797',
      backgroundColor: 'transparent',
      marginBottom: resize(18)
    },
    input: {
      color: '#fff',
      fontSize: resize(15),
      height: resize(30),
      lineHeight: resize(30),
      paddingHorizontal: 0
    }
  };
});
