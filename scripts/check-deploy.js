#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment configuration...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'railway.json',
  'server.js',
  'app/api/health/route.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const requiredScripts = ['start:railway', 'build'];

console.log('\n📦 Checking package.json scripts...');
requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`${exists ? '✅' : '❌'} script: ${script}`);
  if (!exists) allFilesExist = false;
});

// Check railway.json configuration
const railwayJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'railway.json'), 'utf8'));
console.log('\n🚂 Checking Railway configuration...');

const requiredRailwayConfig = [
  'build.builder',
  'build.buildCommand',
  'deploy.startCommand',
  'deploy.healthcheckPath'
];

requiredRailwayConfig.forEach(config => {
  const keys = config.split('.');
  let value = railwayJson;
  for (const key of keys) {
    value = value[key];
  }
  const exists = value !== undefined;
  console.log(`${exists ? '✅' : '❌'} ${config}: ${value || 'missing'}`);
  if (!exists) allFilesExist = false;
});

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 All checks passed! Ready for deployment.');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
} 