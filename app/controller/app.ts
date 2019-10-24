import {State, broadcast} from 'febrest';

import state from 'state';

export function toast(data: any) {
  broadcast('sys.toast', data);
}

export function alert(data: any) {
  broadcast('sys.alert', data);
}
export function navigate(data: any) {
  broadcast('sys.navigation.navigate', data);
}
export function navigationReset(data: any) {
  broadcast('sys.navigation.reset', data);
}
export function navigationGoBack(data: any) {
  broadcast('sys.navigation.goBack', data);
}

export function setConfig(data: any) {
  State(state.config).set(data);
}
