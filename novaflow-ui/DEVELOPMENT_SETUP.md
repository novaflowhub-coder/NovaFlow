# Development Environment Setup for Google OAuth

## Problem
Google OAuth doesn't accept IP addresses (like `100.127.255.249:3000`) as authorized origins - only domain names are allowed.

## Solution Options

### Option 1: Use Localhost (Recommended)
Access your app via `http://localhost:3000` instead of the IP address.

**Google OAuth Setup:**
- Authorized JavaScript origins: `http://localhost:3000`
- Access app at: `http://localhost:3000`

### Option 2: Local Domain Mapping (Advanced)
If you must use a domain name that resolves to your development IP:

1. **Edit your hosts file** (requires admin privileges):
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Add line: `100.127.255.249 novaflow.local`

2. **Update Google OAuth:**
   - Authorized JavaScript origins: `http://novaflow.local:3000`
   - Access app at: `http://novaflow.local:3000`

3. **Update .env.local:**
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
   NEXT_PUBLIC_BACKEND_URL=http://novaflow.local:8080
   ```

### Option 3: Use Demo Login
For immediate testing without Google OAuth setup, use the traditional login form on the login page with any credentials (it's configured for demo mode).

## Current Status
- ✅ Backend configured for Google OIDC
- ✅ Frontend integrated with Google Sign-In
- ⏳ Waiting for Google OAuth client configuration
