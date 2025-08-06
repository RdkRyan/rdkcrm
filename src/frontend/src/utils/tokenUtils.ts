import { User } from '@auth0/auth0-react';

// Function to decode JWT token (without verification for inspection purposes)
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to inspect user object and token for roles
export const inspectUserRoles = (user: User | undefined, token?: string) => {
  console.log('=== USER OBJECT INSPECTION ===');
  console.log('Full user object:', user);
  
  if (user) {
    console.log('User email:', user.email);
    console.log('User name:', user.name);
    console.log('User sub:', user.sub);
    
    // Check common role locations
    console.log('=== CHECKING ROLE LOCATIONS ===');
    console.log('user.roles:', user.roles);
    console.log('user.app_metadata:', user.app_metadata);
    console.log('user.user_metadata:', user.user_metadata);
    
    // Check custom claims (replace with your actual namespace)
    const customClaims = [
      'https://your-namespace/roles',
      'https://your-domain/roles',
      'https://your-namespace/app_metadata',
      'https://your-domain/app_metadata',
      'https://your-namespace/user_metadata',
      'https://your-domain/user_metadata'
    ];
    
    customClaims.forEach(claim => {
      if (user[claim as keyof User]) {
        console.log(`${claim}:`, user[claim as keyof User]);
      }
    });
  }
  
  if (token) {
    console.log('=== TOKEN INSPECTION ===');
    const decodedToken = decodeToken(token);
    console.log('Decoded token payload:', decodedToken);
    
    if (decodedToken) {
      console.log('Token roles:', decodedToken.roles);
      console.log('Token permissions:', decodedToken.permissions);
      console.log('Token scopes:', decodedToken.scope);
      console.log('Token custom claims:', Object.keys(decodedToken).filter(key => key.startsWith('https://')));
    }
  }
  
  console.log('=== END INSPECTION ===');
};

// Function to get roles from token
export const getRolesFromToken = (token: string): string[] => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return [];
  
  // Check various possible role locations in the token
  return decodedToken.roles || 
         decodedToken['https://your-namespace/roles'] ||
         decodedToken['https://your-domain/roles'] ||
         decodedToken.permissions ||
         [];
}; 