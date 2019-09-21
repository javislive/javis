package host.spencer.net.SSocket.MessageParser;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;

public class Message {
    int type;
    ByteArrayOutputStream content;
    public Message(int type,ByteArrayOutputStream content) {
        this.type = type;
        this.content = content;
    }
    public String getContent() {
        try {
            return new String(content.toByteArray(),"utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return  "";
        }
    }
}
