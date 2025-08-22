# Start NovaFlow Backend Services

## 1. Start User Management Backend

```bash
cd c:\Apps\NovaFlow\novaflow-usermanagement-backend
mvn spring-boot:run
```

**Expected Output:**
- Service starts on port 8080
- Database connection established
- Endpoints available: /api/me, /api/authorize

## 2. Verify Backend is Running

```bash
curl http://localhost:8080/actuator/health
```

Should return: `{"status":"UP"}`

## 3. Test Authorization

**With authorized user (novaflowhub@gmail.com):**
- Should access dashboard successfully
- Backend returns user profile with roles/permissions

**With unauthorized user (any other email):**
- Should be redirected to `/unauthorized` page
- Backend returns 403 Forbidden

## 4. Database Check

Verify `novaflowhub@gmail.com` exists in database:

```sql
SELECT * FROM user_management.users WHERE email = 'novaflowhub@gmail.com';
```

## Current Status

❌ **Backend NOT running** - This is why authorization isn't working
✅ **Frontend authorization check** - Added to dashboard page
✅ **403 error handling** - Redirects to unauthorized page
✅ **User validation logic** - Backend checks database for user existence
