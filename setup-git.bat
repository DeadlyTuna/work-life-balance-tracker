@echo off
REM Git setup script for work-life-balance-app

SET GIT="C:\Program Files\Git\cmd\git.exe"

echo Initializing Git repository...
%GIT% init

echo Adding all files...
%GIT% add .

echo Creating initial commit...
%GIT% commit -m "Initial commit: Work-Life Balance Tracker with localStorage"

echo Setting branch to main...
%GIT% branch -M main

echo Adding remote repository...
%GIT% remote add origin https://github.com/DeadlyTuna/work-life-balance-tracker.git

echo Pushing to GitHub...
%GIT% push -u origin main

echo.
echo Done! Your code is now on GitHub.
pause
