package com.masjid.screen;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "MasjidBootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) return;

        SharedPreferences prefs = context.getSharedPreferences(StartOnBootPlugin.PREFS_NAME, Context.MODE_PRIVATE);
        boolean startOnBoot = prefs.getBoolean(StartOnBootPlugin.KEY_START_ON_BOOT, false);
        if (!startOnBoot) {
            Log.d(TAG, "Start on boot disabled, skipping launch");
            return;
        }

        Intent launch = new Intent(context, MainActivity.class);
        launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(launch);
        Log.d(TAG, "App launched on boot");
    }
}
