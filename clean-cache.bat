@echo off
echo 🧹 Limpiando caché de Next.js...

REM Detener el servidor de desarrollo si está corriendo
echo Deteniendo servidor de desarrollo...
taskkill /f /im node.exe >nul 2>&1

REM Eliminar carpeta .next
if exist ".next" (
    echo Eliminando carpeta .next...
    rmdir /s /q ".next"
    echo ✅ Carpeta .next eliminada
) else (
    echo ℹ️  Carpeta .next no encontrada
)

REM Eliminar caché de node_modules
if exist "node_modules\.cache" (
    echo Eliminando caché de node_modules...
    rmdir /s /q "node_modules\.cache"
    echo ✅ Caché de node_modules eliminada
) else (
    echo ℹ️  Caché de node_modules no encontrada
)

REM Limpiar caché de npm
echo Limpiando caché de npm...
npm cache clean --force

echo 🎉 ¡Limpieza completada!
echo Ahora puedes ejecutar: npm run dev
pause 