package host.spencer.net.SSocket.client;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.Socket;

import host.spencer.net.SSocket.MessageParser.Message;
import host.spencer.net.SSocket.listener.SocketListener;
import host.spencer.net.SSocket.socket.SSocket;

public class Client implements SocketListener {
    SSocket socket;
    private  SocketListener mListener;
    public void open(String address,int port) {
        new Thread(){
            @Override
            public void run() {
                super.run();
                try {
                    Socket  s = new Socket(address,port);
                    socket = new SSocket(s,Client.this);
                    onConnect(socket);
                } catch (IOException e) {
                    e.printStackTrace();
                    onError(e);
                }
            }
        }.start();

    }
    public void send(String msg) {
        socket.send(msg);
    }
    public void close() {
        socket.close();
    }
    public void  setListener(SocketListener listener) {
        mListener = listener;
    }
    @Override
    public void onConnect(SSocket socket) {
        if(mListener!=null) {
            mListener.onConnect(socket);
        }
    }

    @Override
    public void onClose(SSocket socket) {
        if(mListener!=null) {
            mListener.onClose(socket);
        }
    }

    @Override
    public void onMessage(SSocket socket, Message message) {
        if(mListener!=null) {
            mListener.onMessage(socket,message);
        }
    }

    @Override
    public void onMessage(Message message) {
        if(mListener!=null) {
            mListener.onMessage(socket,message);
        }
    }

    @Override
    public void onError(Exception e) {
        if(mListener!=null) {
            mListener.onError(e);
        }
    }
}
