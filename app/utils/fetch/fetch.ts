import config from 'config';
import { dispatch, State } from 'febrest';
const publicApiURI = config.publicApiURI;

const publicApiHost = `${publicApiURI.protocol}://${publicApiURI.domain}`;

const TIMEOUT = 60 * 1e3;
// const PATH_HOST_MAP: {
//   [idx: string]: string;
// } = {
//   '*': publicApiHost
// };

function onError(result: any) {}
function onFail(result: any) {}
function onTimeout(result: any) {}

function parseUrl(path: string): string {
  const paths: string[] = path.split('/');
  const host: string = publicApiHost;
  if (!host) {
    throw new Error("can't find host for path" + paths[0]);
  }
  // paths.shift();
  let url = host + paths.join('/');
  return url;
}
function attachParamsToUrl(
  url: string,
  params: {
    [idx: string]: string;
  }
) {
  let strings = [];
  for (let p in params) {
    strings.push(p + '=' + params[p]);
  }
  return url + '?' + strings.join('&');
}
function _fetch(url: string, params?: any, method?: string, headers?: Headers) {
  if (typeof params == 'string') {
    method = params;
    params = null;
  }
  headers = headers || new Headers();

  const requestParams = applyMiddlewares({
    url,
    params,
    method,
    headers
  });
  url = parseUrl(requestParams.url);
  params = requestParams.params;
  headers = requestParams.headers;
  method = requestParams.method || 'get';
  let requestInit: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    body: undefined,
    method: method,
    headers
  };
  if (requestInit.method === 'post' && params) {
    requestInit.body = params ? JSON.stringify(params) : null;
    headers.append('content-type', 'application/json');
  }
  if (params instanceof FormData) {
    requestInit.mode = 'FormData';
    //formdata强制用post
    requestInit.method = 'post';
    requestInit.body = params || undefined;
  }
  if (requestInit.method === 'get' && params) {
    url = attachParamsToUrl(url, params);
  }
  const request = new Request(url, requestInit);

  return new Promise((resolve, reject) => {
    console.log('请求开始=======', url, params);
    fetch(request).then(
      response => {
        response.json().then(data => {
          console.log('请求成功=======', url, data);
          if (data && data.code === 200) {
            resolve(data.data);
          } else if (data && data.code === 401) {
            State('user').clear();
            dispatch('app.toast', { message: '登录失效，请重新登录' });
            dispatch('app.resetNavigation', {
              routeName: 'Main'
            });
          } else {
            onError(data);
            dispatch('app.toast', { message: data.error });
            reject(data);
          }
        });
        clearTimeout(timeout);
      },
      response => {
        console.log('请求失败=======', url, response);
        dispatch('app.toast', { message: response.error || 'error' });
        clearTimeout(timeout);
        onFail(response);
        reject(response);
      }
    );
    const timeout = setTimeout(() => {
      const result = { message: 'timeout', code: '500' };
      console.log('请求失败=======', url, result);
      reject(result);
      onTimeout(result);
      dispatch('app.toast', { message: '服务器超时，请稍后再试' });
    }, TIMEOUT);
  });
}

export interface middlewareParam {
  url: string;
  params?: any;
  method?: string;
  headers?: Headers;
}
export type middlewareType = (params: middlewareParam) => middlewareParam;
const middlewares: middlewareType[] = [];
function addMiddleware(middleware: middlewareType) {
  middlewares.push(middleware);
}

function applyMiddlewares(params: middlewareParam): middlewareParam {
  if (middlewares.length <= 0) {
    return params;
  }
  return middlewares.reduce((pre, cur) => {
    return cur(pre);
  }, params);
}
function createFetch(_module: string, version?: string) {
  return function(
    path: string,
    data?: any,
    method?: string,
    headers?: Headers
  ) {
    return _fetch(_module + path, data, method, headers);
  };
}
export { createFetch, _fetch as fetch, addMiddleware };
