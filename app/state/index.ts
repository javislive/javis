import {State} from 'febrest';
import persist from './persist';

const state = {
  devices: 'devices',
  status: 'status',
  config: 'config',
  persist: function() {
    State.observe(function(event: any) {
      persist({[event.key]: event.current}, SYNC_MAP);
    });
    return persist(null, SYNC_MAP);
  },
};
State.batch({
  [state.config]: {
    net: {
      port: 1988,
    },
  },
});

const SYNC_MAP = [state.config];

export default state;
