package host.spencer.net.SSocket.MessageParser;

import android.util.Log;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.HashMap;

import host.spencer.net.SSocket.listener.MessageListener;

public class Parser {
    public final static int CODE_MESSAGE = 19880624; //新消息
    public final static int CODE_MESSAGE_FINISH = 11190588; //消息结束
    public final static int CODE_TICK = 1; //心跳
    public final static int MESSAGE_TYPE_FILE = 1; //消息类型 文件
    public final static int MESSAGE_TYPE_MESSAGE = 2; //消息类型  普通文本消息
    private MessageListener messageListener;
    private int status = 0;
    ByteArrayOutputStream bos;
    public Parser(MessageListener listener) {
        messageListener = listener;
    }
    public void parse(InputStream inputStream){
        int result;
        int len = 0;
        int offset = 0;
        int available = 0;
        try {
            BufferedInputStream bufferedInputStream = new BufferedInputStream(inputStream);
            available = bufferedInputStream.available();
            if(available<=0) {
                return;
            }
            if(status == 0) {
                bos = new ByteArrayOutputStream();//空闲状态
                status = 1;
            }
            while (offset<available) {
                result = bufferedInputStream.read();
                offset++;
                bos.write(result);
            }
            bos.close();
            status = 0;
            messageListener.onMessage(new Message(MESSAGE_TYPE_MESSAGE,bos));

        }catch (Exception e) {
            e.printStackTrace();
            messageListener.onError(e);
        }

    }
}
