package host.spencer.react.modules;

import android.content.Context;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.LinkAddress;
import android.net.LinkProperties;
import android.net.Network;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

import javax.annotation.Nonnull;

import host.spencer.receivers.NetworkReceiver;

public class RCTNetworkManager extends ReactContextBaseJavaModule  implements NetworkReceiver.WifiStateChangeCallback {
    public RCTNetworkManager(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        IntentFilter filter = new IntentFilter();
        filter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);
        filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
        filter.addAction(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION);
        reactContext.registerReceiver(new NetworkReceiver(this), filter);

    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Nonnull
    @Override
    public String getName() {
        return "NetworkManager";
    }

    public boolean isConnected() {
        ConnectivityManager mgr = (ConnectivityManager) getCurrentActivity()
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            Network net = mgr.getActiveNetwork();
            return net != null;

        } else {
            NetworkInfo networkInfo = mgr.getActiveNetworkInfo();
            return networkInfo != null && networkInfo.isConnected();
        }
    }

    @ReactMethod
    public void getNetInfo(Promise promise) {
        ConnectivityManager mgr = (ConnectivityManager) getCurrentActivity()
                .getSystemService(Context.CONNECTIVITY_SERVICE);


        WifiManager wifi = (WifiManager) getCurrentActivity().getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (!isConnected()) {
            promise.resolve(null);
            return;
        }
        if (wifi.isWifiEnabled()) {
            WifiInfo wifiInfo = wifi.getConnectionInfo();
            if (wifiInfo != null && wifiInfo.getIpAddress() != 0) {
                WritableMap info = Arguments.createMap();
                info.putString("type", "wifi");
                info.putString("ip", intToIp(wifiInfo.getIpAddress()));
                WritableMap extra = Arguments.createMap();
                extra.putString("ssid", wifiInfo.getSSID());
                info.putMap("extra", extra);
                promise.resolve(info);
            }
        } else {
            WritableMap info = Arguments.createMap();
            info.putString("type", "gprs");
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                Network net = mgr.getActiveNetwork();
                LinkProperties link = mgr.getLinkProperties(net);

                for (LinkAddress address : link.getLinkAddresses()) {
                    if (address.getAddress() instanceof Inet4Address) {
                        info.putString("ip", address.getAddress().getHostAddress());
                    }


                }

            } else {
                try {
                    for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements(); ) {
                        NetworkInterface intf = en.nextElement();
                        for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                            InetAddress inetAddress = enumIpAddr.nextElement();
                            if (!inetAddress.isLoopbackAddress() && inetAddress instanceof Inet4Address) {
                                info.putString("ip", inetAddress.getHostAddress().toString());
                            }
                        }
                    }
                } catch (SocketException ex) {
                    Log.e("get IpAddress fail", ex.toString());
                }

            }
            promise.resolve(info);
        }

    }

    private String intToIp(int i) {
        return (i & 0xFF) + "." +
                ((i >> 8) & 0xFF) + "." +
                ((i >> 16) & 0xFF) + "." +
                (i >> 24 & 0xFF);
    }

    @Override
    public void onWifiStateChange(boolean isActive) {
        WritableMap event = Arguments.createMap();
        String eventName = "wifiStateChange";
        event.putString("type",eventName);
        event.putBoolean("state",isActive);
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, event);
    }
}
