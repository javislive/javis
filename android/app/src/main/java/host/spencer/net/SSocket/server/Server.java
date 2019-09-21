package host.spencer.net.SSocket.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import host.spencer.net.SSocket.MessageParser.Message;
import host.spencer.net.SSocket.listener.ServerListener;
import host.spencer.net.SSocket.socket.SSocket;
import host.spencer.net.SSocket.thread.ServerThread;

public class Server implements ServerListener {
    private ServerSocket serverSocket;
    private ServerListener mListener;
    private ServerThread mServerThread;
    public Server(){
    }
    public void listen(int port) {
        try {
            serverSocket = new ServerSocket(port,3);
            onServerCreated(serverSocket);
            mServerThread = new ServerThread(serverSocket,this);
            mServerThread.start();
        } catch (IOException e) {
            e.printStackTrace();
            onError(e);
        }
    }
    public void listen() {
        listen(1988);
    }
    public void close() {
        try {
            serverSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public void setListener(ServerListener listener) {
        mListener = listener;
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

    @Override
    public void onServerCreated(ServerSocket socket) {
        mListener.onServerCreated(socket);
    }

    @Override
    public void onServerClosed(ServerSocket socket) {
        mListener.onServerClosed(socket);
    }

    @Override
    public void onMessage(Message message) {
        mListener.onMessage(message);
    }

    @Override
    public void onError(Exception e) {
        mListener.onError(e);
    }
}
