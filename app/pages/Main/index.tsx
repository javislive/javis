import {SSocket, SSocketServer} from 'native';
import {Text, TouchableOpacity, View} from 'react-native-ui';

import Application from 'celtics/Application';
import Clock from 'components/javis/Clock';
import MusicPlayer from 'components/javis/MusicPlayer';
import Page from 'celtics/Page';
import React from 'react';
import {dispatch} from 'febrest';

interface Props {}
let socket: number;
export default class Main extends Page<Props> {
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    // SSocket.onopen = function() {
    //   console.log('client is ready');
    // };
    // SSocket.onerror = function(data) {
    //   console.log('client is error');
    //   console.log(data);
    // };
    // SSocket.onmessage = function(data: any) {
    //   console.log('message from server');
    //   console.log(data);
    // };
    // SSocket.onclose = function() {
    //   console.log('client is closed');
    // };
    // SSocketServer.onopen = function() {
    //   console.log('server is ready');
    //   SSocket.open('127.0.0.1', 1988);
    // };
    // SSocketServer.onconnect = function(data) {
    //   console.log('server is connect');
    //   console.log(data);
    //   socket = data.data.id;
    // };
    // SSocketServer.onerror = function(data) {
    //   console.log('server is error');
    //   console.log(data);
    // };
    // SSocketServer.onmessage = function(data: any) {
    //   console.log('message from client');
    //   console.log(data);
    //   socket = data.data.id;
    // };
    // SSocketServer.onclose = function() {
    //   console.log('server is closed');
    // };
    // SSocketServer.listen(1988);
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Clock></Clock>
        <MusicPlayer></MusicPlayer>
      </View>
    );
  }
}

const styles = Application.createStyle(() => {
  return {
    wrapper: {
      flex: 1,
      backgroundColor: '#fff',
    },
  };
});
