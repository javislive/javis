import {NativeModules} from 'react-native';

export interface IAudioManager {
  getVolumes: () => Promise<any>;
  getMode: () => Promise<any>;
  getStreamVolume: (type: number) => Promise<any>;
  getStreamMaxVolume: (type: number) => Promise<any>;
  isMusicActive: () => Promise<any>;
  setStreamVolume: (streamType: number, index: number, flags: number) => void;
}

const AudioManager: IAudioManager = NativeModules.AudioManager;
export default AudioManager || {};
