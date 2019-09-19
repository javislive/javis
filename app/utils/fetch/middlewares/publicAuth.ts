import { middlewareParam } from '../fetch';
import { State } from 'febrest';
export default function publicAuth(params: middlewareParam): middlewareParam {
  const user = State('user').get() || {};
  const accessToken = user.access_token;
  if (accessToken) {
    params.headers = params.headers || new Headers();
    params.headers.append('Authorization', user.token_type + ' ' + accessToken);
  }
  return params;
}
