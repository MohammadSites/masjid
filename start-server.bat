@echo off
title شاشة المسجد
cd /d "%~dp0"
echo تشغيل الخادم المحلي...
start /B python -m http.server 8080
timeout /t 2 /nobreak >nul
start "" http://localhost:8080
echo. اضغط أي زر لإيقاف الخادم.
pause >nul
