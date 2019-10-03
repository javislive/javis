import {NativeModules, DeviceEventEmitter} from 'react-native';

export interface INetworkManager {
  getNetInfo: () => any;
  onWifiStateChange: (isActive: boolean) => void;
}

const NetworkManager: INetworkManager = NativeModules.NetworkManager || {};
NetworkManager.onWifiStateChange = function(isActive: boolean) {};
DeviceEventEmitter.addListener('wifiStateChange', function(data: any) {
  NetworkManager.onWifiStateChange(data && data.state);
});

export default NetworkManager;
