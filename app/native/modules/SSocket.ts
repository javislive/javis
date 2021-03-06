import {DeviceEventEmitter, NativeModules} from 'react-native';

let SocketClientManager = NativeModules.SocketClientManager;

class SSocket {
  onopen: undefined | ((event: any) => void);
  onmessage: undefined | ((message: String) => void);
  onerror: undefined | ((error: any) => void);
  onclose: undefined | ((event: any) => void);
  constructor() {}
  open(address: string, port: number) {
    SocketClientManager.open(address, port);
  }
  send(message: string) {
    SocketClientManager.send(message);
  }
  close() {
    SocketClientManager.close();
  }
}

const socket = new SSocket();

DeviceEventEmitter.addListener('socket_client_connect', function(data: any) {
  socket.onopen && socket.onopen(data);
});
DeviceEventEmitter.addListener('socket_client_error', function(data: any) {
  socket.onerror && socket.onerror(data);
});
DeviceEventEmitter.addListener('socket_client_message', function(data: any) {
  socket.onmessage && socket.onmessage(data);
});
DeviceEventEmitter.addListener('socket_client_close', function(data: any) {
  socket.onclose && socket.onclose(data);
});

export default socket;
