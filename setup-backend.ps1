# Quick Setup Script for TLDR Backend

Write-Host "🚀 Setting up TLDR Backend..." -ForegroundColor Cyan

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.10+ first." -ForegroundColor Red
    exit 1
}

# Navigate to Backend directory
Set-Location -Path "Backend"

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "⚠ .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit Backend/.env and add your API keys:" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY or ANTHROPIC_API_KEY" -ForegroundColor Yellow
    Write-Host ""
}

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies. Please check the error above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit Backend/.env and add your API key"
Write-Host "2. Run: python Backend/BackendServer.py"
Write-Host "3. Backend will be available at http://localhost:8000"
Write-Host ""
