package com.masjid.screen;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Stores "start on boot" preference so BootReceiver can read it when device boots.
 */
@CapacitorPlugin(name = "StartOnBoot")
public class StartOnBootPlugin extends Plugin {

    public static final String PREFS_NAME = "MasjidScreen";
    public static final String KEY_START_ON_BOOT = "startOnBoot";

    private SharedPreferences getPrefs() {
        return getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    @PluginMethod
    public void setEnabled(PluginCall call) {
        Boolean enabled = call.getBoolean("enabled");
        if (enabled == null) {
            call.reject("Missing 'enabled' argument");
            return;
        }
        getPrefs().edit().putBoolean(KEY_START_ON_BOOT, enabled).apply();
        JSObject ret = new JSObject();
        ret.put("enabled", enabled);
        call.resolve(ret);
    }

    @PluginMethod
    public void getEnabled(PluginCall call) {
        boolean enabled = getPrefs().getBoolean(KEY_START_ON_BOOT, false);
        JSObject ret = new JSObject();
        ret.put("enabled", enabled);
        call.resolve(ret);
    }
}
