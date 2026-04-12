@echo off
REM ASCII-only: do not add Russian here (cmd breaks UTF-8 batch on many PCs).
cd /d "%~dp0"
set PORT=5173
echo.
echo Open this address in your browser:
echo   http://localhost:%PORT%/
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

where py >nul 2>&1
if %errorlevel%==0 (
  py -3 -m http.server %PORT%
  goto :eof
)
where python >nul 2>&1
if %errorlevel%==0 (
  python -m http.server %PORT%
  goto :eof
)
where node >nul 2>&1
if %errorlevel%==0 (
  npx --yes serve . -l %PORT%
  goto :eof
)

echo [ERROR] Need Python 3 or Node.js to serve files (ES modules do not work from file://).
echo Python: https://www.python.org/downloads/
echo Node:   https://nodejs.org/
echo.
pause
