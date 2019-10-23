import DEVICE from 'constants/DEVICE';
import {createDevice} from 'device';
import {deviceMessageAsync} from './device';
import {dispatch} from 'febrest';

export function init() {
  DEVICE.forEach(device => {
    createDevice(device.id, device.type, device.status);
  });
}

export function clientConnect(clientId: number) {
  dispatch(deviceMessageAsync, clientId);
}
