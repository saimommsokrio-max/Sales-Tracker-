@echo off
echo ====================================================
echo   Auto-uploading Tracker Project to GitHub...
echo ====================================================
echo.

set GIT_PATH=%USERPROFILE%\MinGit\cmd\git.exe

if not exist "%GIT_PATH%" (
    set GIT_PATH=git
)

"%GIT_PATH%" add .
"%GIT_PATH%" commit -m "Auto update project"
"%GIT_PATH%" push origin main

echo.
echo ====================================================
echo   Upload complete! Your changes are live.
echo ====================================================
pause
