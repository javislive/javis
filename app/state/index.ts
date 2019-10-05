import {State} from 'febrest';
import persist from './persist';

const state = {
  music: 'music',
  status: 'status',
  config: 'config',
  persist: function() {
    State.observe(function(event: any) {
      persist({[event.key]: event.current}, SYNYC_MAP);
    });
    return persist(null, SYNYC_MAP);
  },
};
State.batch({
  [state.config]: {
    net: {
      port: 1988,
    },
  },
});

const SYNYC_MAP = [state.config];

export default state;
