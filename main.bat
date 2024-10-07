@echo off
:: Set the window title and color
title Node.js Project Launcher
color 0A

:: Function to display the menu
:menu
cls
echo ====================================================
echo               Node.js Project Launcher
echo ====================================================
echo.
echo Select the project to run:
echo [1] major
echo [2] tomarket
echo [3] Not-Pixel
echo [4] 
echo [5] 
echo [6] blum
echo [7] not_pixel
echo [8] auto_click
echo [9] 
echo [0] Exit
echo.
set /p choice=please choose 1 number [0-9]: 

:: Handle the menu selection
if "%choice%"=="1" (
    call :startProject "major" "C:\Users\huy\Desktop\Tool_Farm\major-main"
) else if "%choice%"=="2" (
    call :startProject "tomarket" "C:\Users\huy\Desktop\Tool_Farm\tomarket-main"
) else if "%choice%"=="3" (
    call :startProject "Not-Pixel" "C:\Users\huy\Desktop\Tool_Farm\not-pixel"
) else if "%choice%"=="6" (
    python .\script-python\bots\src\aimbot.py
) else if "%choice%"=="7" (
    python .\script-python\bots\src\not_pixel.py
) else if "%choice%"=="8" (
    python .\script-python\bots\src\auto_click.py
) else if "%choice%"=="9" (
    @REM python .\script-python\bots\src\aimbot.py
) else if "%choice%"=="0" (
    echo Exiting...
    timeout /t 2 >nul
    exit
) else (
    echo ====================================================
    echo Invalid choice. Please try again.
    echo ====================================================
    timeout /t 2 >nul
    goto menu[]
)

:: Function to start a project
:startProject
cls
echo ====================================================
echo Starting %1...
echo ====================================================
cd /d %2 || (
    echo Error: Failed to navigate to project directory!
    pause
    goto menu
)
npm start || (
    echo Error: Failed to start %1!
    pause
    goto menu
)
pause
goto menu
