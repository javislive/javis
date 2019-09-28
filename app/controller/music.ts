import KeyCode from 'constants/KeyCode';
import {KeyEvent} from 'native';
import {State} from 'febrest';

export function nextSong() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_NEXT);
}
export function preSong() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PREVIOUS);
}
export function playStop() {
  const musicState = State('music').get();
  if (!musicState || musicState.status != 'playing') {
    KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PLAY);
    State('music').set({
      status: 'playing',
    });
  } else {
    KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PAUSE);
    State('music').set({
      status: 'pause',
    });
  }
}

//检查音乐播放器是否活着
function checkMusicAlive() {}

function startMusic() {}
