@echo off
echo ========================================
echo 清理 Nuxt 缓存并重启
echo ========================================

echo.
echo [1/4] 停止开发服务器...
taskkill /f /im node.exe 2>nul

echo.
echo [2/4] 清理 .nuxt 缓存...
if exist ".nuxt" (
    rmdir /s /q ".nuxt"
    echo ✓ .nuxt 已清理
) else (
    echo - .nuxt 不存在
)

echo.
echo [3/4] 清理 node_modules 缓存...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✓ node_modules\.cache 已清理
) else (
    echo - node_modules\.cache 不存在
)

if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✓ node_modules\.vite 已清理
) else (
    echo - node_modules\.vite 不存在
)

echo.
echo [4/4] 验证 Three.js 版本...
type package.json | findstr "three"

echo.
echo ========================================
echo 缓存清理完成！
echo 请运行: npm run dev
echo ========================================
pause
