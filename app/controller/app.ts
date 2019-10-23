import {State, bordercast} from 'febrest';

import state from 'state';

export function toast(data: any) {
  bordercast('sys.toast', data);
}

export function alert(data: any) {
  bordercast('sys.alert', data);
}
export function navigate(data: any) {
  bordercast('sys.navigation.navigate', data);
}
export function navigationReset(data: any) {
  bordercast('sys.navigation.reset', data);
}
export function navigationGoBack(data: any) {
  bordercast('sys.navigation.goBack', data);
}

export function setConfig(data: any) {
  State(state.config).set(data);
}
