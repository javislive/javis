import {State, dispatch} from 'febrest';
import {deviceMessageAsync, invokeDevice} from 'controller/device';

import CMD from 'constants/CMD';
import Device from 'device/Device';
import {clientConnect} from 'controller/application';

class Brain {
  constructor() {}

  onCMD(data: any) {
    const {cmd, payload} = data;
    switch (cmd) {
      case CMD.DEVICE_ASYNC_MESSAGE:
        dispatch(deviceMessageAsync, payload);
        break;
      case CMD.DEVICE_ACTION:
        dispatch(invokeDevice, {
          id: payload.id,
          action: payload.action,
          payload: payload.payload,
        });
        break;
    }
  }
  onmessage(message: any) {
    this.onCMD(message);
  }
  onconnect(channel: number) {
    dispatch(clientConnect, channel);
  }
  onerror() {}
  onclose() {}
}
export default new Brain();
