// Simple test to verify API connectivity
async function testAPI() {
  try {
    console.log('🔍 Testing API connectivity...');

    // Test health endpoint
    const healthResponse = await fetch('/api/health');
    console.log('🏥 Health check response:', healthResponse.status);

    if (healthResponse.ok) {
      console.log('✅ Backend is reachable');
    } else {
      console.log('❌ Backend not reachable');
    }

    // Test admin login
    const loginResponse = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@gayathrithulasi',
        password: 'gayathrithulasi'
      })
    });

    console.log('🔐 Login response status:', loginResponse.status);

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ Login response:', data);

      if (data.success) {
        console.log('🎉 Login successful!');
        console.log('🪙 Token received:', !!data.data.token);

        // Store token for testing
        localStorage.setItem('adminToken', data.data.token);
        console.log('💾 Token stored in localStorage');

        // Test token verification
        const verifyResponse = await fetch('/api/admin/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.data.token}`
          }
        });

        console.log('🔍 Token verification status:', verifyResponse.status);

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Token verification successful:', verifyData);
        } else {
          console.log('❌ Token verification failed');
        }
      } else {
        console.log('❌ Login failed:', data.error);
      }
    } else {
      console.log('❌ Login request failed');
    }

  } catch (error) {
    console.error('❌ API test error:', error);
  }
}

// Run test when page loads
testAPI();