package host.spencer.net.SSocket.socket;

import android.util.Log;

import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.Socket;

import host.spencer.net.SSocket.MessageParser.Message;
import host.spencer.net.SSocket.MessageParser.Parser;
import host.spencer.net.SSocket.listener.SocketListener;
import host.spencer.net.SSocket.thread.MessageThread;

public class SSocket implements SocketListener {
    private Socket mSocket;
    private MessageThread messageThread;
    private SocketListener mListener;
    private static int ID_GENERATOR = 1;
    private int id;
    public SSocket(Socket socket, SocketListener listener){
        mSocket=socket;
        messageThread = new MessageThread(mSocket,this);
        messageThread.start();
        mListener = listener;
        keepAlive();
        id = ++ID_GENERATOR;
    }
    public int getId() {
        return id;
    }
    public void send(String msg) {
        try {
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(mSocket.getOutputStream());
            bufferedOutputStream.write(msg.getBytes());
            bufferedOutputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
            onError(e);
        }
    }
    public void close() {
        try {
            mSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
            onError(e);
        }
        onClose(this);
    }
    private void keepAlive(){

    }

    @Override
    public void onMessage(Message message) {
        mListener.onMessage(this,message);
    }

    @Override
    public void onError(Exception e) {
        mListener.onError(e);
    }

    @Override
    public void onConnect(SSocket socket) {
        mListener.onConnect(socket);
    }

    @Override
    public void onClose(SSocket socket) {
        mListener.onClose(socket);
    }

    @Override
    public void onMessage(SSocket socket, Message message) {
        mListener.onMessage(socket,message);
    }
}
