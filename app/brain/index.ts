import {dispatch} from 'febrest';
import {SSocketServer} from 'native';
import CMD from './CMD';
import {playStop, preSong, nextSong} from 'controller/music';

const PORT = 1988;
class Brain {
  socket: number | undefined;
  constructor() {}
  init() {
    SSocketServer.onopen = function() {
      console.log('server is ready');
    };
    SSocketServer.onconnect = data => {
      console.log('server is connect,');
      this.socket = data.data.id;
    };
    SSocketServer.onerror = function(data) {
      console.log('server is error ');
      dispatch(playStop);
    };
    SSocketServer.onmessage = (data: any) => {
      this.onCMD(data.data);
    };
    SSocketServer.onclose = function() {
      console.log('server is closed');
      setTimeout(() => {
        SSocketServer.listen(PORT);
      }, 5 * 60000);
    };
    SSocketServer.listen(PORT);
  }
  onCMD(data: any) {
    console.log('data', data);
    data = JSON.parse(data.data || '{}');
    const {message, paylod} = data;
    switch (message) {
      case CMD.MUSIC_PLAY:
        dispatch(playStop);
        break;
      case CMD.MUSIC_PREVIEW:
        dispatch(preSong);
        break;
      case CMD.MUSIC_NEXT:
        dispatch(nextSong);
        break;
      case CMD.MUSIC_PAUSE:
        dispatch(playStop);
        break;
    }
  }

  send(message: string, payload?: any) {
    if (!this.socket) {
      return;
    }
    let data = JSON.stringify({message, payload});
    SSocketServer.send(this.socket, data);
  }
}
export default new Brain();
