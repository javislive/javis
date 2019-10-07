import {SSocketServer} from 'native';

function listen(port: number, reconnect?: number) {
  SSocketServer.onopen = function() {
    console.log('server is ready');
  };
  SSocketServer.onconnect = event => {
    console.log('server is connect,');
  };
  SSocketServer.onerror = function(event) {
    console.log('server is error ');
  };
  SSocketServer.onmessage = (event: any) => {};
  SSocketServer.onclose = function() {
    console.log('server is closed');
    setTimeout(() => {
      SSocketServer.listen(port);
    }, reconnect);
  };
  SSocketServer.listen(port);
}

function send(message: any, callback: (data: any) => void) {}
function close() {}
