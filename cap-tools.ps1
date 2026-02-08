# ===============================
# CAPTENANT ADB CLEANER (Windows)
# ===============================

function Cap-Clean {
    Write-Host "Cleaning ghost ADB entries..." -ForegroundColor Yellow

    $adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"

    # Kill offline / unauthorized devices
    & $adb devices | ForEach-Object {
        if ($_ -match "offline|unauthorized") {
            $device = ($_ -split "`t")[0]
            if ($device -like "emulator-*") {
                Write-Host "Killing ghost emulator: $device"
                & $adb -s $device emu kill 2>$null
            }
        }
    }

    # Restart ADB cleanly
    & $adb kill-server
    & $adb start-server

    Write-Host "Clean! Available devices:" -ForegroundColor Green
    & $adb devices
}

function Cap-Android {
    Cap-Clean
    npx cap run android
}
