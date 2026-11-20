# ==============================================================================
# MessMate Database Restore Tool
# Restores from D:\mass_management\backups to D:\mass_management\prisma\dev.db
# ==============================================================================

param(
    [string]$BackupFile
)

$backupDir = "D:\mass_management\backups"
$targetDb = "D:\mass_management\prisma\dev.db"

if (-not $BackupFile) {
    # Find latest backup if no file specified
    $latest = Get-ChildItem -Path $backupDir -Filter "messmate_backup_*.db" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $latest) {
        Write-Error "No backups found in $backupDir"
        exit 1
    }
    $BackupFile = $latest.FullName
}

if (!(Test-Path -Path $BackupFile)) {
    Write-Error "Specified backup file does not exist: $BackupFile"
    exit 1
}

Write-Host "Restoring database from: $BackupFile" -ForegroundColor Yellow
Copy-Item -Path $BackupFile -Destination $targetDb -Force

if (Test-Path -Path $targetDb) {
    Write-Host "Database successfully restored to: $targetDb" -ForegroundColor Green
} else {
    Write-Error "Restore operation failed!"
    exit 1
}
