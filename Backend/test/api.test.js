// Simple API tests for the Aftercare Backend
// Run with: node test/api.test.js

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Simple test runner
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    console.log('🧪 Running API Tests...\n');
    
    for (const { name, testFn } of this.tests) {
      try {
        await testFn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// HTTP request helper
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test suite
const runner = new TestRunner();

runner.test('Health check endpoint', async () => {
  const response = await makeRequest('/health');
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  if (response.data.status !== 'OK') throw new Error('Health check failed');
});

runner.test('Get brochures list', async () => {
  const response = await makeRequest('/brochures');
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  if (!response.data.success) throw new Error('Response not successful');
  if (!Array.isArray(response.data.data)) throw new Error('Data is not an array');
});

runner.test('Get myomectomy brochure', async () => {
  const response = await makeRequest('/brochures/myomectomy');
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  if (!response.data.success) throw new Error('Response not successful');
  if (!response.data.data.activityRestrictions) throw new Error('Missing activity restrictions');
});

runner.test('Create patient tracker entry', async () => {
  const trackerData = {
    patientId: 'test123',
    procedureType: 'myomectomy',
    symptoms: ['mild pain'],
    painLevel: 3,
    notes: 'Test entry'
  };
  
  const response = await makeRequest('/trackers', {
    method: 'POST',
    body: trackerData
  });
  
  if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`);
  if (!response.data.success) throw new Error('Response not successful');
  if (response.data.data.patientId !== 'test123') throw new Error('Patient ID mismatch');
});

runner.test('Validate tracker data', async () => {
  const invalidData = {
    symptoms: ['test'],
    painLevel: 15 // Invalid pain level
  };
  
  const response = await makeRequest('/trackers', {
    method: 'POST',
    body: invalidData
  });
  
  if (response.status !== 400) throw new Error(`Expected 400, got ${response.status}`);
  if (response.data.error !== 'Validation failed') throw new Error('Validation error not returned');
});

runner.test('404 for unknown route', async () => {
  const response = await makeRequest('/unknown-route');
  if (response.status !== 404) throw new Error(`Expected 404, got ${response.status}`);
});

// Run tests
runner.run();
