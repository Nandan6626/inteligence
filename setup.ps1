Write-Host "Setting up Enterprise AI Company Intelligence Platform..." -ForegroundColor Cyan

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install it first." -ForegroundColor Red
    exit
}

# Check for Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python is not installed. Please install it first." -ForegroundColor Red
    exit
}

# Setup Backend
Write-Host "Setting up Backend..." -ForegroundColor Yellow
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Setup Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
cd ..\frontend
npm install

Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the backend:" -ForegroundColor Cyan
Write-Host "  cd backend"
Write-Host "  .\venv\Scripts\activate"
Write-Host "  uvicorn main:app --reload"
Write-Host ""
Write-Host "To run the frontend:" -ForegroundColor Cyan
Write-Host "  cd frontend"
Write-Host "  npm run dev"
