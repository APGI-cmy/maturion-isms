# verify-vercel-env.ps1
# Verifies Vercel environment variables and checks for secret references

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel Environment Variable Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✓ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Pull Vercel environment information
Write-Host "Pulling Vercel environment configuration..." -ForegroundColor Yellow
Write-Host "(This will prompt you to link to your project if not already linked)" -ForegroundColor Gray
Write-Host ""

try {
    vercel pull --yes --environment=preview 2>&1 | Out-Null
    Write-Host "✓ Vercel configuration pulled successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to pull Vercel configuration" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check for .vercel directory
if (Test-Path ".vercel") {
    Write-Host "✓ .vercel directory found" -ForegroundColor Green
} else {
    Write-Host "✗ .vercel directory not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Search for environment files
Write-Host "Searching for environment configuration files..." -ForegroundColor Yellow
Write-Host ""

$envFiles = @(
    ".vercel/.env.preview.local",
    ".vercel/.env.production.local",
    ".vercel/.env.development.local",
    ".vercel/project.json"
)

foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "Found: $file" -ForegroundColor Green
        Write-Host "Contents:" -ForegroundColor Gray
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Get-Content $file | Write-Host
        Write-Host "----------------------------------------" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check for secret references in environment files
Write-Host "Checking for secret references (@secret_name pattern)..." -ForegroundColor Yellow
Write-Host ""

$secretReferences = @()

Get-ChildItem -Path ".vercel" -Recurse -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match '@[a-z_]+') {
        $matches = [regex]::Matches($content, '@([a-z_]+)')
        foreach ($match in $matches) {
            $secretReferences += [PSCustomObject]@{
                File = $_.FullName
                Reference = $match.Value
            }
        }
    }
}

if ($secretReferences.Count -gt 0) {
    Write-Host "✗ WARNING: Secret references found!" -ForegroundColor Red
    Write-Host ""
    $secretReferences | Format-Table -AutoSize
    Write-Host ""
    Write-Host "These secret references may cause deployment failures if the secrets don't exist in Vercel." -ForegroundColor Yellow
} else {
    Write-Host "✓ No secret references found (all values are direct)" -ForegroundColor Green
}

Write-Host ""

# Check for required environment variables
Write-Host "Checking for required MAT environment variables..." -ForegroundColor Yellow
Write-Host ""

$requiredVars = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_API_BASE_URL"
)

$envContent = ""
if (Test-Path ".vercel/.env.preview.local") {
    $envContent = Get-Content ".vercel/.env.preview.local" -Raw
}

foreach ($var in $requiredVars) {
    if ($envContent -match "$var=") {
        $value = ($envContent | Select-String "$var=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value })
        if ($value -match '^@') {
            Write-Host "✗ $var = $value (SECRET REFERENCE)" -ForegroundColor Red
        } else {
            Write-Host "✓ $var = [REDACTED] (direct value)" -ForegroundColor Green
        }
    } else {
        Write-Host "✗ $var not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan