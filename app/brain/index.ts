import {dispatch} from 'febrest';
import {SSocketServer} from 'native';
import CMD from './CMD';
import {musicStop, musicPlay, preSong, nextSong} from 'controller/music';

class Brain {
  sockets: number[] = [];
  constructor() {}
  init(port: number) {
    SSocketServer.onopen = function() {
      console.log('server is ready');
    };
    SSocketServer.onconnect = event => {
      console.log('server is connect,');
      this.onDeviceConnect(event.data);
    };
    SSocketServer.onerror = function(event) {
      console.log('server is error ');
      dispatch(musicStop);
    };
    SSocketServer.onmessage = (event: any) => {
      this.onCMD(event.data);
    };
    SSocketServer.onclose = function() {
      console.log('server is closed');
      setTimeout(() => {
        SSocketServer.listen(port);
      }, 5 * 60000);
    };
    SSocketServer.listen(port);
  }
  destroy() {
    SSocketServer.close();
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
        dispatch(musicPlay);
        break;
      case CMD.MUSIC_PREVIEW:
        dispatch(preSong);
        break;
      case CMD.MUSIC_NEXT:
        dispatch(nextSong);
        break;
      case CMD.MUSIC_PAUSE:
        dispatch(musicStop);
        break;
    }
  }

  send(id: number, message: string, payload?: any) {
    let data = JSON.stringify({message, payload});
    SSocketServer.send(id, data);
  }
  private onDeviceConnect(data: any) {
    const id = data.id;

    this.sockets.push(data.id);
  }
}
export default new Brain();
