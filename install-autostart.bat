@echo off
chcp 65001 >nul
title تثبيت التشغيل التلقائي - شاشة المسجد
cd /d "%~dp0"

set "TARGET=%USERPROFILE%\MasjidScreen"
set "SOURCE=%~dp0"

echo.
echo ===== شاشة المسجد - التشغيل التلقائي عند فتح الجهاز =====
echo.
echo سيتم نسخ التطبيق إلى: %TARGET%
echo وسيُفتح تلقائياً كلما شغّلت الجهاز (بعد تسجيل الدخول لـ Windows).
echo.

mkdir "%TARGET%" 2>nul
xcopy /E /I /Y "%SOURCE%index.html" "%TARGET%\" >nul
xcopy /E /I /Y "%SOURCE%app.js" "%TARGET%\" >nul
xcopy /E /I /Y "%SOURCE%styles.css" "%TARGET%\" >nul
xcopy /E /I /Y "%SOURCE%manifest.json" "%TARGET%\" >nul
xcopy /E /I /Y "%SOURCE%sw.js" "%TARGET%\" >nul
xcopy /E /I /Y "%SOURCE%start-kiosk.bat" "%TARGET%\" >nul
if exist "%SOURCE%data" xcopy /E /I /Y "%SOURCE%data\*" "%TARGET%\data\" >nul
if exist "%SOURCE%media" xcopy /E /I /Y "%SOURCE%media\*" "%TARGET%\media\" >nul

set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "LINK=%STARTUP%\MasjidScreen.vbs"

:: VBS: run launcher from TARGET folder (hidden, no console window)
echo Set WshShell = CreateObject("WScript.Shell") > "%LINK%"
echo WshShell.Run "cmd /c cd /d ""%TARGET%"" && start-kiosk.bat", 0, False >> "%LINK%"

echo تم التثبيت.
echo.
echo عند تشغيل الجهاز وتسجيل الدخول سيفتح التطبيق تلقائياً.
echo لإلغاء التشغيل التلقائي: احذف الملف من مجلد "بدء التشغيل".
echo.
pause
