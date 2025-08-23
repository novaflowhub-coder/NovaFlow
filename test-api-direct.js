// Test API call directly to debug the 403 issue
const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token from browser

async function testUserAPI() {
    try {
        console.log('Testing direct API call...');
        
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
        } else {
            const errorText = await response.text();
            console.log('Error response:', errorText);
        }
        
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Also test CORS preflight
async function testCORS() {
    try {
        console.log('Testing CORS preflight...');
        
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'OPTIONS',
        });
        
        console.log('CORS preflight status:', response.status);
        console.log('CORS headers:', [...response.headers.entries()]);
        
    } catch (error) {
        console.error('CORS test error:', error);
    }
}

testCORS();
testUserAPI();
