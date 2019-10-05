import {AudioManger} from 'native';
import {State} from 'febrest';

export default function init() {
  AudioManger.isMusicActive().then(isActive => {
    State('music').set({
      playing: isActive,
    });
  });
}
