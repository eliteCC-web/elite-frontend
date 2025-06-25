# Script para limpiar la caché de Next.js en Windows
Write-Host "🧹 Limpiando caché de Next.js..." -ForegroundColor Yellow

# Detener el servidor de desarrollo si está corriendo
Write-Host "Deteniendo servidor de desarrollo..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Eliminar carpeta .next
if (Test-Path ".next") {
    Write-Host "Eliminando carpeta .next..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Carpeta .next eliminada" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Carpeta .next no encontrada" -ForegroundColor Blue
}

# Eliminar caché de node_modules
if (Test-Path "node_modules\.cache") {
    Write-Host "Eliminando caché de node_modules..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Caché de node_modules eliminada" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Caché de node_modules no encontrada" -ForegroundColor Blue
}

# Limpiar caché de npm
Write-Host "Limpiando caché de npm..." -ForegroundColor Cyan
npm cache clean --force
Write-Host "✅ Caché de npm limpiada" -ForegroundColor Green

Write-Host "🎉 ¡Limpieza completada!" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar: npm run dev" -ForegroundColor Yellow 