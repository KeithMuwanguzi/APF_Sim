# Frontend OTP Bypass Implementation

## Changes Made

Updated `portal/src/pages/LoginPage.tsx` to handle OTP bypass for test users.

## How It Works

### Before (Old Flow)
```
Login → Always redirect to /otp page
```

### After (New Flow)
```
Login → Check response
  ├─ If otp_bypassed = true → Store tokens → Redirect to /dashboard
  └─ If otp_bypassed = false → Store session_id → Redirect to /otp
```

## Code Changes

The login handler now checks for the `otp_bypassed` flag in the response:

```typescript
if (response.ok && data.success) {
  // Check if OTP was bypassed (test users)
  if (data.otp_bypassed) {
    // Direct login - store tokens and redirect to dashboard
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    navigate('/dashboard')
    return
  }

  // Regular flow - continue to OTP page
  sessionStorage.setItem('otp_session_id', data.session_id)
  navigate('/otp')
}
```

## Test Users

These users will bypass OTP and go directly to the dashboard:

1. **Admin User**
   - Email: `admin@apt.com`
   - Password: `admin@1234`

2. **Member User**
   - Email: `member@apf.com`
   - Password: `member@1234`

## Testing

1. Make sure the backend server is running
2. Open the frontend application
3. Login with one of the test users
4. You should be redirected directly to the dashboard without seeing the OTP page

## Backend Response Format

### For Test Users (OTP Bypassed)
```json
{
  "success": true,
  "message": "Login successful (OTP bypassed for test user)",
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 45,
    "email": "admin@apt.com",
    "role": "1"
  },
  "otp_bypassed": true
}
```

### For Regular Users (OTP Required)
```json
{
  "success": true,
  "session_id": "uuid-here",
  "email": "user@example.com",
  "user_name": "user",
  "message": "OTP sent to your email"
}
```

## Token Storage

When OTP is bypassed, the following items are stored in localStorage:
- `access_token` - JWT access token for API requests
- `refresh_token` - JWT refresh token for renewing access
- `user` - User object (JSON string) with id, email, and role

## Security Notes

⚠️ These test users should only be used in development/testing environments.

## Troubleshooting

If you're still being redirected to the OTP page:

1. **Check browser console** - Look for the login response
2. **Verify backend is updated** - Make sure the backend server was restarted
3. **Clear browser cache** - Clear localStorage and sessionStorage
4. **Check network tab** - Verify the login response includes `otp_bypassed: true`

### Clear Browser Storage
```javascript
// Open browser console and run:
localStorage.clear()
sessionStorage.clear()
location.reload()
```
