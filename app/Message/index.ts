import CMD from 'constants/CMD';
import socket from './client';

class Message {
  onmessage: ((data: any) => void) | undefined;
  onerror: ((id: number) => void) | undefined;
  onclose: ((id?: number) => void) | undefined;
  onconnect: ((id?: number) => void) | undefined;
  connect(config: any, handler: any) {
    return socket.open(config, handler);
  }
  destroy() {
    socket.close();
  }
  send(data: any, channel?: number) {
    socket.send(data, channel);
  }
}

const message = new Message();
export default message;
