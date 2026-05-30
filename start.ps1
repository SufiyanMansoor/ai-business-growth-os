# AI Business Growth OS - Start Script
# Runs from local disk to avoid Google Drive npm issues

$ErrorActionPreference = "Stop"
$src = $PSScriptRoot
$dest = "$env:LOCALAPPDATA\ai-growth-os\app"

Write-Host "Syncing project to local disk..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $dest | Out-Null
robocopy $src $dest /MIR /XD node_modules .git /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Robocopy failed with code $LASTEXITCODE" }

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location "$dest\frontend"
if (-not (Test-Path "node_modules\vite")) {
  npm install
  if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Frontend npm install failed" }
}
Pop-Location

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Push-Location "$dest\backend"
if (-not (Test-Path "node_modules\express")) {
  npm install
  if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Backend npm install failed" }
}
Pop-Location

Write-Host ""
Write-Host "Starting AI Business Growth OS..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Yellow
Write-Host ""

Push-Location $dest
npm install --silent 2>$null
npm run dev
