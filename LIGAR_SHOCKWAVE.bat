@echo off
title SHOCKWAVE DEPLOY SYSTEM
echo ==========================================
echo INICIANDO DEPLOY PROFISSIONAL SHOCKWAVE
echo ==========================================
echo.

cd C:\Users\gabri\.gemini\antigravity\scratch\shockwave-sales-automation

echo [1/3] Configurando repositorio remoto...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/ivanjuliao782-arch/shockwave-sales-automation.git
git branch -M main

echo [2/3] Subindo codigo para o GitHub...
echo (Se pedir login, use o seu navegador ja aberto)
git push -u origin main

echo [3/3] Abrindo Vercel para Deploy Final...
start https://vercel.com/new/import?s=https://github.com/ivanjuliao782-arch/shockwave-sales-automation

echo.
echo ==========================================
echo PROCESSO CONCLUIDO. VERIFIQUE O NAVEGADOR.
echo ==========================================
pause
