@echo off
echo ========================================
echo SSB Platform - Development Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Python and Node.js are installed.
echo.

REM Setup Backend
echo ========================================
echo Setting up Backend (Django)...
echo ========================================
cd ssb-backend

REM Create and activate virtual environment
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

REM Run migrations
echo Setting up database...
python manage.py makemigrations
python manage.py migrate

echo.
echo ========================================
echo Backend setup complete!
echo ========================================
echo.

REM Setup Frontend
echo ========================================
echo Setting up Frontend (React)...
echo ========================================
cd ..\ssb-react

REM Install dependencies
echo Installing frontend dependencies...
call npm install

echo.
echo ========================================
echo Frontend setup complete!
echo ========================================
echo.

echo.
echo ========================================
echo Setup Complete! Ready to run?
echo ========================================
echo.
echo Next steps:
echo 1. Open a terminal in ssb-backend folder and run:
echo    venv\Scripts\activate.bat
echo    python manage.py createsuperuser
echo    python manage.py runserver
echo.
echo 2. Open another terminal in ssb-react folder and run:
echo    npm run dev
echo.
echo The website will be at: http://localhost:5173
echo API will be at: http://localhost:8000/api/v1
echo Admin panel: http://localhost:8000/admin
echo.
pause
