@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Java Intensive — запуск
echo.
echo === Материалы по Java (интенсив) ===
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [Ошибка] Не установлен Node.js.
  echo.
  echo 1. Откройте сайт https://nodejs.org/
  echo 2. Скачайте версию LTS и установите ^(галочки по умолчанию можно оставить^)
  echo 3. Закройте это окно и снова дважды щёлкните Start.bat
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Первый раз ставим зависимости — может занять минуту...
  call npm install
  if errorlevel 1 (
    echo.
    echo [Ошибка] npm install не удался. Проверьте интернет и попробуйте снова.
    pause
    exit /b 1
  )
  echo.
)

echo Запускаем страницу. Это окно НЕ закрывайте — пока оно открыто, сайт работает.
echo Остановить сервер: в этом окне нажмите Ctrl+C, потом любую клавишу.
echo.
call npm run dev
echo.
pause
