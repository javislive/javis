function bridge() {
  const callbacks: (() => void)[] = [];

  const methods: { [inx: string]: () => void } = {};

  const originalPostMessage = window.postMessage;
  const patchedPostMessage = function(
    message: string,
    targetOrigin: string,
    transfer?: any[]
  ) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      'hasOwnProperty',
      'postMessage'
    );
  };
  window.postMessage = patchedPostMessage;

  window.nativeWebView = {
    invokeMethod: function(
      methodName: string,
      params?: [],
      callback?: () => void
    ) {
      const message = {
        method: methodName,
        params: params || [],
        type: 'invokeMethod',
        callback: null
      };
      if (callback) {
        callbacks.push(callback);
        message.callback = callback;
      }
      window.postMessage(JSON.stringify(message), '*');
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
  window.document.addEventListener('message', function(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'invokeMethod':
          if (data.method) {
            methods[data.method].apply(null, data.params);
          }
          break;
        case 'invokeMethodCallback':
          if (data.callback) {
            callbacks[data.callback].apply(null, data.params);
            delete callbacks[data.callback];
          }
          break;
      }
    } catch (e) {}
  });
  document.onNativeLoad && document.onNativeLoad();
  document.onNativeLoad = undefined;
}

function assembleJavaScript(userJavaScript?: string) {
  return `
    (${bridge.toString()})();
    ${userJavaScript || ''}
    `;
}

export default assembleJavaScript;
