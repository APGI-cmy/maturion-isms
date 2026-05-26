param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRef,
  [string]$LegacySupabaseUrl = "",
  [string]$LegacySupabaseServiceRoleKey = "",
  [string]$AimcBaseUrl = "",
  [string]$AimcServiceToken = ""
)

$pairs = @{}
if ($LegacySupabaseUrl) { $pairs["LEGACY_SUPABASE_URL"] = $LegacySupabaseUrl }
if ($LegacySupabaseServiceRoleKey) { $pairs["LEGACY_SUPABASE_SERVICE_ROLE_KEY"] = $LegacySupabaseServiceRoleKey }
if ($AimcBaseUrl) { $pairs["AIMC_BASE_URL"] = $AimcBaseUrl }
if ($AimcServiceToken) { $pairs["AIMC_SERVICE_TOKEN"] = $AimcServiceToken }

if ($pairs.Count -eq 0) {
  Write-Host "No secrets provided. Nothing to set." -ForegroundColor Yellow
  exit 1
}

$setArgs = @()
foreach ($kv in $pairs.GetEnumerator()) {
  $setArgs += "$($kv.Key)=$($kv.Value)"
}

Write-Host "Setting $($pairs.Count) secrets for project $ProjectRef..." -ForegroundColor Cyan
supabase secrets set --project-ref $ProjectRef @setArgs
if ($LASTEXITCODE -ne 0) {
  Write-Host "Failed to set secrets." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Secrets updated successfully." -ForegroundColor Green
