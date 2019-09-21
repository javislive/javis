package host.spencer.react.modules;


import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

import javax.annotation.Nonnull;

import host.spencer.net.SSocket.MessageParser.Message;
import host.spencer.net.SSocket.listener.ServerListener;
import host.spencer.net.SSocket.socket.SSocket;
import host.spencer.services.ServerService;

public class RCTSocketServerManager extends ReactContextBaseJavaModule implements ServerListener {
    final String EVENT_READY = "socket_server_ready";
    final String EVENT_CONNECTED = "socket_server_connect";
    final String EVENT_ERROR = "socket_server_error";
    final String EVENT_MESSAGE = "socket_server_message";
    final String EVENT_CLOSE = "socket_socket_close";

    private ServerService.Binder binder;
    private HashMap<Integer,SSocket> sockets = new HashMap<Integer, SSocket>();
    private int port = 0;
    public RCTSocketServerManager(@Nonnull ReactApplicationContext reactContext) {
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
        return "SocketServerManager";
    }
    @ReactMethod
    public void listen(final int port) {
        this.port = port;
        if(binder==null) {
            Intent intent = new Intent(getCurrentActivity(), ServerService.class);
            getCurrentActivity().bindService(intent, new ServiceConnection() {
                @Override
                public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
                    binder = (ServerService.Binder) iBinder;
                    binder.setListener(RCTSocketServerManager.this);
                    binder.listen(port);
                }

                @Override
                public void onServiceDisconnected(ComponentName componentName) {
                    binder = null;
                }
            }, Context.BIND_AUTO_CREATE);
        }
    }
    @ReactMethod
    public void send(Integer socketId,String message) {
        SSocket sSocket = sockets.get(socketId);
        if(sSocket!=null) {
            sSocket.send(message);
        }
    }


    @Override
    public void onMessage( Message message) {

    }

    @Override
    public void onError(Exception e) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","connect");
        dispatchEvent(EVENT_ERROR,writableMap);
    }

    @Override
    public void onServerCreated(ServerSocket socket) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","ready");
        dispatchEvent(EVENT_READY,writableMap);
    }

    @Override
    public void onServerClosed(ServerSocket socket) {
        if(port!=0) {
            binder.listen(port);

        }
    }

    @Override
    public void onConnect(SSocket socket) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","connect");
        writableMap.putInt("id",socket.getId());
        sockets.put(socket.getId(),socket);
        dispatchEvent(EVENT_CONNECTED,writableMap);
    }

    @Override
    public void onClose(SSocket socket) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("message","connect");
        writableMap.putInt("id",socket.getId());
        sockets.remove(socket.getId());
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
}
