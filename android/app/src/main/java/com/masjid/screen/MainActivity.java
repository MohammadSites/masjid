package com.masjid.screen;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(StartOnBootPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
