import CMD from './CMD';
import {SSocketServer} from 'native';

class Client {
  private sockets: number[] = [];
  private authQueue: {[key: number]: any} = {};
  open(config: any, handlers: any): Promise<null> {
    return new Promise(resolve => {
      SSocketServer.onopen = () => {
        console.log('server is ready');
        this.sockets = [];
        resolve();
      };
      SSocketServer.onconnect = ({data}) => {
        console.log('server is connect');
        this.waitForLogin(data.id);
      };
      SSocketServer.onerror = ({data}: any) => {
        console.log('server is error');
        handlers.onerror(data.id);
        this.sockets.every((id, index) => {
          if (id === data.id) {
            this.sockets.splice(index, 1);
            return false;
          }
          return true;
        });
      };
      SSocketServer.onmessage = (event: any) => {
        const data = event.data;
        switch (data.cmd) {
          case CMD.SYS_LOGIN:
            this.onDeviceLogin(data.id);
            handlers.onconnect(data.id);
            break;
          case CMD.SYS_MESSAGE:
            handlers.onmessage(JSON.parse(data.data || '{}'), data.id);
            break;
        }
      };
      SSocketServer.onclose = (event: any) => {
        console.log('server is closed');
        this.sockets = [];
        handlers.onclose(event.data);
      };
      SSocketServer.listen(config.port);
    });
  }
  send(data: any, id?: number) {
    if (id) {
      SSocketServer.send(id, JSON.stringify(data));
    }
  }
  close(id?: number) {
    if (id) {
      SSocketServer.closeSocket(id);
    } else {
      SSocketServer.close();
    }
  }
  //socket的login，并不验证user
  private waitForLogin(id: number) {
    this.authQueue[id] = setTimeout(() => {
      //5s内没消息，踢掉它
      SSocketServer.closeSocket(id);
    }, 5000);
  }
  private onDeviceLogin(id: number) {
    clearTimeout(this.authQueue[id]);
    this.sockets.push(id);
  }
}

export default new Client();
