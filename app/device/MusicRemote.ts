import {AudioManger} from 'native';
import Music from './Music';
import message from 'Message';

class MusicRemote extends Music {
  static type = 'Music';
  init() {}
  dispatchAction(action: string, payload: any) {
    switch (action) {
      case Music.ACTION_PLAY:
        message.send({});
        break;
      case Music.ACTION_PRE_SONG:
        break;
      case Music.ACTION_PAUSE:
        break;
      case Music.ACTION_NEXT_SONG:
        break;
    }
  }
}

export default MusicRemote;
