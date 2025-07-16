#!/usr/bin/env node

const https = require('https');
const http = require('http');

const domains = [
  'elite-frontend-production.up.railway.app',
  'www.elitecentrocomercial.com',
  'elitecentrocomercial.com'
];

console.log('🔒 Checking SSL configuration...\n');

async function checkDomain(domain) {
  return new Promise((resolve) => {
    const options = {
      hostname: domain,
      port: 443,
      path: '/api/health',
      method: 'GET',
      timeout: 5000,
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ ${domain} - SSL OK`);
          console.log(`   Status: ${response.status}`);
          console.log(`   Protocol: ${response.protocol}`);
          console.log(`   SSL: ${response.ssl}`);
          console.log(`   Port: ${response.port}`);
        } catch (e) {
          console.log(`⚠️  ${domain} - SSL OK but invalid JSON response`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${domain} - SSL Error: ${err.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.log(`⏰ ${domain} - SSL Timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function checkAllDomains() {
  for (const domain of domains) {
    await checkDomain(domain);
    console.log('');
  }
}

checkAllDomains().then(() => {
  console.log('🔍 SSL check completed!');
}); 