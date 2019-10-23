import {AudioManger} from 'native';
import KeyCode from 'constants/KeyCode';
import {KeyEvent} from 'native';
import Music from './Music';

class MusicLocal extends Music {
  static type = 'Music';
  init() {
    AudioManger.isMusicActive().then(isActive => {
      this.status = {
        playing: isActive,
      };
    });
  }
  dispatchAction(action: string, payload?: any) {
    switch (action) {
      case Music.ACTION_PLAY:
        KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PLAY);
        this.setStatus('playing', true);
        break;
      case Music.ACTION_PRE_SONG:
        KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PREVIOUS);
        this.setStatus('playing', true);
        break;
      case Music.ACTION_PAUSE:
        KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PAUSE);
        this.setStatus('playing', false);
        break;
      case Music.ACTION_NEXT_SONG:
        KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_NEXT);
        this.setStatus('playing', true);
        break;
    }
  }
}

export default MusicLocal;
