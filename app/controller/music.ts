import KeyCode from 'constants/KeyCode';
import {KeyEvent} from 'native';
import {State} from 'febrest';

export function nextSong() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_NEXT);
}
export function preSong() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PREVIOUS);
}
export function musicStop() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PAUSE);
  State('music').set({
    playing: false,
  });
}
export function musicPlay() {
  KeyEvent.dispatch(KeyCode.KEYCODE_MEDIA_PLAY);
  State('music').set({
    playing: true,
  });
}

//检查音乐播放器是否活着
function checkMusicAlive() {}

function startMusic() {}
