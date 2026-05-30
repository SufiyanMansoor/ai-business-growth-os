# Deploy frontend to GitHub Pages (manual — no workflow scope needed)
$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$LocalApp = "$env:LOCALAPPDATA\ai-growth-os\app"
$Repo = "https://github.com/SufiyanMansoor/ai-business-growth-os.git"

Write-Host "Syncing project..." -ForegroundColor Cyan
robocopy $ProjectRoot $LocalApp /MIR /XD node_modules .git /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

Write-Host "Building for GitHub Pages..." -ForegroundColor Cyan
Push-Location "$LocalApp\frontend"
npm install --prefer-offline 2>$null
$env:GITHUB_PAGES = "true"
npm run build
Pop-Location

$DeployDir = "$env:TEMP\ghp-deploy"
Remove-Item $DeployDir -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "$LocalApp\frontend\dist" $DeployDir -Recurse
Copy-Item "$DeployDir\index.html" "$DeployDir\404.html" -Force

Write-Host "Pushing to gh-pages branch..." -ForegroundColor Cyan
Push-Location $DeployDir
git init | Out-Null
git checkout -b gh-pages 2>$null
git add .
git config user.email "deploy@aigrowthos.com"
git config user.name "Deploy Bot"
git commit -m "Deploy to GitHub Pages $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -q
git remote remove origin 2>$null
git remote add origin $Repo
git push -f origin gh-pages
Pop-Location

Write-Host ""
Write-Host "Deployed! Live at:" -ForegroundColor Green
Write-Host "https://sufiyanmansoor.github.io/ai-business-growth-os/" -ForegroundColor Yellow
