import { User } from '@auth0/auth0-react';

// Define the role types
export type UserRole = 'admin' | 'read:contacts';

// Function to check if user has admin role
export const hasAdminRole = (user: User | undefined): boolean => {
  if (!user) return false;
  
  // Check for roles in custom claims (Auth0 domain-specific)
  const roles = user['dev-uneclc7juqwrway0.us.auth0.com/roles'] || 
                user['https://your-namespace/roles'] || 
                user['https://your-domain/roles'] ||
                user.app_metadata?.roles || 
                user.roles || [];
  
  // Check for Admin role (case-insensitive)
  if (roles.includes('Admin') || roles.includes('admin')) {
    return true;
  }
  
  // Fallback: check for admin email
  if (user.email && user.email.includes('admin')) {
    return true;
  }
  
  return false;
};

// Function to check if user has read:contacts role
export const hasReadContactsRole = (user: User | undefined): boolean => {
  if (!user) return false;
  
  // Check for roles in custom claims (Auth0 domain-specific)
  const roles = user['dev-uneclc7juqwrway0.us.auth0.com/roles'] || 
                user['https://your-namespace/roles'] || 
                user['https://your-domain/roles'] ||
                user.app_metadata?.roles || 
                user.roles || [];
  
  // Check for read:contacts role or admin access
  return roles.includes('read:contacts') || roles.includes('Admin') || roles.includes('admin');
};

// Function to get user's primary role
export const getUserRole = (user: User | undefined): UserRole | null => {
  if (!user) return null;
  
  const roles = user.app_metadata?.roles || user['https://your-namespace/roles'] || [];
  
  if (roles.includes('admin')) {
    return 'admin';
  } else if (roles.includes('read:contacts')) {
    return 'read:contacts';
  }
  
  return null;
}; 