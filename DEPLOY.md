# Deployment

## Vercel
- Build runs `npm run build` (copies app + **data/** into `public/`).
- If you don’t see the latest changes or Hijri dates:
  1. In Vercel dashboard: **Deployments** → **⋯** on latest → **Redeploy** → enable **Clear cache and redeploy**.
  2. Ensure the connected repo/branch is correct and Root Directory is empty (repo root).

## Flash / USB version
- **USB_PACKAGE** and **MASJID_TV** are synced from the main app so they include `data/hijri.json` and the latest code.
- To refresh them after you change the main app:  
  `npm run sync:flash`
- Then copy the updated **USB_PACKAGE** or **MASJID_TV** folder to your USB drive.

## APK
- Sync and open Android Studio: `npm run android:studio`
- Or build debug APK (needs Java): `npm run android:apk`
- Output: `android/app/build/outputs/apk/debug/app-debug.apk`
