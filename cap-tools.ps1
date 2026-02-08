# cap-tools.ps1 (PowerShell) - fixes ghost/offline/authorizing issues for ADB + Capacitor
# Usage (in SAME terminal):
#   . .\cap-tools.ps1
#   Cap-Clean
#   Cap-Run

$script:adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"

function Get-Adb {
  if (-not (Test-Path $script:adb)) {
    throw "ADB not found at: $script:adb"
  }
  return $script:adb
}

function Cap-Clean {
  $adb = Get-Adb

  Write-Host "Cleaning ghost ADB entries..." -ForegroundColor Cyan

  # 1) Kill any known ghost emulator IDs (safe if they don't exist)
  foreach ($id in @("emulator-5562","emulator-5556","emulator-5558","emulator-5554")) {
    & $adb -s $id emu kill 2>$null | Out-Null
  }

  # 2) Disconnect offline/unauthorized/authorizing devices
  $lines = & $adb devices
  $bad = $lines |
    Select-String "offline|unauthorized|authorizing" |
    ForEach-Object { ($_.ToString().Trim() -split "\s+")[0] } |
    Where-Object { $_ -and $_ -ne "List" }

  foreach ($d in $bad) {
    Write-Host "Disconnecting: $d" -ForegroundColor Yellow
    & $adb disconnect $d 2>$null | Out-Null
  }

  # 3) If any device is stuck in authorizing, reset ADB keys (forces fresh RSA handshake)
  $lines2 = (& $adb devices) -join "`n"
  if ($lines2 -match "authorizing") {
    Write-Host "Stuck 'authorizing' detected -> resetting ADB keys..." -ForegroundColor Yellow
    Remove-Item "$env:USERPROFILE\.android\adbkey*" -Force -ErrorAction SilentlyContinue
  }

  # 4) Restart ADB cleanly
  & $adb kill-server | Out-Null
  Start-Sleep -Seconds 2
  & $adb start-server | Out-Null

  Write-Host "`nClean! Devices now:" -ForegroundColor Green
  & $adb devices
}

function Cap-Run {
  $adb = Get-Adb

  Cap-Clean

  # Pick first GOOD emulator/device (not offline/unauthorized/authorizing)
  $target = (& $adb devices) |
    Select-String "device$" |
    ForEach-Object { ($_.ToString().Trim() -split "\s+")[0] } |
    Where-Object { $_ -notmatch "^List$" } |
    Select-Object -First 1

  if (-not $target) {
    Write-Host "`nNo authorized device found." -ForegroundColor Red
    Write-Host "Start an emulator, then accept the RSA popup inside the emulator." -ForegroundColor Red
    return
  }

  Write-Host "`nRunning Capacitor on: $target" -ForegroundColor Green
  npx cap run android --target $target
}
