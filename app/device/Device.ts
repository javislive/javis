import SYS_BROADCAST from 'constants/SYS_BROADCAST';
import {broadcast} from 'broadcast';

const devices: Map<string, Device> = new Map();

class Device {
  id: string;
  type: string;

  private _status() {}
  static activeDevices() {
    return devices;
  }
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
  }
  init() {}
  getStatus(key: string) {
    return (this.status && this.status[key]) || null;
  }
  setStatus(key: string, v: any) {
    this.status[key] = v;
    broadcast(SYS_BROADCAST.DEVICE_UPDATE, {id: this.id, status: this.status});
  }
  destroy() {
    devices.delete(this.id);
    broadcast(SYS_BROADCAST.DEVICE_OFFLINE, {id: this.id});
  }
  dispatchAction(action: string, payload?: any) {}
}

export default Device;
