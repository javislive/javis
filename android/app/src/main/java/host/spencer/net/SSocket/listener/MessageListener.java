package host.spencer.net.SSocket.listener;


import host.spencer.net.SSocket.MessageParser.Message;

public interface MessageListener {
    public void onMessage(Message messgae);
    public void onError(Exception e);
}
