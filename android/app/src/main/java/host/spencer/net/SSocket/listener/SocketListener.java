package host.spencer.net.SSocket.listener;

import java.net.ServerSocket;
import java.net.Socket;

import host.spencer.net.SSocket.MessageParser.Message;
import host.spencer.net.SSocket.socket.SSocket;

public interface SocketListener  extends MessageListener{
    public void onConnect(SSocket socket);
    public void onClose(SSocket socket);
    public void onMessage(SSocket socket, Message message);
}
