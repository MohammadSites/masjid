@echo off
cd /d "%~dp0"
:: Start server in background (no window)
start /B pythonw -m http.server 8080 2>nul
if errorlevel 1 start /B python -m http.server 8080 2>nul
timeout /t 3 /nobreak >nul
:: Open in kiosk/fullscreen - try Chrome then Edge then default
start "" "http://localhost:8080"
:: Keep this window hidden - exit after browser is open
timeout /t 2 /nobreak >nul
exit
