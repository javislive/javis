import {dispatch} from 'febrest';
import {SSocket} from 'native';
import CMD from './CMD';
import {musicPlay} from 'controller/music';
class Brain {
  constructor() {}
  init() {
    SSocket.onopen = () => {
      console.log('client is open');
      dispatch(musicPlay);
    };
    SSocket.onerror = function(data) {
      console.log('client is error');
      console.log(data);
    };
    SSocket.onmessage = function(data: any) {
      console.log('message from server');
      console.log(data);
    };
    SSocket.open('192.168.0.102', 1988);
  }
  destroy() {
    SSocket.close();
  }
  onCMD(data: any) {
    data = JSON.parse(data.data || '{}');
    const {message, paylod} = data;
    switch (message) {
      case CMD.SYS_CONNECT:
        break;
      case CMD.SYS_LOGIN:
        break;
      case CMD.SYS_LOGOUT:
        break;
      case CMD.DEVICE_ASYNC_MESSAGE:
        break;
      case CMD.MUSIC_PLAY:
        break;
      case CMD.MUSIC_PREVIEW:
        break;
      case CMD.MUSIC_NEXT:
        break;
      case CMD.MUSIC_PAUSE:
        break;
    }
  }
  send(message: string, payload?: any) {
    let data = JSON.stringify({message, payload});
    SSocket.send(data);
  }
}

export default new Brain();
