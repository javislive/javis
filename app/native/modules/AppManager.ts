import {NativeModules} from 'react-native';

export interface IAppManager {
  isAppAlive: (packageName: string) => Promise<any>;
  startApp: (packageName: string) => void;
  isAppInstall: (packageName: string) => Promise<any>;
}

const AppManager: IAppManager = NativeModules.AppManager;
export default AppManager || {};
