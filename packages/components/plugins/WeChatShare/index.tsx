import React from 'react';
import { Plugin } from 'celtics/Plugin';
import { TouchableOpacity } from 'react-native-ui';
import Application from 'celtics/Application';
import Share from './Share';

export default class WeChatShare extends Plugin {

  state = {
    show: false,
    data: null
  }

  dispatch(action: string, data: any) {
    switch (action) {
      case 'show':
        this.show(data);
        return;
      default:
        this.close();
    }
  }

  show = (data: any) => {
    this.setState({
      show: true,
      data
    });
  }

  close = () => {
    this.setState({
      show: false,
      data: null
    });
  }

  render() {
    const { show, data } = this.state;
    if (!show) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.wrap}
        onPress={this.close}
      >
        <Share
          data={data}
          onShared={this.close}
        />
      </TouchableOpacity>
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
      backgroundColor: 'rgba(120, 120, 120, 0.3)',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }
  };
});
