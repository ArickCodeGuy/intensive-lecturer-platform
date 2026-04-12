$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot "dist"
$sharePath = Join-Path $projectRoot "share-package"
$assetsPath = Join-Path $sharePath "assets"
$startScriptPath = Join-Path $sharePath "Start-Lecture.bat"

if (-not (Test-Path $distPath)) {
    throw "Dist directory not found. Run npm run build first."
}

if (Test-Path $sharePath) {
    Remove-Item -Path $sharePath -Recurse -Force
}

New-Item -ItemType Directory -Path $sharePath | Out-Null
New-Item -ItemType Directory -Path $assetsPath | Out-Null

Copy-Item -Path (Join-Path $distPath "index.html") -Destination $sharePath
Copy-Item -Path (Join-Path $distPath "favicon.svg") -Destination $sharePath
Copy-Item -Path (Join-Path $distPath "assets\*") -Destination $assetsPath -Recurse

$startScript = @"
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
"@

Set-Content -Path $startScriptPath -Value $startScript -Encoding ASCII

Write-Host "Share package created at $sharePath"
