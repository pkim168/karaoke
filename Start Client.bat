@echo off
for /f "tokens=1-2 delims=:" %%a in ('ipconfig^|find "IPv4"') do set ip==%%b
set ipAddress=%ip:~1%
cd client
echo IP Address : %ipAddress%
call npm start
pause