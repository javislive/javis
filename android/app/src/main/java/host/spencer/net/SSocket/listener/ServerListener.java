package host.spencer.net.SSocket.listener;

import java.net.ServerSocket;

public interface ServerListener extends SocketListener{
    public void onServerCreated(ServerSocket socket);
    public void onServerClosed(ServerSocket socket);
}
