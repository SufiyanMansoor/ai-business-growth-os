# Deploy frontend to GitHub Pages (manual — no workflow scope needed)
$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$LocalApp = "$env:LOCALAPPDATA\ai-growth-os\app"
$Repo = "https://github.com/SufiyanMansoor/ai-business-growth-os.git"

Write-Host "Syncing project..." -ForegroundColor Cyan
robocopy $ProjectRoot $LocalApp /MIR /XD node_modules .git /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

Write-Host "Building for GitHub Pages..." -ForegroundColor Cyan
Push-Location "$LocalApp\frontend"
cmd /c "npm install --prefer-offline 2>nul"
$env:GITHUB_PAGES = "true"
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
Pop-Location

$DeployDir = "$env:TEMP\ghp-deploy"
Remove-Item $DeployDir -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "$LocalApp\frontend\dist" $DeployDir -Recurse
Copy-Item "$DeployDir\index.html" "$DeployDir\404.html" -Force

Write-Host "Pushing to gh-pages branch..." -ForegroundColor Cyan
Push-Location $DeployDir
git init | Out-Null
cmd /c "git checkout -b gh-pages 2>nul"
git add .
git config user.email "deploy@aigrowthos.com"
git config user.name "Deploy Bot"
git commit -m "Deploy to GitHub Pages $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -q
cmd /c "git remote remove origin 2>nul"
git remote add origin $Repo
cmd /c "git push -f origin gh-pages"
if ($LASTEXITCODE -ne 0) { throw "gh-pages push failed" }
Pop-Location

Write-Host ""
Write-Host "Deployed! Live at:" -ForegroundColor Green
Write-Host "https://sufiyanmansoor.github.io/ai-business-growth-os/" -ForegroundColor Yellow
