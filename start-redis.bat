@echo off
setlocal

:: 设置 Redis 服务器路径和配置文件路径-service
set REDIS_SERVER=%~dp0redis-server\redis-server.exe
set REDIS_CONF=%~dp0redis-server\redis.windows.conf

:: 检查路径和文件存在性
if not exist "%REDIS_SERVER%" (
    echo Redis server executable not found at %REDIS_SERVER%
    echo Redis server executable not found at %date% %time% >> redis_start.log
    exit /b 1
)
if not exist "%REDIS_CONF%" (
    echo Redis configuration file not found at %REDIS_CONF%
    echo Redis configuration file not found at %date% %time% >> redis_start.log
    exit /b 1
)

:: 启动 Redis 服务
start "" "%REDIS_SERVER%" "%REDIS_CONF%"

:: 检查 Redis 服务是否成功启动
timeout /t 5 >nul
tasklist | findstr /i "redis-server.exe" >nul
if %errorlevel% neq 0 (
    echo Redis server failed to start.
    echo Redis server failed to start at %date% %time% >> redis_start.log
    exit /b 1
)

:: 输出启动成功信息
echo Redis server started successfully.

endlocal
