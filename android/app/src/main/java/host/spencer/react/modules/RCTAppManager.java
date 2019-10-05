package host.spencer.react.modules;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

import javax.annotation.Nonnull;

public class RCTAppManager extends ReactContextBaseJavaModule {
    public RCTAppManager(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Nonnull
    @Override
    public String getName() {
        return "AppManager";
    }
    @ReactMethod
    public void isAppAlive(String packageName, Promise promise) {
        ActivityManager am = (ActivityManager) getCurrentActivity().getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> infos = am.getRunningAppProcesses();
        for(ActivityManager.RunningAppProcessInfo rapi : infos){
            if(rapi.processName.equals(packageName)) {
                promise.resolve(true);
                return;
            }
        }
        promise.resolve(false);
    }
    @ReactMethod
    public void startApp(String packageName) {
        PackageManager packageManager =getCurrentActivity().getPackageManager();
        Intent intent= new Intent();
        intent =packageManager.getLaunchIntentForPackage(packageName);//需要启动的应用包名
        if(intent!=null){
            getCurrentActivity().startActivity(intent);
        }
    }
    @ReactMethod
    public void isAppInstall(String packageName,Promise promise) {
        PackageInfo packageInfo;
        try {
            packageInfo = getCurrentActivity().getPackageManager().getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            packageInfo = null;
            e.printStackTrace();
        }
        if(packageInfo == null) {
            promise.resolve(false);
        } else {
            promise.resolve(true);
        }

    }
}
