#!/usr/bin/env node

/**
 * Google OAuth Integration Acceptance Test
 * Tests the complete authentication flow from frontend to backend
 */

const https = require('https');
const http = require('http');

// Test configuration
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testEnvironmentConfiguration() {
  log('🔧 Testing Environment Configuration...', 'blue');
  
  const tests = [
    {
      name: 'Google Client ID configured',
      test: () => GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id.googleusercontent.com',
      error: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID not properly configured'
    },
    {
      name: 'Backend URL configured',
      test: () => BACKEND_URL && BACKEND_URL !== 'http://localhost:8080',
      warning: 'Using default backend URL - consider setting NEXT_PUBLIC_BACKEND_URL'
    },
    {
      name: 'Frontend URL configured',
      test: () => FRONTEND_URL,
      error: 'Frontend URL not configured'
    }
  ];
  
  let passed = 0;
  for (const test of tests) {
    try {
      if (test.test()) {
        log(`  ✅ ${test.name}`, 'green');
        passed++;
      } else {
        if (test.error) {
          log(`  ❌ ${test.name}: ${test.error}`, 'red');
        } else if (test.warning) {
          log(`  ⚠️  ${test.name}: ${test.warning}`, 'yellow');
          passed++;
        }
      }
    } catch (error) {
      log(`  ❌ ${test.name}: ${error.message}`, 'red');
    }
  }
  
  return passed;
}

async function testBackendConnectivity() {
  log('🔗 Testing Backend Connectivity...', 'blue');
  
  const tests = [
    {
      name: 'Backend health check',
      url: `${BACKEND_URL}/actuator/health`,
      expectedStatus: 200
    },
    {
      name: 'Backend CORS preflight',
      url: `${BACKEND_URL}/me`,
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization,Content-Type'
      },
      expectedStatus: [200, 204]
    }
  ];
  
  let passed = 0;
  for (const test of tests) {
    try {
      const response = await makeRequest(test.url, {
        method: test.method || 'GET',
        headers: test.headers || {}
      });
      
      const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus];
      if (expectedStatuses.includes(response.statusCode)) {
        log(`  ✅ ${test.name}`, 'green');
        passed++;
      } else {
        log(`  ❌ ${test.name}: Expected ${test.expectedStatus}, got ${response.statusCode}`, 'red');
      }
    } catch (error) {
      log(`  ❌ ${test.name}: ${error.message}`, 'red');
    }
  }
  
  return passed;
}

async function testFrontendConnectivity() {
  log('🌐 Testing Frontend Connectivity...', 'blue');
  
  const tests = [
    {
      name: 'Frontend login page',
      url: `${FRONTEND_URL}/login`,
      expectedStatus: 200,
      expectedContent: ['Google', 'Sign']
    },
    {
      name: 'Frontend dashboard (should redirect)',
      url: `${FRONTEND_URL}/dashboard`,
      expectedStatus: [200, 302, 307]
    }
  ];
  
  let passed = 0;
  for (const test of tests) {
    try {
      const response = await makeRequest(test.url);
      
      const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus];
      if (expectedStatuses.includes(response.statusCode)) {
        let contentCheck = true;
        if (test.expectedContent) {
          contentCheck = test.expectedContent.every(content => 
            response.body.toLowerCase().includes(content.toLowerCase())
          );
        }
        
        if (contentCheck) {
          log(`  ✅ ${test.name}`, 'green');
          passed++;
        } else {
          log(`  ❌ ${test.name}: Expected content not found`, 'red');
        }
      } else {
        log(`  ❌ ${test.name}: Expected ${test.expectedStatus}, got ${response.statusCode}`, 'red');
      }
    } catch (error) {
      log(`  ❌ ${test.name}: ${error.message}`, 'red');
    }
  }
  
  return passed;
}

