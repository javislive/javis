import {NativeModules, DeviceEventEmitter} from 'react-native';

let SocketServerManager = NativeModules.SocketServerManager;

class SockerServer {
  onopen: undefined | (() => void);
  onconnect: undefined | ((data: any) => void);
  onmessage: undefined | ((message: String) => void);
  onerror: undefined | ((error: any) => void);
  onclose: undefined | (() => void);
  listen(port: number) {
    SocketServerManager.listen(port);
  }
  send(socket: number, message: string) {
    SocketServerManager.send(socket, message);
  }
}

DeviceEventEmitter.addListener('socket_server_ready', function(data: any) {
  server.onopen && server.onopen();
});
DeviceEventEmitter.addListener('socket_server_connect', function(data: any) {
  server.onconnect && server.onconnect(data);
});
DeviceEventEmitter.addListener('socket_server_error', function(data: any) {
  server.onerror && server.onerror(data);
});
DeviceEventEmitter.addListener('socket_server_message', function(data: any) {
  server.onmessage && server.onmessage(data);
});
DeviceEventEmitter.addListener('socket_socket_close', function(data: any) {
  server.onclose && server.onclose();
});
const server = new SockerServer();
export default server;
