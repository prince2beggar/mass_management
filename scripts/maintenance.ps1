# ==============================================================================
# MessMate Automated Daily Maintenance & Health Runner
# Runs strictly on D:\mass_management
# ==============================================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Starting MessMate Daily Maintenance Routine..." -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Step 1: Automated Database Snapshot
Write-Host "[1/4] Creating database backup snapshot..." -ForegroundColor Yellow
$backupScript = Join-Path -Path $PSScriptRoot -ChildPath "backup-db.ps1"
if (Test-Path $backupScript) {
    & powershell -File $backupScript
} else {
    Write-Warning "Backup script not found at: $backupScript"
}

# Step 2: Prune Backups Older Than 30 Days
Write-Host "[2/4] Pruning backup archive (retention: 30 days)..." -ForegroundColor Yellow
$backupDir = "D:\mass_management\backups"
if (Test-Path $backupDir) {
    $cutoff = (Get-Date).AddDays(-30)
    $oldBackups = Get-ChildItem -Path $backupDir -Filter "messmate_backup_*.db" | Where-Object { $_.LastWriteTime -lt $cutoff }
    foreach ($old in $oldBackups) {
        Remove-Item -Path $old.FullName -Force
        Write-Host "Pruned obsolete backup: $($old.Name)" -ForegroundColor DarkGray
    }
    Write-Host "Backup pruning completed." -ForegroundColor Green
}

# Step 3: Temporary Folder Cleanup on D: Drive
Write-Host "[3/4] Cleaning temporary build scratch on D: drive..." -ForegroundColor Yellow
$tempDir = "D:\mass_management\.temp"
if (Test-Path $tempDir) {
    Get-ChildItem -Path $tempDir -Recurse | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-3) } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Temporary file pruning completed." -ForegroundColor Green
}

# Step 4: System Health Ping
Write-Host "[4/4] Verifying live server health and database connection..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -TimeoutSec 5
    Write-Host "System Status: $($health.status)" -ForegroundColor Green
    Write-Host "Database Latency: $($health.checks.database.latencyMs) ms" -ForegroundColor Green
    Write-Host "Storage Policy: $($health.checks.database.storage)" -ForegroundColor Green
} catch {
    Write-Warning "Local server is not active or unreachable."
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Maintenance Routine Completed Successfully!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
