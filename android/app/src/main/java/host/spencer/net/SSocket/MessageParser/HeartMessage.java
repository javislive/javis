package host.spencer.net.SSocket.MessageParser;

import java.io.ByteArrayOutputStream;

public class HeartMessage extends Message {
    public HeartMessage(int type, ByteArrayOutputStream content) {
        super(type, content);
    }
}
