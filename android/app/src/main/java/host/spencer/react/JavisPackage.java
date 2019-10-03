package host.spencer.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Nonnull;

import host.spencer.react.modules.RCTKeyEventManager;
import host.spencer.react.modules.RCTNetworkManager;
import host.spencer.react.modules.RCTSocketServerManager;
import host.spencer.react.modules.RCTSokcetClientManager;

public class JavisPackage implements ReactPackage {
    /**
     * @param reactContext react application context that can be used to create modules
     * @return list of native modules to register with the newly created catalyst instance
     */
    @Nonnull
    @Override
    public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
        return  Arrays.<NativeModule>asList(new RCTSocketServerManager(reactContext), new RCTSokcetClientManager(reactContext),new RCTKeyEventManager(reactContext),new RCTNetworkManager(reactContext));
    }

    /**
     * @param reactContext
     */
    @Nonnull
    @Override
    public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList();
    }
}
