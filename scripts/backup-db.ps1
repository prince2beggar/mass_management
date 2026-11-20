# ==============================================================================
# MessMate Database Automated Backup Tool
# Stored strictly on D:\mass_management\backups
# ==============================================================================

$backupDir = "D:\mass_management\backups"
$sourceDb = "D:\mass_management\prisma\dev.db"

if (!(Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Created backup folder: $backupDir"
}

if (!(Test-Path -Path $sourceDb)) {
    Write-Error "Source database not found at: $sourceDb"
    exit 1
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$destination = Join-Path -Path $backupDir -ChildPath "messmate_backup_$timestamp.db"

# Copy SQLite snapshot atomically
Copy-Item -Path $sourceDb -Destination $destination -Force

if (Test-Path -Path $destination) {
    $fileInfo = Get-Item $destination
    $hash = (Get-FileHash -Path $destination -Algorithm SHA256).Hash
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Database Backup Completed Successfully!" -ForegroundColor Green
    Write-Host "File: $($fileInfo.Name)"
    Write-Host "Path: $destination"
    Write-Host "Size: $([math]::Round($fileInfo.Length / 1KB, 2)) KB"
    Write-Host "SHA256: $hash"
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Error "Backup creation failed!"
    exit 1
}
