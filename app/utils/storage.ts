import AsyncStorage from '@react-native-community/async-storage';

function strifyJSON(v: Object): string {
  try {
    return JSON.stringify(v);
  } catch {
    return v;
  }
}
function parseJSON(v: string) {
  try {
    return JSON.parse(v);
  } catch (e) {
    return v;
  }
}
export default {
  getAllKeys() {
    return AsyncStorage.getAllKeys();
  },
  removeItem(key: string) {
    return AsyncStorage.removeItem(key);
  },
  removeItems(keys: string[]) {
    return AsyncStorage.multiRemove(keys);
  },
  clear() {
    return AsyncStorage.clear();
  },
  getItem(key: string): string | object {
    return AsyncStorage.getItem(key).then(
      v => {
        if (v && v != '0') {
          return parseJSON(v);
        }
        return null;
      },
      e => {
        return Promise.reject(e);
      },
    );
  },
  getItems(keys: string[]) {
    return AsyncStorage.multiGet(keys).then(
      values => {
        const dest = {};
        if (values) {
          values.forEach(item => {
            dest[item[0]] = parseJSON(item[1]);
          });
        }
        return dest;
      },
      e => {
        return Promise.reject(e);
      },
    );
  },
  setItems(source: {[key: string]: any}) {
    const values: string[][] = [];
    for (let s in source) {
      values.push([s, strifyJSON(source[s])]);
    }
    return AsyncStorage.multiSet(values);
  },
  setItem(key: string, v: any) {
    return AsyncStorage.setItem(key, strifyJSON[v]);
  },
};
