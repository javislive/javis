package host.spencer.services;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import host.spencer.net.SSocket.client.Client;
import host.spencer.net.SSocket.listener.SocketListener;

public class ClientService extends Service {
    private ClientService.Binder mBinder;
    private Client mClient;
    @Override
    public void onCreate() {
        super.onCreate();
        mBinder = new ClientService.Binder(this);
        mClient = new Client();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mClient.close();
        mBinder.destory();
    }
    private void send(String message) {
        mClient.send(message);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }
    public class Binder extends android.os.Binder {
        private ClientService mService;
        public Binder(ClientService service) {
            mService = service;
        }
        public void destory() {
        }
        public void send(String msg) {
            mService.send(msg);
        }
        public void close() {
            mClient.close();
        }
        public void open(String address,int port) {
            mClient.open(address,port);
        }
        public void setListener(SocketListener listener) {
            mService.mClient.setListener(listener);
        }
    }
}
