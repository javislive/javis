import SYS_BROADCAST from 'constants/SYS_BROADCAST';
import {broadcast} from 'broadcast';

const devices: Map<string, Device> = new Map();
export type StatusChangeListener = (status: any) => void;
class Device {
  static activeDevices() {
    return devices;
  }
  static acitveDevicesForType(type: string) {
    const d: Device[] = [];
    devices.forEach(device => {
      if (device.type === type) {
        d.push(device);
      }
    });
    return d;
  }
  id: string;
  type: string;

  private _status() {}
  private listeners: StatusChangeListener[] = [];

  constructor(id: string, status: any, type: string) {
    this.id = id;
    this._status = status || {};
    this.type = type;
    devices.set(id, this);
    this.init();
    broadcast(SYS_BROADCAST.DEVICE_ONLINE, {id: this.id, status: this.status});
  }
  get status() {
    return this._status;
  }
  set status(status: any) {
    this._status = status;
    broadcast(SYS_BROADCAST.DEVICE_UPDATE, {id: this.id, status: this.status});
    this.dispatchStatusChangeEvent();
  }
  init() {}
  getStatus(key: string) {
    return (this.status && this.status[key]) || null;
  }
  setStatus(key: string, v: any) {
    this.status[key] = v;
    broadcast(SYS_BROADCAST.DEVICE_UPDATE, {id: this.id, status: this.status});
    this.dispatchStatusChangeEvent();
  }
  addStatusChangeListener(listener: StatusChangeListener) {
    this.listeners.push(listener);
  }
  removeStatusChangeListener(listener: StatusChangeListener) {
    this.listeners.every((l, i) => {
      if (l === listener) {
        this.listeners.splice(i, 1);
        return false;
      }
      return true;
    });
  }
  destroy() {
    devices.delete(this.id);
    broadcast(SYS_BROADCAST.DEVICE_OFFLINE, {id: this.id});
  }
  dispatchAction(action: string, payload?: any) {}
  private dispatchStatusChangeEvent() {
    this.listeners.forEach(l => {
      l(this.status);
    });
  }
}

export default Device;
