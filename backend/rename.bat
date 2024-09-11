@echo off
setlocal enabledelayedexpansion

rem Change this to your directory
set "dir=D:\budget_planner\backend\20021010_easy_ham\easy_ham"

cd /d "%dir%"

for %%f in (*) do (
    set "filename=%%~nf.txt"
    ren "%%f" "!filename!"
)

echo Done renaming all files to .txt.
pause
