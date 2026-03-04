# بناء ملف APK (للمطوّرين فقط)

إذا أردت **تعديل التطبيق** وبناء APK جديد بنفسك (اختياري):

1. ثبّت **Node.js** و **Android Studio** على جهازك.
2. في مجلد المشروع:
   ```bash
   npm install
   npm run cap:sync
   npx cap open android
   ```
3. من Android Studio: **Build → Build APK(s)**.
4. الملف الناتج: `android/app/build/outputs/apk/debug/app-debug.apk`.

**لمستخدمي التلفزيون/التابلت:** لا تحتاج هذا الملف. حمّل الـ APK الجاهز من **GitHub Actions** (انظر **OFFLINE_USE.md**).
