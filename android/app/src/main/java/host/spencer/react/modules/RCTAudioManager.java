package host.spencer.react.modules;

import android.content.Context;
import android.media.AudioManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

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
    @ReactMethod
    public void setStreamVolume(int streamType, int index, int flags) {
        audioManager.setStreamVolume(streamType,index,flags);
    }
    @ReactMethod
    public void getVolumes(Promise promise) {
//        int mode = audioManager.getMode();
//        boolean isMusicActive  = audioManager.isMusicActive();
        int musicVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
        int musicMaxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        int alarmVolume = audioManager.getStreamVolume(AudioManager.STREAM_ALARM);
        int alarmMaxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM);
        int ringVolume = audioManager.getStreamVolume(AudioManager.STREAM_RING);
        int ringMaxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_RING);
        WritableMap map = Arguments.createMap();
        map.putInt("musicVolume",musicVolume);
        map.putInt("musicMaxVolume",musicMaxVolume);
        map.putInt("alarmVolume",alarmVolume);
        map.putInt("alarmMaxVolume",alarmMaxVolume);
        map.putInt("ringVolume",ringVolume);
        map.putInt("ringMaxVolume",ringMaxVolume);
        promise.resolve(map);
    }
    @ReactMethod
    public void getMode(Promise promise) {
        promise.resolve(audioManager.getMode());
    }
    @ReactMethod
    public void isMusicActive(Promise promise){
        promise.resolve(audioManager.isMusicActive());
    }
    @ReactMethod
    public void getStreamVolume(int streamType,Promise promise) {
        promise.resolve(audioManager.getStreamVolume(streamType));
    }
    @ReactMethod
    public void getStreamMaxVolume(int streamType,Promise promise) {
        promise.resolve(audioManager.getStreamMaxVolume(streamType));
    }
}
