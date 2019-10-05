import {State} from 'febrest';
import storage from 'utils/storage';

export default function persist(states: any | null, keys: string[]) {
  if (!states) {
    return storage.getItems(keys).then(
      data => {
        const dest: any = {};
        for (let d in data) {
          if (data[d]) {
            dest[d] = data[d];
          }
          State.batch(dest);
        }
      },
      e => {
        throw new Error('state ready error');
      },
    );
  } else {
    const items: {[key: string]: any} = {};
    keys.forEach(key => {
      if (states[key]) {
        items[key] = states[key];
      }
    });
    return storage.setItems(items);
  }
}
