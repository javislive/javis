package host.spencer.net.SSocket.thread;

import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.Socket;

import host.spencer.net.SSocket.MessageParser.Parser;
import host.spencer.net.SSocket.listener.MessageListener;

public class MessageThread extends Thread{
    MessageListener mListener;
    Socket mSocket;
    Parser parser;
    @Override
    public void run() {
        super.run();
        while (true) {
            onMessage();
        }
    }

    public MessageThread(Socket socket, MessageListener listener) {
        mListener = listener;
        mSocket = socket;
        parser = new Parser(mListener);
    }


    private void onMessage() {
        try {
            InputStream inputStream = mSocket.getInputStream();
            parser.parse(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
