function bridge() {
  //print;

  const callbacks: CallBack[] = [];

  const methods: { [inx: string]: () => void } = {};

  interface CallBack {
    resolve: (data: any) => void;
    reject: (error: any) => void;
  }
  interface MethodPayload {
    params?: any[];
    method: string;
    callback: number;
    type: 'invokeMethod';
  }
  interface CallBackPayload {
    callback: number;
    success: boolean;
    type: 'invokeMethodCallback';
    result?: any;
  }
  function postMessage(message: any) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
  window.nativeWebView = {
    postMessage: (message: any) => {
      try {
        const data = message;
        switch (data.type) {
          case 'invokeMethod':
            let method = methods[data.method];
            if (method) {
              try {
                let result = method.apply(null, data.params);
                Promise.resolve(result).then(result => {
                  const d: CallBackPayload = {
                    result,
                    success: true,
                    callback: data.callback,
                    type: 'invokeMethodCallback'
                  };
                  postMessage(d);
                });
              } catch (e) {
                const d: CallBackPayload = {
                  result: e.message,
                  success: false,
                  callback: data.callback,
                  type: 'invokeMethodCallback'
                };
                postMessage(d);
              }
            }
          case 'invokeMethodCallback':
            let callback = callbacks[data.callback];
            if (callback) {
              delete callbacks[data.callback];
              if (data.success) {
                callback.resolve(data.result);
              } else {
                callback.reject(data.result);
              }
            }
        }
      } catch (e) {}
    },
    invokeMethod: function(method: string, params?: []) {
      return new Promise((resolve, reject) => {
        callbacks.push({
          reject,
          resolve
        });

        let data: MethodPayload = {
          method,
          params,
          type: 'invokeMethod',
          callback: callbacks.length - 1
        };
        postMessage(data);
      });
    },
    injectMethod: function(methodName: string, method: () => void) {
      methods[methodName] = method;
    }
  };
  window.nativeWebView.invokeMethod.toString = function() {
    return 'function invokeMethod() { [native code] }';
  };
  window.nativeWebView.injectMethod.toString = function() {
    return 'function injectMethod() { [native code] }';
  };
  window.nativeWebView.postMessage.toString = function() {
    return 'function postMessage() { [native code] }';
  };
  document.onNativeLoad && document.onNativeLoad();
  document.onNativeLoad = undefined;
  window.print = function() {
    window.nativeWebView.invokeMethod('print', [location.href]);
  };
}

function assembleJavaScript(userJavaScript?: string) {
  return `
    (${bridge.toString()})();
    try{
      ${userJavaScript || ''}
    }catch(e) {
      alert(e.message)
    }
    `;
}

export default assembleJavaScript;
