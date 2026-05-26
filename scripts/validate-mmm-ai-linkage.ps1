param(
  [Parameter(Mandatory = $true)]
  [string]$SupabaseUrl,
  [Parameter(Mandatory = $true)]
  [string]$AnonKey
)

function Invoke-FunctionProbe {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Body
  )

  $uri = "$SupabaseUrl/functions/v1/$Name"
  $headers = @(
    "-H", "apikey: $AnonKey",
    "-H", "Authorization: Bearer $AnonKey",
    "-H", "Content-Type: application/json"
  )

  $cmd = @("curl.exe", "-s", "-o", "NUL", "-w", "%{http_code}", "-X", "POST", $uri) + $headers + @("-d", $Body)
  $code = & $cmd[0] $cmd[1..($cmd.Length - 1)]
  [PSCustomObject]@{
    function_name = $Name
    status_code   = [int]$code
  }
}

$probes = @(
  @{ name = "mmm-ai-chat-user"; body = '{"message":"health check","context":{"route":"/matrix"}}' },
  @{ name = "mmm-subject-knowledge-list"; body = '{"status":"all"}' },
  @{ name = "mmm-subject-knowledge-migrate-legacy"; body = '{"dry_run":true,"limit":1}' }
)

$results = foreach ($probe in $probes) {
  Invoke-FunctionProbe -Name $probe.name -Body $probe.body
}

$results | Format-Table -AutoSize
