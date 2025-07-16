#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');

const domains = [
  'www.elitecentrocomercial.com',
  'elitecentrocomercial.com',
  'elite-frontend-production.up.railway.app'
];

console.log('🌐 Checking domain configuration...\n');

async function checkDomain(domain) {
  console.log(`🔍 Checking ${domain}...`);
  
  // Check HTTP
  try {
    const httpResult = await checkProtocol(domain, 'http');
    console.log(`   HTTP: ${httpResult ? '✅ OK' : '❌ Failed'}`);
  } catch (e) {
    console.log(`   HTTP: ❌ Error - ${e.message}`);
  }
  
  // Check HTTPS
  try {
    const httpsResult = await checkProtocol(domain, 'https');
    console.log(`   HTTPS: ${httpsResult ? '✅ OK' : '❌ Failed'}`);
  } catch (e) {
    console.log(`   HTTPS: ❌ Error - ${e.message}`);
  }
  
  // Check health endpoint
  try {
    const healthResult = await checkHealthEndpoint(domain);
    console.log(`   Health: ${healthResult ? '✅ OK' : '❌ Failed'}`);
  } catch (e) {
    console.log(`   Health: ❌ Error - ${e.message}`);
  }
  
  console.log('');
}

function checkProtocol(domain, protocol) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: domain,
      port: protocol === 'https' ? 443 : 80,
      path: '/',
      method: 'GET',
      timeout: 5000,
      rejectUnauthorized: false
    };

    const client = protocol === 'https' ? https : http;
    
    const req = client.request(options, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

function checkHealthEndpoint(domain) {
  return new Promise((resolve, reject) => {
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
          resolve(response.status === 'healthy');
        } catch (e) {
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function checkAllDomains() {
  for (const domain of domains) {
    await checkDomain(domain);
  }
}

checkAllDomains().then(() => {
  console.log('🔍 Domain check completed!');
  console.log('\n💡 If you see SSL errors, check Railway domain configuration:');
  console.log('   1. Go to Railway dashboard');
  console.log('   2. Select your frontend service');
  console.log('   3. Go to Settings > Domains');
  console.log('   4. Verify domain configuration');
  console.log('   5. Check SSL certificate status');
}); 