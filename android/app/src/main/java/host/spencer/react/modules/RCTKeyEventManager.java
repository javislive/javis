package host.spencer.react.modules;

import android.view.KeyEvent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

import host.spencer.utils.DispatchKeyEvent;

public class RCTKeyEventManager extends ReactContextBaseJavaModule {
    public RCTKeyEventManager(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Nonnull
    @Override
    public String getName() {
        return "KeyEventManager";
    }
    @ReactMethod
    public void dispatch(int keyCode) {

        DispatchKeyEvent.dispatch(keyCode);

    }
}
