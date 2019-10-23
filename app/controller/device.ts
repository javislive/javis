import BuildConfig from 'BuildConfig';
import CMD from 'constants/CMD';
import Device from 'device/Device';
import {KeyEvent} from 'native';
import {createDevice} from 'device';
import message from 'Message';
interface DeviceIntent {
  id: string;
  action: string;
  payload?: any;
}
export function invokeDevice(intent: DeviceIntent) {
  const {id, action, payload} = intent;
  const device = Device.activeDevices().get(id);
  if (device) {
    device.dispatchAction(action, payload);
  }
}
interface DeviceInfo {
  id: string;
  type: string;
  status: any;
}
export function addDevice(device: DeviceInfo) {
  return createDevice(device.type, device.id, device.status);
}

export function deviceMessageAsync(payload: any) {
  if (BuildConfig.platform == 'server') {
    const devices = getDevices();
    message.send(
      {
        cmd: CMD.DEVICE_ASYNC_MESSAGE,
        payload: devices,
      },
      payload,
    );
  } else {
    Device.activeDevices().clear();
    payload.forEach((device: DeviceInfo) => {
      deviceStatusUpdate(device);
    });
  }
}
export function deviceOnline(device: DeviceInfo) {
  createDevice(device.type, device.id, device.status);
}

export function deviceOffline(id: string) {
  const device = Device.activeDevices().get(id);
  if (device) {
    device.destroy();
  }
}

export function deviceStatusUpdate(device: DeviceInfo) {
  let d = Device.activeDevices().get(device.id);
  if (!d) {
    addDevice(device);
  } else {
    d.status = device.status;
  }
}
export function getDevices() {
  const devices: DeviceInfo[] = [];
  Device.activeDevices().forEach((device: Device, id: string) => {
    devices.push({id, status: device.status, type: device.type});
  });
  return devices;
}
