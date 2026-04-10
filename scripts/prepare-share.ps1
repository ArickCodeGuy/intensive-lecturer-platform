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
chcp 65001 >nul
cd /d "%~dp0"
start "" "%CD%\index.html"
"@

Set-Content -Path $startScriptPath -Value $startScript -Encoding ASCII

Write-Host "Share package created at $sharePath"
