@echo off
REM File must stay ASCII-only: cmd.exe breaks UTF-8 .bat on many PCs (garbled lines = fake "commands").
cd /d "%~dp0"
title Java Intensive

echo.
echo === Java Intensive materials ===
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH.
  echo.
  echo 1. Open https://nodejs.org/ and install LTS
  echo 2. Reboot PC or reopen this folder after install
  echo 3. Run Start.bat again
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo First run: installing dependencies ^(may take a minute^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Check internet and try again.
    pause
    exit /b 1
  )
  echo.
)

echo Starting dev server. Keep this window open.
echo Open: http://localhost:5173/
echo Stop: press Ctrl+C here.
echo.
call npm run dev
echo.
pause
