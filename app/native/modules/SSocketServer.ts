import {DeviceEventEmitter, NativeModules} from 'react-native';

let SocketServerManager = NativeModules.SocketServerManager;

class SockerServer {
  onopen: undefined | ((data: any) => void);
  onconnect: undefined | ((data: any) => void);
  onmessage: undefined | ((message: String) => void);
  onerror: undefined | ((error: any) => void);
  onclose: undefined | ((data: any) => void);
  listen(port: number) {
    SocketServerManager.listen(port);
  }
  send(socket: number, message: string) {
    SocketServerManager.send(socket, message);
  }
  closeSocket(socket: number) {
    SocketServerManager.closeSocket(socket);
  }
  close() {
    SocketServerManager.close();
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
  server.onclose && server.onclose(data);
});
const server = new SockerServer();
export default server;
