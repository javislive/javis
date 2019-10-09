package host.spencer.receivers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

public class NetworkReceiver extends BroadcastReceiver {
    private WifiStateChangeCallback wifiStateChangeCallback;
    public NetworkReceiver (){
    }
    public NetworkReceiver (WifiStateChangeCallback wifiStateChangeCallback){
        this.wifiStateChangeCallback = wifiStateChangeCallback;
    }
    public void setWifiStateChangeCallback(WifiStateChangeCallback wifiStateChangeCallback){
        this.wifiStateChangeCallback = wifiStateChangeCallback;
    }
    @Override
    public void onReceive(Context context, Intent intent) {
        //wifi连接上与否
        if (intent.getAction().equals(WifiManager.NETWORK_STATE_CHANGED_ACTION)) {

            NetworkInfo info = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
            if (info.getState().equals(NetworkInfo.State.DISCONNECTED)) {
                wifiStateChangeCallback.onWifiStateChange(false);
            } else if (info.getState().equals(NetworkInfo.State.CONNECTED)) {
                wifiStateChangeCallback.onWifiStateChange(true);
            }
        }
   }
   public static interface WifiStateChangeCallback {
        void onWifiStateChange(boolean isActive);
   }
}
