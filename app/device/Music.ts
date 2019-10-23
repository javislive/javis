import Device from './Device';

class Music extends Device {
  static type = 'Music';
  static ACTION_PLAY = 'ACTION_PLAY';
  static ACTION_PAUSE = 'ACTION_PAUSE';
  static ACTION_NEXT_SONG = 'ACTION_NEXT_SONG';
  static ACTION_PRE_SONG = 'ACTION_NEXT_SONG';
  constructor(id: string, status: any) {
    super(id, status, 'Music');
  }
  init() {}
  dispatchAction(action: string, payload?: any) {}
}

export default Music;
