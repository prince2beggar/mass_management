# ==============================================================================
# MessMate Post-Deployment Smoke Test Suite
# ==============================================================================

param(
    [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Starting MessMate Production Smoke Tests on: $BaseUrl" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$routes = @(
    "/api/health",
    "/",
    "/dashboard",
    "/meals",
    "/bazar",
    "/finance",
    "/rooms",
    "/emergency",
    "/notices",
    "/reports",
    "/admin",
    "/super-admin"
)

$allPassed = $true

foreach ($route in $routes) {
    $url = "$BaseUrl$route"
    $start = Get-Date
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 35
        $duration = [math]::Round(((Get-Date) - $start).TotalMilliseconds, 2)
        if ($response.StatusCode -eq 200) {
            Write-Host "[PASS] ($($response.StatusCode)) $route ($duration ms)" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] ($($response.StatusCode)) $route" -ForegroundColor Red
            $allPassed = $false
        }
    } catch {
        Write-Host "[ERROR] Could not connect to: $url - $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }
}

Write-Host "--------------------------------------------------" -ForegroundColor Cyan

# Test health check payload directly
try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/api/health"
    if ($health.status -eq "healthy" -and $health.checks.database.status -eq "connected") {
        Write-Host "[PASS] Health Check Verified: Database Connected (${($health.checks.database.latencyMs)} ms)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Health status unexpected: $($health.status)" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "[ERROR] Health API call failed" -ForegroundColor Red
    $allPassed = $false
}

Write-Host "==================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "All 12 Smoke Tests Passed Successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Some smoke tests failed. Please inspect logs." -ForegroundColor Red
    exit 1
}
