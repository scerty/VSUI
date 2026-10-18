#!/bin/bash

echo "========================================"
echo "SSB Platform - Development Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Python and Node.js are installed."
echo ""

# Setup Backend
echo "========================================"
echo "Setting up Backend (Django)..."
echo "========================================"
cd ssb-backend

# Create and activate virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Setting up database..."
python manage.py makemigrations
python manage.py migrate

echo ""
echo "========================================"
echo "Backend setup complete!"
echo "========================================"
echo ""

# Setup Frontend
echo "========================================"
echo "Setting up Frontend (React)..."
echo "========================================"
cd ../ssb-react

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo ""
echo "========================================"
echo "Frontend setup complete!"
echo "========================================"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. In ssb-backend folder:"
echo "   source venv/bin/activate"
echo "   python manage.py createsuperuser"
echo "   python manage.py runserver"
echo ""
echo "2. In ssb-react folder:"
echo "   npm run dev"
echo ""
echo "The website will be at: http://localhost:5173"
echo "API will be at: http://localhost:8000/api/v1"
echo "Admin panel: http://localhost:8000/admin"
echo ""
