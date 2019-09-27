import KeyCode from 'constants/KeyCode';
import {KeyEvent} from 'native';

export function nextSong() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_NEXT);
}
export function preSong() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PREVIOUS);
}
export function playStop() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PLAY);
}

//检查音乐播放器是否活着
function checkMusicAlive() {}

function startMusic() {}
