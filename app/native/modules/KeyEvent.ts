import {NativeModules} from 'react-native';

export interface IKeyEvent {
  dispatch: (code: number) => void;
}

const KeyEvent: IKeyEvent = NativeModules.KeyEventManager;
export default KeyEvent || {};
