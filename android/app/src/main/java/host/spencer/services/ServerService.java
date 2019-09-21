package host.spencer.services;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;


import host.spencer.net.SSocket.server.Server;
import host.spencer.net.SSocket.listener.ServerListener;

public class ServerService extends Service {
    private Binder mBinder;
    private Server mServer;
    @Override
    public void onCreate() {
        super.onCreate();
        mBinder = new Binder(this);
        mServer = new Server();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mServer.close();
        mBinder.destory();
    }
    private void listen(int port) {
        mServer.listen(port);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }
    public class Binder extends android.os.Binder {
        private ServerService mService;
        public Binder(ServerService service) {
            mService = service;
        }
        public void destory() {
        }
        public void listen(int port) {
            mService.listen(port);
        }
        public void setListener(ServerListener listener) {
            mService.mServer.setListener(listener);
        }
    }
}
