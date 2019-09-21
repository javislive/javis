package host.spencer.react.modules;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;

import host.spencer.net.SSocket.MessageParser.Message;
import host.spencer.net.SSocket.listener.SocketListener;
import host.spencer.net.SSocket.socket.SSocket;
import host.spencer.services.ClientService;

public class RCTSokcetClientManager extends ReactContextBaseJavaModule implements SocketListener {

    private ClientService.Binder binder;
    final String EVENT_CONNECTED = "socket_client_connect";
    final String EVENT_ERROR = "socket_client_error";
    final String EVENT_MESSAGE = "socket_client_message";
    final String EVENT_CLOSE = "socket_client_close";
    public RCTSokcetClientManager(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void dispatchEvent(String eventName, WritableMap params) {

        WritableMap event = Arguments.createMap();
        event.putString("type",eventName);
        event.putMap("data",params);
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, event);
    }
    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Nonnull
    @Override
    public String getName() {
        return "SocketClientManager";
    }

    @ReactMethod
    public void open(String adderss,int port) {
        if(binder==null) {
            Intent intent = new Intent(getCurrentActivity(), ClientService.class);
            getCurrentActivity().bindService(intent, new ServiceConnection() {
                @Override
                public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                    binder = (ClientService.Binder) iBinder;
                    binder.setListener(RCTSokcetClientManager.this);
                    binder.open(adderss,port);
                }

                @Override
                public void onServiceDisconnected(ComponentName componentName) {
                    binder = null;
                }
            }, Context.BIND_AUTO_CREATE);
        }
    }

    @ReactMethod
    public void close() {
        binder.close();
    }

    @ReactMethod
    public void send(String message) {
        binder.send(message);
    }
    @Override
    public void onConnect(SSocket socket) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","connect");
        writableMap.putInt("id",socket.getId());
        dispatchEvent(EVENT_CONNECTED,writableMap);
    }

    @Override
    public void onClose(SSocket socket) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","connect");
        writableMap.putInt("id",socket.getId());
        dispatchEvent(EVENT_CLOSE,writableMap);
    }

    @Override
    public void onMessage(SSocket socket, Message message) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","message");
        writableMap.putInt("id",socket.getId());
        writableMap.putString("data",message.getContent());
        dispatchEvent(EVENT_MESSAGE,writableMap);
    }

    @Override
    public void onMessage(Message messgae) {

    }

    @Override
    public void onError(Exception e) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","connect");
        dispatchEvent(EVENT_ERROR,writableMap);
    }
}
