import {broadcast as b, subscribe as s, unsubscribe as u} from 'febrest';

export function broadcast(cmd: string, data: any) {
  b(cmd, data);
}

export function subscribe(callback: (data: any) => void) {
  s(callback);
}

export function unsubscribe(callback: (data: any) => void) {
  u(callback);
}
