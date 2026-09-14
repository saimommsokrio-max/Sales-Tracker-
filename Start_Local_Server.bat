@echo off
echo ====================================================
echo   Starting Sokrio Sales Tracker Local Server...
echo ====================================================
echo.
echo All edits made while running this server are automatically
echo saved to state.json and ready to upload via Upload_To_GitHub.bat!
echo.
start "" http://127.0.0.1:8080
node server.js
pause
