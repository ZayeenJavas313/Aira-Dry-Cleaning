# Script untuk memperbaiki error auth_gssapi_client di MariaDB XAMPP
# Jalankan sebagai Administrator: powershell -ExecutionPolicy Bypass -File .\scripts\fix-xampp-mysql.ps1

$mysqlBin = "C:\xampp\mysql\bin"
$mysqld = Join-Path $mysqlBin "mysqld.exe"
$mysql = Join-Path $mysqlBin "mysql.exe"

if (-not (Test-Path $mysqld)) {
    Write-Host "XAMPP MySQL tidak ditemukan di C:\xampp\mysql\bin" -ForegroundColor Red
    exit 1
}

Write-Host "1. Menghentikan MySQL XAMPP..." -ForegroundColor Yellow
Get-Process -Name mysqld -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "2. Memulai MySQL dengan skip-grant-tables..." -ForegroundColor Yellow
$proc = Start-Process -FilePath $mysqld -ArgumentList "--skip-grant-tables","--console" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 4

Write-Host "3. Memperbaiki autentikasi user root..." -ForegroundColor Yellow
$fixSql = @"
UPDATE mysql.global_priv SET priv=json_set(priv, '$.plugin', 'mysql_native_password', '$.authentication_string', '') WHERE User='root';
UPDATE mysql.user SET plugin='mysql_native_password', authentication_string='' WHERE User='root';
FLUSH PRIVILEGES;
"@

& $mysql -u root -e $fixSql 2>$null
if ($LASTEXITCODE -ne 0) {
    # Fallback for older MariaDB
    & $mysql -u root -e "UPDATE mysql.user SET plugin='mysql_native_password', password='' WHERE User='root'; FLUSH PRIVILEGES;" 2>$null
}

Write-Host "4. Menghentikan MySQL temporary..." -ForegroundColor Yellow
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "5. Memulai MySQL normal via XAMPP..." -ForegroundColor Yellow
Start-Process -FilePath $mysqld -ArgumentList "--console" -WindowStyle Hidden
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Selesai! Sekarang set DB_TYPE=mysql di backend/.env lalu jalankan npm run seed" -ForegroundColor Green
