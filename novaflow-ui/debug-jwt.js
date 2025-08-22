/**
 * JWT Token Debugging Utility
 * Run this in browser console to debug authentication issues
 */

function debugJWT() {
  console.log('🔍 JWT Token Debug Information');
  console.log('================================');
  
  // Get token from localStorage
  const token = localStorage.getItem('nf_token');
  if (!token) {
    console.error('❌ No JWT token found in localStorage');
    return;
  }
  
  console.log('✅ Token found in localStorage');
  console.log('Token length:', token.length);
  console.log('Token preview:', token.substring(0, 50) + '...');
  
  try {
    // Decode JWT without verification (for debugging only)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format - should have 3 parts separated by dots');
      return;
    }
    
    console.log('✅ JWT has correct format (3 parts)');
    
    // Decode header
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    console.log('📋 JWT Header:', header);
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    console.log('📋 JWT Payload:', payload);
    
    // Check important claims
    console.log('\n🔑 Key Claims:');
    console.log('- Issuer (iss):', payload.iss);
    console.log('- Audience (aud):', payload.aud);
    console.log('- Subject (sub):', payload.sub);
    console.log('- Email:', payload.email);
    console.log('- Issued At (iat):', new Date(payload.iat * 1000).toISOString());
    console.log('- Expires At (exp):', new Date(payload.exp * 1000).toISOString());
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < now;
    console.log('- Is Expired:', isExpired ? '❌ YES' : '✅ NO');
    
    if (isExpired) {
      console.error('⚠️ Token is expired! This will cause 401 errors.');
    }
    
    // Check audience format
    if (payload.aud && typeof payload.aud === 'string' && payload.aud.endsWith('.googleusercontent.com')) {
      console.log('✅ Audience looks like a valid Google Client ID');
    } else {
      console.warn('⚠️ Audience format might be incorrect:', payload.aud);
    }
    
  } catch (error) {
    console.error('❌ Failed to decode JWT:', error.message);
  }
  
  // Check environment variables
  console.log('\n🌍 Environment Configuration:');
  console.log('- NEXT_PUBLIC_GOOGLE_CLIENT_ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'NOT SET');
  console.log('- NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET');
  
  // Test backend connectivity
  console.log('\n🔌 Testing Backend Connectivity...');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  
  fetch(`${backendUrl}/actuator/health`)
    .then(response => {
      if (response.ok) {
        console.log('✅ Backend health check passed');
        return response.json();
      } else {
        console.error('❌ Backend health check failed:', response.status, response.statusText);
      }
    })
    .then(health => {
      if (health) {
        console.log('📊 Backend health:', health);
      }
    })
    .catch(error => {
      console.error('❌ Backend connectivity error:', error.message);
      console.error('💡 Make sure backend is running on:', backendUrl);
    });
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 Run debugJWT() in console to debug authentication issues');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debugJWT };
}
