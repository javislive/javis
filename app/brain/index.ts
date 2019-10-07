import {dispatch, State} from 'febrest';
import {SSocketServer} from 'native';
import CMD from './CMD';
import {musicStop, musicPlay, preSong, nextSong} from 'controller/music';
import state from 'state';
import ACTION from './ACTION';

class Brain {
  sockets: number[] = [];
  authQueue: {[key: number]: any} = {};
  constructor() {}
  init(port: number) {
    SSocketServer.onopen = function() {
      console.log('server is ready');
    };
    SSocketServer.onconnect = event => {
      console.log('server is connect,');
      this.onConnect(event.data);
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
    let id = data.id;
    data = JSON.parse(data.data || '{}');
    const {message, payload} = data;
    switch (message) {
      case CMD.SYS_CONNECT:
        this.onDeviceConnect(id, payload);
        break;
      case CMD.SYS_LOGIN:
        this.onDeviceLogin(id, payload);
        break;
      case CMD.SYS_LOGOUT:
        this.onDeviceLogout(id);
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
  private onDeviceConnect(id: number, payload: any) {}
  private onConnect(data: any) {
    const id = data.id;
    this.waitForLogin(id);
  }
  private waitForLogin(id: number) {
    this.authQueue[id] = setTimeout(() => {
      SSocketServer.closeSocket(id);
    }, 5000);
  }
  private onDeviceLogin(id: number, payload: any) {
    clearTimeout(this.authQueue[id]);
    this.send(id, CMD.DEVICE_ASYNC_MESSAGE, this.getDeviceAsyncMessage());
    //验证逻辑以后补充
  }
  private onDeviceLogout(id: number) {
    SSocketServer.closeSocket(id);
  }
  private getDeviceAsyncMessage() {
    const music = State(state.music).get();
    return {
      music,
    };
  }
}
export default new Brain();
