# Environment lockdown for D: drive execution only
$env:TEMP = "D:\mass_management\.temp"
$env:TMP = "D:\mass_management\.temp"
$env:npm_config_cache = "D:\Web_Dev_Cache\npm-cache"
$env:PNPM_HOME = "D:\.npm-global"
$env:PRISMA_ENGINES_CACHE_DIR = "D:\mass_management\.cache\prisma"
$env:TURBO_CACHE_DIR = "D:\mass_management\.cache\turbo"
$env:NEXT_TELEMETRY_DISABLED = "1"
Write-Host "Environment configured strictly for D: drive."
