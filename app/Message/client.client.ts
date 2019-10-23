import CMD from './CMD';
import {SSocket} from 'native';

class Client {
  open(config: any, handlers: any) {
    return new Promise((resolve, reject) => {
      let isClosed = false;
      SSocket.onopen = event => {
        if (isClosed) {
          return;
        }
        this.login();
        console.log('client is open');
      };
      SSocket.onerror = function({data}: any) {
        console.log('client is error');
        handlers.onerror(JSON.parse(data.data || '{}'));
      };
      SSocket.onclose = ({data}: any) => {
        console.log('client closed');
        handlers.onclose(data.id);
      };
      SSocket.onmessage = ({data}: any) => {
        console.log('message from server');
        const {cmd, data: mData} = data;
        switch (cmd) {
          case CMD.SYS_LOGIN:
            resolve();
            clearTimeout(t);
            break;
          case CMD.SYS_MESSAGE:
            handlers.onmessage(JSON.parse(mData || '{}'));
            break;
        }
      };

      SSocket.open(config.ip, config.port);
      let t = setTimeout(() => {
        isClosed = true;
        reject();
      }, 60000);
    });
  }
  send(data: any) {
    SSocket.send(JSON.stringify({cmd: CMD.SYS_MESSAGE, data}));
  }
  close() {
    SSocket.close();
  }
  private login() {
    SSocket.send(JSON.stringify({cmd: CMD.SYS_LOGIN}));
  }
}

export default new Client();