async function testGoogleOAuthConfiguration() {
  log('🔐 Testing Google OAuth Configuration...', 'blue');
  
  const tests = [
    {
      name: 'Google Client ID format',
      test: () => {
        if (!GOOGLE_CLIENT_ID) return false;
        return GOOGLE_CLIENT_ID.endsWith('.googleusercontent.com') && 
               GOOGLE_CLIENT_ID.length > 50;
      },
      error: 'Google Client ID format appears invalid'
    },
    {
      name: 'Google Discovery Document accessible',
      url: 'https://accounts.google.com/.well-known/openid_configuration',
      expectedStatus: 200
    }
  ];
  
  let passed = 0;
  for (const test of tests) {
    try {
      if (test.test) {
        if (test.test()) {
          log(`  ✅ ${test.name}`, 'green');
          passed++;
        } else {
          log(`  ❌ ${test.name}: ${test.error}`, 'red');
        }
      } else if (test.url) {
        const response = await makeRequest(test.url);
        if (response.statusCode === test.expectedStatus) {
          log(`  ✅ ${test.name}`, 'green');
          passed++;
        } else {
          log(`  ❌ ${test.name}: Expected ${test.expectedStatus}, got ${response.statusCode}`, 'red');
        }
      }
    } catch (error) {
      log(`  ❌ ${test.name}: ${error.message}`, 'red');
    }
  }
  
  return passed;
}

async function testBackendEndpoints() {
  log('🔍 Testing Backend API Endpoints...', 'blue');
  
  const tests = [
    {
      name: '/me endpoint (unauthenticated)',
      url: `${BACKEND_URL}/me`,
      expectedStatus: 401,
      description: 'Should reject unauthenticated requests'
    },
    {
      name: '/authorize endpoint (unauthenticated)',
      url: `${BACKEND_URL}/authorize`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissionName: 'view', pagePath: '/dashboard' }),
      expectedStatus: 401,
      description: 'Should reject unauthenticated requests'
    }
  ];
  
  let passed = 0;
  for (const test of tests) {
    try {
      const response = await makeRequest(test.url, {
        method: test.method || 'GET',
        headers: test.headers || {},
        body: test.body
      });
      
      if (response.statusCode === test.expectedStatus) {
        log(`  ✅ ${test.name}: ${test.description}`, 'green');
        passed++;
      } else {
        log(`  ❌ ${test.name}: Expected ${test.expectedStatus}, got ${response.statusCode}`, 'red');
      }
    } catch (error) {
      log(`  ❌ ${test.name}: ${error.message}`, 'red');
    }
  }
  
  return passed;
}

async function generateTestReport(results) {
  log('\n📊 Test Results Summary', 'blue');
  log('========================', 'blue');
  
  const totalTests = Object.values(results).reduce((sum, count) => sum + count.total, 0);
  const totalPassed = Object.values(results).reduce((sum, count) => sum + count.passed, 0);
  const totalFailed = totalTests - totalPassed;
  
  for (const [category, result] of Object.entries(results)) {
    const status = result.passed === result.total ? '✅' : '❌';
    log(`${status} ${category}: ${result.passed}/${result.total}`, 
        result.passed === result.total ? 'green' : 'red');
  }
  
  log(`\nOverall: ${totalPassed}/${totalTests} tests passed`, 
      totalFailed === 0 ? 'green' : 'red');
  
  if (totalFailed > 0) {
    log('\n🔧 Next Steps:', 'yellow');
    log('1. Ensure backend services are running on correct ports', 'yellow');
    log('2. Create .env.local with proper Google Client ID', 'yellow');
    log('3. Configure Google OAuth authorized origins', 'yellow');
    log('4. Verify CORS settings in backend', 'yellow');
  } else {
    log('\n🎉 All tests passed! Ready for manual Google Sign-In testing.', 'green');
  }
}

async function runAcceptanceTests() {
  log('🚀 Starting Google OAuth Integration Acceptance Tests\n', 'blue');
  
  const results = {};
  
  // Run all test suites
  const envPassed = await testEnvironmentConfiguration();
  results['Environment Configuration'] = { passed: envPassed, total: 3 };
  
  const backendPassed = await testBackendConnectivity();
  results['Backend Connectivity'] = { passed: backendPassed, total: 2 };
  
  const frontendPassed = await testFrontendConnectivity();
  results['Frontend Connectivity'] = { passed: frontendPassed, total: 2 };
  
  const oauthPassed = await testGoogleOAuthConfiguration();
  results['Google OAuth Configuration'] = { passed: oauthPassed, total: 2 };
  
  const endpointsPassed = await testBackendEndpoints();
  results['Backend API Endpoints'] = { passed: endpointsPassed, total: 2 };
  
  await generateTestReport(results);
}

// Run tests if called directly
if (require.main === module) {
  runAcceptanceTests().catch(error => {
    log(`\n❌ Test execution failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runAcceptanceTests };
