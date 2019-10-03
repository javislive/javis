import {KeyEvent} from 'native';
import Application from 'celtics/Application';
import CMD from 'brain/CMD';
import {State} from 'febrest';

export function nextSong() {
  const app: any = Application.getInstance();
  const brain = app.brain;
  brain.send(CMD.MUSIC_NEXT);
}
export function preSong() {
  const app: any = Application.getInstance();
  const brain = app.brain;
  brain.send(CMD.MUSIC_PREVIEW);
}
export function playStop() {
  const app: any = Application.getInstance();
  const brain = app.brain;
  const musicState = State('music').get();
  if (!musicState || musicState.status != 'playing') {
    brain.send(CMD.MUSIC_PLAY);
    State('music').set({
      status: 'playing',
    });
  } else {
    brain.send(CMD.MUSIC_PAUSE);
    State('music').set({
      status: 'pause',
    });
  }
}
