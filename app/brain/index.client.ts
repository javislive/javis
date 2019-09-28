import {dispatch} from 'febrest';
import {SSocket} from 'native';
import CMD from './CMD';
import {playStop} from 'controller/music';
class Brain {
  constructor() {}
  init() {
    SSocket.onopen = () => {
      dispatch(playStop);
    };
    SSocket.onerror = function(data) {
      console.log('client is error');
      console.log(data);
    };
    SSocket.onmessage = function(data: any) {
      console.log('message from server');
      console.log(data);
    };
    SSocket.open('192.168.0.102', 1998);
  }
  onCMD(cmd: string) {}
  send(message: string, payload?: any) {
    let data = JSON.stringify({message, payload});
    SSocket.send(data);
  }
}

export default new Brain();
