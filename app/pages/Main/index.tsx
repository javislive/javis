import {Text, View, TouchableOpacity} from 'react-native-ui';

import Page from 'celtics/Page';
import React from 'react';
import {dispatch} from 'febrest';
import {SSocket, SSocketServer} from 'native';
interface Props {}
let socket: number;
export default class Main extends Page<Props> {
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    SSocket.onopen = function() {
      console.log('client is ready');
    };
    SSocket.onerror = function(data) {
      console.log('client is error');
      console.log(data);
    };
    SSocket.onmessage = function(data: any) {
      console.log('message from server');
      console.log(data);
    };
    SSocket.onclose = function() {
      console.log('client is closed');
    };
    SSocketServer.onopen = function() {
      console.log('server is ready');
      SSocket.open('127.0.0.1', 1988);
    };
    SSocketServer.onconnect = function(data) {
      console.log('server is connect');
      console.log(data);
      socket = data.data.id;
    };
    SSocketServer.onerror = function(data) {
      console.log('server is error');
      console.log(data);
    };
    SSocketServer.onmessage = function(data: any) {
      console.log('message from client');
      console.log(data);
      socket = data.data.id;
    };
    SSocketServer.onclose = function() {
      console.log('server is closed');
    };
    SSocketServer.listen(1988);
  }

  render() {
    return (
      <View>
        <Text>首页</Text>
        <TouchableOpacity
          onPress={() => {
            const message = new Date().toString();
            console.log('send message to server:' + message);
            SSocket.send(message);
          }}>
          <Text>发消息给服务端</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const message = new Date().toString();
            console.log('send message to client:' + message);
            SSocketServer.send(socket, message);
          }}>
          <Text>发消息给客户端</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
