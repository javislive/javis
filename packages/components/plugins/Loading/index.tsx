import React from 'react';
import { Plugin } from 'celtics/Plugin';
import {
  ActivityIndicator,
  View,
} from 'react-native'
import Application from 'celtics/Application';

export default class Loading extends Plugin {

  state = {
    show: false,
  }

  dispatch(action: string, data: any) {
    switch (action) {
      case 'show':
        this.show();
        return;
      default:
        this.close();
    }
  }

  show = (data: any) => {
    this.setState({
      show: true,
    });
  }

  close = () => {
    this.setState({
      show: false,
    });
  }

  render() {
    const { show } = this.state;
    if (!show) {
      return null;
    }
    return (
      <View
        style={styles.wrap}
      >
        <ActivityIndicator size="large" color="#C9B27C" />
      </View>
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    wrap: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(120, 120, 120, 0)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  };
});
