# Auth0 Login Troubleshooting Guide

## Current Issue
The error `Cannot read properties of undefined (reading 'filter')` suggests there's an issue with Auth0's token processing after adding the new Admin role.

## Immediate Steps to Try

### 1. **Clear Browser Data**
- Clear all cookies and cache for localhost
- Try in an incognito/private window
- Clear Auth0 session data

### 2. **Check Auth0 Application Settings**
In your Auth0 dashboard:
- Go to Applications → Your App
- Verify **Allowed Callback URLs** includes: `http://localhost:3000`
- Verify **Allowed Logout URLs** includes: `http://localhost:3000`
- Verify **Allowed Web Origins** includes: `http://localhost:3000`

### 3. **Check Auth0 API Settings**
- Go to APIs → rdk-crm API
- Verify the **Identifier** matches your `REACT_APP_AUTH0_AUDIENCE`
- Check if the new Admin role is properly assigned to the API

### 4. **Check Role Configuration**
- Go to User Management → Roles
- Verify the Admin role exists and is properly configured
- Go to User Management → Users → Your User
- Verify the Admin role is assigned to your user

### 5. **Environment Variables**
Verify your `.env` file has:
```
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-identifier
```

## Debug Steps

### Step 1: Use Simple Debug
1. Go to `http://localhost:3000/simple-debug`
2. Try logging in
3. Check the user object structure

### Step 2: Check Console Logs
1. Open browser console (F12)
2. Look for any Auth0-related errors
3. Check the network tab for failed requests

### Step 3: Test Without Audience
The audience parameter has been temporarily disabled. Try logging in now.

## Common Solutions

### Solution 1: Recreate Auth0 Application
If the issue persists:
1. Create a new Auth0 application
2. Update your environment variables
3. Test with the new application

### Solution 2: Check Role Permissions
1. Go to Auth0 → APIs → rdk-crm
2. Go to Permissions tab
3. Ensure the Admin role has the necessary permissions

### Solution 3: Update Scopes
Try updating the scope in App.tsx:
```javascript
scope: "openid profile email read:contacts"
```

## Next Steps
1. Try the simple debug page first
2. Check if removing the audience parameter fixes the issue
3. If it works, we'll gradually add back the audience and roles
4. If it doesn't work, we may need to recreate the Auth0 application

## Error Analysis
The error suggests Auth0's internal token processing is failing, likely due to:
- Incorrect audience configuration
- Role/permission mismatch
- Token structure changes after role addition
- Cached tokens with old structure 