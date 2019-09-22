package host.spencer.react.modules;

import android.content.Context;
import android.media.AudioManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import javax.annotation.Nonnull;

public class RCTAudioManager extends ReactContextBaseJavaModule {
    private AudioManager audioManager;
    public RCTAudioManager(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        audioManager = (AudioManager)reactContext.getSystemService(Context.AUDIO_SERVICE);
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Nonnull
    @Override
    public String getName() {
        return "AudioManager";
    }
}
