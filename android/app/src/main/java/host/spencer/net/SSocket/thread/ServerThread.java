package host.spencer.net.SSocket.thread;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import host.spencer.net.SSocket.listener.ServerListener;
import host.spencer.net.SSocket.socket.SSocket;

public class ServerThread extends Thread {
    ServerSocket mServerSocket;
    ServerListener mListner;
    SSocket socket;
    public ServerThread(ServerSocket socket,ServerListener listener) {
        mServerSocket = socket;
        mListner = listener;
    }

    @Override
    public void run() {
        super.run();
        while (true) {
            try {
                Socket s = mServerSocket.accept();
                socket = new SSocket(s,mListner);
                mListner.onConnect(socket);
            } catch (IOException e) {
                e.printStackTrace();
                mListner.onError(e);
            }
        }
    }
}
