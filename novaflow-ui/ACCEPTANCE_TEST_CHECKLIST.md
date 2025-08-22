# Google OAuth Integration Acceptance Test Checklist

## Prerequisites Setup
- [ ] **Environment Configuration**
  - [ ] Copy `.env.example` to `.env.local`
  - [ ] Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` with actual Google OAuth Client ID
  - [ ] Set `NEXT_PUBLIC_BACKEND_URL` (e.g., `http://novaflow.local.com:8080`)
  - [ ] Configure hosts file mapping if using local domain

- [ ] **Google Cloud Console Setup**
  - [ ] Create OAuth 2.0 Client ID (Web application)
  - [ ] Add authorized origins (e.g., `http://localhost:3000`, `http://novaflow.local.com:3000`)
  - [ ] Add authorized redirect URIs if needed

- [ ] **Backend Services Running**
  - [ ] User Management Service on port 8080
  - [ ] Database (PostgreSQL) accessible
  - [ ] CORS configured for frontend origin

## Test Execution

### 1. Environment Validation ✅
- [ ] **Client ID Validation**: AuthService shows proper error for missing/invalid client ID
- [ ] **Backend URL Configuration**: Single source of truth working
- [ ] **Fail-fast Errors**: Clear error messages for misconfiguration

### 2. Frontend Connectivity
- [ ] **Login Page Load**: `/login` loads without errors
- [ ] **GSI Script Loading**: Google Identity Services script loads successfully
- [ ] **No Console Errors**: Browser console shows no critical errors

### 3. Google Sign-In Flow
- [ ] **Initialization Order**: GSI initializes before rendering/prompting
- [ ] **Button Rendering**: Google Sign-In button renders correctly
- [ ] **Sign-In Trigger**: Clicking button triggers Google OAuth flow
- [ ] **JWT Validation**: Received credential passes JWT format validation
- [ ] **Token Storage**: JWT stored with proper cookie flags (secure/samesite)

### 4. Backend Integration
- [ ] **Profile Fetch**: `/me` endpoint called with Bearer token
- [ ] **User Data**: Backend returns user profile with roles/permissions
- [ ] **Authorization Check**: `/authorize` endpoint validates permissions
- [ ] **CORS Headers**: Cross-origin requests work properly

### 5. Authentication State
- [ ] **Token Persistence**: Token survives page refresh
- [ ] **User Profile**: User data cached in localStorage
- [ ] **Authentication Check**: `isAuthenticated()` returns correct status
- [ ] **JWT Expiry**: Expired tokens handled gracefully

### 6. Navigation & Security
- [ ] **Dashboard Redirect**: Successful login redirects to `/dashboard`
- [ ] **Protected Routes**: Unauthenticated users redirected to `/login`
- [ ] **Sign Out**: Clears tokens, localStorage, and redirects to login
- [ ] **Google Sign-Out**: Disables auto-select on sign out

## Error Scenarios

### 7. Error Handling
- [ ] **Invalid JWT**: Malformed tokens rejected
- [ ] **Network Errors**: Backend unavailable handled gracefully
- [ ] **Permission Denied**: Unauthorized access shows appropriate message
- [ ] **Origin Mismatch**: Google OAuth origin errors displayed clearly

### 8. Development Environment
- [ ] **Localhost Testing**: Works on `http://localhost:3000`
- [ ] **Local Domain**: Works with hosts file mapping
- [ ] **Cookie Flags**: Proper secure/samesite flags for HTTP/HTTPS
- [ ] **VPN Compatibility**: Works with/without VPN

## Manual Test Steps

1. **Start Services**
   ```bash
   # Terminal 1: Start backend
   cd novaflow-usermanagement-backend
   mvn spring-boot:run
   
   # Terminal 2: Start frontend
   cd novaflow-ui
   npm run dev
   ```

2. **Test Authentication Flow**
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with Google" button
   - Complete Google OAuth flow
   - Verify redirect to dashboard
   - Check browser dev tools for errors

3. **Test Protected Routes**
   - Navigate to `http://localhost:3000/dashboard` (should work if authenticated)
   - Open incognito/private window
   - Navigate to dashboard (should redirect to login)

4. **Test Sign Out**
   - Click user menu → Sign Out
   - Verify redirect to login
   - Verify tokens cleared from localStorage/cookies

## Expected Results

✅ **Success Criteria:**
- No console errors during authentication flow
- JWT token properly validated and stored
- Backend endpoints return expected data
- User can access protected routes after authentication
- Sign out completely clears authentication state

❌ **Failure Indicators:**
- Console errors related to Google OAuth
- Authentication tokens not stored/retrieved
- Backend API calls fail with CORS or auth errors
- Protected routes accessible without authentication
- Sign out doesn't clear authentication state

## Troubleshooting

**Common Issues:**
- **Origin not authorized**: Update Google OAuth authorized origins
- **CORS errors**: Check backend CORS configuration
- **Token format errors**: Verify JWT structure and signing
- **Network errors**: Ensure backend services are running
- **Cookie issues**: Check secure/samesite flags for environment
