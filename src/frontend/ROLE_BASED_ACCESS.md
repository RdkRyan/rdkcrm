# Role-Based Access Control Implementation

## Overview

This application implements role-based access control (RBAC) using Auth0 for user authentication and authorization. The system supports two main roles:

- **`admin`**: Full access to all features including the Admin panel
- **`read:contacts`**: Access to view contacts and call logs (most users will have this role)

## Implementation Details

### Role Checking

The role checking logic is implemented in `src/utils/roleUtils.ts` and includes:

- `hasAdminRole(user)`: Checks if user has admin privileges
- `hasReadContactsRole(user)`: Checks if user has read:contacts role
- `getUserRole(user)`: Returns the user's primary role

### Auth0 Role Configuration

The system looks for roles in multiple possible locations within the Auth0 user object:

1. `user['https://your-namespace/roles']`
2. `user['https://your-domain/roles']`
3. `user.roles`
4. `user['https://your-namespace/app_metadata']?.roles`
5. `user.app_metadata?.roles`

### Components Updated

#### Header Component (`src/components/Header.tsx`)
- Admin link only shows for users with `admin` role
- Both desktop and mobile navigation updated

#### Home Component (`src/components/Home.tsx`)
- Removed direct Admin links for non-admin users
- Shows appropriate action buttons based on user role:
  - Admin users: "Go to Admin" / "Access Admin Panel"
  - Read:contacts users: "View Contacts"
  - Other users: "Access Dashboard"

#### Admin Component (`src/components/Admin.tsx`)
- Added role-based access control
- Users without admin role are denied access with appropriate message

## Auth0 Setup Requirements

To properly configure roles in Auth0:

1. **Create Roles**: In your Auth0 dashboard, create the roles:
   - `admin`
   - `read:contacts`

2. **Assign Roles to Users**: Assign appropriate roles to your users

3. **Configure Rules/Actions**: Ensure roles are included in the user profile by creating an Auth0 Action or Rule that adds roles to the user object

4. **Update Namespace**: Replace `your-namespace` and `your-domain` in `roleUtils.ts` with your actual Auth0 domain/namespace

## Testing

The implementation includes debug logging to help identify where roles are stored in the Auth0 user object. Check the browser console when users log in to see the user object structure and adjust the role checking logic accordingly.

## Security Notes

- Role checking is implemented on both client and component levels
- Direct URL access to `/admin` is protected by component-level checks
- The system gracefully handles users without any assigned roles 